import { spawn } from 'node:child_process'

export const MAX_BYTES = 8 * 1024 * 1024
export type Word = { id: string; text: string; left: number; top: number; width: number; height: number; confidence: number }
export type OcrResult = { width: number; height: number; text: string; words: Word[] }
export class OcrError extends Error {
  status: number
  constructor(message: string, status = 422) { super(message); this.status = status }
}
export function validatePng(data: Buffer) {
  if (data.length > MAX_BYTES) throw new OcrError('Das Bild ist zu groß (maximal 8 MB).', 413)
  if (data.length < 33 || !data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || data.readUInt32BE(8) !== 13 || data.toString('ascii',12,16) !== 'IHDR') throw new OcrError('Bitte ein gültiges PNG-Bild übergeben.', 415)
  const width = data.readUInt32BE(16), height = data.readUInt32BE(20)
  if (!width || !height || width > 8000 || height > 8000 || width * height > 12_000_000) throw new OcrError('Maximal 12 Megapixel und 8000 Pixel pro Seite.', 413)
  return { width, height }
}
export function parseTsv(tsv: string): OcrResult {
  const words: Word[] = [], lines: string[] = []
  let width = 0, height = 0, previousLine = ''
  for (const row of tsv.trimEnd().split('\n').slice(1)) {
    const c = row.split('\t')
    if (c[0] === '1') { width = Number(c[8]); height = Number(c[9]); continue }
    const text = c.slice(11).join('\t').trim()
    if (c[0] !== '5' || !text) continue
    const [left, top, w, h, confidence] = c.slice(6,11).map(Number)
    if (![left,top,w,h,confidence].every(Number.isFinite) || left < 0 || top < 0 || w <= 0 || h <= 0 || left+w > width || top+h > height) continue
    words.push({ id: c.slice(1,6).join('-'), text, left, top, width: w, height: h, confidence })
    const line = c.slice(1,5).join('-')
    if (line !== previousLine) lines.push(text)
    else lines[lines.length - 1] += ` ${text}`
    previousLine = line
  }
  return { width, height, text: lines.join('\n'), words }
}
export async function recognize(image: Buffer, signal?: AbortSignal, launch: typeof spawn = spawn): Promise<OcrResult> {
  const dimensions = validatePng(image)
  const tsv = await new Promise<string>((resolve, reject) => {
    // Fixed executable/arguments and image bytes on stdin. The launch seam is server-side only.
    const child = launch('tesseract', ['stdin', 'stdout', '-l', 'eng', '--psm', '3', 'tsv'], { stdio: ['pipe', 'pipe', 'pipe'] })
    let failure: OcrError | null = null, bytes = 0, stderr = ''
    const output: Buffer[] = []
    const stop = (error: OcrError) => { if (!failure) { failure = error; child.kill('SIGKILL') } }
    const abort = () => stop(signal?.reason instanceof OcrError ? signal.reason : new OcrError('Texterkennung abgebrochen.', 499))
    const timer = setTimeout(() => stop(new OcrError('Die Texterkennung wurde nach 30 Sekunden beendet. Bitte ein kleineres Bild versuchen.', 504)), 30_000)
    child.stdout?.on('data', (chunk: Buffer) => {
      bytes += chunk.length
      if (bytes > 4 * 1024 * 1024) stop(new OcrError('Die OCR-Ausgabe ist zu groß. Bitte einen kleineren Bildausschnitt versuchen.'))
      else if (!failure) output.push(chunk)
    })
    child.stderr?.on('data', (chunk: Buffer) => { if (stderr.length < 64 * 1024) stderr += chunk.toString('utf8').slice(0, 64 * 1024 - stderr.length) })
    child.on('error', (error: NodeJS.ErrnoException) => {
      failure = new OcrError(error.code === 'ENOENT' ? 'Tesseract fehlt. Bitte Tesseract mit dem Sprachmodell „eng“ installieren (siehe README).' : 'Tesseract konnte nicht gestartet werden.', 503)
    })
    // close follows exit/error and stream closure. Keep the caller's slot until then.
    child.once('close', code => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort)
      if (failure) return reject(failure)
      if (stderr.includes('Failed loading language')) return reject(new OcrError('Tesseract-Sprachmodell „eng“ fehlt. Bitte lokal installieren (siehe README).', 503))
      if (code !== 0) return reject(new OcrError('Das Bild konnte nicht verarbeitet werden. Bitte ein anderes PNG oder JPEG versuchen.'))
      resolve(Buffer.concat(output).toString('utf8'))
    })
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
    child.stdin?.on('error', () => {})
    child.stdin?.end(image)
  })
  return { ...parseTsv(tsv), ...dimensions }
}

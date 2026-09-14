import type { IncomingMessage, ServerResponse } from 'node:http'
import { MAX_BYTES, OcrError, recognize, validatePng } from './ocr.ts'

function readImage(req: IncomingMessage, signal: AbortSignal): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    const cleanup = () => { req.off('data', data); req.off('end', end); req.off('error', fail); signal.removeEventListener('abort', abort) }
    const fail = (error: Error) => { cleanup(); req.pause(); reject(error) }
    const abort = () => fail(signal.reason instanceof OcrError ? signal.reason : new OcrError('Anfrage abgebrochen.', 408))
    const data = (chunk: Buffer) => { size += chunk.length; if (size > MAX_BYTES) fail(new OcrError('Das Bild ist zu groß (maximal 8 MB).',413)); else chunks.push(chunk) }
    const end = () => { cleanup(); resolve(Buffer.concat(chunks)) }
    req.on('data', data); req.on('end', end); req.on('error', fail)
    signal.addEventListener('abort', abort, { once:true })
    if (signal.aborted) abort()
  })
}
export function ocrMiddleware(engine = recognize, requestTimeoutMs = 35_000) {
  let busy = false
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split('?')[0] !== '/api/ocr') return next()
    const send = (status: number, data: unknown) => {
      if (res.destroyed || res.writableEnded) return
      res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', ...(status >= 400 ? { Connection:'close' } : {}) })
      res.end(JSON.stringify(data))
    }
    const port = req.socket.localPort
    const hosts = [`127.0.0.1:${port}`, `localhost:${port}`, `[::1]:${port}`]
    if (!hosts.includes(req.headers.host || '') || !['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress || '')) return send(403, {error:'Nur lokal erreichbar.'})
    if (req.method !== 'POST') { res.setHeader('Allow','POST'); return send(405,{error:'Bitte die Texterkennung in der Workbench starten.'}) }
    if (req.headers['x-workbench-request'] !== 'ocr' || (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`)) return send(403,{error:'Anfrage aus dieser Herkunft ist nicht erlaubt.'})
    if (req.headers['content-type'] !== 'image/png') return send(415,{error:'Bitte ein PNG-Bild übergeben.'})
    if (Number(req.headers['content-length']) > MAX_BYTES) return send(413,{error:'Das Bild ist zu groß (maximal 8 MB).'})
    if (busy) return send(409,{error:'Eine Texterkennung läuft bereits. Bitte gleich erneut versuchen.'})
    busy = true
    const controller = new AbortController()
    const disconnect = () => { if (!res.writableEnded) controller.abort() }
    res.on('close', disconnect)
    const timer = setTimeout(() => controller.abort(new OcrError('Das Zeitlimit der Anfrage wurde erreicht. Bitte erneut mit einem kleineren Bild versuchen.', 504)), requestTimeoutMs)
    void (async () => {
      try {
        const data = await readImage(req, controller.signal)
        validatePng(data)
        const start = performance.now()
        const result = await engine(data, controller.signal)
        send(200,{...result,engine:'Tesseract · eng',elapsedMs:Math.round(performance.now()-start)})
      } catch (error) {
        send(error instanceof OcrError ? error.status : 500,{error:error instanceof OcrError ? error.message : 'Texterkennung fehlgeschlagen. Bitte erneut versuchen.'})
      } finally { clearTimeout(timer); res.off('close',disconnect); busy = false }
    })()
  }
}

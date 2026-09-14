export type OcrWord = { id: string; text: string; left: number; top: number; width: number; height: number; confidence: number }
export type OcrResponse = { text: string; words: OcrWord[]; width: number; height: number; engine: string; elapsedMs: number }
export async function prepareImage(file: Blob): Promise<Blob> {
  if (!['image/png','image/jpeg'].includes(file.type)) throw new Error('Bitte ein PNG- oder JPEG-Bild auswählen.')
  if (!file.size || file.size > 8*1024*1024) throw new Error('Bitte ein Bild bis 8 MB auswählen.')
  let bitmap: ImageBitmap
  try { bitmap = await createImageBitmap(file) } catch { throw new Error('Das Bild konnte nicht geöffnet werden. Bitte ein anderes PNG oder JPEG auswählen.') }
  try {
    if (bitmap.width > 8000 || bitmap.height > 8000 || bitmap.width*bitmap.height > 12_000_000) throw new Error('Maximal 12 Megapixel und 8000 Pixel pro Seite.')
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Bildverarbeitung im Browser nicht verfügbar.')
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(bitmap,0,0)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve,'image/png'))
    if (!blob || blob.size > 8*1024*1024) throw new Error('Das aufbereitete Bild ist zu groß. Bitte ein kleineres Bild auswählen.')
    return blob
  } finally { bitmap.close() }
}
export async function runOcr(image: Blob, signal: AbortSignal): Promise<OcrResponse> {
  let response: Response
  try { response = await fetch('/api/ocr', {method:'POST',headers:{'Content-Type':'image/png','X-Workbench-Request':'ocr'},body:image,signal}) }
  catch (error) { if (signal.aborted) throw error; throw new Error('Der lokale Server ist nicht erreichbar. Bitte Verbindung prüfen und erneut versuchen.') }
  let data
  try { data = await response.json() } catch { throw new Error('Die OCR-Schnittstelle ist nicht erreichbar. Bitte die Workbench mit ihrem lokalen Server starten.') }
  if (!response.ok) throw new Error(data.error || 'Texterkennung fehlgeschlagen.')
  return data as OcrResponse
}

import { useEffect, useRef, useState } from 'react'
import { FileImage, Loader2, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { prepareImage, runOcr } from './ocr-client'
import type { OcrResponse } from './ocr-client'
import './ocr.css'

type Source = { id: string; name: string; blob: Blob; url: string }
export function Ocr({ visible, onContextChange }: { visible: boolean; onContextChange: () => void }) {
  const [contextId, setContextId] = useState(() => crypto.randomUUID())
  const [source, setSource] = useState<Source | null>(null)
  const [result, setResult] = useState<(OcrResponse & {id:string}) | null>(null)
  const [status, setStatus] = useState<'idle'|'preparing'|'running'|'done'|'cancelled'|'error'>('idle')
  const [error, setError] = useState('')
  const [boxes, setBoxes] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const request = useRef<AbortController | null>(null)
  const revision = useRef(0)
  const upload = useRef<HTMLInputElement>(null)
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url) }, [source])
  useEffect(() => () => request.current?.abort(), [])
  function invalidate() { revision.current++; setContextId(crypto.randomUUID()); request.current?.abort(); request.current = null; onContextChange(); setError(''); setSelected(null) }
  async function choose(file: Blob, name: string) {
    invalidate(); const current = revision.current
    setSource(null); setResult(null); setStatus('preparing')
    try {
      const blob = await prepareImage(file)
      if (current !== revision.current) return
      setSource({ id:crypto.randomUUID(), name, blob, url:URL.createObjectURL(blob) }); setStatus('idle')
    } catch (err) { if (current === revision.current) { setError((err as Error).message); setStatus('error') } }
  }
  async function sample() {
    invalidate(); const current = revision.current
    setSource(null); setResult(null); setStatus('preparing')
    const controller = new AbortController(); request.current = controller
    try {
      const response = await fetch('/ocr-sample.png',{signal:controller.signal})
      if (!response.ok) throw new Error('Beispielbild nicht verfügbar.')
      const blob = await response.blob()
      if (current === revision.current) await choose(blob,'Beispiel · Testbeleg')
    } catch (err) { if (current === revision.current) { setError((err as Error).message); setStatus('error') } }
  }
  async function start() {
    if (!source) return
    invalidate(); const current = revision.current
    const controller = new AbortController(); request.current = controller
    setStatus('running'); setResult(null)
    try {
      const next = await runOcr(source.blob, controller.signal)
      if (current !== revision.current) return
      setResult({...next,id:crypto.randomUUID()}); setStatus('done')
    } catch (err) { if (current === revision.current) { setError((err as Error).message); setStatus('error') } }
    finally { if (current === revision.current) request.current = null }
  }
  function reset() { invalidate(); setSource(null); setResult(null); setStatus('idle'); if (upload.current) upload.current.value = '' }
  const word = result?.words.find(w => w.id === selected)
  const busy = status === 'preparing' || status === 'running'
  return <div hidden={!visible} className="ocr-demo" data-annotation-id={`ocr-context-${contextId}`} data-annotation-label="OCR-Arbeitsfläche">
    <div className="ocr-inputs">
      <div className="ocr-file"><Label htmlFor="ocr-file">Bild auswählen</Label><Input ref={upload} id="ocr-file" type="file" accept="image/png,image/jpeg" onChange={e => { const file = e.target.files?.[0]; if (file) void choose(file,file.name); e.target.value = '' }}/><small>PNG oder JPEG · bis 8 MB / 12 Megapixel</small></div>
      <Button variant="outline" size="sm" onClick={() => void sample()} disabled={busy}>Beispiel laden</Button>
    </div>
    <div className="ocr-actions">
      {status === 'running' ? <><Button disabled size="sm"><Loader2 size={15} className="spin"/>Text wird erkannt</Button><Button variant="outline" size="sm" onClick={() => { invalidate(); setStatus('cancelled') }}>Abbrechen</Button></> : <Button size="sm" disabled={!source || busy} onClick={() => void start()}><Play size={14}/>{status === 'error' ? 'Erneut versuchen' : result ? 'Erneut erkennen' : 'Text erkennen'}</Button>}
      {(source || error) && !busy && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={14}/>Zurücksetzen</Button>}
      <span role="status" aria-live="polite">{status === 'preparing' ? 'Bild wird vorbereitet …' : status === 'cancelled' ? 'Abgebrochen. Du kannst erneut starten.' : result ? `${result.words.length} Wörter · ${(result.elapsedMs/1000).toFixed(2)} s` : 'Verarbeitung lokal · Englisch'}</span>
    </div>
    {error && <p className="input-error ocr-error" role="alert">{error}</p>}
    <div className="ocr-comparison">
      <section className="ocr-original" aria-label="Originalbild">
        <div className="ocr-section-heading"><h2>Original</h2>{result && <div><Label htmlFor="ocr-boxes">Wortbereiche</Label><Switch id="ocr-boxes" checked={boxes} onCheckedChange={setBoxes}/></div>}</div>
        {source ? <><p className="ocr-filename">{source.name}</p><div className="ocr-image" data-annotation-id={`ocr-image-${source.id}`} data-annotation-label={`Bild: ${source.name}`}><img src={source.url} alt={`OCR-Original: ${source.name}`}/>{boxes && result?.words.map(w => <button key={w.id} type="button" className={`ocr-word ${selected === w.id ? 'is-selected' : ''}`} aria-label={`Wort: ${w.text}`} aria-pressed={selected === w.id} title={w.text} data-annotation-id={`ocr-${result.id}-word-${w.id}`} data-annotation-label={`OCR-Wort: ${w.text}`} style={{left:`${w.left/result.width*100}%`,top:`${w.top/result.height*100}%`,width:`${w.width/result.width*100}%`,height:`${w.height/result.height*100}%`}} onClick={() => setSelected(selected === w.id ? null : w.id)}/>)}</div></> : <div className="ocr-placeholder"><FileImage size={30} strokeWidth={1.2}/><p>Wähle ein Bild oder lade das Beispiel.</p></div>}
        <p className="ocr-selection" aria-live="polite">{word ? `„${word.text}“ · Tesseract-Konfidenz ${Math.round(word.confidence)} / 100` : result?.words.length ? 'Klicke einen Wortbereich zum Prüfen.' : 'Original und Ergebnis direkt vergleichen.'}</p>
      </section>
      <section className="ocr-output" aria-label="OCR-Ergebnis">
        <div className="ocr-section-heading"><h2>Erkannter Text</h2>{result && <small>Tesseract · eng</small>}</div>
        {result ? <div data-annotation-id={`ocr-${result.id}-text`} data-annotation-label="Erkannter Text" className="ocr-text"><pre>{result.text || 'Kein Text erkannt. Versuche ein schärferes Bild mit gut lesbarem Text.'}</pre></div> : <div className="ocr-placeholder"><p>{status === 'running' ? 'Die lokale Texterkennung läuft …' : 'Starte die Texterkennung, um das Ergebnis zu prüfen.'}</p></div>}
      </section>
    </div>
    <div className="demo-footnote"><FileImage size={15}/><span>Echte lokale OCR. Bilder und Ergebnisse bleiben bis zum Zurücksetzen oder Neuladen im Speicher. Anmerkungen werden im Browser gespeichert.</span></div>
  </div>
}

import { useState } from 'react'
import { MessageSquare, X, Download, Trash2, Check, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import type { Mark } from './anchors'
export type { Mark } from './anchors'
export { AnnotationCanvas } from './AnnotationCanvas'
export type Note = { id: string; number: number; page: string; version: string; body: string; mark?: Mark }
export type Mode = 'browse' | 'pin' | 'region'
export function FeedbackPanel({ notes, page, version, pending, onCancel, onSave, onDelete, selected, onClose }: { notes: Note[]; page: string; version: string; pending: Mark | null; onCancel: () => void; onSave: (body: string) => void; onDelete: (id: string) => void; selected: string | null; onClose: () => void }) {
  const [body, setBody] = useState('')
  const [filter, setFilter] = useState<'all' | 'page'>('all')
  const shown = notes.filter(n => filter === 'all' || n.page === page)
  function exportNotes() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'workbench-feedback-draft', notes }, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'workbench-feedback.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <aside className="feedback-panel" aria-label="Anmerkungen">
    <div className="panel-heading"><h2>Anmerkungen <span>{notes.length}</span></h2><Button variant="ghost" size="icon-sm" aria-label="Anmerkungen schließen" onClick={onClose}><X size={16}/></Button></div>
    <p className="panel-intro">Sammle deine Gedanken. Die nächste Runde startest du im Chat.</p>
    <div className="feedback-filter"><Button variant={filter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>Alle Seiten</Button><Button variant={filter === 'page' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('page')}>Diese Seite</Button></div>
    <div className="notes-list">{shown.length ? shown.map(n => <article className={`note ${selected === n.id ? 'selected-note' : ''}`} key={n.id}><div className="note-meta"><span className="note-number">{n.number}</span><span>{n.page === 'notification' ? 'Benachrichtigung' : n.page === 'ocr' ? 'Texterkennung' : 'Rabattregel'} · {n.version.toUpperCase()}</span><Button variant="ghost" size="icon-sm" aria-label={`Anmerkung ${n.number} löschen`} onClick={() => onDelete(n.id)}><Trash2 size={13}/></Button></div><p>{n.body}</p>{n.mark && <div className="anchor-label">{n.mark.anchor ? `An ${n.mark.anchor.label} gebunden` : 'Freie Fläche · positionsbezogen'}</div>}<span className="note-status"><span/>Gesammelt</span></article>) : <div className="empty-notes"><MessageSquare size={26} strokeWidth={1.3}/><strong>Platz für deine Gedanken</strong><p>Markiere eine Stelle in der Vorschau oder schreibe eine Anmerkung.</p></div>}</div>
    <form className="note-composer" onSubmit={e => { e.preventDefault(); if (!body.trim()) return; onSave(body.trim()); setBody('') }}>
      <div className="composer-context"><span>{pending ? (pending.anchor ? pending.anchor.label : 'Freie Fläche') : 'Zur aktuellen Seite'} · {version.toUpperCase()}</span>{pending && <button type="button" onClick={onCancel} aria-label="Markierung verwerfen"><X size={13}/></button>}</div>
      <Textarea id="note-body" aria-label="Neue Anmerkung" placeholder="Was möchtest du ändern?" value={body} onChange={e => setBody(e.target.value)} maxLength={2000}/>
      <div className="composer-footer"><span>{page === 'notification' ? 'Benachrichtigung' : page === 'ocr' ? 'Texterkennung' : 'Rabattregel'}</span><Button size="sm" type="submit" disabled={!body.trim()}><Check size={14}/>Sammeln</Button></div>
    </form>
    <div className="panel-bottom"><Button variant="ghost" size="sm" onClick={exportNotes} disabled={!notes.length}><Download size={14}/>JSON exportieren<ArrowUpRight size={12}/></Button><span>In diesem Browser gespeichert</span></div>
  </aside>
}

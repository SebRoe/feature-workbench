import { useEffect, useRef, useState } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import type { Mode, Note } from './Feedback'
import { captureMark, clippingRect, findAnchor, projectMark } from './anchors'
import type { Mark, Rect } from './anchors'

type Position = { rect: Rect; clip: Rect }
export function AnnotationCanvas({ children, mode, notes, onMark, onSelect }: { children: ReactNode; mode: Mode; notes: Note[]; onMark: (m: Mark) => void; onSelect: (n: Note) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const [draft, setDraft] = useState<Rect | null>(null)
  const [positions, setPositions] = useState<Record<string, Position>>({})

  useEffect(() => {
    let frame = 0
    let previous = ''
    function update() {
      const root = ref.current
      if (!root) return
      const canvas = root.getBoundingClientRect()
      const next: Record<string, Position> = {}
      for (const note of notes) {
        if (!note.mark) continue
        const target = note.mark.anchor ? findAnchor(root, note.mark.anchor.id) : null
        if (target && (getComputedStyle(target).visibility === 'hidden' || !target.getClientRects().length)) continue
        const rect = projectMark(note.mark, canvas, target?.getBoundingClientRect())
        if (rect) next[note.id] = { rect, clip: clippingRect(root, target) }
      }
      const signature = JSON.stringify(next)
      if (signature !== previous) { previous = signature; setPositions(next) }
      // Transforms don't fire ResizeObserver. Track visible annotations only.
      if (notes.some(n => n.mark)) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [notes])

  function point(e: PointerEvent) {
    const box = ref.current!.getBoundingClientRect()
    return { x: Math.max(box.left, Math.min(box.right, e.clientX)), y: Math.max(box.top, Math.min(box.bottom, e.clientY)) }
  }
  function selection(p: { x: number; y: number }): Rect {
    const s = start.current!
    return { left: Math.min(s.x, p.x), top: Math.min(s.y, p.y), width: Math.abs(s.x - p.x), height: Math.abs(s.y - p.y) }
  }
  const missing = notes.filter(n => n.mark?.anchor && !positions[n.id])
  return <>
    <div className="annotated-canvas" ref={ref}>
      {children}
      {notes.map(n => {
        const position = positions[n.id]
        if (!position) return null
        const { rect, clip } = position
        return <div className="mark-layer" key={n.id} style={{ clipPath: `polygon(${clip.left}px ${clip.top}px, ${clip.left + clip.width}px ${clip.top}px, ${clip.left + clip.width}px ${clip.top + clip.height}px, ${clip.left}px ${clip.top + clip.height}px)` }}><button className="saved-mark" data-note-id={n.id} aria-label={`Anmerkung ${n.number}: ${n.body}`} onClick={() => onSelect(n)} style={{ left: rect.left, top: rect.top, width: rect.width || undefined, height: rect.height || undefined, minWidth: rect.width ? 0 : undefined, minHeight: rect.height ? 0 : undefined }}><span>{n.number}</span></button></div>
      })}
      {mode !== 'browse' && <div className="drawing-layer" aria-label={mode === 'pin' ? 'Punkt auf der Vorschau markieren' : 'Bereich auf der Vorschau markieren'} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); start.current = point(e) }} onPointerMove={e => { if (start.current && mode === 'region') { const r = selection(point(e)); const box = ref.current!.getBoundingClientRect(); setDraft({ ...r, left: r.left - box.left, top: r.top - box.top }) } }} onPointerUp={e => {
        if (!start.current) return
        const p = point(e)
        const r = mode === 'pin' ? { left: p.x, top: p.y, width: 0, height: 0 } : selection(p)
        start.current = null; setDraft(null)
        if (mode === 'pin' || (r.width > 4 && r.height > 4)) onMark(captureMark(ref.current!, r))
      }} onPointerCancel={() => { start.current = null; setDraft(null) }}>
        {draft && <div className="draft-mark" style={{ left: draft.left, top: draft.top, width: draft.width, height: draft.height }}/>}</div>}
    </div>
    {missing.length > 0 && <div className="missing-anchors" role="status">Ziel aktuell nicht sichtbar: {missing.map(n => `Anmerkung ${n.number}`).join(', ')}. Die Kommentare bleiben erhalten.</div>}
  </>
}

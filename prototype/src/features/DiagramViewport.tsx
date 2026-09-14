import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DiagramViewport({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)
  return <>
    <div className="diagram-controls"><span>Ziehen zum Verschieben</span><div><Button variant="ghost" size="icon-sm" aria-label="Diagramm verkleinern" disabled={zoom <= .6} onClick={() => setZoom(z => Math.max(.6, +(z - .2).toFixed(1)))}><Minus size={14}/></Button><output aria-label="Diagrammzoom">{Math.round(zoom * 100)} %</output><Button variant="ghost" size="icon-sm" aria-label="Diagramm vergrößern" disabled={zoom >= 1.8} onClick={() => setZoom(z => Math.min(1.8, +(z + .2).toFixed(1)))}><Plus size={14}/></Button><Button variant="ghost" size="icon-sm" aria-label="Diagrammansicht zurücksetzen" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}><RotateCcw size={14}/></Button></div></div>
    <div className="flow diagram-viewport" aria-label="Entscheidungspfad" tabIndex={0} onKeyDown={e => {
      const offsets: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }
      const d = offsets[e.key]; if (d) { e.preventDefault(); setPan(p => ({ x: p.x + d[0], y: p.y + d[1] })) }
    }} onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, startX: pan.x, startY: pan.y } }} onPointerMove={e => { if (drag.current) setPan({ x: drag.current.startX + e.clientX - drag.current.x, y: drag.current.startY + e.clientY - drag.current.y }) }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <div className="diagram-content" data-annotation-id="discount-workflow" data-annotation-label="Rabatt-Workflow" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>{children}</div>
    </div>
  </>
}

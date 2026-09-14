import { useState } from 'react'
import { Layers2, Bell, GitBranch, ChevronRight, MessageSquare, MousePointer2, Crosshair, Scan, PanelLeftClose, PanelLeft, FlaskConical, CircleHelp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Ocr } from './features/Ocr'
import { Notification, BusinessRule } from './features/Examples'
import type { DemoState } from './features/Examples'
import { AnnotationCanvas, FeedbackPanel } from './features/Feedback'
import type { Mark, Mode, Note } from './features/Feedback'

const storageKey = 'feature-workbench-draft-feedback-v1'
function loadNotes(): Note[] {
  try { const data = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(data) ? data.filter(n => typeof n?.id === 'string' && typeof n?.body === 'string' && typeof n?.number === 'number' && ['notification', 'rule', 'ocr'].includes(n?.page) && ['v1', 'v2'].includes(n?.version) && (!n.mark || ['x','y','w','h'].every(k => typeof n.mark[k] === 'number' && n.mark[k] >= 0 && n.mark[k] <= 100) && (!n.mark.anchor || (typeof n.mark.anchor.id === 'string' && typeof n.mark.anchor.label === 'string')))) : [] } catch { return [] }
}
export default function App() {
  const [page, setPage] = useState('notification')
  const [version, setVersion] = useState('v2')
  const [sidebar, setSidebar] = useState(true)
  const [panel, setPanel] = useState(true)
  const [mode, setMode] = useState<Mode>('browse')
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [pending, setPending] = useState<Mark | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<DemoState>('success')
  const [amount, setAmount] = useState('120')
  const [member, setMember] = useState(true)
  const [help, setHelp] = useState(false)
  const [storageError, setStorageError] = useState(false)
  function updateNotes(next: Note[]) { setNotes(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false) } catch { setStorageError(true) } }
  const title = page === 'notification' ? 'Benachrichtigung' : page === 'ocr' ? 'Texterkennung' : 'Rabattregel'
  function navigate(next: string) { setPage(next); setPending(null); setMode('browse'); setSelected(null) }
  function save(body: string) { updateNotes([...notes, { id: crypto.randomUUID(), number: Math.max(0, ...notes.map(n => n.number)) + 1, page, version, body, ...(pending ? { mark: pending } : {}) }]); setPending(null); setMode('browse') }
  return <TooltipProvider><div className={`workbench ${sidebar ? '' : 'nav-collapsed'} ${panel ? '' : 'review-collapsed'}`}>
    {sidebar && <nav className="sidebar" aria-label="Workbench-Seiten"><div className="brand"><span className="brand-icon"><Layers2 size={20}/></span><strong>workbench<span>Ein Raum für gute Features.</span></strong></div><div className="project-label"><span className="project-avatar">W</span><div>Erste Ideen<small>Lokaler Entwurf</small></div><span className="project-dot"/></div><div className="nav-group-label">ARBEITSFLÄCHEN <span>03</span></div><button className={`nav-item ${page === 'notification' ? 'active' : ''}`} onClick={() => navigate('notification')} aria-current={page === 'notification' ? 'page' : undefined}><Bell size={17}/><span>Benachrichtigung</span><small>01</small></button><button className={`nav-item ${page === 'rule' ? 'active' : ''}`} onClick={() => navigate('rule')} aria-current={page === 'rule' ? 'page' : undefined}><GitBranch size={17}/><span>Rabattregel</span><small>02</small></button><button className={`nav-item ${page === 'ocr' ? 'active' : ''}`} onClick={() => navigate('ocr')} aria-current={page === 'ocr' ? 'page' : undefined}><Scan size={17}/><span>Texterkennung</span><small>03</small></button><div className="sidebar-bottom"><div className="draft-label"><FlaskConical size={16}/><span>Zum Ausprobieren<small>Beispiele & lokale Testläufe</small></span></div><button className="help-button" onClick={() => setHelp(!help)}><CircleHelp size={16}/>So funktioniert’s<ExternalLink size={13}/></button></div></nav>}
    <header className="topbar"><div className="breadcrumbs"><Button size="icon-sm" variant="ghost" aria-label={sidebar ? 'Navigation ausblenden' : 'Navigation einblenden'} onClick={() => setSidebar(!sidebar)}>{sidebar ? <PanelLeftClose size={17}/> : <PanelLeft size={17}/>}</Button><span>Erste Ideen</span><ChevronRight size={14}/><strong>{title}</strong></div><div className="header-actions"><span className="version-label">Beispielstand</span><select aria-label="Beispielversion" value={version} onChange={e => { setVersion(e.target.value); setPending(null); setMode('browse') }}><option value="v2">V2 · Aktuell</option><option value="v1">V1 · Vorher</option></select><Button variant={panel ? 'secondary' : 'outline'} size="sm" aria-label={`Anmerkungen ${notes.length}`} onClick={() => setPanel(!panel)} aria-expanded={panel}><MessageSquare size={15}/><span>Anmerkungen</span><span className="count-pill">{notes.length}</span></Button></div></header>
    <main className="main-content"><div className="page-heading"><div className="eyebrow">{page === 'notification' ? '01 / UI-KOMPONENTE' : page === 'ocr' ? '03 / LOKALE VERARBEITUNG' : '02 / BUSINESS-LOGIK'}</div><div className="title-row"><h1>{title}</h1><Badge variant="outline">{page === 'ocr' ? 'Echte lokale OCR' : 'Interaktiver Entwurf'}</Badge></div><p>{page === 'notification' ? 'Eine kleine Rückmeldung. Für die Momente, in denen alles klar sein soll.' : page === 'ocr' ? 'Ein Bild einlesen. Den erkannten Text direkt am Original prüfen.' : 'Eine Regel verstehen, bevor sie Teil des Produkts wird.'}</p></div>
      {help && <div className="help-banner"><strong>Ausprobieren → markieren → sammeln.</strong><p>Wechsle frei zwischen Seiten. Wähle Punkt oder Bereich, markiere die Vorschau und füge einen Kommentar hinzu. Die Überarbeitung beauftragst du anschließend im Chat. Der Versionswechsel zeigt zwei vorbereitete Designstände; echte Runden und Wiederherstellung folgen später.</p><Button variant="ghost" size="sm" onClick={() => setHelp(false)}>Verstanden</Button></div>}
      {storageError && <p role="alert" className="input-error">Browser-Speicherung nicht verfügbar. Bitte Anmerkungen als JSON exportieren.</p>}
      <section className="preview-shell" aria-label="Interaktive Vorschau"><div className="preview-heading"><div><span className="live-dot"/>Vorschau <span className="preview-version">{version.toUpperCase()}</span></div><div className="annotation-tools" aria-label="Review-Werkzeuge">{([{ id: 'browse', icon: MousePointer2, label: 'Ausprobieren' }, { id: 'pin', icon: Crosshair, label: 'Punkt markieren' }, { id: 'region', icon: Scan, label: 'Bereich markieren' }] as const).map(({ id, icon: Icon, label }) => <Tooltip key={id}><TooltipTrigger asChild><Button aria-label={label} aria-pressed={mode === id} variant={mode === id ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => { setMode(id); setPending(null) }}><Icon size={16}/></Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>)}<span className="toolbar-divider"/><Button variant="ghost" size="sm" onClick={() => { setPanel(true); setMode('browse'); setTimeout(() => document.getElementById('note-body')?.focus(), 0) }}><MessageSquare size={15}/><span>Notiz</span></Button></div></div>
      {mode !== 'browse' && <div className="mark-hint">{mode === 'pin' ? 'Klicke auf eine Stelle in der Vorschau.' : 'Ziehe ein Rechteck um den gewünschten Bereich.'}<button onClick={() => setMode('browse')}>Abbrechen</button></div>}
      <AnnotationCanvas mode={mode} notes={notes.filter(n => n.page === page && n.version === version)} onMark={m => { setPending(m); setPanel(true); setMode('browse'); setTimeout(() => document.getElementById('note-body')?.focus(), 0) }} onSelect={n => { setSelected(n.id); setPanel(true) }}>{page === 'notification' ? <Notification state={state} setState={setState} version={version}/> : page === 'rule' ? <BusinessRule amount={amount} setAmount={setAmount} member={member} setMember={setMember}/> : null}<Ocr visible={page === 'ocr'} onContextChange={() => { setPending(null); setMode('browse') }}/></AnnotationCanvas></section>
      <div className="workspace-footer"><span><span className="status-dot"/>Bereit zum Ausprobieren</span><span>Dein Feedback bleibt beim Seitenwechsel erhalten.</span></div>
      {version === 'v1' && <p className="version-notice">Beispielstand V1: frühere, kantigere Benachrichtigung. Rabattregel und Texterkennung sind in beiden Ständen identisch.</p>}
    </main>
    {panel && <FeedbackPanel notes={notes} page={page} version={version} pending={pending} onCancel={() => setPending(null)} onSave={save} onDelete={id => updateNotes(notes.filter(n => n.id !== id))} selected={selected} onClose={() => setPanel(false)}/>}
  </div></TooltipProvider>
}

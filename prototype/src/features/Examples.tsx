import { Check, Bell, AlertCircle, Loader2, ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { quote } from './model'
import { DiagramViewport } from './DiagramViewport'

export type DemoState = 'success' | 'loading' | 'error'
export function Notification({ state, setState, version }: { state: DemoState; setState: (s: DemoState) => void; version: string }) {
  const labels = { success: 'Erfolgreich', loading: 'In Bearbeitung', error: 'Fehler' }
  return <>
    <div className="demo-toolbar"><span>Zustand</span><div className="segmented">{(Object.keys(labels) as DemoState[]).map(s => <Button key={s} variant={state === s ? 'secondary' : 'ghost'} size="sm" aria-pressed={state === s} onClick={() => setState(s)}>{labels[s]}</Button>)}</div></div>
    <div className="notification-stage" data-annotation-id="notification-scene" data-annotation-label="Benachrichtigungsvorschau">
      <div className="background-document" aria-hidden="true"><div className="skeleton-dot"/><div className="skeleton-line short"/><div className="skeleton-line"/><div className="skeleton-line"/><div className="skeleton-line medium"/><div className="skeleton-grid"><div/><div/><div/></div></div>
      <div data-annotation-id="notification-card" data-annotation-label="Benachrichtigung" className={`notification-card ${version === 'v1' ? 'old-version' : ''}`}>
        <span data-annotation-id="notification-icon" data-annotation-label="Statussymbol" className={`notification-icon ${state}`}>{state === 'success' ? <Check size={20}/> : state === 'error' ? <AlertCircle size={20}/> : <Loader2 className="spin" size={20}/>}</span>
        <div><strong>{state === 'success' ? 'Alles gespeichert' : state === 'error' ? 'Speichern fehlgeschlagen' : 'Wird gespeichert'}</strong><p>{state === 'success' ? 'Deine Änderungen sind auf dem neuesten Stand.' : state === 'error' ? 'Bitte versuche es noch einmal.' : 'Einen kleinen Moment noch.'}</p>{state === 'error' && <Button size="sm" variant="outline" onClick={() => setState('success')}>Erneut versuchen</Button>}</div>
      </div>
      <span className="stage-caption">Benachrichtigung · interaktives UI-Beispiel</span>
    </div>
    <div className="demo-footnote"><Bell size={15}/><span>Wechsle den Zustand, ohne einen echten Speichervorgang auszulösen.</span></div>
  </>
}
export function BusinessRule({ amount, setAmount, member, setMember }: { amount: string; setAmount: (s: string) => void; member: boolean; setMember: (b: boolean) => void }) {
  const result = amount.trim() ? quote(Number(amount), member) : null
  const eligible = !!result && Number(amount) >= 100
  const euro = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
  return <div className="rule-demo">
    <div className="rule-inputs"><div><Label htmlFor="amount">Warenkorbwert</Label><div className="amount-field"><Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} aria-invalid={!result}/><span>EUR</span></div></div><div className="member-field"><div><Label htmlFor="member">Mitgliedschaft</Label><p>Zusätzlicher Vorteil ab 100 €</p></div><Switch id="member" checked={member} onCheckedChange={setMember}/></div></div>
    {!result && <p role="alert" className="input-error">Bitte einen gültigen Betrag ab 0 € eingeben.</p>}
    <DiagramViewport>
      <div className="flow-node" data-annotation-id="discount-input" data-annotation-label="Warenkorb-Eingabe"><span className="node-icon"><Sparkles size={16}/></span><div><small>EINGABE</small><strong>{result ? euro(Number(amount)) : 'Betrag fehlt'}</strong></div></div><ArrowDown className="flow-arrow" size={20}/>
      <div data-annotation-id="discount-condition" data-annotation-label="100-Euro-Bedingung" className={`flow-node condition ${result ? 'active-node' : ''}`}><span className="decision-icon">?</span><div><small>BEDINGUNG</small><strong>Warenkorb mindestens 100 €?</strong></div></div>
      <div className="flow-branches"><div className={result && !eligible ? 'chosen' : ''}><span className="branch-label">Nein</span><ArrowDown size={18}/><div className="branch-node" data-annotation-id="discount-no" data-annotation-label="Kein Rabatt">Kein Rabatt</div></div><div className={eligible ? 'chosen' : ''}><span className="branch-label">Ja</span><ArrowDown size={18}/><div className="branch-node" data-annotation-id="discount-yes" data-annotation-label="Rabatt anwenden">{member ? 'Mitglied · 15 %' : 'Standard · 10 %'}</div></div></div>
    </DiagramViewport>
    <div className="rule-result" aria-live="polite"><div><small>ERGEBNIS</small><p>{result ? `${result.rate} % Rabatt · ${euro(result.discount)} gespart` : 'Warte auf eine gültige Eingabe'}</p></div><strong>{result ? euro(result.total) : '—'}</strong></div>
    <div className="demo-footnote"><ArrowRight size={15}/><span>Die Beispielregel wird tatsächlich berechnet. Keine externen Dienste.</span></div>
  </div>
}

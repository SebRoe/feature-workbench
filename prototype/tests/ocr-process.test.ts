import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { PassThrough } from 'node:stream'
import { readFile } from 'node:fs/promises'
import type { spawn } from 'node:child_process'
import { OcrError, recognize } from '../server/ocr.ts'
const image=await readFile(new URL('../public/ocr-sample.png',import.meta.url))
function fakeProcess() {
  const child=Object.assign(new EventEmitter(),{stdin:new PassThrough(),stdout:new PassThrough(),stderr:new PassThrough(),killed:false,kill(_signal:string){this.killed=true;return true}})
  return {child,launch: (()=>child) as unknown as typeof spawn}
}
test('cancellation holds the execution promise until the process closes',async()=>{
  const {child,launch}=fakeProcess(),controller=new AbortController()
  let settled=false
  const result=recognize(image,controller.signal,launch).finally(()=>{settled=true})
  const rejection=assert.rejects(result,(err:unknown)=>err instanceof OcrError&&err.status===499)
  controller.abort();await new Promise(resolve=>setImmediate(resolve))
  assert.equal(child.killed,true)
  assert.equal(settled,false)
  child.emit('close',null,'SIGKILL');await rejection
})
test('output limit is distinct from a timeout',async()=>{
  const {child,launch}=fakeProcess()
  const result=recognize(image,undefined,launch)
  const rejection=assert.rejects(result,(err:unknown)=>err instanceof OcrError&&err.status===422&&/Ausgabe/.test(err.message))
  child.stdout.write(Buffer.alloc(4*1024*1024+1));child.emit('close',null,'SIGKILL');await rejection
})
test('engine timeout waits for close and reports its own deadline',async(t)=>{
  t.mock.timers.enable({apis:['setTimeout']})
  const {child,launch}=fakeProcess()
  const result=recognize(image,undefined,launch)
  const rejection=assert.rejects(result,(err:unknown)=>err instanceof OcrError&&err.status===504&&/30 Sekunden/.test(err.message))
  t.mock.timers.tick(30_000);assert.equal(child.killed,true)
  child.emit('close',null,'SIGKILL');await rejection
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request } from 'node:http'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { ocrMiddleware } from '../server/api.ts'
import { OcrError, recognize } from '../server/ocr.ts'
const image = await readFile(new URL('../public/ocr-sample.png', import.meta.url))
async function serve(engine = recognize, timeoutMs = 35_000) {
  const handler = ocrMiddleware(engine, timeoutMs)
  const server = createServer((req, res) => handler(req, res, () => { res.writeHead(404); res.end() }))
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  const address = server.address() as { port: number }
  const url = `http://127.0.0.1:${address.port}`
  return { url, close: () => new Promise<void>(resolve => { server.close(() => resolve()); server.closeAllConnections() }), post: (headers = {}, body: BodyInit = image) => fetch(`${url}/api/ocr`, { method: 'POST', headers: { 'content-type': 'image/png', 'x-workbench-request': 'ocr', origin: url, ...headers }, body }) }
}
test('HTTP boundary blocks foreign origins, hosts, missing headers, methods and non-images', async () => {
  let calls = 0
  const app = await serve(async () => { calls++; throw new Error('must not reach engine') })
  try {
    assert.equal((await app.post({ origin: 'https://foreign.example' })).status, 403)
    assert.equal(await new Promise<number | undefined>((resolve, reject) => { const req = request(`${app.url}/api/ocr`, { method: 'POST', headers: { host: 'foreign.example' } }, res => { res.resume(); resolve(res.statusCode) }); req.on('error', reject); req.end() }), 403)
    assert.equal((await app.post({ 'x-workbench-request': '' })).status, 403)
    assert.equal((await fetch(`${app.url}/api/ocr`)).status, 405)
    assert.equal((await app.post({ 'content-type': 'text/plain' })).status, 415)
    assert.equal((await app.post({}, 'not an image')).status, 415)
    // Do not send an oversized body after the server has already rejected its headers.
    assert.equal(await new Promise<number | undefined>((resolve, reject) => {
      const req = request(`${app.url}/api/ocr`, { method:'POST', headers:{'content-type':'image/png','x-workbench-request':'ocr','content-length':8*1024*1024+1} }, res => { res.resume(); resolve(res.statusCode) })
      req.on('error',reject); req.end()
    }), 413)
    assert.equal(calls, 0)
  } finally { await app.close() }
})
test('real HTTP OCR returns text, metadata and no-store', async () => {
  const app = await serve()
  try {
    const res = await app.post()
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('cache-control'), 'no-store')
    const result = await res.json()
    assert.match(result.text, /WORKBENCH OCR/)
    assert.equal(result.engine, 'Tesseract · eng')
    assert.ok(result.elapsedMs >= 0)
  } finally { await app.close() }
})
test('one active job, safe engine errors, then successful retry', async () => {
  let release!: () => void, started!: () => void
  const start = new Promise<void>(resolve => { started = resolve })
  const gate = new Promise<void>(resolve => { release = resolve })
  let count = 0
  const app = await serve(async () => { if (++count === 1) { started(); await gate; throw new OcrError('Tesseract fehlt.', 503) } return { width:1000,height:660,text:'retry',words:[] } })
  try {
    const first = app.post(); await start
    assert.equal((await app.post()).status, 409)
    release(); assert.equal((await first).status, 503)
    assert.equal((await app.post()).status, 200)
  } finally { release(); await app.close() }
})
test('disconnect aborts engine and releases the execution slot', async () => {
  let started!: () => void, aborted!: () => void
  const start = new Promise<void>(resolve => { started = resolve })
  const abort = new Promise<void>(resolve => { aborted = resolve })
  let count = 0
  const app = await serve(async (_image, signal) => {
    if (++count > 1) return { width:1000,height:660,text:'retry',words:[] }
    started()
    return new Promise((_resolve,reject) => signal!.addEventListener('abort', () => { aborted(); reject(new OcrError('aborted',499)) }, { once:true }))
  })
  try {
    const controller = new AbortController()
    const request = fetch(`${app.url}/api/ocr`, { method:'POST',headers:{'content-type':'image/png','x-workbench-request':'ocr',origin:app.url}, body:image,signal:controller.signal }).catch(() => null)
    await start; controller.abort(); await request; await abort
    assert.equal((await app.post()).status, 200)
  } finally { await app.close() }
})
test('aborting an incomplete upload releases the slot without reaching the engine', async () => {
  let calls = 0
  const app = await serve(async () => { calls++; return {width:1000,height:660,text:'retry',words:[]} })
  try {
    await new Promise<void>(resolve => {
      const req = request(`${app.url}/api/ocr`, {method:'POST',headers:{'content-type':'image/png','x-workbench-request':'ocr','content-length':image.length}}, res => res.resume())
      req.on('error', () => {})
      req.write(image.subarray(0,16))
      setTimeout(() => { req.destroy(); resolve() },20)
    })
    assert.equal(calls,0)
    const deadline = Date.now() + 2000
    let status: number
    do { status = (await app.post()).status; if (status === 409) await new Promise(resolve => setTimeout(resolve, 10)) } while (status === 409 && Date.now() < deadline)
    assert.equal(status,200)
    assert.equal(calls,1)
  } finally { await app.close() }
})
test('request deadline reports a timeout and releases the slot', async () => {
  let count = 0
  const app = await serve(async (_image, signal) => {
    if (++count > 1) return {width:1000,height:660,text:'retry',words:[]}
    return new Promise((_resolve,reject) => signal!.addEventListener('abort', () => reject(signal!.reason), {once:true}))
  }, 30)
  try {
    const res = await app.post()
    assert.equal(res.status,504)
    assert.match((await res.json()).error,/Zeitlimit/)
    assert.equal((await app.post()).status,200)
  } finally { await app.close() }
})
test('chunked oversized upload never reaches engine and releases slot', async () => {
  let calls=0
  const app=await serve(async () => {calls++;return {width:1000,height:660,text:'retry',words:[]}})
  try {
    const status=await new Promise<number | undefined>((resolve,reject) => {
      const req=request(`${app.url}/api/ocr`,{method:'POST',headers:{'content-type':'image/png','x-workbench-request':'ocr','transfer-encoding':'chunked'}},res=>{res.resume();resolve(res.statusCode)})
      req.on('error',reject)
      req.end(Buffer.alloc(8*1024*1024+1))
    })
    assert.equal(status,413);assert.equal(calls,0)
    assert.equal((await app.post()).status,200);assert.equal(calls,1)
  } finally {await app.close()}
})

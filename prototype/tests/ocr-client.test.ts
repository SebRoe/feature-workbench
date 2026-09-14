import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareImage, runOcr } from '../src/features/ocr-client.ts'
test('browser input validation rejects unsupported and oversized files before decoding', async () => {
  await assert.rejects(prepareImage(new Blob(['pdf'],{type:'application/pdf'})),/PNG.*JPEG/)
  await assert.rejects(prepareImage(new Blob([new Uint8Array(8*1024*1024+1)],{type:'image/png'})),/8 MB/)
})
test('client surfaces safe backend setup errors, HTML fallback and network failure', async () => {
  const original = globalThis.fetch
  const image = new Blob(['test'],{type:'image/png'}), signal = new AbortController().signal
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({error:'Tesseract fehlt.'}),{status:503,headers:{'content-type':'application/json'}})
    await assert.rejects(runOcr(image,signal),/Tesseract fehlt/)
    globalThis.fetch = async () => new Response('<html>Vite fallback</html>')
    await assert.rejects(runOcr(image,signal),/OCR-Schnittstelle/)
    globalThis.fetch = async () => { throw new TypeError('Failed to fetch') }
    await assert.rejects(runOcr(image,signal),/lokale Server/)
  } finally { globalThis.fetch = original }
})

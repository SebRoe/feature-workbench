import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { validatePng, parseTsv, recognize } from '../server/ocr.ts'
const sample = await readFile(new URL('../public/ocr-sample.png', import.meta.url))
const tsv = 'level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext\n1\t1\t0\t0\t0\t0\t0\t0\t1000\t660\t-1\t\n5\t1\t1\t1\t1\t1\t10\t20\t80\t30\t96.5\tHello\n5\t1\t1\t1\t1\t2\t100\t20\t80\t30\t95\tworld\n5\t1\t1\t1\t2\t1\t10\t60\t80\t30\t90\tNext';
test('TSV retains word geometry and line breaks', () => {
  const result = parseTsv(tsv)
  assert.equal(result.text, 'Hello world\nNext')
  assert.equal(result.width, 1000)
  assert.deepEqual(result.words[0], { id: '1-1-1-1-1', text: 'Hello', left: 10, top: 20, width: 80, height: 30, confidence: 96.5 })
})
test('PNG boundary rejects non-images, empty, oversized images and huge dimensions', () => {
  assert.deepEqual(validatePng(sample), { width: 1000, height: 660 })
  for (const data of [Buffer.alloc(0), Buffer.from('file:///etc/passwd'), Buffer.alloc(8 * 1024 * 1024 + 1)]) assert.throws(() => validatePng(data))
  const huge = Buffer.from(sample); huge.writeUInt32BE(100000, 16)
  assert.throws(() => validatePng(huge))
})
test('real local OCR recognizes synthetic sample and bounds every word', async () => {
  const result = await recognize(sample)
  assert.match(result.text, /WORKBENCH OCR/)
  assert.match(result.text, /42\.50 EUR/)
  assert.ok(result.words.length > 10)
  for (const word of result.words) {
    assert.ok(word.left >= 0 && word.top >= 0)
    assert.ok(word.left + word.width <= result.width && word.top + word.height <= result.height)
  }
})
test('blank image produces an honest empty result', async () => {
  const result = await recognize(await readFile(new URL('./fixtures/blank.png', import.meta.url)))
  assert.equal(result.text, '')
  assert.equal(result.width, 600)
  assert.deepEqual(result.words, [])
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { quote } from '../src/features/model.ts'
test('discount starts at 100 euros; members receive 15 instead of 10 percent', () => {
  assert.deepEqual(quote(99, false), { rate: 0, discount: 0, total: 99 })
  assert.deepEqual(quote(100, false), { rate: 10, discount: 10, total: 90 })
  assert.deepEqual(quote(100, true), { rate: 15, discount: 15, total: 85 })
  assert.deepEqual(quote(50, true), { rate: 0, discount: 0, total: 50 })
})
test('invalid amounts do not produce a quote and cents are rounded', () => {
  assert.equal(quote(-1, false), null)
  assert.equal(quote(NaN, false), null)
  assert.equal(quote(Infinity, true), null)
  assert.deepEqual(quote(123.45, true), { rate: 15, discount: 18.52, total: 104.93 })
})

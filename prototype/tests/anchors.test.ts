import { test } from 'node:test'
import assert from 'node:assert/strict'
import { projectMark } from '../src/features/anchors.ts'
const canvas = { left: 100, top: 100, width: 800, height: 600 }
const mark = { x: 25, y: 50, w: 50, h: 25, anchor: { id: 'node', label: 'Node' } }
test('anchored region follows movement and zoom, independently of canvas dimensions', () => {
  assert.deepEqual(projectMark(mark, canvas, { left: 200, top: 200, width: 200, height: 100 }), { left: 150, top: 150, width: 100, height: 25 })
  assert.deepEqual(projectMark(mark, canvas, { left: 240, top: 260, width: 400, height: 200 }), { left: 240, top: 260, width: 200, height: 50 })
})
test('missing and hidden anchors never fall back to stale canvas coordinates', () => {
  assert.equal(projectMark(mark, canvas, null), null)
  assert.equal(projectMark(mark, canvas, { left: 0, top: 0, width: 0, height: 0 }), null)
})
test('legacy free marks remain canvas-relative', () => {
  assert.deepEqual(projectMark({ x: 25, y: 50, w: 0, h: 0 }, canvas), { left: 200, top: 300, width: 0, height: 0 })
})

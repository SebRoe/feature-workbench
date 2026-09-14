export type Rect = { left: number; top: number; width: number; height: number }
export type Mark = { x: number; y: number; w: number; h: number; anchor?: { id: string; label: string } }

export function projectMark(mark: Mark, canvas: Rect, target?: Rect | null): Rect | null {
  if (mark.anchor && (!target || target.width <= 0 || target.height <= 0)) return null
  const frame = mark.anchor ? target! : canvas
  return {
    left: frame.left - canvas.left + frame.width * mark.x / 100,
    top: frame.top - canvas.top + frame.height * mark.y / 100,
    width: frame.width * mark.w / 100,
    height: frame.height * mark.h / 100,
  }
}

export function findAnchor(root: HTMLElement, id: string) {
  const matches = [...root.querySelectorAll<HTMLElement>('[data-annotation-id]')].filter(el => el.dataset.annotationId === id)
  return matches.length === 1 ? matches[0] : null
}

export function captureMark(root: HTMLElement, selection: Rect): Mark {
  // Hit-test the content beneath the review overlay, respecting stacking order.
  const hit = document.elementsFromPoint(selection.left + selection.width / 2, selection.top + selection.height / 2)
    .find(el => root.contains(el) && !el.closest('.drawing-layer, .mark-layer'))
  let target = hit?.closest<HTMLElement>('[data-annotation-id]') ?? null
  while (target && root.contains(target)) {
    const box = target.getBoundingClientRect()
    if (box.width > 0 && box.height > 0 && selection.left >= box.left && selection.top >= box.top && selection.left + selection.width <= box.right && selection.top + selection.height <= box.bottom && findAnchor(root, target.dataset.annotationId!) === target) break
    target = target.parentElement?.closest<HTMLElement>('[data-annotation-id]') ?? null
  }
  if (target && !root.contains(target)) target = null
  const box = (target || root).getBoundingClientRect()
  return {
    x: (selection.left - box.left) / box.width * 100,
    y: (selection.top - box.top) / box.height * 100,
    w: selection.width / box.width * 100,
    h: selection.height / box.height * 100,
    ...(target ? { anchor: { id: target.dataset.annotationId!, label: target.dataset.annotationLabel || target.getAttribute('aria-label') || target.dataset.annotationId! } } : {}),
  }
}

export function clippingRect(root: HTMLElement, target: HTMLElement | null): Rect {
  const canvas = root.getBoundingClientRect()
  let left = canvas.left, top = canvas.top, right = canvas.right, bottom = canvas.bottom
  for (let el = target?.parentElement; el && el !== root; el = el.parentElement) {
    const style = getComputedStyle(el)
    const box = el.getBoundingClientRect()
    if (/(hidden|clip|scroll|auto)/.test(style.overflowX)) { left = Math.max(left, box.left); right = Math.min(right, box.right) }
    if (/(hidden|clip|scroll|auto)/.test(style.overflowY)) { top = Math.max(top, box.top); bottom = Math.min(bottom, box.bottom) }
  }
  return { left: left - canvas.left, top: top - canvas.top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) }
}

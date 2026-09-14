export function quote(amount: number, member: boolean) {
  if (!Number.isFinite(amount) || amount < 0) return null
  const cents = Math.round(amount * 100)
  const rate = cents >= 10000 ? (member ? 15 : 10) : 0
  const discount = Math.round(cents * rate / 100)
  return { rate, discount: discount / 100, total: (cents - discount) / 100 }
}

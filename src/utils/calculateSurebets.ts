export const calculateSurebet = (oddsA: number, oddsB: number) => {
  const invA = 1 / oddsA
  const invB = 1 / oddsB
  const total = invA + invB
  return {
    isSurebet: total < 1,
    profitPercentage: (1 - total) * 100,
  }
}
export const parseNumber = (input: string): number => {
 if (!input) return NaN
  // Reemplaza cualquier coma por punto
  let normalized = input.replace(/,/g, ".")
  // Elimina cualquier caracter que no sea número o punto
  normalized = normalized.replace(/[^0-9.]/g, "")
  // Si hay más de un punto, toma solo el primero y elimina los demás
  const firstDotIndex = normalized.indexOf(".")
  if (firstDotIndex !== -1) {
    normalized =
      normalized.slice(0, firstDotIndex + 1) +
      normalized.slice(firstDotIndex + 1).replace(/\./g, "")
  }
  return parseFloat(normalized)
}

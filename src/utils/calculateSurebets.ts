export const calculateSurebet = (oddsA: number, oddsB: number) => {
  const invA = 1 / oddsA
  const invB = 1 / oddsB
  const total = invA + invB
  return {
    isSurebet: total < 1,
    profitPercentage: (1 - total) * 100,
  }
}

import { useState } from "react"

interface SurebetResult {
  isSurebet: boolean
  betOnFavorite: number
  betOnUnderdog: number
  profit: number
  bookieMargin: number
  guaranteedLoss: number
}

export const useSurebet = () => {
  const [result, setResult] = useState<SurebetResult | null>(null)

  const calculateSurebet = (
    favoriteOdds: number,
    underdogOdds: number,
    totalAmount: number
  ) => {
    const margin = 1 / favoriteOdds + 1 / underdogOdds

    if (margin < 1) {
      const betOnFavorite = (totalAmount / favoriteOdds) / margin
      const betOnUnderdog = (totalAmount / underdogOdds) / margin
      const profit = totalAmount / margin - totalAmount

      setResult({
        isSurebet: true,
        betOnFavorite,
        betOnUnderdog,
        profit,
        bookieMargin: 0,
        guaranteedLoss: 0,
      })
    } else {
      const bookieMargin = (margin - 1) * 100
      const guaranteedLoss = (totalAmount * bookieMargin) / 100

      setResult({
        isSurebet: false,
        betOnFavorite: 0,
        betOnUnderdog: 0,
        profit: 0,
        bookieMargin,
        guaranteedLoss,
      })
    }
  }

  return { result, calculateSurebet }
}

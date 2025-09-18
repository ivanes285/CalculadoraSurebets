interface Props {
  favoriteTeam: string
  underdogTeam: string
  favoriteOdds: number
  underdogOdds: number
  totalAmount: number
  result: {
    isSurebet: boolean
    betOnFavorite: number
    betOnUnderdog: number
    profit: number
    bookieMargin: number
    guaranteedLoss: number
  } | null
}

export const SurebetResult = ({
  favoriteTeam,
  underdogTeam,
  favoriteOdds,
  underdogOdds,
  totalAmount,
  result,
}: Props) => {
  if (!result) return null

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2
        className={`text-xl font-bold text-center mb-4 ${
          result.isSurebet
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {result.isSurebet ? "Resultado Surebet" : "No hay Surebet"}
      </h2>

      {result.isSurebet ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center">
              <p className="font-semibold text-gray-800 dark:text-white">
                Apostar en {favoriteTeam}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${result.betOnFavorite.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                a cuota {favoriteOdds}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center">
              <p className="font-semibold text-gray-800 dark:text-white">
                Apostar en {underdogTeam}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${result.betOnUnderdog.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                a cuota {underdogOdds}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-800 dark:text-white">
              Ganancia asegurada
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Independientemente del resultado, obtendrás un beneficio
              garantizado de <strong>${result.profit.toFixed(2)}</strong> sobre
              tu inversión de ${totalAmount.toFixed(2)}.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Margen de la Casa de Apuestas
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {result.bookieMargin.toFixed(2)}%
            </p>
          </div>

          <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-800 dark:text-white">
              Información
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Apostar en ambos resultados con estas cuotas resultará en una
              pérdida garantizada de aproximadamente{" "}
              <strong>${result.guaranteedLoss.toFixed(2)}</strong> sobre tu
              inversión de ${totalAmount.toFixed(2)}.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

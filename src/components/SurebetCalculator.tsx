import { useState, useEffect } from "react"
import { ThemeToggle } from "./ThemeToggle"

export const SurebetCalculator = () => {
  const [totalAmount, setTotalAmount] = useState("")
  const [oddsA, setOddsA] = useState("")
  const [oddsB, setOddsB] = useState("")
  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [strategy, setStrategy] = useState<"classic" | "underdog" | "favorite">(
    "classic"
  )
  const [strategyText, setStrategyText] = useState("")
  const [resultHTML, setResultHTML] = useState("")
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(true)
  const [roundToInteger, setRoundToInteger] = useState(false)

  useEffect(() => {
    if (strategy === "classic") {
      setStrategyText(
        `<p class="font-bold mb-1 text-blue-600 dark:text-blue-400">🛡️ Estrategia Clásica</p>
        <p class="text-gray-700 dark:text-gray-300">Aseguras una <strong>ganancia pequeña y garantizada</strong> sin importar quién gane.</p>`
      )
    } else if (strategy === "underdog") {
      setStrategyText(
        `<p class="font-bold mb-1 text-yellow-500 dark:text-yellow-400">💰 Mayor Ganancia con Underdog</p>
        <p class="text-gray-700 dark:text-gray-300">Maximizas tu ganancia si gana el desfavorecido. Si gana el favorito, recuperas tu inversión.</p>`
      )
    } else {
      setStrategyText(
        `<p class="font-bold mb-1 text-purple-500 dark:text-purple-400">🔥 Mayor Ganancia con Favorito</p>
        <p class="text-gray-700 dark:text-gray-300">Maximizas tu ganancia si gana el favorito. Si gana el underdog, recuperas tu inversión.</p>`
      )
    }
  }, [strategy])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", isDark.toString())
  }, [isDark])

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme !== null) {
      setIsDark(savedTheme === "true")
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setIsDark(prefersDark)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev)
  }

  const clearForm = () => {
    setTotalAmount("")
    setOddsA("")
    setOddsB("")
    setTeamA("")
    setTeamB("")
    setError("")
    setResultHTML("")
    setRoundToInteger(false)
  }

  const calculateBets = () => {
    setError("")
    setResultHTML("")

    const total = parseFloat(totalAmount.replace(",", "."))
    const odds1 = parseFloat(oddsA.replace(",", "."))
    const odds2 = parseFloat(oddsB.replace(",", "."))

    if (isNaN(total) || total <= 0) {
      setError("Por favor, ingresa un monto total válido y mayor a 0.")
      return
    }
    if (isNaN(odds1) || isNaN(odds2) || odds1 <= 1 || odds2 <= 1) {
      setError("Por favor, ingresa cuotas válidas y mayores a 1.")
      return
    }
    if (!teamA || !teamB) {
      setError("Por favor, ingresa los nombres de ambos equipos.")
      return
    }

    const margin = 1 / odds1 + 1 / odds2

    if (margin < 1) {
      let favoriteTeam, favoriteOdds, underdogTeam, underdogOdds
      let betOnFavorite = 0,
        betOnUnderdog = 0
      let profitFavorite, profitUnderdog, returnFavorite, returnUnderdog

      if (odds1 < odds2) {
        favoriteTeam = teamA
        favoriteOdds = odds1
        underdogTeam = teamB
        underdogOdds = odds2
      } else {
        favoriteTeam = teamB
        favoriteOdds = odds2
        underdogTeam = teamA
        underdogOdds = odds1
      }

      if (strategy === "classic") {
        betOnFavorite = total / (1 + favoriteOdds / underdogOdds)
        betOnUnderdog = total - betOnFavorite
      } else if (strategy === "underdog") {
        betOnFavorite = total / favoriteOdds
        betOnUnderdog = total - betOnFavorite
      } else {
        betOnUnderdog = total / underdogOdds
        betOnFavorite = total - betOnUnderdog
      }

      // Recalcular para enteros y garantizar ganancia >= 0
      if (roundToInteger) {
        betOnFavorite = Math.floor(betOnFavorite)
        betOnUnderdog = Math.floor(betOnUnderdog)

        returnFavorite = betOnFavorite * favoriteOdds
        returnUnderdog = betOnUnderdog * underdogOdds
        profitFavorite = returnFavorite - total
        profitUnderdog = returnUnderdog - total

        // Ajuste: aumentar la apuesta del otro equipo si alguno queda negativo
        if (profitFavorite < 0 || profitUnderdog < 0) {
          // Calculamos cuánto falta para 0 ganancia
          const deficit = Math.max(0 - profitFavorite, 0 - profitUnderdog)
          // Distribuimos incremento proporcionalmente
          betOnFavorite += Math.ceil(deficit / favoriteOdds)
          betOnUnderdog += Math.ceil(deficit / underdogOdds)
        }
      }

      returnFavorite = betOnFavorite * favoriteOdds
      returnUnderdog = betOnUnderdog * underdogOdds
      profitFavorite = returnFavorite - total
      profitUnderdog = returnUnderdog - total

      const strategyDetails = `
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-green-50 dark:bg-green-900/50 p-3 rounded-lg border border-green-200 dark:border-green-700">
            <p class="font-semibold text-green-800 dark:text-green-200">Si gana ${favoriteTeam}:</p>
            <p class="text-green-600 dark:text-green-400 font-bold text-lg">
              Recuperas $${returnFavorite.toFixed(2)}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              Ganancia neta: <span class="font-bold">$${profitFavorite.toFixed(2)}</span>
            </p>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/50 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p class="font-semibold text-yellow-800 dark:text-yellow-200">Si gana ${underdogTeam}:</p>
            <p class="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
              Recuperas $${returnUnderdog.toFixed(2)}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              Ganancia neta: <span class="font-bold">$${profitUnderdog.toFixed(2)}</span>
            </p>
          </div>
        </div>
      `

      setResultHTML(`
        <h2 class="text-xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
          ${
            strategy === "classic"
              ? "Estrategia Tradicional: Ganancia garantizada"
              : strategy === "underdog"
              ? "Estrategia de Mayor Ganancia (Underdog)"
              : "Estrategia de Mayor Ganancia (Favorito)"
          }
        </h2>
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">Margen a tu favor</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">${(
            (1 - margin) * 100
          ).toFixed(2)}%</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center flex-col">
            <p class="font-semibold text-gray-800 dark:text-white">Apostar en ${favoriteTeam}</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">$${betOnFavorite.toFixed(
              0
            )}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">a cuota ${favoriteOdds}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center flex-col">
            <p class="font-semibold text-gray-800 dark:text-white">Apostar en ${underdogTeam}</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">$${betOnUnderdog.toFixed(
              0
            )}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">a cuota ${underdogOdds}</p>
          </div>
        </div>
        <div class="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          ${strategyDetails}
        </div>
      `)
    } else {
      const bookieMargin = (margin - 1) * 100
      const guaranteedLoss = (total * bookieMargin) / 100
      setResultHTML(`
        <h2 class="text-xl font-bold text-center text-red-600 dark:text-red-400 mb-4">No hay Surebet</h2>
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">Margen de la Casa de Apuestas</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">${bookieMargin.toFixed(
            2
          )}%</p>
        </div>
        <div class="mt-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <p class="font-semibold text-gray-800 dark:text-white">Información</p>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Apostar en ambos resultados con estas cuotas resultará en una pérdida garantizada de aproximadamente <strong>$${guaranteedLoss.toFixed(
            2
          )}</strong> sobre tu inversión de $${total.toFixed(2)}.</p>
        </div>
      `)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Calculadora de Surebets
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Encuentra ganancias seguras
            </p>
          </div>
          <ThemeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto total a apostar ($)
            </label>
            <input
              type="text"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Equipo A
              </label>
              <input
                type="text"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Argentina"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cuota de A
              </label>
              <input
                type="text"
                value={oddsA}
                onChange={(e) => setOddsA(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 2.15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Equipo B
              </label>
              <input
                type="text"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Brasil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cuota de B
              </label>
              <input
                type="text"
                value={oddsB}
                onChange={(e) => setOddsB(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 1.95"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estrategia
            </label>
            <select
              value={strategy}
              onChange={(e) =>
                setStrategy(
                  e.target.value as "classic" | "underdog" | "favorite"
                )
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="classic">Ganancia Uniforme (Clásica)</option>
              <option value="underdog">Mayor Ganancia (Underdog)</option>
              <option value="favorite">Mayor Ganancia (Favorito)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={roundToInteger}
              onChange={() => setRoundToInteger((prev) => !prev)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Mostrar apuestas en enteros
            </span>
          </div>

          <div
            className="mt-2 p-3 rounded-md border text-sm flex items-center min-h-[60px] shadow-sm"
            dangerouslySetInnerHTML={{ __html: strategyText }}
          ></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={clearForm}
            className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800"
          >
            Limpiar
          </button>
          <button
            onClick={calculateBets}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            Calcular
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}

        {resultHTML && (
          <div
            className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6"
            dangerouslySetInnerHTML={{ __html: resultHTML }}
          ></div>
        )}
      </div>
    </div>
  )
}

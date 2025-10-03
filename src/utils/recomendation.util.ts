export const getRecommendation = (
  odds1: number,
  odds2: number,
  total: number,
  teamA = "Equipo A",
  teamB = "Equipo B"
) => {
  // Validación básica
  if (!isFinite(odds1) || !isFinite(odds2) || odds1 <= 1 || odds2 <= 1 || total <= 0) {
    return `<div class="p-3 rounded-md bg-red-100 text-red-800">Entradas inválidas. Asegúrate de ingresar cuotas > 1 y monto > 0.</div>`
  }

  // Determinar favorito / underdog (menor cuota = favorito)
  let favoriteTeam: string, underdogTeam: string
  let favoriteOdds: number, underdogOdds: number
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

  // Probabilidades implícitas normalizadas
  const pFavRaw = 1 / favoriteOdds
  const pUndRaw = 1 / underdogOdds
  const sumRaw = pFavRaw + pUndRaw
  const pFav = pFavRaw / sumRaw
  const pUnd = pUndRaw / sumRaw

  // Margen: si < 1 -> arbitraje posible
  const margin = pFavRaw + pUndRaw

  // ---------------------------
  // 1) Estrategia CLÁSICA (arbitraje / igualar retorno)
  // ---------------------------
  const R = total / margin
  const sFavClassic = R / favoriteOdds
  const sUndClassic = R / underdogOdds
  const profitClassic = +(R - total)

  // ---------------------------
  // 2) Cobertura "underdog" (recuperar si gana favorito)
  // ---------------------------
  const sFavUnderdog = total / favoriteOdds
  const sUndUnderdog = total - sFavUnderdog
  const retFav_Und = sFavUnderdog * favoriteOdds
  const retUnd_Und = sUndUnderdog * underdogOdds
  const profitFav_Und = +(retFav_Und - total)
  const profitUnd_Und = +(retUnd_Und - total)

  // ---------------------------
  // 3) Cobertura "favorite" (recuperar si gana underdog)
  // ---------------------------
  const sUndFavorite = total / underdogOdds
  const sFavFavorite = total - sUndFavorite
  const retFav_Fav = sFavFavorite * favoriteOdds
  const retUnd_Fav = sUndFavorite * underdogOdds
  const profitFav_Fav = +(retFav_Fav - total)
  const profitUnd_Fav = +(retUnd_Fav - total)

  // ---------------------------
  // EV y worst-case
  // ---------------------------
  const evClassic = profitClassic
  const evUnderdog = pFav * profitFav_Und + pUnd * profitUnd_Und
  const evFavorite = pFav * profitFav_Fav + pUnd * profitUnd_Fav
  const worstClassic = profitClassic
  const worstUnderdog = Math.min(profitFav_Und, profitUnd_Und)
  const worstFavorite = Math.min(profitFav_Fav, profitUnd_Fav)

  // Elegir recomendación
  let recommendedKey: "classic" | "underdog" | "favorite" = "classic"
  if (margin < 1) {
    recommendedKey = "classic"
  } else {
    const evs = [
      { k: "classic", v: evClassic },
      { k: "underdog", v: evUnderdog },
      { k: "favorite", v: evFavorite },
    ]
    evs.sort((a, b) => b.v - a.v)
    recommendedKey = evs[0].k as any
  }

  // Funciones auxiliares
  const money = (n: number) => `$${n.toFixed(2)}`

  // HTML final con tarjetas estilizadas
  const html = `
  <div class="grid gap-4 sm:grid-cols-3">
    <!-- Ganancia uniforme (Clásica) -->
    <div class="p-4 rounded-xl shadow-lg bg-green-50 border border-green-300">
      <p class="font-bold text-lg text-green-800 mb-2">Ganancia uniforme (Clásica)</p>
      <p class="text-gray-700">Apostar: <strong>${money(sFavClassic)}</strong> en ${favoriteTeam}, <strong>${money(sUndClassic)}</strong> en ${underdogTeam}</p>
      <p class="mt-2 font-semibold text-green-900">Ganancia garantizada: <strong>${money(profitClassic)}</strong></p>
    </div>

    <!-- Cobertura Underdog -->
    <div class="p-4 rounded-xl shadow-lg bg-yellow-50 border border-yellow-300">
      <p class="font-bold text-lg text-yellow-800 mb-2">Cobertura Underdog</p>
      <p class="text-gray-700">Apostar: <strong>${money(sFavUnderdog)}</strong> en ${favoriteTeam}, <strong>${money(sUndUnderdog)}</strong> en ${underdogTeam}</p>
      <p class="mt-2 font-semibold text-yellow-900">Ganancia máxima: <strong>${money(Math.max(profitFav_Und, profitUnd_Und))}</strong></p>
    </div>

    <!-- Cobertura Favorito -->
    <div class="p-4 rounded-xl shadow-lg bg-purple-50 border border-purple-300">
      <p class="font-bold text-lg text-purple-800 mb-2">Cobertura Favorito</p>
      <p class="text-gray-700">Apostar: <strong>${money(sFavFavorite)}</strong> en ${favoriteTeam}, <strong>${money(sUndFavorite)}</strong> en ${underdogTeam}</p>
      <p class="mt-2 font-semibold text-purple-900">Ganancia máxima: <strong>${money(Math.max(profitFav_Fav, profitUnd_Fav))}</strong></p>
    </div>
  </div>

  <!-- Recomendación -->
  <div class="p-4 rounded-lg bg-green-100 border-l-4 border-green-600 mt-4 shadow">
    <p class="font-semibold text-green-800">Recomendación:</p>
    <p class="mt-1 text-green-900">
      ${recommendedKey === "classic" 
        ? `La mejor opción es <strong>Ganancia uniforme (Clásica)</strong>: beneficio seguro (ganancia garantizada).` 
        : recommendedKey === "underdog" 
        ? `La mejor opción por EV es <strong>Cobertura al Underdog</strong>.`
        : `La mejor opción por EV es <strong>Cobertura al Favorito</strong>.`}
    </p>
    <p class="text-sm text-green-800 mt-2">
      Nota: la recomendación se basa exclusivamente en las cuotas y el monto ingresado.
    </p>
  </div>
  `
  return html
}
/* =========================================================
   Liberate v4 · pantalla HOY (alumno)
   ========================================================= */

function hoy(){
  const cx = S.clima === 'cancelada';
  const ab = S.llamada === 'abierta';
  const t  = TURNO.n;

  const status = cx
    ? `<span class="pill pill--no">Cancelada</span>`
    : ab ? `<span class="pill pill--ok">Llamada abierta</span>`
         : `<span class="pill pill--mute">Esperado</span>`;

  const copy = S.mi === 'esperado'
      ? 'Todavía no respondiste (igual tenés tu lugar fijo)'
      : S.mi === 'voy'
        ? '¡Tu personaje ya está en la plaza! 💪'
        : 'Liberaste tu lugar. Podés cambiarlo cuando quieras.';

  return `
  <div class="screen screen--hoy">
    ${sceneHero()}
    <div class="sheet">
      <div class="grabber"></div>

      <div class="sheet-head">
        <div>
          <div class="eyebrow">${DAYS_FULL[HOY]} · hoy</div>
          <h1 style="margin-top:2px">${t.h} <span class="sep">·</span> ${t.lugar}</h1>
        </div>
        ${status}
      </div>

      ${S.clima === 'a_confirmar'
        ? `<div class="alert">${ic('cloud', 15)}<div>Clima en duda. El profe confirma a las 19:00.</div></div>`
        : ''}

      ${cx
        ? `<p class="sub" style="margin-top:10px">No se descuenta de tu plan. ¡Nos vemos en la próxima!</p>`
        : (ab && S.msg
            ? `<div class="quote"><span class="quote-tag">Profe</span>${S.msg}</div>`
            : '')}

      ${!cx ? `
        <div class="answer">
          <button class="answer-btn ok ${S.mi === 'voy' ? 'on' : ''}" onclick="mi('voy')"
            aria-pressed="${S.mi === 'voy'}">
            <span class="answer-ic">${ic('check', 13)}</span>Voy
          </button>
          <button class="answer-btn no ${S.mi === 'no_voy' ? 'on' : ''}" onclick="mi('no_voy')"
            aria-pressed="${S.mi === 'no_voy'}">
            <span class="answer-ic">${ic('x', 13)}</span>No voy
          </button>
        </div>
        <p class="hint">${copy}</p>` : ''}
    </div>
    ${nav()}
  </div>`;
}

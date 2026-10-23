/* =========================================================
   Liberate v4 · pantalla MI LIBERATE (calendario / semana fija)
   ========================================================= */

function liberate(){
  const [i, k] = S.sel.split('-');
  const d    = +i;
  const t    = TURNO[k];
  const free = (k === 'm' ? 15 : 25) - (6 + d*2);

  /* próximas clases: hoy y después, dando la vuelta a la semana */
  const orden = [2,3,4,0,1];
  const up = orden.flatMap(j => ['m','n'].filter(q => S.week[j+'-'+q]).map(q => [j, q]));

  const proximas = up.length ? up.map(([j, q]) => {
    const tt = TURNO[q];
    const esHoy = j === HOY && q === 'n';
    return `
      <div class="item">
        <div class="day-badge ${j === HOY ? 'is-today' : ''}">
          <b>${DAYS[j]}</b><span>${j === HOY ? 'hoy' : j < HOY ? 'próx.' : 'sem'}</span>
        </div>
        <div class="item-main">
          <div class="item-title">${tt.h} · ${tt.lugar}</div>
          <div class="item-sub">${DAYS_FULL[j]}${j === HOY ? ' · hoy' : ''}</div>
        </div>
        ${esHoy
          ? `<span class="pill ${S.mi === 'voy' ? 'pill--ok' : S.mi === 'no_voy' ? 'pill--no' : 'pill--mute'}">${stp()}</span>`
          : `<span class="pill pill--mute">Fija</span>`}
      </div>`;
  }).join('') : `<p class="sub">Todavía no armaste tu semana.</p>`;

  const filas = ['m','n'].map(q => {
    const tt = TURNO[q];
    return `
      <div class="week-row">
        <div class="week-hour">${tt.h}<span>${tt.lugar}</span></div>
        ${DAYS.map((_, j) => {
          const on = !!S.week[j+'-'+q];
          return `<button class="cell ${on ? 'on' : ''} ${S.sel === j+'-'+q ? 'sel' : ''}"
            onclick="tog(${j},'${q}')" aria-pressed="${on}"
            aria-label="${DAYS_FULL[j]} ${tt.h} ${tt.lugar}">${on ? ic('check', 15) : '+'}</button>`;
        }).join('')}
      </div>`;
  }).join('');

  const body = `
    <div class="card">
      <div class="card-head"><h3>Próximas clases</h3>${ic('calendar', 17)}</div>
      <div class="list">${proximas}</div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3>Mi semana fija</h3>
        <span class="pill ${nSel() >= PLAN ? 'pill--wa' : 'pill--ok'}">${nSel()}/${PLAN} clases</span>
      </div>
      <p class="sub">Elegí tu turno base y se arma solo:</p>
      <div class="chips">
        <button class="chip" onclick="base('m')">☀️ Mañana</button>
        <button class="chip" onclick="base('n')">🌙 Noche</button>
        <button class="chip" onclick="base('x')">🔀 Mixto</button>
      </div>
      <div class="week">
        <div class="week-row">
          <div></div>
          ${DAYS.map((n, j) => `<div class="week-day ${j === HOY ? 'is-today' : ''}">${n}</div>`).join('')}
        </div>
        ${filas}
      </div>
      <div class="week-foot">
        <span>${ic('clock', 12)} 2 turnos</span>
        <span>${ic('pin', 12)} Gym y Plaza</span>
      </div>
    </div>

    <div class="card card--flat">
      <div class="card-head" style="margin-bottom:8px">
        <h3 style="margin:0">${DAYS_FULL[d]} · ${t.h} · ${t.lugar}</h3>
        <span class="pill pill--mute">${free} lugares</span>
      </div>
      <p class="sub">${S.week[S.sel]
        ? 'Es parte de tu semana fija.'
        : 'No es tu horario fijo. Podés sumarte como clase extra si hay lugar.'}</p>
      <div style="margin-top:12px;display:grid;gap:8px">
        <button class="btn btn--ghost btn--sm" onclick="toast('Demo: te anotarías solo esta semana')">
          Anotarme solo esta semana</button>
        <button class="btn btn--ghost btn--sm" onclick="toast('Demo: pasarías al otro turno solo hoy')">
          Pasarme al otro turno solo hoy</button>
      </div>
    </div>`;

  return page('Mi Liberate', `${DAYS_FULL[HOY]} · ${cnt().v} confirmados hoy`, body + nav(), {
    note: 'Cambios permanentes aplican desde la semana próxima si los hacés hasta el domingo.'
  });
}

function tog(i, k){
  const key = i + '-' + k;
  S.sel = key;
  if (S.week[key]) delete S.week[key];
  else {
    if (nSel() >= PLAN){
      toast('Llegaste al tope de tu plan (3 clases por semana)');
      render();
      return;
    }
    S.week[key] = 1;
  }
  render();
}

function base(t){
  S.week = {};
  [0,2,4].forEach(d => {
    if (t === 'm' || t === 'x') S.week[d+'-m'] = 1;
    if (t === 'n')              S.week[d+'-n'] = 1;
  });
  if (t === 'x'){ delete S.week['4-m']; S.week['4-n'] = 1; }
  toast('Semana armada según tu turno');
  render();
}

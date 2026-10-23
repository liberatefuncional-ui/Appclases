/* =========================================================
   Liberate v4 · pantalla PERFIL
   ========================================================= */

function perfil(){
  const usadas = 9, total = 12, racha = 4;

  const body = `
    <div class="card center av-hero">
      <canvas class="av av-big" data-u="6" data-s="${S.av}" width="48" height="80"
        aria-label="Tu personaje en la plaza"></canvas>
      <h3 style="margin-top:12px">Alumno demo</h3>
      <p class="sub" style="margin-top:2px">Elegí tu personaje para la plaza</p>
      <div class="avs">
        ${[0,1,2,3,4,5,6,7].map(s => `
          <button class="avb ${S.av === s ? 'on' : ''}" onclick="setAv(${s})"
            aria-pressed="${S.av === s}" aria-label="Personaje ${s+1}">
            <canvas class="av" data-u="3" data-s="${s}" width="24" height="40"></canvas>
          </button>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3 style="margin:0">Mi membresía</h3>
        <span class="pill pill--ok">Activa</span>
      </div>
      <div class="serif xl">Plan 3 clases por semana</div>
      <p class="sub" style="margin-top:2px">Vence el 30/11</p>

      <div class="row-between" style="margin-top:16px">
        <span class="sub" style="font-weight:700;color:var(--ink-2)">Clases del mes</span>
        <span class="kpi"><b>${usadas}</b><span>/ ${total}</span></span>
      </div>
      <div class="bar" style="margin-top:8px"><i style="width:${usadas/total*100}%"></i></div>

      <div class="stats">
        <div class="stat ok"><b>${racha}</b><span>Racha</span></div>
        <div class="stat"><b>${total-usadas}</b><span>Restan</span></div>
        <div class="stat"><b>${nSel()}</b><span>Fijas / sem</span></div>
      </div>

      <div style="display:grid;gap:8px;margin-top:14px">
        <button class="btn btn--ghost btn--sm" onclick="toast('Demo: pausar plan')">Pausar plan</button>
        <button class="btn btn--acc btn--sm" onclick="toast('Demo: renovar cuota')">Renovar</button>
      </div>
    </div>`;

  return page('Perfil', 'Tu personaje, tu plan y tu racha.', body + nav());
}

function setAv(s){ S.av = s; render(); }

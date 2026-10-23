/* =========================================================
   Liberate v4 · pantalla ENTRENAR EN CASA
   ========================================================= */

function casa(){
  if (S.run) return runner();
  if (S.rut != null) return detalleRutina();

  const body = `
    <div class="card card--glass">
      <div class="card-head" style="margin-bottom:6px">
        <h3>Esta semana</h3>
        <span class="pill pill--acc">${ic('flame', 12)} ${S.casa} hechos</span>
      </div>
      <p class="sub">Para los días que no podés venir a la plaza.</p>
    </div>

    ${RT.map((r, i) => `
      <div class="card" role="button" tabindex="0"
        onclick="abrirRutina(${i})" onkeydown="if(event.key==='Enter')abrirRutina(${i})">
        <div class="card-head" style="margin-bottom:6px">
          <h3 style="margin:0">${r.n}</h3>
          <span class="pill pill--mute">${r.ex.length} min</span>
        </div>
        <div class="row-between">
          <p class="sub">${r.lv} · ${r.eq}</p>
          <span style="color:var(--acc)">${ic('play', 18)}</span>
        </div>
      </div>`).join('')}`;

  return page('Entrenar en casa', 'Rutinas cortas, sin equipo. Sumá igual tu semana.', body + nav());
}

function abrirRutina(i){ S.rut = i; render(); }

function detalleRutina(){
  const r = RT[S.rut];
  const body = `
    <div class="card">
      <div class="card-head">
        <h3 style="margin:0">${r.n}</h3>
        <span class="pill pill--mute">${r.ex.length} ejercicios</span>
      </div>
      <p class="sub">40 s de trabajo · 20 s de pausa · ${r.lv} · ${r.eq}</p>
      <hr class="hr">
      <div class="list">
        ${r.ex.map((e, i) => `
          <div class="item">
            <div class="day-badge" style="width:34px;height:34px;border-radius:10px">
              <b style="font-size:13px">${i+1}</b>
            </div>
            <div class="item-main"><div class="item-title">${e}</div></div>
          </div>`).join('')}
      </div>
    </div>
    <div style="margin-top:12px;display:grid;gap:8px">
      <button class="btn btn--acc" onclick="start()">${ic('play', 17)} Empezar</button>
      <button class="btn btn--ghost btn--sm" onclick="S.rut=null;render()">Volver</button>
    </div>`;
  return page(r.n, 'Sin equipo, sin excusas.', body + nav());
}

function start(){
  S.run = { i:0, left:40, rest:false, done:0 };
  clearInterval(S.iv);
  S.iv = setInterval(tick, 1000);
  render();
}

/* El timer actualiza sólo el anillo, sin repintar toda la pantalla. */
function tick(){
  const r = S.run; if (!r) return;
  r.left--;

  if (r.left < 0){
    const n = RT[S.rut].ex.length;
    if (!r.rest && r.i === n-1){ r.done = 1; clearInterval(S.iv); S.casa++; }
    else if (!r.rest){ r.rest = true; r.left = 20; }
    else { r.i++; r.rest = false; r.left = 40; }
  }

  if (r.done){ render(); return; }
  paintRunner(r);
}

function paintRunner(r){
  const ex = RT[S.rut].ex;
  const ring  = document.getElementById('ring');
  const num   = document.getElementById('ringNum');
  const lab   = document.getElementById('ringLab');
  const name  = document.getElementById('exName');
  const next  = document.getElementById('exNext');
  const step  = document.getElementById('exStep');
  if (!ring || r.done) { render(); return; }

  const p = r.rest ? (20 - r.left)/20*100 : (40 - r.left)/40*100;
  ring.style.setProperty('--p', p.toFixed(1));
  ring.classList.toggle('pause', r.rest);
  num.textContent = r.left;
  lab.textContent = r.rest ? 'Pausa' : 'Trabajo';
  name.textContent = r.rest ? 'Recuperá' : ex[r.i];
  step.textContent = `Ejercicio ${r.i+1} de ${ex.length}`;
  next.textContent = ex[r.i+1] ? 'Sigue: ' + ex[r.i+1] : '¡Último ejercicio!';
}

function runner(){
  const r = S.run, ex = RT[S.rut].ex;

  if (r.done){
    const bodyDone = `
      <div class="card center" style="padding:28px 18px">
        <div style="color:var(--acc);display:flex;justify-content:center">${ic('flame', 54)}</div>
        <h2 style="margin-top:12px">Entrenamiento completo</h2>
        <p class="sub" style="margin-top:6px">Llevás ${S.casa} entrenamientos en casa esta semana.</p>
      </div>
      <button class="btn btn--acc" style="margin-top:12px"
        onclick="S.run=null;S.rut=null;render()">Volver</button>`;
    return page('¡Listo!', 'Un día más que no se negocia.', bodyDone + nav());
  }

  const p = r.rest ? (20 - r.left)/20*100 : (40 - r.left)/40*100;

  const body = `
    <div class="card center" style="padding:20px 16px 24px">
      <div class="eyebrow" id="exStep">Ejercicio ${r.i+1} de ${ex.length}</div>
      <h2 id="exName" style="margin:6px 0 2px">${r.rest ? 'Recuperá' : ex[r.i]}</h2>

      <div class="ring ${r.rest ? 'pause' : ''}" id="ring" style="--p:${p.toFixed(1)}"
        role="timer" aria-live="off">
        <div class="ring-inner">
          <div class="ring-num" id="ringNum">${r.left}</div>
          <div class="ring-lab" id="ringLab">${r.rest ? 'Pausa' : 'Trabajo'}</div>
        </div>
      </div>

      <p class="sub" style="margin-top:16px" id="exNext">
        ${ex[r.i+1] ? 'Sigue: ' + ex[r.i+1] : '¡Último ejercicio!'}</p>
    </div>

    <button class="btn btn--ghost btn--sm" style="margin-top:10px"
      onclick="clearInterval(S.iv);S.run=null;render()">Terminar</button>`;

  return page(RT[S.rut].n, '40 s de trabajo · 20 s de pausa', body + nav());
}

/* =========================================================
   Liberate v4 · vista PROFE
   ========================================================= */

function profe(){
  const c  = cnt();
  const ab = S.llamada === 'abierta';
  const cx = S.clima === 'cancelada';

  /* ---------- estado del clima ---------- */
  const bloqueClima = cx
    ? `<div class="card">
         <div class="card-head">
           <h3 style="margin:0">Clase cancelada</h3>
           <span class="pill pill--no">${ic('rain', 12)} Lluvia</span>
         </div>
         <p class="sub">Se avisó a todos y no se descuenta del plan.</p>
         <button class="btn btn--ghost btn--sm" style="margin-top:12px"
           onclick="S.clima='normal';render()">Deshacer</button>
       </div>`
    : `<div class="card">
         <div class="card-head"><h3 style="margin:0">Clima</h3>${ic('cloud', 17)}</div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
           <button class="btn btn--ghost btn--sm" onclick="toggleClima()">
             ${ic('cloud', 14)} ${S.clima === 'a_confirmar' ? 'Confirmado' : 'A confirmar'}</button>
           <button class="btn btn--ghost btn--sm btn--danger-ghost" onclick="cancelarPorLluvia()">
             ${ic('rain', 14)} Cancelar</button>
         </div>
       </div>`;

  /* ---------- abrir llamada / panel de respuestas ---------- */
  const bloqueLlamada = (!ab && !cx)
    ? `<div class="card">
         <div class="card-head">
           <h3 style="margin:0">Pasar lista</h3>
           <span class="pill pill--mute">Sin abrir</span>
         </div>
         <p class="sub">Abrí la llamada del día para que los alumnos confirmen.</p>
         <button class="btn btn--acc" style="margin-top:14px" onclick="abrirLlamada()">
           ${ic('bell', 16)} Abrir llamada de hoy</button>
       </div>`
    : (ab ? `<div class="card card--glass">
         <div class="card-head">
           <h3 style="margin:0">Respuestas de hoy</h3>
           <button class="mini-btn on" onclick="cerrarLlamada()">${ic('bolt', 11)} Abierta · cerrar</button>
         </div>
         <div class="stats">
           <div class="stat ok"><b>${c.v}</b><span>Voy</span></div>
           <div class="stat no"><b>${c.n}</b><span>No voy</span></div>
           <div class="stat mute"><b>${c.s}</b><span>Sin resp.</span></div>
         </div>

         <label class="label" style="margin-top:16px">Mensaje para el grupo</label>
         <textarea rows="2" oninput="S.msg=this.value">${S.msg}</textarea>

         <a class="btn btn--wa btn--sm" style="margin-top:9px" target="_blank" rel="noopener" href="${waLink()}">
           ${ic('wa', 15)} Compartir en WhatsApp</a>
         <div style="display:grid;gap:8px;margin-top:8px">
           <button class="btn btn--ghost btn--sm" onclick="sim()">${ic('dice', 14)} Simular respuestas (demo)</button>
           <button class="btn btn--ghost btn--sm" onclick="recordar()">${ic('bell', 14)} Recordar a los ${c.s} que faltan</button>
         </div>
       </div>` : '');

  /* ---------- lista de asistencia ---------- */
  const asistencia = (ab && !cx)
    ? `<div class="card">
         <div class="card-head">
           <h3 style="margin:0">Asistencia</h3>
           <span class="pill pill--mute">${marcados()}/${c.t}</span>
         </div>
         <div class="list">
           ${filasAsistencia().map(x => `
             <div class="stu">
               <div>
                 <div class="item-title">${x.n}</div>
                 <span class="pill ${x.st === 'voy' ? 'pill--ok' : x.st === 'no_voy' ? 'pill--no' : 'pill--mute'}"
                   style="margin-top:4px">${x.st === 'voy' ? 'Voy' : x.st === 'no_voy' ? 'No voy' : 'Esperado'}</span>
               </div>
               <button class="mini-btn ${x.a ? 'on' : ''}" onclick="asis(${x.i})">
                 ${x.a ? ic('check', 12) + ' Vino' : 'Marcar'}
               </button>
             </div>`).join('')}
         </div>
       </div>` : '';

  const cabecera = `
    <header class="appbar">
      <div class="logo">liber<span>ate</span></div>
      <button class="role-btn" onclick="setRole('alumno')">${ic('back')} VER COMO ALUMNO</button>
    </header>`;

  const hero = `
    ${sceneMini()}
    <div class="page-body">
      <div class="card card--flat" style="margin-top:0">
        <div class="row-between">
          <span class="eyebrow">${DAYS_FULL[HOY]} · hoy</span>
          <span class="pill ${cx ? 'pill--no' : ab ? 'pill--ok' : 'pill--mute'}">
            ${cx ? 'Cancelada' : ab ? 'Llamada abierta' : 'Sin abrir'}</span>
        </div>
        <h1 style="margin-top:8px">19:30 <span class="sep">·</span> Plaza</h1>
        <p class="sub" style="margin-top:4px">Cupo ${CUPO} · ${c.t} alumnos esperados</p>
      </div>
      ${bloqueLlamada}
      ${bloqueClima}
      ${asistencia}
      <p class="note">Vista del profe · datos de ejemplo</p>
    </div>`;

  return `<div class="screen page--profe">${cabecera}${hero}</div>`;
}

/* ---------- helpers de profe ---------- */
const marcados = () => S.al.filter(x => x.a).length + (S.meA ? 1 : 0);

function filasAsistencia(){
  const rows = [{ n:'Vos (alumno demo)', st:S.mi, a:S.meA, i:0 }];
  S.al.forEach((x, i) => rows.push({ n:x.n, st:x.st, a:x.a, i:i+1 }));
  return rows;
}

function abrirLlamada(){
  S.llamada = 'abierta';
  toast('Llamada abierta · push enviado');
  render();
}

function cerrarLlamada(){
  S.llamada = 'sin_abrir';
  toast('Llamada cerrada');
  render();
}

function toggleClima(){
  S.clima = S.clima === 'a_confirmar' ? 'normal' : 'a_confirmar';
  render();
}

function cancelarPorLluvia(){
  if (confirm('¿Cancelar la clase por lluvia?')){
    S.clima = 'cancelada';
    toast('Push enviado a todos');
    render();
  }
}

function recordar(){ toast('Recordatorio enviado a ' + cnt().s + ' alumnos'); }

function sim(){
  S.al.forEach((x,i) => {
    if (x.st === 'esperado' && Math.random() < .65){
      x.st = Math.random() < .82 ? 'voy' : 'no_voy';
      x.t = performance.now() + i*150;
    }
  });
  render();
}

function asis(i){
  if (i === 0) S.meA = !S.meA;
  else S.al[i-1].a = !S.al[i-1].a;
  render();
}

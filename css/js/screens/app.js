/* =========================================================
   Liberate v4 · controlador: render, navegación y acciones
   ========================================================= */

const app = () => document.getElementById('app');

function render(){
  const shell = S.role === 'profe' ? profe()
    : S.tab === 'hoy'    ? hoy()
    : S.tab === 'lib'    ? liberate()
    : S.tab === 'casa'   ? casa()
    : perfil();

  app().innerHTML = shell;
  app().classList.remove('is-enter');
  void app().offsetWidth;          // fuerza reflow para reiniciar la animación
  app().classList.add('is-enter');

  paintAvatars();
  if (document.documentElement.classList.contains('static')) paintPlazaOnce();
}

/* ---------- navegación ---------- */
function go(tab){
  S.tab = tab;
  clearInterval(S.iv);
  S.run = null;
  S.rut = null;
  render();
  window.scrollTo(0, 0);
}

function setRole(role){
  S.role = role;
  render();
  window.scrollTo(0, 0);
}

/* ---------- responder el día ---------- */
function mi(v){
  S.mi = S.mi === v ? 'esperado' : v;
  if (S.mi === 'voy') S.mit = performance.now();
  toast(S.mi === 'esperado' ? 'Quitaste tu respuesta'
      : S.mi === 'voy'      ? 'Confirmado · te esperamos'
      : 'Avisaste que no vas');
  render();
}

/* ---------- deep links (útiles para capturas y para compartir) ---------- */
function applyDeepLink(){
  const P = new URLSearchParams(location.search);
  if (P.get('static')) document.documentElement.classList.add('static');

  const preset = {
    profe:   () => { S.role = 'profe'; },
    abierta: () => { S.role = 'profe'; S.llamada = 'abierta'; S.mi = 'voy'; },
    lluvia:  () => { S.clima = 'cancelada'; },
    lib:     () => { S.tab = 'lib'; },
    casa:    () => { S.tab = 'casa'; },
    rutina:  () => { S.tab = 'casa'; S.rut = 1; },
    timer:   () => { S.tab = 'casa'; S.rut = 0; S.run = { i:2, left:27, rest:false, done:0 }; },
    perfil:  () => { S.tab = 'perfil'; }
  };
  const fn = preset[window.S_PRESET || P.get('s')];
  if (fn) fn();
}

/* ---------- arranque ---------- */
applyDeepLink();
render();

/* Mantiene viva la escena si la pestaña estuvo oculta */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) render();
});

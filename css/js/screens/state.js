/* =========================================================
   Liberate v4 · estado y utilidades de dominio
   Un único objeto `S` como fuente de verdad.
   ========================================================= */

const DAYS      = ['Lun','Mar','Mié','Jue','Vie'];
const DAYS_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes'];

/* Día de la demo: 2 = miércoles. Toda la UI deriva de acá, así que
   cambiando este número (o calculándolo con new Date()) se mueve toda la app. */
const HOY    = 2;
const CUPO   = 25;
const PLAN   = 3;
const TURNOS = 3;

const TURNO = {
  m: { h:'8:00',  lugar:'Gym',   icon:'☀️' },
  n: { h:'19:30', lugar:'Plaza', icon:'🌙' }
};

const S = {
  role: 'alumno',
  tab: 'hoy',
  av: 3,
  casa: 0,
  rut: null,
  run: null,
  week: { '0-n':1, '2-n':1, '4-n':1 },
  sel: '2-n',
  llamada: 'abierta',
  clima: 'normal',
  mi: 'esperado',
  mit: 0,
  meA: false,
  msg: 'Hoy circuito, traigan agua 💧',
  al: ['Caro M.','Nicolás P.','Lau G.','Fede R.','Sofi D.','Mati L.','Juli A.','Agus B.',
       'Vale T.','Lucho F.','Mica S.','Tomi H.','Pau C.','Ezequiel O.','Flor N.','Gonza V.',
       'Cami Q.','Dami K.','Rocío E.','Santi Z.'].map((n, i) => ({
         n, t: 0, a: false,
         st: i < 9 ? 'voy' : (i === 10 || i === 15) ? 'no_voy' : 'esperado'
       }))
};

/* rutinas de entrenamiento en casa */
const RT = [
  { n:'Circuito express', lv:'Intermedio', eq:'Sin equipo',
    ex:['Sentadillas','Flexiones','Mountain climbers','Plancha','Burpees','Zancadas'] },
  { n:'Tren inferior', lv:'Principiante', eq:'Sin equipo',
    ex:['Sentadilla sumo','Puente de glúteos','Zancadas alternas','Sentadilla con salto',
        'Elevación de talones','Sentadilla isométrica','Patada de glúteo','Estocada lateral'] },
  { n:'Movilidad y elongación', lv:'Todos', eq:'Colchoneta',
    ex:['Rotación de cadera','Gato y vaca','Estocada con giro','Estiramiento de isquios','Postura del niño'] }
];

/* ---------- derivados ---------- */
function cnt(){
  const v = S.al.filter(x => x.st === 'voy').length    + (S.mi === 'voy' ? 1 : 0);
  const n = S.al.filter(x => x.st === 'no_voy').length + (S.mi === 'no_voy' ? 1 : 0);
  const t = S.al.length + 1;
  return { v, n, s: t - v - n, t };
}
const nSel = () => Object.keys(S.week).length;
const stp  = () => S.mi === 'voy' ? 'Voy' : S.mi === 'no_voy' ? 'No voy' : 'Esperado';

const waLink = () => 'https://wa.me/?text=' + encodeURIComponent(
  `Liberate 🌳 Hoy entrenamos a las 19:30 en la Plaza. ${S.msg}\n¿Venís? Confirmá acá: https://liberate.app/hoy`
);

/* ---------- toast ---------- */
function toast(m){
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = m;
  el.classList.add('s');
  clearTimeout(toast.k);
  toast.k = setTimeout(() => el.classList.remove('s'), 2600);
}

/* =========================================================
   Liberate v4 · UI compartida (iconos, appbar, nav, avatares)
   ========================================================= */

const ICONS = {
  sun:     '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="16" rx="4"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  dumbbell:'<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>',
  user:    '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.2c.6-3.6 3.5-5.6 7.2-5.6s6.6 2 7.2 5.6"/>',
  users:   '<circle cx="9" cy="8" r="3.2"/><path d="M3 20.2c.5-3.2 2.9-4.9 6-4.9s5.5 1.7 6 4.9"/><path d="M16.2 5.2a3.2 3.2 0 0 1 0 6.1M17.5 15.6c2.1.5 3.4 2.1 3.7 4.6"/>',
  check:   '<path d="M4.5 12.6l4.7 4.7L19.5 7"/>',
  x:       '<path d="M6 6l12 12M18 6L6 18"/>',
  cloud:   '<path d="M7 17.5h9.5a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6-1.4A3.6 3.6 0 0 0 7 17.5z"/>',
  rain:    '<path d="M7 14.5h9.5a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6-1.4A3.6 3.6 0 0 0 7 14.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',
  play:    '<path d="M8.5 5.5l10 6.5-10 6.5z"/>',
  bell:    '<path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z"/><path d="M10 18a2.2 2.2 0 0 0 4 0"/>',
  wa:      '<path d="M3.5 20.5l1.4-4A8.2 8.2 0 1 1 8 19.2z"/><path d="M8.6 8.4c.2 2.2 2.4 4.4 4.6 4.6.7.1 1.3-.5 1.3-1.2 0-.5-.4-.8-1.4-1.1-.5-.2-.9.4-1.2.6-1-.4-1.9-1.3-2.3-2.3.2-.3.8-.7.6-1.2-.3-1-.6-1.4-1.1-1.4-.7 0-1.3.6-1.2 1.3z"/>',
  dice:    '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>',
  flame:   '<path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-1.9.9-3.4 1.8-4.4.4 1.2 1.1 1.9 1.9 1.9 1.3 0 1.7-1.4 1.3-2.6z"/>',
  back:    '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  bolt:    '<path d="M13.5 3L6 13.5h5l-.5 7.5L18 10.5h-5z"/>',
  spark:   '<path d="M12 3.5l1.6 4.6 4.6 1.6-4.6 1.6L12 16l-1.6-4.7L5.8 9.7l4.6-1.6z"/>',
  clock:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin:     '<path d="M12 21s6.5-6.2 6.5-11A6.5 6.5 0 0 0 5.5 10c0 4.8 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'
};

function ic(name, size){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
    stroke-linecap="round" stroke-linejoin="round" ${size ? `style="width:${size}px;height:${size}px"` : ''}
    aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ---------- barra superior ---------- */
const appbar = () => `
  <header class="appbar">
    <div class="logo">liber<span>ate</span></div>
    <button class="role-btn" onclick="setRole('profe')">${ic('users')} VER COMO PROFE</button>
  </header>`;

/* ---------- navegación inferior ---------- */
const TABS = [
  ['hoy',    'sun',      'HOY'],
  ['lib',    'calendar', 'MI LIBERATE'],
  ['casa',   'dumbbell', 'EN CASA'],
  ['perfil', 'user',     'PERFIL']
];

const nav = () => `
  <nav class="nav" aria-label="Navegación principal">
    ${TABS.map(([k, i, l]) => `
      <button class="${S.tab === k ? 'on' : ''}" onclick="go('${k}')"
        ${S.tab === k ? 'aria-current="page"' : ''}>
        ${ic(i)}${l}
      </button>`).join('')}
  </nav>`;

/* ---------- shell de página ---------- */
function page(title, sub, body, opts = {}){
  return `
  <div class="screen${opts.profe ? ' page--profe' : ''}">
    ${opts.profe ? '' : appbar()}
    <div class="page-head">
      <h1>${title}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
    </div>
    <div class="page-body">${body}</div>
    ${opts.note ? `<p class="note">${opts.note}</p>` : ''}
  </div>`;
}

/* ---------- avatares (canvas) ---------- */
function paintAvatars(){
  document.querySelectorAll('canvas.av').forEach(c => {
    const u = +c.dataset.u, s = +c.dataset.s;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    person(c.getContext('2d'), {
      x: c.width/2, y: c.height - 4, u, seed: s, t: 0, id: 0
    }, 1e6);
  });
}

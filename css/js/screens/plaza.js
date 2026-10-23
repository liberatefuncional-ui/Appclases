/* =========================================================
   Liberate v4 · Plaza pixel art (motor procedural)
   Se dibuja a 192x420 lógico y se escala con pixelated.
   El "suelo" está en y=90 (constante OY): todo el mundo se
   dibuja en coordenadas de piso y el canvas se corre 90px.
   ========================================================= */

const SL = [];
[20,40,60,132,152,172].forEach(x => SL.push([x, 90, 1]));
for (let i=0;i<10;i++) SL.push([10 + i*18, 102, 1]);
for (let i=0;i<7;i++)  SL.push([14 + i*26, 122, 2]);
for (let i=0;i<5;i++)  SL.push([22 + i*37, 142, 2]);
for (let i=0;i<5;i++)  SL.push([22 + i*37, 174, 3]);

const MI  = SL.findIndex(s => s[1] === 122 && s[0] === 92);
const ORD = SL.filter((s, i) => i !== MI);

/* ---------- quiénes están en la plaza ---------- */
function who(){
  const l = [];
  if (S.mi === 'voy'){
    const s = SL[MI];
    l.push({ x:s[0], y:s[1], u:s[2], seed:S.av, t:S.mit, me:1, id:99 });
  }
  S.al.forEach((a, i) => {
    if (a.st !== 'voy') return;
    const s = ORD[(i*11 + 2) % ORD.length];
    l.push({ x:s[0], y:s[1], u:s[2], seed:i+1, t:a.t, id:i });
  });
  return l.sort((a, b) => a.y - b.y);
}

/* ---------- un personaje ---------- */
function person(g, p, now){
  const SKIN = ['#f2c7a0','#d9a273','#a8704a','#7a4a2e'];
  const HAIR = ['#1b1b1b','#5a3320','#d9a62e','#8b2d2d','#555'];
  const SHIRT= ['#ffffff','#2a6fdb','#e8541e','#7a3fb0','#f2c200','#111','#d83a6a'];
  const PANT = ['#222','#3a4a6a','#555'];

  const u = p.u, age = now - p.t;
  const fr  = Math.floor(now/260 + p.id) % 2;
  const hop = Math.sin(now/420 + p.id*1.7) > .93;

  let dy = 0;
  if (age < 700){                       // animación de llegada
    const k = 1 - age/700;
    dy = -Math.round(k*k*70);
    g.globalAlpha = Math.min(1, age/200);
  } else if (hop) dy = -u;

  g.fillStyle = 'rgba(0,0,0,.22)';
  g.fillRect(Math.round(p.x - 2*u), p.y, 4*u, u);

  const y = p.y + dy;
  const R = (a, b, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(p.x + a*u), Math.round(y + b*u), w*u, h*u);
  };

  R(-2,-11, 4,2, HAIR[p.seed*3 % 5]);
  R(-2, -9, 4,2, SKIN[p.seed % 4]);
  R(-1, -8, 1,1, '#111'); R(1,-8, 1,1, '#111');
  R(-2, -7, 4,3, SHIRT[p.seed*5 % 7]);
  R(-3, -7, 1,3, SKIN[p.seed % 4]); R(2,-7, 1,3, SKIN[p.seed % 4]);
  R(-2, -4, 4,2, PANT[p.seed % 3]);
  R(-2, -2, 1, 2-fr, SKIN[p.seed % 4]);
  R( 1, -2, 1, 1+fr, SKIN[p.seed % 4]);

  if (p.me){ R(-1,-15, 3,1, '#ffd23f'); R(0,-14, 1,1, '#ffd23f'); }  // coronita
  g.globalAlpha = 1;
}

/* ---------- escena completa ---------- */
function drawScene(cv, now){
  const g = cv.getContext('2d');
  const W = 192, H = 330, OY = 90;
  const w = S.clima === 'cancelada' ? 2 : S.clima === 'a_confirmar' ? 1 : 0;

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, 420);
  g.setTransform(1, 0, 0, 1, 0, OY);

  const F = (x,y,a,b,c) => { g.fillStyle = c; g.fillRect(x,y,a,b); };
  const C = (cx,cy,r,c) => {
    g.fillStyle = c;
    for (let j=-r;j<=r;j++){
      const q = Math.round(Math.sqrt(r*r - j*j));
      g.fillRect(cx-q, cy+j, q*2, 1);
    }
  };

  /* cielo */
  const sky = [['#8fd3f4','#b6e6f8'], ['#93a6b0','#b3c1c8'], ['#5d6d77','#77878f']][w];
  F(0, -OY, W, 70+OY, sky[0]);
  [-70,-45,-20,5,30,50,62].forEach((y,i) => F(0, y, W, i<6 ? (i+2)*3 : 8, sky[1]));

  if (!w){ C(150,-45,11,'#fff3a8'); C(150,-45,8,'#ffd93d'); }         // sol

  /* nubes con parallax */
  for (let k=0;k<9;k++){
    const x = Math.round((now/(70+k*12) + k*47) % (W+60) - 30);
    const y = -85 + k*14;
    const c = w ? ['#aab6bc','#8a979e','#6f7c83'][w] : '#fff';
    F(x,y, 22,5, c); F(x+4,y-3, 12,4, c); F(x+14,y-2, 10,4, c);
  }

  /* arboleda de fondo */
  for (let i=0;i<14;i++){ C(i*15+5, 68, 10, '#2e6b3a'); C(i*15+12, 70, 7, '#3f8f4f'); }

  /* pasto con franjas */
  F(0, 68, W, H-68, '#7cc24a');
  for (let y=70, h=3, k=0; y<H; y+=h, h+=.7, k++)
    if (k%2) F(0, Math.round(y), W, Math.round(h), '#6db33f');

  /* camino de piedra en perspectiva */
  for (let y=88;y<H;y++){
    const hw = Math.floor(9 + (y-88)*.9), c = y%7==0 ? '#cdcab9' : '#e9e7db';
    F(96-hw, y, hw*2, 1, c);
    F(96-hw, y, 1,1, '#9a9885'); F(96+hw-1, y, 1,1, '#9a9885');
  }

  /* árboles */
  const T = (x,y,s) => {
    F(x-2*s, y-14*s, 4*s, 14*s, '#6b4a2b');
    C(x, y-20*s, 10*s, '#2f7d3b');
    C(x-3*s, y-23*s, 6*s, '#4fa04c');
    C(x+4*s, y-18*s, 5*s, '#3a8a43');
  };
  T(40,82,.8); T(152,80,.8); T(14,108,1.1); T(178,104,1.1);

  /* bancos */
  const Bn = (x,y) => {
    F(x,y-7, 14,2, '#a0642f'); F(x,y-4, 14,2, '#c07a3a');
    F(x+1,y-2, 2,4, '#222');   F(x+11,y-2, 2,4, '#222');
  };
  Bn(60,86); Bn(118,86); Bn(2,128); Bn(176,128);

  /* fuente */
  F(80,82, 32,7, '#bdb9a8'); F(82,84, 28,4, '#8ecfe8'); F(80,89, 32,2, '#8c8872');
  F(94,70, 4,12, '#bdb9a8'); F(88,72, 16,3, '#cfccbd');
  for (let i=0;i<7;i++)
    F(96 + Math.round(Math.sin(now/180 + i*1.3)*(i+1)), 64 + (i*1.5|0), 1,2, '#e6f7ff');

  /* gente */
  if (S.clima !== 'cancelada') who().forEach(p => person(g, p, now));

  /* clima encima de todo */
  g.setTransform(1,0,0,1,0,0);
  if (w === 1) F(0,0, W,420, 'rgba(60,70,80,.18)');
  if (w === 2){
    F(0,0, W,420, 'rgba(20,30,40,.4)');
    for (let i=0;i<50;i++)
      F((i*53)%W, Math.floor((now/5 + i*29)%420), 1,4, '#cfe6f2');
  }
}

/* ---------- loop único para todos los canvas de plaza ---------- */
let lastPaint = 0;
function paintPlaza(now){
  if (now - lastPaint >= 60){
    lastPaint = now;
    document.querySelectorAll('canvas.plaza').forEach(cv => {
      cv.width = 192; cv.height = 420;          // evita canvas borroso al re-render
      drawScene(cv, now);
    });
  }
  requestAnimationFrame(paintPlaza);
}
requestAnimationFrame(paintPlaza);

/* ---------- dibujo único (modo captura) ---------- */
function paintPlazaOnce(t){
  document.querySelectorAll('canvas.plaza').forEach(cv => {
    cv.width = 192; cv.height = 420;
    drawScene(cv, t || 1200);
  });
}

/* ---------- markup de las dos escenas ---------- */
const hudChips = (full) => {
  const c = cnt(), cx = S.clima === 'cancelada';
  const lab = ['☀️ Despejado','☁️ A confirmar','🌧 Lluvia'][cx ? 2 : S.clima === 'a_confirmar' ? 1 : 0];
  return `<span class="hud-chip">👥 ${cx ? 0 : c.v}/${CUPO}</span><span class="hud-chip">${lab}</span>`
       + (full ? `<span class="hud-chip">🔥 4</span>` : '');
};

const sceneHero = () => `
  <div class="hero">
    <canvas class="plaza" width="192" height="420" aria-label="Plaza con los alumnos que confirmaron"></canvas>
    <div class="hero-top">
      <div class="hud">${hudChips(1)}</div>
      <button class="ghost-pill" onclick="setRole('profe')" aria-label="Ver la app como profe">Profe</button>
    </div>
    <div class="hero-scrim"></div>
    ${S.clima === 'cancelada'
      ? `<div class="hero-ovl"><b>CLASE CANCELADA<br>POR LLUVIA</b></div>` : ''}
  </div>`;

const sceneMini = () => `
  <div class="mini">
    <canvas class="plaza" width="192" height="420" aria-label="Plaza del día"></canvas>
    <div class="hud">${hudChips(0)}</div>
    ${S.clima === 'cancelada'
      ? `<div class="hero-ovl"><b>CLASE CANCELADA<br>POR LLUVIA</b></div>` : ''}
  </div>`;

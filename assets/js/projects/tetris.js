(() => {
  // --- API ---
  const API_URL = "https://subscriber-api-lolroxs.vercel.app/api/tetris";

  // --- Config ---
  const W=10, H=20;
  const CLEAR_MS=320, CLEAR_BLINKS=3;
  const BASE_DROP=1000, MIN_DROP=90, SPEED_STEP=80;
  const COLORS={ I:"#00e5ff", O:"#ffd500", T:"#e91e63", S:"#43a047", Z:"#ef5350", J:"#3f51b5", L:"#fb8c00" };
  const SHAPES={
    I:{c:"I",m:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]},
    O:{c:"O",m:[[1,1],[1,1]]},
    T:{c:"T",m:[[1,1,1],[0,1,0],[0,0,0]]},
    S:{c:"S",m:[[0,1,1],[1,1,0],[0,0,0]]},
    Z:{c:"Z",m:[[1,1,0],[0,1,1],[0,0,0]]},
    J:{c:"J",m:[[1,0,0],[1,1,1],[0,0,0]]},
    L:{c:"L",m:[[0,0,1],[1,1,1],[0,0,0]]},
  };
  const BAG = () => Object.values(SHAPES).map(s=>s).sort(()=>Math.random()-0.5);

  // --- Canvas ---
  const cvs=document.getElementById("tetris"), ctx=cvs.getContext("2d");
  const ncv=document.getElementById("next"), nctx=ncv.getContext("2d");
  const hcv=document.getElementById("hold"), hctx=hcv.getContext("2d");

  // Mobile canvases
  const ncvMobile=document.getElementById("next-mobile"), nctxMobile=ncvMobile?.getContext("2d");
  const hcvMobile=document.getElementById("hold-mobile"), hctxMobile=hcvMobile?.getContext("2d");

  function resize(){
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: maximize canvas size
      const containerWidth = Math.min(window.innerWidth - 16, 600);
      const containerHeight = window.innerHeight;

      // Calculate cell size to fit screen nicely
      const cellByWidth = Math.floor(containerWidth / W);
      const cellByHeight = Math.floor((containerHeight * 0.6) / H); // Use 60% of height for canvas
      const cell = Math.max(18, Math.min(cellByWidth, cellByHeight, 32));

      cvs.width = cell * W;
      cvs.height = cell * H;
      CELL = cell;
    } else {
      // Desktop: original sizing
      const maxW = Math.min(document.getElementById("tetris-wrap").clientWidth - 260, 520);
      const cell = Math.max(16, Math.floor(Math.min(maxW, 520) / W));
      cvs.width = cell * W;
      cvs.height = cell * H;
      CELL = cell;
    }
  }
  let CELL=26; resize(); addEventListener("resize", resize);

  // --- State ---
  let board=Array.from({length:H},()=>Array(W).fill(0));
  let piece=null, bag=BAG(), nextPiece=bag.pop();
  let holdPiece=null, canHold=true;
  let score=0, level=1, dropTimer=0, last=0, paused=false, over=false, clearing=null, didSave=false;
  const scoreEl=document.getElementById("score"), levelEl=document.getElementById("level"),
        lbEl=document.getElementById("lb"), nameInp=document.getElementById("name");

  // Mobile elements
  const scoreMobileEl=document.getElementById("score-mobile");
  const levelMobileEl=document.getElementById("level-mobile");

  // Update score/level for both desktop and mobile
  function updateScore() {
    const scoreText = score.toString();
    const levelText = level.toString();
    if (scoreEl) scoreEl.textContent = "Score: " + scoreText;
    if (levelEl) levelEl.textContent = "Level: " + levelText;
    if (scoreMobileEl) scoreMobileEl.textContent = scoreText;
    if (levelMobileEl) levelMobileEl.textContent = levelText;
  }

  const clone = m => m.map(r=>r.slice());
  function levelFromScore(s){ return 1 + Math.floor(s/500); }
  function dropInterval() {
    const decay = 0.88; // smaller = slower acceleration per level
    return Math.max(MIN_DROP, BASE_DROP * Math.pow(decay, level - 1));
  }
  function rotateCW(m){ const N=m.length, r=Array.from({length:N},()=>Array(N).fill(0)); for(let y=0;y<N;y++) for(let x=0;x<N;x++) r[x][N-1-y]=m[y][x]; return r; }
  function rotateCCW(m){ const N=m.length, r=Array.from({length:N},()=>Array(N).fill(0)); for(let y=0;y<N;y++) for(let x=0;x<N;x++) r[N-1-x][y]=m[y][x]; return r; }
  function collide(px,py,mat){
    for(let y=0;y<mat.length;y++) for(let x=0;x<mat[y].length;x++){
      if(!mat[y][x]) continue; const X=px+x, Y=py+y;
      if(X<0||X>=W||Y>=H) return true;
      if(Y>=0 && board[Y][X]) return true;
    } return false;
  }
  function merge(px,py,mat,c){ for(let y=0;y<mat.length;y++) for(let x=0;x<mat[y].length;x++){ if(!mat[y][x]) continue; const X=px+x,Y=py+y; if(Y>=0) board[Y][X]=c; } }

  // --- Mini renders ---
  function drawMini(ctx, cv, shape){
    ctx.clearRect(0,0,cv.width,cv.height);
    if (!shape) { ctx.fillStyle="#0a0a0a"; ctx.fillRect(0,0,cv.width,cv.height); return; }
    const m = SHAPES[shape.c].m, size = Math.max(m.length, m[0].length);
    const cell = Math.floor(Math.min(cv.width, cv.height)/(size+1));
    const ox = Math.floor((cv.width - cell*m[0].length)/2);
    const oy = Math.floor((cv.height - cell*m.length)/2);
    ctx.fillStyle="#0a0a0a"; ctx.fillRect(0,0,cv.width,cv.height);
    for(let y=0;y<m.length;y++) for(let x=0;x<m[y].length;x++){
      if(!m[y][x]) continue; ctx.fillStyle=COLORS[shape.c];
      ctx.fillRect(ox + x*cell +1, oy + y*cell +1, cell-2, cell-2);
    }
  }

  const drawNext=()=>{
    drawMini(nctx,ncv,nextPiece);
    if (nctxMobile) drawMini(nctxMobile,ncvMobile,nextPiece);
  };

  const drawHold=()=>{
    drawMini(hctx,hcv,holdPiece);
    if (hctxMobile) drawMini(hctxMobile,hcvMobile,holdPiece);
  };

  // --- Piece flow ---
  function spawn(){
    piece = { x:3, y:-2, m:clone(nextPiece.m), c: nextPiece.c };
    if (bag.length===0) bag=BAG();
    nextPiece = bag.pop();
    canHold=true; drawNext(); drawHold();
    if (collide(piece.x, piece.y, piece.m)) { over=true; }
  }
  function hold(){
    if (!canHold || !piece || clearing || over) return;
    const current = { c: piece.c, m: clone(piece.m) };
    if (!holdPiece){ holdPiece = current; spawn(); }
    else { const swap = holdPiece; holdPiece=current; piece={ x:3, y:-2, m:clone(swap.m), c:swap.c }; if (collide(piece.x,piece.y,piece.m)) over=true; }
    canHold=false; drawHold();
  }

  // --- Draw ---
  function drawCell(x,y,c,ghost=false){
    const px=x*CELL, py=y*CELL;
    ctx.fillStyle=ghost? "#ffffff22" : COLORS[c];
    ctx.fillRect(px+1, py+1, CELL-2, CELL-2);
    if(!ghost){ ctx.fillStyle="#00000022"; ctx.fillRect(px+1, py+CELL-6, CELL-2, 5); }
  }
  function overlay(text){
    ctx.fillStyle="rgba(0,0,0,.6)"; ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle="#eee"; ctx.font="600 18px system-ui"; ctx.textAlign="center";
    ctx.fillText(text, cvs.width/2, cvs.height/2);
  }
  function drawBoard(now){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.strokeStyle="#222"; ctx.lineWidth=1;
    for(let x=0;x<=W;x++){ ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H*CELL); ctx.stroke(); }
    for(let y=0;y<=H;y++){ ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W*CELL,y*CELL); ctx.stroke(); }

    for(let y=0;y<H;y++) for(let x=0;x<W;x++){
      if(!board[y][x]) continue;
      let flashing=false;
      if (clearing && clearing.rows.includes(y)){
        const prog = (now - clearing.t0) / (CLEAR_MS / CLEAR_BLINKS);
        flashing = Math.floor(prog)%2===0;
      }
      if (clearing && clearing.rows.includes(y) && flashing){
        ctx.fillStyle="#fff"; ctx.fillRect(x*CELL+1, y*CELL+1, CELL-2, CELL-2);
      } else drawCell(x,y,board[y][x]);
    }

    if (piece && !clearing){
      let gy=piece.y; while(!collide(piece.x, gy+1, piece.m)) gy++;
      for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
        if(piece.m[y][x] && gy+y>=0) drawCell(piece.x+x, gy+y, piece.c, true);
      }
      for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
        if(piece.m[y][x] && piece.y+y>=0) drawCell(piece.x+x, piece.y+y, piece.c);
      }
    }
    if (paused && !over) overlay("PAUSED");
    if (over) overlay("GAME OVER  (R to restart)");
  }

  // --- Clears / scoring ---
  function checkClears(){
    const rows=[]; for(let y=0;y<H;y++) if(board[y].every(v=>v)) rows.push(y);
    if(rows.length){
      const add=[0,100,300,500,800][rows.length]||0; score+=add;
      clearing={rows, t0:performance.now()};
      return true;
    } return false;
  }
  function applyClears(){
    clearing.rows.sort((a,b)=>a-b).forEach(y=>{ board.splice(y,1); board.unshift(Array(W).fill(0)); });
    clearing=null; level = levelFromScore(score);
    updateScore();
  }

  // --- Lock / game over ---
  function lock(){
    let aboveTop=false;
    for(let y=0;y<piece.m.length;y++) for(let x=0;x<piece.m[y].length;x++){
      if(!piece.m[y][x]) continue;
      const X=piece.x+x, Y=piece.y+y;
      if (Y<0) { aboveTop=true; continue; }
      board[Y][X]=piece.c;
    }
    piece=null;
    if (aboveTop){ over=true; saveScoreOnce(); return; }
    if (!checkClears()) spawn();
    updateScore();
  }

  // --- Moves ---
  function hardDrop(){ if(!piece||clearing) return; let d=0; while(!collide(piece.x,piece.y+1,piece.m)){ piece.y++; d++; } score+=d*2; lock(); }
  function softDrop(){ if(!piece||clearing) return; if(!collide(piece.x,piece.y+1,piece.m)){ piece.y++; score+=1; } else lock(); }
  function rot(dir){
    if (!piece) return;
    const m0=piece.m; let m= dir>0? rotateCW(m0) : rotateCCW(m0);
    if (piece.c==="O") return;
    const kicks=[[0,0],[-1,0],[1,0],[0,-1],[0,1]];
    for (const [kx,ky] of kicks){ if(!collide(piece.x+kx,piece.y+ky,m)){ piece.x+=kx; piece.y+=ky; piece.m=m; return; } }
  }

  // --- Controls ---
  addEventListener("keydown", e=>{
    if (e.repeat) return;
    if (over){ if (e.code==="KeyR") reset(); return; }
    if (e.code==="KeyP"){ paused=!paused; return; }
    if (paused || clearing) return;

    if (e.code==="ArrowLeft"){ if(!collide(piece.x-1,piece.y,piece.m)) piece.x--; }
    else if (e.code==="ArrowRight"){ if(!collide(piece.x+1,piece.y,piece.m)) piece.x++; }
    else if (e.code==="ArrowDown"){ softDrop(); }
    else if (e.code==="Space"){ hardDrop(); }
    else if (e.code==="ArrowUp" || e.code==="KeyX"){ rot(1); }
    else if (e.code==="KeyZ"){ rot(-1); }
    else if (e.code==="KeyC" || e.code==="ShiftLeft" || e.code==="ShiftRight"){ hold(); }
  });

  // --- Mobile Controls: DAS/ARR Auto-Repeat ---
  const V = (ms) => navigator.vibrate?.(ms); // Optional haptic feedback

  // Auto-repeat binding with DAS (Delayed Auto Shift) and ARR (Auto Repeat Rate)
  function bindRepeat(el, action, { das = 130, arr = 45 } = {}) {
    if (!el) return;
    let timeout = null, interval = null;

    const down = (e) => {
      e.preventDefault();
      action(); // Execute immediately
      V(5); // Short vibration
      // Start auto-repeat after DAS delay
      timeout = setTimeout(() => {
        interval = setInterval(action, arr);
      }, das);
    };

    const up = () => {
      clearTimeout(timeout);
      clearInterval(interval);
      timeout = interval = null;
    };

    el.addEventListener('pointerdown', down, { passive: false });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('pointercancel', up);
  }

  // Single-press bindings (no repeat)
  function bindSingle(el, action) {
    if (!el) return;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      action();
      V(8); // Slightly longer vibration for actions
    }, { passive: false });
  }

  // New mobile controls
  bindRepeat(document.getElementById('btn-left-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    if (!collide(piece.x - 1, piece.y, piece.m)) piece.x--;
  });

  bindRepeat(document.getElementById('btn-right-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    if (!collide(piece.x + 1, piece.y, piece.m)) piece.x++;
  });

  bindSingle(document.getElementById('btn-rotate-mobile'), () => {
    if (paused || clearing || over || !piece) return;
    rot(1);
  });

  bindSingle(document.getElementById('btn-drop-mobile'), () => {
    if (paused || clearing || over) return;
    hardDrop();
    V(18); // Strong vibration for hard drop
  });

  bindSingle(document.getElementById('btn-hold-mobile'), () => {
    if (paused || clearing || over) return;
    hold();
  });

  bindSingle(document.getElementById('btn-pause-mobile'), () => {
    if (over) return;
    paused = !paused;
  });

  // Legacy desktop quick controls
  bindSingle(document.getElementById('btn-rotate-cw-legacy'), () => {
    if (paused || clearing || over || !piece) return;
    rot(1);
  });

  bindSingle(document.getElementById('btn-rotate-ccw-legacy'), () => {
    if (paused || clearing || over || !piece) return;
    rot(-1);
  });

  bindSingle(document.getElementById('btn-hold-legacy'), () => {
    if (paused || clearing || over) return;
    hold();
  });

  // --- Fullscreen ---
  const wrapEl = document.getElementById('tetris-wrap');
  const fsBtnMobile = document.getElementById('btn-fullscreen-mobile');
  const fsBtnLegacy = document.getElementById('btn-fullscreen-legacy');

  function updateFullscreenButtons() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    const textMobile = isFullscreen ? '✕' : '⛶';
    const textLegacy = isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
    if (fsBtnMobile) fsBtnMobile.textContent = textMobile;
    if (fsBtnLegacy) fsBtnLegacy.textContent = textLegacy;
  }

  function toggleFullscreen() {
    const elem = wrapEl;

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Listen for fullscreen changes (including ESC key)
  document.addEventListener('fullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100); // Resize canvas after fullscreen transition
  });
  document.addEventListener('webkitfullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100);
  });
  document.addEventListener('mozfullscreenchange', () => {
    updateFullscreenButtons();
    setTimeout(resize, 100);
  });

  // Bind fullscreen buttons
  bindSingle(fsBtnMobile, toggleFullscreen);
  bindSingle(fsBtnLegacy, toggleFullscreen);

  // --- Leaderboard (global) ---
  function renderLeaderboard(list){
    lbEl.innerHTML = "";
    const entries = (list || []).slice(0, 10);
    if (!entries.length) {
      const li = document.createElement("li");
      li.textContent = "No scores yet";
      lbEl.appendChild(li);
      return;
    }
    entries.forEach((e, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1} ${e.name} — ${e.score}`;
      lbEl.appendChild(li);
    });
  }
  async function fetchLeaderboard(){
    try { const r=await fetch(API_URL,{method:"GET",mode:"cors"}); const j=await r.json(); renderLeaderboard(j.leaderboard); }
    catch {}
  }
  async function submitScoreGlobal(){
    const name = (nameInp?.value || localStorage.getItem("tetris_name") || "YOU").slice(0,16);
    localStorage.setItem("tetris_name", name);
    try {
      const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,score}),mode:"cors"});
      const j=await r.json(); if (j.leaderboard) renderLeaderboard(j.leaderboard);
    } catch {}
  }
  function saveScoreOnce(){ if (didSave) return; didSave=true; if (score>0) submitScoreGlobal(); }

  // --- Loop / reset ---
  function step(t){
    const dt=t-last; last=t;
    if (!paused && !over){
      if (clearing){ if (t-clearing.t0 >= CLEAR_MS*CLEAR_BLINKS){ applyClears(); spawn(); dropTimer=0; } }
      else { dropTimer+=dt; if (dropTimer >= dropInterval()){ if(!collide(piece.x,piece.y+1,piece.m)) piece.y++; else lock(); dropTimer=0; } }
    } else if (over){ saveScoreOnce(); }
    drawBoard(t);
    requestAnimationFrame(step);
  }
  function reset(){
    board=Array.from({length:H},()=>Array(W).fill(0));
    score=0; level=1; over=false; paused=false; clearing=null; didSave=false;
    bag=BAG(); nextPiece=bag.pop(); holdPiece=null; canHold=true;
    updateScore();
    const saved = localStorage.getItem("tetris_name") || "YOU"; if (nameInp) nameInp.value = saved;
    fetchLeaderboard(); spawn();
  }

  reset(); requestAnimationFrame(step);
})();

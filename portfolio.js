/* ── VHS CLOCK ── */
function updateVHSTime() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timeEl = document.getElementById('vhs-time');
  const dateEl = document.getElementById('vhs-date');
  if (timeEl) {
    timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  if (dateEl) {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    dateEl.textContent = `${months[now.getMonth()]} ${pad(now.getDate())}.${now.getFullYear()}`;
  }
}
updateVHSTime();
setInterval(updateVHSTime, 1000);


/* ── SCREEN NAVIGATION ── */
const screens = document.querySelectorAll('.screen');

function showScreen(id) {
  screens.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.style.display = 'flex';
  target.classList.add('active');

  if (id !== 'title-screen') {
    animateSkillBars(target);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* menu buttons on title screen */
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) showScreen(target);
  });
});

/* back buttons on inner screens */
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target') || 'title-screen';
    showScreen(target);
  });
});

/* keyboard: Escape to go back */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const active = document.querySelector('.screen.active');
    if (active && active.id !== 'title-screen') showScreen('title-screen');
  }
});

/* arrow keys to navigate menu on title screen */
document.addEventListener('keydown', e => {
  const active = document.querySelector('.screen.active');
  if (!active || active.id !== 'title-screen') return;

  const btns = [...document.querySelectorAll('.menu-btn')];
  const focused = document.activeElement;
  const idx = btns.indexOf(focused);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    btns[(idx + 1) % btns.length].focus();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    btns[(idx - 1 + btns.length) % btns.length].focus();
  }
  if (e.key === 'Enter' && idx >= 0) {
    btns[idx].click();
  }
});


/* ── SKILL BAR ANIMATION ── */
function animateSkillBars(container) {
  const items = container.querySelectorAll('.skill-item');
  items.forEach((item, i) => {
    const level = parseInt(item.getAttribute('data-level') || '0', 10);
    const bar = item.querySelector('.skill-bar');
    if (!bar) return;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = level + '%';
    }, 80 * i + 100);
  });
}


/* ── COPY BUTTONS ── */
document.querySelectorAll('.copy-tag').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-copy');
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 1800);
    }).catch(() => {
      btn.textContent = 'failed';
      setTimeout(() => { btn.textContent = 'copy'; }, 1500);
    });
  });
});


/* ── INIT ── */
showScreen('title-screen');
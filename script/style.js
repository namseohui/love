document.addEventListener('DOMContentLoaded', () => {
  // ─── 1) 상단바 메뉴 토글 ──────────────────────────────────────
  const topBar    = document.querySelector('.topBar_nav');
  const toggleBtn = topBar.querySelector('.nav-toggle');
  const primary   = topBar.querySelector('ul:first-of-type');
  const secondary = topBar.querySelector('.nav-line--secondary');

  toggleBtn.addEventListener('click', e => {
    e.preventDefault();
    if (topBar.classList.contains('hide-primary') && topBar.classList.contains('expanded')) {
      topBar.classList.remove('hide-primary');
      toggleBtn.setAttribute('aria-expanded', true);
      return;
    }
    const isOpen = topBar.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    if (!isOpen) topBar.classList.remove('hide-primary');
  });

  primary.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      topBar.classList.remove('expanded', 'hide-primary');
      toggleBtn.setAttribute('aria-expanded', false);
      primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
    });
  });

  secondary.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      topBar.classList.add('expanded', 'hide-primary');
      toggleBtn.setAttribute('aria-expanded', true);
      secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
    });
  });

  // ─── 2) 하단바 클릭 active 처리 ─────────────────────────────────
  document.querySelectorAll('.bottomBar a').forEach(link => {
    link.addEventListener('click', e => {
      // e.preventDefault();
      document.querySelectorAll('.bottomBar a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ─── 3) 날짜 필터 버튼 active 처리 ────────────────────────────────
  document.querySelectorAll('.range_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range_btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── 4) 달력 아이콘 클릭 시 date picker 강제 오픈 ─────────────────
  document.querySelectorAll('.date_input img').forEach(img => {
    img.addEventListener('click', () => {
      const input = img.closest('.date_input')?.querySelector('input[type="date"]');
      if (input?.showPicker) input.showPicker();
      else alert('브라우저에서 날짜 선택 기능을 지원하지 않습니다.');
    });
  });

  // ─── 5) 장바구니 체크박스 on/off ─────────────────────────────────
  document.querySelectorAll('.basketAdd-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('basketAdd-checked');
    });
  });

  // ─── 6) 장바구니 수량 & 수정 컨트롤 ───────────────────────────────
  document.querySelectorAll('.basketAdd-controls-row').forEach(row => {
    const minusBtn  = row.querySelector('.basketAdd-minus');
    const plusBtn   = row.querySelector('.basketAdd-plus');
    const countEl   = row.querySelector('.basketAdd-count');
    const modifyBtn = row.querySelector('.basketAdd-modify');

    minusBtn.addEventListener('click', () => {
      let v = parseInt(countEl.textContent, 10);
      if (v > 0) countEl.textContent = v - 1;
    });
    plusBtn.addEventListener('click', () => {
      let v = parseInt(countEl.textContent, 10);
      countEl.textContent = v + 1;
    });
    modifyBtn.addEventListener('click', () => {
      let v = parseInt(countEl.textContent, 10);
      alert(`수량이 ${v}로 수정되었습니다.`);
      minusBtn.classList.add('basketAdd-disabled');
      plusBtn.classList.add('basketAdd-disabled');
      modifyBtn.classList.add('basketAdd-disabled');
    });
  });

  // ─── 7) 캐러셀 슬라이더 ─────────────────────────────────────────
  const track      = document.querySelector('.carousel-track');
  if (track) {
    const slides     = Array.from(track.children);
    const total      = slides.length;
    const counter    = document.querySelector('.carousel-counter');
    const menuBtn    = document.querySelector('.carousel-menu');
    const popup      = document.querySelector('.carousel-popup');
    const thumbTrack = document.querySelector('.carousel-thumb-track');

    // 무한루프 복제 & 초기 세팅…
    const firstClone = slides[0].cloneNode(true);
    const lastClone  = slides[total - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);
    let idx = 1;
    const slideWidth = track.clientWidth;
    track.style.transform = `translateX(${-slideWidth * idx}px)`;
    counter.textContent = `${idx} / ${total}`;

    function moveTo(i, animate = true) {
      track.style.transition = animate ? 'transform .4s ease' : 'none';
      track.style.transform = `translateX(${-slideWidth * i}px)`;
      track.addEventListener('transitionend', onTransitionEnd);
      const disp = ((i - 1 + total) % total) + 1;
      counter.textContent = `${disp} / ${total}`;
    }
    function onTransitionEnd() {
      track.style.transition = 'none';
      if (idx === 0) idx = total;
      else if (idx === total + 1) idx = 1;
      track.style.transform = `translateX(${-slideWidth * idx}px)`;
      track.removeEventListener('transitionend', onTransitionEnd);
    }
    setInterval(() => { idx++; moveTo(idx); }, 3000);

    // 팝업/썸네일 클릭 등…
    menuBtn.addEventListener('click', () => {
      popup.style.display = 'flex';
      thumbTrack.querySelectorAll('.carousel-thumb').forEach(t => t.classList.remove('active'));
      thumbTrack.querySelector(`.carousel-thumb[data-index="${((idx - 1 + total) % total) + 1}"]`)
                .classList.add('active');
    });
    document.querySelector('.carousel-popup-close').addEventListener('click', () => popup.style.display = 'none');
    popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });
    thumbTrack.querySelectorAll('.carousel-thumb').forEach(t => {
      t.addEventListener('click', () => {
        idx = parseInt(t.dataset.index, 10);
        moveTo(idx);
        popup.style.display = 'none';
      });
    });
  }

  // ─── 8) 터치 스와이프 지원 ───────────────────────────────────────
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? idx-- : idx++;
        moveTo(idx);
      }
    });
  }

  // ─── 9) 고객센터 글씨 벌리기 ────────────────────────────────────
  document.querySelectorAll('.cs-hours .box h2 span').forEach(el => {
    const target = 40;
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    ctx.font = getComputedStyle(el).font;
    const textWidth = ctx.measureText(el.textContent.trim()).width;
    const gaps      = el.textContent.trim().length - 1;
    if (gaps > 0) {
      el.style.display       = 'inline-block';
      el.style.width         = `${target}px`;
      el.style.letterSpacing = `${(target - textWidth) / gaps}px`;
    }
  });

  // ─── 10) 사이드바 메뉴 열고 닫는 코드는 분리된 파일에서 처리 ────────
});

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1) 상단바 메뉴 토글 ───
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

  // ─── 2) 하단바 클릭 active 처리 ───
  document.querySelectorAll('.bottomBar a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.bottomBar a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ─── 3) 날짜 필터 버튼 active 처리 ───
  document.querySelectorAll('.range_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range_btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── 4) 달력 아이콘 클릭 시 date picker 강제 오픈 ───
  document.querySelectorAll('.date_input img').forEach(img => {
    img.addEventListener('click', () => {
      const input = img.closest('.date_input')?.querySelector('input[type="date"]');
      if (input?.showPicker) input.showPicker();
      else alert('브라우저에서 날짜 선택 기능을 지원하지 않습니다.');
    });
  });

  // ─── 5) 장바구니 체크박스 on/off ───
  document.querySelectorAll('.basketAdd-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('basketAdd-checked');
    });
  });

  // ─── 6) 장바구니 수량 & 수정 컨트롤 ───
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

  // ─── 7) 캐러셀 슬라이더 ───
  const track      = document.querySelector('.carousel-track');
  const slides     = Array.from(track.children);
  const total      = slides.length;
  const counter    = document.querySelector('.carousel-counter');
  const menuBtn    = document.querySelector('.carousel-menu');
  const popup      = document.querySelector('.carousel-popup');
  const thumbTrack = document.querySelector('.carousel-thumb-track');

  // 무한 루프용 복제
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[total - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // 초기 슬라이드 세팅
  let idx = 1;
  const slideWidth = track.clientWidth;
  track.style.transform = `translateX(${-slideWidth * idx}px)`;
  counter.textContent = `${idx} / ${total}`;  // 초기 카운터 갱신

  function moveTo(i, animate = true) {
    if (!animate) track.style.transition = 'none';
    else          track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(${-slideWidth * i}px)`;
    track.addEventListener('transitionend', onTransitionEnd);
    const displayIdx = ((i - 1 + total) % total) + 1;
    counter.textContent = `${displayIdx} / ${total}`;
  }

  function onTransitionEnd() {
    track.style.transition = 'none';
    if (idx === 0) {
      idx = total;
      track.style.transform = `translateX(${-slideWidth * idx}px)`;
    } else if (idx === total + 1) {
      idx = 1;
      track.style.transform = `translateX(${-slideWidth * idx}px)`;
    }
    track.removeEventListener('transitionend', onTransitionEnd);
  }

  // 자동 슬라이드
  setInterval(() => {
    idx++;
    moveTo(idx);
  }, 3000);

  // 팝업 열기/닫기 & 썸네일 클릭
  menuBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
    thumbTrack.querySelectorAll('.carousel-thumb').forEach(t => t.classList.remove('active'));
    thumbTrack
      .querySelector(`.carousel-thumb[data-index="${((idx - 1 + total) % total) + 1}"]`)
      .classList.add('active');
  });
  document.querySelector('.carousel-popup-close').addEventListener('click', () => {
    popup.style.display = 'none';
  });
  popup.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = 'none';
  });
  thumbTrack.querySelectorAll('.carousel-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      idx = parseInt(thumb.getAttribute('data-index'), 10);
      moveTo(idx, true);
      popup.style.display = 'none';
    });
  });

  // ─── 8) 터치 스와이프 지원 ───
  const carousel = document.querySelector('.carousel');
  let startX = 0;
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  carousel.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    const threshold = 50; // 좌우 스와이프 민감도 조절
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        idx--;
      } else {
        idx++;
      }
      moveTo(idx);
    }
  });





  // 고객센터 글씨 벌리기
  document.querySelectorAll('.cs-hours .box h2 span').forEach(el => {
    const targetWidth = 40;  // 원하는 고정 폭 (px)
    // 캔버스 측정용
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 원본 폰트를 그대로 가져오기
    const style = getComputedStyle(el);
    ctx.font = style.font;
    // 실제 텍스트 너비 측정
    const text = el.textContent.trim();
    const textWidth = ctx.measureText(text).width;
    // 글자 사이 공간 계산
    const gaps = text.length - 1;
    if (gaps > 0) {
      const space = (targetWidth - textWidth) / gaps;
      el.style.display = 'inline-block';
      el.style.width = targetWidth + 'px';
      el.style.letterSpacing = space + 'px';
    }
  });







  const items = document.querySelectorAll('.sidebar-menu .has-submenu');

  items.forEach(item => {
    const btn = item.querySelector('.menu-link');

    btn.addEventListener('click', e => {
      e.preventDefault();

      // 1) 다른 애들 닫기
      items.forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      // 2) 클릭된 항목만 토글
      item.classList.toggle('active');
    });
  });

  // (선택) 링크형 메뉴에도 active 주고 싶다면:
  document.querySelectorAll('.sidebar-menu .sidemenu-item:not(.has-submenu) .menu-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        // 다 닫기
        items.forEach(i => i.classList.remove('active'));
        // 자기 부모에만 active
        link.closest('.sidemenu-item').classList.add('active');
      });
    });













     // ─── 기존 토글, 슬라이더 등 코드 그대로… ──────────────────────────

  // ─── 메뉴 사이드바 열기/닫기 ──────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const sidebarWrap = document.querySelector('.menuSideBarWrap');
    const sidebar     = document.querySelector('.menuSideBar');
    const openBtn     = document.querySelector('.menuLink');
    const closeBtn    = sidebar?.querySelector('.sidebar-title01 img.close');
  
    // 만약 하나라도 없으면 아무것도 안 함
    if (!sidebarWrap || !sidebar || !openBtn || !closeBtn) return;
  
    // CSS 에서 display:none; 을 이미 설정했다면, JS 에선 클래스 토글만 하면 됩니다.
    sidebar.classList.add('sidebar-closed');
  
    // 열기
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      sidebarWrap.style.display = 'block';
      requestAnimationFrame(() => {
        sidebar.classList.replace('sidebar-closed', 'sidebar-open');
      });
    });
  
    // 닫기
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      sidebar.classList.replace('sidebar-open', 'sidebar-closed');
      sidebar.addEventListener('transitionend', function handler(ev) {
        if (ev.propertyName === 'transform') {
          sidebarWrap.style.display = 'none';
          sidebar.removeEventListener('transitionend', handler);
        }
      });
    });
  
    // (선택) 래퍼 클릭해도 닫기
    sidebarWrap.addEventListener('click', e => {
      if (e.target === sidebarWrap) closeBtn.click();
    });
  });
  

  // ─── 나머지 기존 코드 계속… ──────────────────────────





}); 

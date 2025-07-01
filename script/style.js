document.addEventListener('DOMContentLoaded', () => {
  // ─── 1) 상단바 메뉴 토글 ─────────────────────────────
  const topBar = document.querySelector('.topBar_nav');
  if (topBar) {
    const toggleBtn = topBar.querySelector('.nav-toggle');
    const primary   = topBar.querySelector('ul:first-of-type');
    const secondary = topBar.querySelector('.nav-line--secondary');

    toggleBtn.addEventListener('click', e => {
      e.preventDefault();
      if (topBar.classList.contains('hide-primary') && topBar.classList.contains('expanded')) {
        topBar.classList.remove('hide-primary');
        toggleBtn.setAttribute('aria-expanded', true);
      } else {
        const isOpen = topBar.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        if (!isOpen) topBar.classList.remove('hide-primary');
      }
    });

    primary.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        topBar.classList.remove('expanded','hide-primary');
        toggleBtn.setAttribute('aria-expanded', false);
        primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        li.classList.add('active');
        secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      });
    });

    secondary.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        topBar.classList.add('expanded','hide-primary');
        toggleBtn.setAttribute('aria-expanded', true);
        secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        li.classList.add('active');
        primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      });
    });
  }

  // ─── 2) 하단바 메뉴 active 처리 ───────────────────────────
  document.querySelectorAll('.bottomBar a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.bottomBar a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ─── 3) 날짜 필터 버튼 active 처리 ────────────────────────
  document.querySelectorAll('.range_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range_btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── 4) 달력 아이콘 클릭 시 date picker 강제 오픈 ─────────
  document.querySelectorAll('.date_input img').forEach(img => {
    img.addEventListener('click', () => {
      const input = img.closest('.date_input')?.querySelector('input[type="date"]');
      if (input?.showPicker) input.showPicker();
      else alert('브라우저에서 날짜 선택 기능을 지원하지 않습니다.');
    });
  });

  // ─── 5) 장바구니 체크박스 토글 ───────────────────────────
  document.querySelectorAll('.basket-item_check').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.basket-check_label').classList.toggle('basket-checked', cb.checked);
    });
  });

  // ─── 6) 장바구니 수량 & 수정 컨트롤 ───────────────────────
  document.querySelectorAll('.basket-cart_item').forEach(item => {
    const unitPrice = Number(item.dataset.price);
    const minusBtn  = item.querySelector('.basket-qty_btn[data-action="decrement"]');
    const plusBtn   = item.querySelector('.basket-qty_btn[data-action="increment"]');
    const qtyInput  = item.querySelector('input[type="number"], .basket-qty_input');
    const priceEl   = item.querySelector('.basket-item_price');
    const subEl     = document.getElementById('subtotal');
    const totEl     = document.getElementById('total');
    const modifyBtn = item.querySelector('.basket-btn_modify');

    function updateAmounts() {
      let qty = parseInt(qtyInput.value, 10) || 1;
      qty = Math.max(1, qty);
      qtyInput.value = qty;
      const lineTotal = unitPrice * qty;
      const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
      priceEl.textContent = fmt(lineTotal);
      if (subEl) subEl.textContent = fmt(lineTotal);
      if (totEl) totEl.textContent = fmt(lineTotal);
    }

    minusBtn?.addEventListener('click', () => {
      if (qtyInput.stepDown) qtyInput.stepDown();
      else qtyInput.value = parseInt(qtyInput.value,10)-1;
      updateAmounts();
    });
    plusBtn?.addEventListener('click', () => {
      if (qtyInput.stepUp) qtyInput.stepUp();
      else qtyInput.value = parseInt(qtyInput.value,10)+1;
      updateAmounts();
    });
    qtyInput?.addEventListener('change', updateAmounts);

    modifyBtn?.addEventListener('click', () => {
      const v = parseInt(qtyInput.value,10) || 1;
      alert(`수량이 ${v}로 수정되었습니다.`);
      minusBtn.classList.add('basketAdd-disabled');
      plusBtn.classList.add('basketAdd-disabled');
      modifyBtn.classList.add('basketAdd-disabled');
    });

    updateAmounts();
  });

  // ─── 7) 캐러셀 슬라이더 ──────────────────────────────────
  const track      = document.querySelector('.carousel-track');
  const slides     = track ? Array.from(track.children) : [];
  const total      = slides.length;
  const counter    = document.querySelector('.carousel-counter');
  const menuBtn    = document.querySelector('.carousel-menu');
  const popup      = document.querySelector('.carousel-popup');
  const thumbTrack = document.querySelector('.carousel-thumb-track');

  if (track && total > 0) {
    // 무한 루프용 복제
    const firstClone = slides[0].cloneNode(true);
    const lastClone  = slides[total-1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);
    let idx = 1;
    const slideWidth = track.clientWidth;
    track.style.transform = `translateX(${-slideWidth * idx}px)`;
    if (counter) counter.textContent = `${idx} / ${total}`;

    function onTransitionEnd() {
      track.style.transition = 'none';
      if (idx === 0) {
        idx = total;
        track.style.transform = `translateX(${-slideWidth * idx}px)`;
      } else if (idx === total+1) {
        idx = 1;
        track.style.transform = `translateX(${-slideWidth * idx}px)`;
      }
      track.removeEventListener('transitionend', onTransitionEnd);
    }

    function moveTo(i, animate=true) {
      if (!animate) track.style.transition = 'none';
      else track.style.transition = 'transform 0.4s ease';
      track.style.transform = `translateX(${-slideWidth * i}px)`;
      track.addEventListener('transitionend', onTransitionEnd);
      const disp = ((i-1+total)%total)+1;
      if (counter) counter.textContent = `${disp} / ${total}`;
    }

    let autoID = setInterval(() => {
      idx++; moveTo(idx);
    }, 3000);

    // 팝업 열기/닫기
    menuBtn?.addEventListener('click', () => {
      if (!popup) return;
      popup.style.display = 'flex';
      thumbTrack.querySelectorAll('.carousel-thumb').forEach(t=>t.classList.remove('active'));
      thumbTrack.querySelector(`.carousel-thumb[data-index="${((idx-1+total)%total)+1}"]`)
                ?.classList.add('active');
    });
    document.querySelector('.carousel-popup-close')?.addEventListener('click', () => {
      popup.style.display = 'none';
    });
    popup?.addEventListener('click', e => {
      if (e.target === popup) popup.style.display = 'none';
    });
    thumbTrack?.querySelectorAll('.carousel-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        idx = parseInt(thumb.dataset.index,10);
        moveTo(idx);
        popup.style.display = 'none';
      });
    });

    // 스와이프
    const carousel = document.querySelector('.carousel');
    let startX = 0;
    carousel?.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    carousel?.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        idx += diff>0 ? -1 : 1;
        moveTo(idx);
      }
    });
  }

  // ─── 8) cs-hours 글자 사이 자동 벌리기 ─────────────────────
  document.querySelectorAll('.cs-hours .box h2 span').forEach(el => {
    const targetWidth = 50; // px
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const style = getComputedStyle(el);
    ctx.font = style.font;
    const text = el.textContent.trim();
    const textWidth = ctx.measureText(text).width;
    const gaps = text.length - 1;
    if (gaps > 0) {
      const space = (targetWidth - textWidth) / gaps;
      el.style.display = 'inline-block';
      el.style.width = targetWidth + 'px';
      el.style.letterSpacing = space + 'px';
    }
  });

  // ─── 9) 사이드바 메뉴 토글 ───────────────────────────────
  const items = document.querySelectorAll('.sidebar-menu .has-submenu');
  items.forEach(item => {
    const btn = item.querySelector('.menu-link');
    btn.addEventListener('click', e => {
      e.preventDefault();
      items.forEach(i => i !== item && i.classList.remove('active'));
      item.classList.toggle('active');
    });
  });
  document.querySelectorAll('.sidebar-menu .menu-item:not(.has-submenu) .menu-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        link.closest('.menu-item').classList.add('active');
      });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // ─── 상단바 메뉴 토글 ───
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

  // ─── 하단바 클릭 active 처리 ───
  document.querySelectorAll('.bottomBar a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.bottomBar a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ─── 날짜 필터 버튼 active 처리 ───
  document.querySelectorAll('.range_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range_btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── 달력 아이콘 클릭 시 date picker 강제 오픈 ───
  document.querySelectorAll('.date_input img').forEach(img => {
    img.addEventListener('click', () => {
      const input = img.closest('.date_input')?.querySelector('input[type="date"]');
      if (input?.showPicker) input.showPicker();
      else alert('브라우저에서 날짜 선택 기능을 지원하지 않습니다.');
    });
  });

  // ─── 장바구니 체크박스 on/off (각 아이템마다) ───
  document.querySelectorAll('.basketAdd-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('basketAdd-checked');
    });
  });

  // ─── 장바구니 수량 & 수정 컨트롤 (각 아이템마다) ───
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
});

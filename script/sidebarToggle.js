document.addEventListener('DOMContentLoaded', () => {
  // ─── 1) 사이드바 열기/닫기 ────────────────────────────
  const sidebarWrap = document.querySelector('.menuSideBarWrap');
  const sidebar     = document.querySelector('.menuSideBar');
  const openBtn     = document.querySelector('.menuLink');           // 햄버거 아이콘
  const closeBtn    = document.querySelector('.sidebar-title01 img.close');

  // 네 요소 모두 존재해야 실행
  if (sidebarWrap && sidebar && openBtn && closeBtn) {
    // 초기 상태: CSS의 display:none + 닫힌 transform
    sidebar.classList.add('sidebar-closed');

    // 열기
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      sidebarWrap.style.display = 'block';  // 백드롭 보이기
      requestAnimationFrame(() => {
        sidebar.classList.replace('sidebar-closed', 'sidebar-open');
      });
    });

    // 닫기(X 버튼)
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

    // 백드롭 클릭해도 닫기
    sidebarWrap.addEventListener('click', e => {
      if (e.target === sidebarWrap) closeBtn.click();
    });
  }

  // ─── 2) 서브메뉴 토글 (한 번에 하나만 열림) ───────────────
  document.querySelectorAll('.sidebar-menu .has-submenu').forEach(item => {
    const btn = item.querySelector('.menu-link');
    btn.addEventListener('click', e => {
      e.preventDefault();
      // 1) 다른 서브메뉴는 모두 닫기
      document.querySelectorAll('.sidebar-menu .has-submenu')
        .forEach(i => {
          if (i !== item) i.classList.remove('active');
        });
      // 2) 클릭한 항목만 토글
      item.classList.toggle('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebarWrap = document.querySelector('.menuSideBarWrap');
    const sidebar     = document.querySelector('.menuSideBar');
    const openBtn     = document.querySelector('.menuLink');           // 햄버거 아이콘
    const closeBtn    = document.querySelector('.sidebar-title01 img.close');
  
    // 네 요소가 모두 있어야 실행
    if (!sidebarWrap || !sidebar || !openBtn || !closeBtn) return;
  
    // CSS에서 display:none 으로 숨김(기본)
    sidebar.classList.add('sidebar-closed');
  
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      sidebarWrap.style.display = 'block';  // 반투명 백드롭 보이기
      requestAnimationFrame(() => {
        sidebar.classList.replace('sidebar-closed', 'sidebar-open');
      });
    });
  
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
  });
  



  // ─── 서브메뉴 토글 ──────────────────────────────────────────────
document.querySelectorAll('.sidebar-menu .has-submenu').forEach(item => {
  const btn = item.querySelector('.menu-link')
  btn.addEventListener('click', e => {
    e.preventDefault()
    // (선택) 다른 서브메뉴는 하나만 열고 싶다면 아래 두 줄을 활성화
    // document.querySelectorAll('.sidebar-menu .has-submenu').forEach(i => i !== item && i.classList.remove('active'))
    item.classList.toggle('active')
  })
})

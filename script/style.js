document.addEventListener('DOMContentLoaded', () => {
  const topBar    = document.querySelector('.topBar_nav');
  const toggleBtn = topBar.querySelector('.nav-toggle');
  const primary   = topBar.querySelector('ul:first-of-type');
  const secondary = topBar.querySelector('.nav-line--secondary');

  // 1) 화살표 클릭 → expanded / hide-primary 토글
  toggleBtn.addEventListener('click', e => {
    e.preventDefault();

    if (topBar.classList.contains('hide-primary') && topBar.classList.contains('expanded')) {
      topBar.classList.remove('hide-primary');
      toggleBtn.setAttribute('aria-expanded', true);
      return;
    }

    const isOpen = topBar.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    if (!isOpen) {
      topBar.classList.remove('hide-primary');
    }
  });

  // 2) 1차 메뉴 클릭
  primary.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      topBar.classList.remove('expanded', 'hide-primary');
      toggleBtn.setAttribute('aria-expanded', false);

      primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
    });
  });

  // 3) 2차 메뉴 클릭
  secondary.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      topBar.classList.add('expanded', 'hide-primary');
      toggleBtn.setAttribute('aria-expanded', true);

      secondary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      primary.querySelectorAll('li').forEach(i => i.classList.remove('active'));
    });
  });

  // 4) 하단바 클릭 active 처리
  const links = document.querySelectorAll('.bottomBar a');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 5) 날짜 필터 버튼 클릭 시 active 처리
  const buttons = document.querySelectorAll('.range_btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 6) 달력 아이콘 클릭 시 달력 강제 오픈
  document.querySelectorAll('.date_input img').forEach(img => {
    img.addEventListener('click', () => {
      const wrapper = img.closest('.date_input');
      const input = wrapper && wrapper.querySelector('input[type="date"]');
      if (input && typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        alert('브라우저에서 날짜 선택 기능을 지원하지 않습니다.');
      }
    });
  });

});

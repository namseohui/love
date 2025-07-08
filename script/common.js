const cateBtns = document.querySelectorAll('.cateBtn');

  cateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // 상위로 이벤트 전파 막기
      // 먼저 모두 제거
      cateBtns.forEach(el => el.classList.remove('active'));
      // 현재 클릭한 것만 추가
      btn.classList.add('active');
    });
  });

  // 문서(body 등) 아무 데나 클릭하면 active 해제
  document.addEventListener('click', () => {
    cateBtns.forEach(el => el.classList.remove('active'));
  });

// ==== tagBtn ====
  const swiper = new Swiper('.tagSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 4,
    freeMode: true,
    grabCursor: true,
  });

  document.querySelectorAll('.tagBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 모든 버튼 active 클래스 제거
      document.querySelectorAll('.tagBtn').forEach(b => b.classList.remove('active'));

      // 클릭한 버튼에만 active 추가
      btn.classList.add('active');

      // 가운데 정렬 스크롤 이동
      const wrap = document.querySelector('.tagBtnWrap');
      const btnRect = btn.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const btnCenter = btnRect.left + btnRect.width / 2;
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      const scrollLeft = wrap.scrollLeft + (btnCenter - wrapCenter);

      wrap.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    });
  });

// ==== product 리스트 ====
  document.getElementById("toggleBtn").addEventListener("click", function () {
    const products = document.querySelectorAll(".product");
    const productContainer = document.querySelector(".product-contens");
    const isExpanded = productContainer.classList.contains("expanded");  // 클래스 여부로 체크

    if (isExpanded) {
      // 3개씩 보이게 설정
      productContainer.classList.remove("expanded");
      products.forEach(product => {
        product.style.width = "100%";
      });
      // 아이콘 원래 상태로
      this.querySelector("img").src = "../img/product_icon_plur.svg";
    } else {
      // 하나씩 보이게 설정
      productContainer.classList.add("expanded");
      products.forEach(product => {
        product.style.width = "100%";
      });
      // 아이콘 변경
      this.querySelector("img").src = "../img/product_icon_single.svg";
    }
  });

// ==== 코드 복사 ====
  document.querySelectorAll('.copy-btn').forEach(copyBtn => {
    copyBtn.addEventListener('click', () => {
      const pCodeSpan = copyBtn.closest('.p-code');
      if (!pCodeSpan) return;

      // 상품코드 전체 텍스트에서 숫자만 추출
      const fullText = pCodeSpan.textContent;
      const match = fullText.match(/\d{5,}/); // 5자리 이상 숫자 추출

      if (!match) {
        alert('상품코드를 찾을 수 없습니다.');
        return;
      }

      const code = match[0];

      // ✅ clipboard API 지원 시 우선 사용
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          alert(`상품코드 ${code}가 복사되었습니다.`);
        }).catch(() => {
          fallbackCopy(code);
        });
      } else {
        // ✅ clipboard 미지원 시 구형 방식으로 복사
        fallbackCopy(code);
      }
    });

    // 구형 브라우저 복사 방식
    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const success = document.execCommand('copy');
        if (success) {
          alert(`상품코드 ${text}가 복사되었습니다.`);
        } else {
          alert('복사에 실패했습니다.');
        }
      } catch (err) {
        alert('복사에 실패했습니다.');
        console.error(err);
      }

      document.body.removeChild(textarea);
    }
  });


// ==== 업종보기 버튼 ====
document.addEventListener('DOMContentLoaded', () => {
  const businessView = document.getElementById('businessView');
  const wrap = document.getElementById('wrap');
  const offsetFromTop = 180;

  const updatePosition = () => {
    const wrapRect = wrap.getBoundingClientRect();
    const businessHeight = businessView.offsetHeight;
    const scrollTop = window.scrollY;
    const wrapTop = wrap.offsetTop;
    const wrapBottom = wrapTop + wrap.offsetHeight;

    const fixedTop = scrollTop + offsetFromTop;

    if (fixedTop >= wrapTop && fixedTop <= wrapBottom - businessHeight) {
      // 고정 상태
      businessView.style.position = 'fixed';
      businessView.style.top = `${offsetFromTop}px`;
      businessView.style.left = `${wrap.getBoundingClientRect().left}px`;
      businessView.style.width = `${wrap.offsetWidth}px`; // 필요시
    } else if (fixedTop < wrapTop) {
      // 초기 위치
      businessView.style.position = 'absolute';
      businessView.style.top = `200px`;
      businessView.style.left = `0`;
      businessView.style.width = 'auto';
    } else {
      // wrap 하단에 도달
      businessView.style.position = 'absolute';
      businessView.style.top = `${wrap.offsetHeight - businessHeight}px`;
      businessView.style.left = `0`;
      businessView.style.width = 'auto';
    }
  };

  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);
  updatePosition();
});

// 업종보기 > 클릭
document.addEventListener('DOMContentLoaded', () => {
  const businessView = document.getElementById('businessView');
  const slidePanel = document.getElementById('slidePanel');
  const closePanel = document.getElementById('closePanel');

  businessView.addEventListener('click', (e) => {
    e.preventDefault();
    slidePanel.classList.add('open');
    businessView.style.display = 'none';
    document.body.classList.add('no-scroll'); // body의 스크롤 막기
  });

  closePanel.addEventListener('click', () => {
    slidePanel.classList.remove('open');
    businessView.style.display = 'flex';
    document.body.classList.remove('no-scroll'); // body의 스크롤 복원
  });
});

// 좌측 카테고리 클릭 시
  function showCategory(id) {
    // 기존 menu-item에서 active 제거
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    // 현재 클릭된 menu-item에 active 추가
    event.currentTarget.classList.add('active');

    // 모든 submenu 비활성화
    document.querySelectorAll('.submenu').forEach(menu => {
      menu.classList.remove('active');
    });
    // 선택된 submenu 활성화
    const subMenu = document.getElementById(id);
    if (subMenu) subMenu.classList.add('active');
  }

  // 하위 메뉴 토글
  function toggleSubMenu(id) {
    const subSub = document.getElementById(id);
    const arrow = document.getElementById('arrow-' + id);

    // 이미 열린 sub-submenu가 있으면 모두 닫기
    document.querySelectorAll('.sub-submenu').forEach(menu => {
      if (menu !== subSub) {
        menu.classList.remove('active');
        const relatedArrow = menu.previousElementSibling.querySelector('.panel-arrow');
        if (relatedArrow) relatedArrow.classList.remove('active'); // 화살표 원위치
      }
    });

    // 현재 클릭한 sub-submenu 토글
    if (subSub.classList.contains('active')) {
      subSub.classList.remove('active');
      arrow.classList.remove('active'); // 화살표 원위치
    } else {
      subSub.classList.add('active');
      arrow.classList.add('active'); // 화살표 회전
    }
  }
// ==== 카테고리 ====
const openBtn = document.getElementById('openCategoryTab');
const categoryTab = document.querySelector('.categoryTab');

openBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const isActive = categoryTab.classList.contains('active');

  if (isActive) {
    // 이미 열려 있으면 닫기
    categoryTab.classList.remove('active');
    document.body.classList.remove('no-scroll');
  } else {
    // 열기
    categoryTab.classList.add('active');
    document.body.classList.add('no-scroll');
  }
});

// 바깥 클릭 시 닫기
document.addEventListener('click', function (e) {
  const isClickInside = categoryTab.contains(e.target) || openBtn.contains(e.target);

  if (!isClickInside) {
    categoryTab.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
});


// ==== 납품사례 이미지 슬라이드 ====
const swipers = document.querySelectorAll('.pd_Swiper');

  swipers.forEach((el) => {
    new Swiper(el, {
      loop: false,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      }
    });
  });

// ==== 파일업로드 ====
function previewLogo(event) {
    const input = event.target;
    const file = input.files[0];
    const fileNameText = document.getElementById("fileName");

    if (file) {
      fileNameText.textContent = file.name;

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById("logoPreview");
        img.src = e.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      fileNameText.textContent = "선택된 파일 없음";
      document.getElementById("logoPreview").style.display = "none";
    }
  }



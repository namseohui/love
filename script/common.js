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
  });

  closePanel.addEventListener('click', () => {
    slidePanel.classList.remove('open');
    businessView.style.display = 'flex';
  });
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


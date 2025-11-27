document.addEventListener("DOMContentLoaded", () => {
  // 이 페이지에 학습 패널이 없으면(실전 모드 등) 그냥 종료
  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  /* ====================================
     공통 학습 상태
  ==================================== */
  const learningState = {
    currentStep: 1 // 1단계부터 시작
  };

  const stepTitle = document.querySelector(".step-title");
  const stepBadge = document.querySelector(".step-badge");
  const stepDesc  = document.querySelector(".step-description");
  const stepList  = document.querySelectorAll(".step-list li");

  // 패널 버튼
  const retryBtn = document.getElementById("btn-retry-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  // 키오스크 영역 (화살표를 이 안에 올림)
  const kioskArea = document.querySelector(".kiosk-area");
  let hintArrow = null;

  // 필수 요소가 없으면 동작 안 함
  if (!stepTitle || !stepBadge || !stepDesc || stepList.length === 0) {
    console.warn("[learning.js] 학습 패널 요소를 찾지 못했습니다.");
    return;
  }

  // 버튼 텍스트 변경
  if (retryBtn) retryBtn.textContent = "이전 단계로";
  if (resetBtn) resetBtn.textContent = "처음부터";

  /* ====================================
      상단 '홈으로' 버튼 → index.html
  ==================================== */
  const homeBtn = document.querySelector(".app-back");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  /* ====================================
      힌트 화살표 유틸
  ==================================== */

  function ensureArrow() {
    if (!kioskArea) return null;
    if (!hintArrow) {
      hintArrow = document.createElement("div");
      hintArrow.className = "hint-arrow";
      kioskArea.appendChild(hintArrow);
    }
    return hintArrow;
  }

  function hideArrow() {
    if (hintArrow) {
      hintArrow.style.display = "none";
    }
  }

  /**
   * 특정 DOM 요소를 가리키는 화살표 표시
   * @param {HTMLElement} element - 가리킬 대상
   * @param {"left"|"right"} direction - 화살표 머리 방향
   */
  function showArrowForElement(element, direction = "left") {
    if (!kioskArea || !element) return;
    const arrow = ensureArrow();
    if (!arrow) return;

    const baseRect = kioskArea.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const top = rect.top - baseRect.top + rect.height / 2;
    let left;

    if (direction === "left") {
      // 요소 오른쪽 옆에서 ← 방향
      left = rect.right - baseRect.left + 8;
      arrow.textContent = "←";
    } else {
      // 요소 왼쪽 옆에서 → 방향
      left = rect.left - baseRect.left - 24;
      arrow.textContent = "→";
    }

    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
    arrow.style.display = "block";
  }
  function showArrowForDineIn() {
    const btn = document.getElementById("btn-dine-in");
    if (!btn) return;
    showArrowForElement(btn, "left");  // 버튼 오른쪽에서 ← 방향
  }

  // 버거 카테고리 버튼을 가리키는 화살표
  function showArrowForBurgerCategory() {
    const burgerBtn = document.querySelector(".category-nav button");
    if (!burgerBtn) {
      hideArrow();
      return;
    }
    showArrowForElement(burgerBtn, "left");
  }

  // "리아불고기" 메뉴 카드를 가리키는 화살표
  function showArrowForRiaBulgogi() {
    const cards = document.querySelectorAll(".item-card");
    let targetCard = null;

    cards.forEach(card => {
      const nameEl = card.querySelector(".item-name");
      if (nameEl && nameEl.textContent.includes("리아불고기")) {
        targetCard = card;
      }
    });

    if (!targetCard) {
      hideArrow();
      return;
    }

    showArrowForElement(targetCard, "left");
  }

  /* ====================================
      단계 UI 공통 갱신 함수
  ==================================== */

  function updateStepList(step) {
    stepList.forEach((li, index) => {
      li.classList.remove("current", "done");
      if (index < step - 1) {
        li.classList.add("done");
      } else if (index === step - 1) {
        li.classList.add("current");
      }
    });
  }

  function goToStep(step) {
    learningState.currentStep = step;
    hideArrow();
    updateStepList(step);

    if (step === 1) {
      stepBadge.textContent = "1단계";
      stepTitle.textContent = "식사 장소 선택하기";
      stepDesc.innerHTML = `화면 가운데에서 <strong>"매장에서 식사"</strong>를 눌러보세요.`;
    
      setTimeout(() => {
        showArrowForDineIn();
      }, 50);
    } else if (step === 2) {
      stepBadge.textContent = "2단계";
      stepTitle.textContent = "버거 메뉴 열기";
      stepDesc.innerHTML = `왼쪽 카테고리에서 <strong>“버거”</strong> 탭을 눌러보세요.`;

      // 메뉴 화면이 뜬 뒤에 버거 탭 위치를 계산해야 하므로 살짝 늦게 실행
      setTimeout(() => {
        showArrowForBurgerCategory();
      }, 50);

    } else if (step === 3) {
      stepBadge.textContent = "3단계";
      stepTitle.textContent = "리아불고기 선택하기";
      stepDesc.innerHTML = `버거 목록에서 <strong>“리아불고기”</strong>를 찾아 눌러보세요.`;

      setTimeout(() => {
        showArrowForRiaBulgogi();
      }, 50);

    } else if (step === 4) {
      stepBadge.textContent = "4단계";
      stepTitle.textContent = "세트 구성 선택하기";
      stepDesc.innerHTML = `빵, 세트 여부, 디저트·음료를 차례로 선택해 주세요.`;

    } else if (step === 5) {
      stepBadge.textContent = "5단계";
      stepTitle.textContent = "결제하기";
      stepDesc.innerHTML = `주문 내역을 확인한 뒤 <strong>“결제하기”</strong> 버튼을 눌러 결제를 완료해 보세요.`;
    }
  }

  /* ====================================
      1단계: "매장에서 식사" 클릭
  ==================================== */

  const dineInButton = document.getElementById("btn-dine-in");

  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
      // lotteria.js에서 실제 화면 전환 + 카테고리 생성
      // → 여기서는 학습 단계만 2로 이동
      goToStep(2);
      console.log("✅ 1단계 완료 → 2단계로 이동");
    });
  } else {
    console.warn("[learning.js] #btn-dine-in 버튼을 찾을 수 없습니다.");
  }

  /* ====================================
      2단계: "버거 카테고리" 클릭 감지
  ==================================== */

  document.addEventListener("click", (event) => {
    if (learningState.currentStep !== 2) return;

    const target = event.target.closest(".category-nav button");
    if (target && target.textContent.includes("버거")) {
      goToStep(3);
      console.log("✅ 2단계 완료 → 3단계 안내 표시");
    }
  });

  /* ====================================
      3단계: "리아불고기" 카드 클릭 감지
  ==================================== */

  document.addEventListener("click", (event) => {
    if (learningState.currentStep !== 3) return;

    const card = event.target.closest(".item-card");
    if (!card) return;

    const nameEl = card.querySelector(".item-name");
    if (nameEl && nameEl.textContent.includes("리아불고기")) {
      goToStep(4);
      console.log("✅ 3단계 완료 → 4단계 안내 표시");
    }
  });

  /* ====================================
      상단 버튼: 이전 단계 / 처음부터
  ==================================== */

  if (retryBtn) {
    retryBtn.onclick = () => {
      if (learningState.currentStep > 1) {
        goToStep(learningState.currentStep - 1);
      }
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      // 전체 상태 & 키오스크 화면까지 완전 초기화
      location.reload();
    };
  }

  /* ====================================
      초기 상태 세팅
  ==================================== */

  goToStep(1);
});

document.addEventListener("DOMContentLoaded", () => {
  // 혹시 중복 실행 방지
  if (window.__lotteriaLearningInitialized) return;
  window.__lotteriaLearningInitialized = true;

  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  /* ====================================
     공통 학습 상태
  ==================================== */
  const learningState = {
    currentStep: 1 // 1단계부터 시작
  };

  // 같은 클래스를 가진 요소가 여러 개일 수 있으니 전부 선택해서 갱신
  const stepTitleEls = document.querySelectorAll(".step-title");
  const stepBadgeEls = document.querySelectorAll(".step-badge");
  const stepDescEls  = document.querySelectorAll(".step-description");
  const stepListEls  = document.querySelectorAll(".step-list li");

  // 상단 미션 문구 (헤더) – 항상 고정 메시지
  const missionText = document.querySelector(".mission-text");
  if (missionText) {
    missionText.textContent = "미션: 리아불고기 세트를 주문해 보세요";
  }

  // 패널 버튼
  const retryBtn = document.getElementById("btn-retry-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  // 키오스크 영역 (화살표를 이 안에 올림)
  const kioskArea = document.querySelector(".kiosk-area");
  let hintArrow = null;

  if (
    stepTitleEls.length === 0 ||
    stepBadgeEls.length === 0 ||
    stepDescEls.length === 0 ||
    stepListEls.length === 0
  ) {
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
      🔍 힌트 화살표 유틸
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

  function showArrowForElement(element, direction = "left") {
    if (!kioskArea || !element) return;
    const arrow = ensureArrow();
    if (!arrow) return;

    const baseRect = kioskArea.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const top = rect.top - baseRect.top + rect.height / 2;
    let left;

    if (direction === "left") {
      left = rect.right - baseRect.left + 8;
      arrow.textContent = "←";
    } else {
      left = rect.left - baseRect.left - 8;
      arrow.textContent = "→";
    }

    arrow.classList.remove("hint-arrow-down", "hint-arrow-up", "hint-arrow-left", "hint-arrow-right");
    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
    arrow.style.display = "block";
  }

  // 🔽 1단계: 매장에서 식사 버튼 위에서 아래로 내려오는 화살표
  function showArrowForDineIn() {
    if (!kioskArea) return;
    const target = document.getElementById("btn-dine-in");
    if (!target) return;

    const arrow = ensureArrow();
    const baseRect = kioskArea.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    const top  = rect.top - baseRect.top - 12;
    const left = rect.left - baseRect.left + rect.width / 2;

    arrow.textContent = "↓";
    arrow.classList.remove("hint-arrow-up", "hint-arrow-left", "hint-arrow-right");
    arrow.classList.add("hint-arrow-down");
    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
    arrow.style.display = "block";
  }

  // 2단계: 버거 카테고리 버튼을 가리키는 화살표
  function showArrowForBurgerCategory() {
    const burgerBtn = document.querySelector(".category-nav button");
    if (!burgerBtn) {
      hideArrow();
      return;
    }
    showArrowForElement(burgerBtn, "left");
  }

  // 3단계: "리아불고기" 메뉴 카드를 가리키는 화살표
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

    showArrowForElement(targetCard, "right");
  }

  /* ====================================
      단계 UI 공통 갱신 함수
  ==================================== */

  function updateStepList(step) {
    stepListEls.forEach((li, index) => {
      li.classList.remove("current", "done");
      if (index < step - 1) {
        li.classList.add("done");
      } else if (index === step - 1) {
        li.classList.add("current");
      }
    });
  }

  function setStepText(badgeText, titleText, descHTML) {
    stepBadgeEls.forEach(el => (el.textContent = badgeText));
    stepTitleEls.forEach(el => (el.textContent = titleText));
    stepDescEls.forEach(el => (el.innerHTML = descHTML));
  }

  function applyStepUI(step) {
    if (step === 1) {
      setStepText(
        "1단계",
        "식사 장소 선택하기",
        `[1단계] 화면 가운데에서 <strong>"매장에서 식사"</strong>를 눌러보세요.`
      );
      setTimeout(showArrowForDineIn, 50);

    } else if (step === 2) {
      setStepText(
        "2단계",
        "버거 메뉴 열기",
        `[2단계] 왼쪽 카테고리에서 <strong>“버거”</strong> 탭을 눌러보세요.`
      );
      setTimeout(showArrowForBurgerCategory, 100);

    } else if (step === 3) {
      setStepText(
        "3단계",
        "리아불고기 선택하기",
        `[3단계] 버거 목록에서 <strong>“리아불고기”</strong>를 찾아 눌러보세요.`
      );
      setTimeout(showArrowForRiaBulgogi, 150);

    } else if (step === 4) {
      setStepText(
        "4단계",
        "세트 구성 선택하기",
        `[4단계] 빵, 세트 여부, 디저트·음료를 차례로 선택해 주세요.`
      );

    } else if (step === 5) {
      setStepText(
        "5단계",
        "결제하기",
        `[5단계] 주문 내역을 확인한 뒤 <strong>“결제하기”</strong> 버튼을 눌러 결제를 완료해 보세요.`
      );
    }
  }

  function goToStep(step) {
    if (step < 1) step = 1;
    if (step > 5) step = 5;

    console.log("[goToStep] 이동:", learningState.currentStep, "→", step);

    learningState.currentStep = step;
    hideArrow();
    updateStepList(step);
    applyStepUI(step);
  }

  /* ====================================
      1단계: "매장에서 식사" 클릭
  ==================================== */

  const dineInButton = document.getElementById("btn-dine-in");

  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
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
      console.log("[retry] 클릭, 현재 단계:", learningState.currentStep);
      if (learningState.currentStep > 1) {
        goToStep(learningState.currentStep - 1);
      }
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      console.log("[reset] 처음부터 클릭");
      location.reload();
    };
  }

  /* ====================================
      초기 상태 세팅
  ==================================== */

  goToStep(1);
});

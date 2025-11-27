// js/learning.js
document.addEventListener("DOMContentLoaded", () => {
  // 혹시 중복 실행 방지
  if (window.__lotteriaLearningInitialized) return;
  window.__lotteriaLearningInitialized = true;

  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  /* ====================================
     공통 학습 상태
  ==================================== */
  const MAX_STEP = 7; // 일단 7단계까지 여유 있게
  const learningState = {
    currentStep: 1, // 1단계부터 시작
  };

  // 패널 쪽 텍스트 요소 (여러 개 있을 수도 있으니 전부 선택)
  const stepTitleEls = document.querySelectorAll(".step-title");
  const stepBadgeEls = document.querySelectorAll(".step-badge");
  const stepDescEls = document.querySelectorAll(".step-description");
  const stepListEls = document.querySelectorAll(".step-list li");

  // 헤더 한 줄 안내 영역
  const stepLabelEl = document.querySelector(".current-step-text .step-label");
  const stepBriefEl = document.querySelector(".current-step-text .step-brief");

  // 상단 미션 문구 (고정)
  const missionText = document.querySelector(".mission-text");
  if (missionText) {
    missionText.textContent = "미션: 리아불고기 세트를 주문해 보세요";
  }

  // 상단 버튼들
  const prevBtn = document.getElementById("btn-prev-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  // 키오스크 영역 (화살표를 이 안에 올림)
  const kioskArea = document.querySelector(".kiosk-area");
  let hintArrow = null;

  // 필수 요소 체크
  if (
    stepTitleEls.length === 0 ||
    stepBadgeEls.length === 0 ||
    stepDescEls.length === 0 ||
    stepListEls.length === 0
  ) {
    console.warn("[learning.js] 학습 패널 요소를 찾지 못했습니다.");
    return;
  }

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
      🔁 화면 전환 헬퍼 (welcome / menu 등)
  ==================================== */
  function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach((s) => s.classList.remove("active"));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add("active");
    }
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

  // 요소를 가리키는 좌/우 화살표
  function showArrowForElement(element, direction = "left") {
    if (!kioskArea || !element) return;
    const arrow = ensureArrow();
    if (!arrow) return;

    const baseRect = kioskArea.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const top = rect.top - baseRect.top + rect.height / 2;
    let left;

    if (direction === "left") {
      // 요소 오른쪽 옆에서 ←
      left = rect.right - baseRect.left + 8;
      arrow.textContent = "←";
    } else {
      // 요소 왼쪽 옆에서 →
      left = rect.left - baseRect.left - 8;
      arrow.textContent = "→";
    }

    arrow.classList.remove(
      "hint-arrow-down",
      "hint-arrow-up",
      "hint-arrow-left",
      "hint-arrow-right"
    );
    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
    arrow.style.display = "block";
  }

  // 🔽 1단계: 매장에서 식사 버튼 위에서 ↓
  function showArrowForDineIn() {
    if (!kioskArea) return;
    const target = document.getElementById("btn-dine-in");
    if (!target) return;

    const arrow = ensureArrow();
    const baseRect = kioskArea.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    const top = rect.top - baseRect.top - 12; // 버튼 위쪽
    const left = rect.left - baseRect.left + rect.width / 2;

    arrow.textContent = "↓";
    arrow.classList.remove("hint-arrow-up", "hint-arrow-left", "hint-arrow-right");
    arrow.classList.add("hint-arrow-down");
    arrow.style.top = `${top}px`;
    arrow.style.left = `${left}px`;
    arrow.style.display = "block";
  }

  // 2단계: 버거 카테고리 버튼
  function showArrowForBurgerCategory() {
    const burgerBtn = document.querySelector(".category-nav button");
    if (!burgerBtn) {
      hideArrow();
      return;
    }
    showArrowForElement(burgerBtn, "left");
  }

  // 3단계: 리아불고기 카드
  function showArrowForRiaBulgogi() {
    const cards = document.querySelectorAll(".item-card");
    let targetCard = null;

    cards.forEach((card) => {
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

  function setStepText(badgeText, titleText, descHTML, headerLabel, headerBrief) {
    stepBadgeEls.forEach((el) => (el.textContent = badgeText));
    stepTitleEls.forEach((el) => (el.textContent = titleText));
    stepDescEls.forEach((el) => (el.innerHTML = descHTML));

    if (stepLabelEl) stepLabelEl.textContent = headerLabel;
    if (stepBriefEl) stepBriefEl.textContent = headerBrief;
  }

  function applyStepUI(step) {
    if (step === 1) {
      setStepText(
        "1단계",
        "식사 장소 선택하기",
        `[1단계] 화면 가운데에서 <strong>"매장에서 식사"</strong>를 눌러보세요.`,
        "[1단계]",
        "가운데에서 ‘매장에서 식사’를 선택해 주세요."
      );
      setTimeout(showArrowForDineIn, 50);
    } else if (step === 2) {
      setStepText(
        "2단계",
        "버거 메뉴 열기",
        `[2단계] 왼쪽 카테고리에서 <strong>“버거”</strong> 탭을 눌러보세요.`,
        "[2단계]",
        "왼쪽 메뉴에서 ‘버거’ 탭을 눌러 주세요."
      );
      setTimeout(showArrowForBurgerCategory, 100);
    } else if (step === 3) {
      setStepText(
        "3단계",
        "리아불고기 선택하기",
        `[3단계] 버거 목록에서 <strong>“리아불고기”</strong>를 찾아 눌러보세요.`,
        "[3단계]",
        "버거 목록에서 ‘리아불고기’를 찾아 선택해 주세요."
      );
      setTimeout(showArrowForRiaBulgogi, 150);
    } else if (step === 4) {
      setStepText(
        "4단계",
        "세트 구성 선택하기",
        `[4단계] 빵, 세트 여부, 디저트·음료를 차례로 선택해 주세요.`,
        "[4단계]",
        "빵, 디저트, 음료를 차례대로 선택해 주세요."
      );
    } else if (step === 5) {
      setStepText(
        "5단계",
        "결제하기",
        `[5단계] 주문 내역을 확인한 뒤 <strong>“결제하기”</strong> 버튼을 눌러 결제를 완료해 보세요.`,
        "[5단계]",
        "주문 내역을 확인하고 ‘결제하기’를 눌러 주세요."
      );
    }
  }

  function goToStep(step) {
    if (step < 1) step = 1;
    if (step > MAX_STEP) step = MAX_STEP;

    console.log("[goToStep] 이동:", learningState.currentStep, "→", step);

    learningState.currentStep = step;

    // 🔁 단계에 맞춰 실제 화면 전환
    if (step === 1) {
      showScreen("screen-welcome"); // 포장/매장 화면
    } else {
      showScreen("screen-menu"); // 일단 2단계 이후는 메뉴 화면으로
    }

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
      showScreen("screen-menu"); // 혹시 몰라서 한 번 더 보장
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
      goToStep(4); // 아직 화면은 menu 그대로지만 단계 상태는 4로
      console.log("✅ 3단계 완료 → 4단계 안내 표시");
    }
  });

  /* ====================================
      상단 버튼: 이전 단계 / 처음부터
  ==================================== */

  if (prevBtn) {
    prevBtn.onclick = () => {
      console.log("[prev] 클릭, 현재 단계:", learningState.currentStep);
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

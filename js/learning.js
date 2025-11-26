document.addEventListener("DOMContentLoaded", () => {
  // 학습 패널이 없는 페이지(실전 모드 등)는 바로 종료
  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  const body        = document.body;
  const stepTitle   = document.querySelector(".step-title");
  const stepBadge   = document.querySelector(".step-badge");
  const stepDesc    = document.querySelector(".step-description");
  const stepInline  = document.querySelector(".step-inline");
  const stepList    = document.querySelectorAll(".step-list li");
  const hintBox     = document.getElementById("learning-hint");

  if (!stepTitle || !stepBadge || !stepDesc || stepList.length === 0) {
    console.warn("[learning.js] 학습 패널 요소를 찾지 못했습니다.");
    return;
  }

  const learningState = {
    currentStep: 1
  };

  /* =========================
      공통: 단계 UI & 말풍선
  ========================= */
  function setStepUI(step) {
    learningState.currentStep = step;

    // 리스트 스타일 초기화
    stepList.forEach(li => {
      li.classList.remove("current", "done");
    });
    for (let i = 0; i < step - 1; i++) {
      if (stepList[i]) stepList[i].classList.add("done");
    }
    if (stepList[step - 1]) stepList[step - 1].classList.add("current");

    // 말풍선 기본 숨김
    if (hintBox) {
      hintBox.style.display = "none";
    }

    // 헤더 영역 텍스트
    body.classList.remove("show-burger-arrow");

    if (step === 1) {
      stepBadge.textContent = "1단계";
      stepTitle.textContent = "식사 장소 선택하기";
      stepDesc.innerHTML =
        '화면 가운데의 버튼 중에서 <strong>“매장에서 식사”</strong>를 눌러보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[1단계]</strong> 가운데에서 ‘매장에서 식사’를 선택해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "38%";
        hintBox.style.left = "52%";
        hintBox.textContent = "여기를 눌러 매장에서 식사를 선택해요.";
      }

    } else if (step === 2) {
      stepBadge.textContent = "2단계";
      stepTitle.textContent = "버거 메뉴 열기";
      stepDesc.innerHTML =
        '왼쪽 카테고리에서 <strong>“버거”</strong>를 눌러보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[2단계]</strong> 왼쪽 메뉴에서 ‘버거’ 탭을 눌러주세요.";
      }

      body.classList.add("show-burger-arrow");
      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "42%";
        hintBox.style.left = "6%";
        hintBox.textContent = "왼쪽 이 영역에서 ‘버거’를 눌러 메뉴를 여는 단계입니다.";
      }

    } else if (step === 3) {
      stepBadge.textContent = "3단계";
      stepTitle.textContent = "리아불고기 선택하기";
      stepDesc.innerHTML =
        '버거 목록에서 <strong>“리아불고기”</strong>를 찾아 눌러보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[3단계]</strong> 버거 목록에서 ‘리아불고기’를 선택해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "45%";
        hintBox.style.left = "45%";
        hintBox.textContent = "여기 ‘리아불고기’를 눌러 주문을 시작해요.";
      }

    } else if (step === 4) {
      stepBadge.textContent = "4단계";
      stepTitle.textContent = "빵 업그레이드 선택";
      stepDesc.innerHTML =
        '옵션 화면에서 <strong>“빵 업그레이드”</strong> 항목에서 원하는 빵을 선택해 보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[4단계]</strong> 옵션에서 기본빵 또는 버터번을 선택해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "32%";
        hintBox.style.left = "10%";
        hintBox.textContent = "이 영역에서 기본빵 / 버터번 중 하나를 고르면 됩니다.";
      }

    } else if (step === 5) {
      stepBadge.textContent = "5단계";
      stepTitle.textContent = "디저트 선택";
      stepDesc.innerHTML =
        '세트일 경우, <strong>“디저트·치킨 선택”</strong>에서 감자·치킨 등을 선택해 보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[5단계]</strong> 세트 디저트(감자·치킨 등)를 선택해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "46%";
        hintBox.style.left = "10%";
        hintBox.textContent = "여기에서 감자나 치킨 등 디저트를 고를 수 있어요.";
      }

    } else if (step === 6) {
      stepBadge.textContent = "6단계";
      stepTitle.textContent = "음료 선택";
      stepDesc.innerHTML =
        '이어지는 <strong>“음료·커피 선택”</strong> 영역에서 마실 음료를 선택해 보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[6단계]</strong> 콜라, 사이다, 커피 등 음료를 선택해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "62%";
        hintBox.style.left = "10%";
        hintBox.textContent = "이 영역에서 마실 음료를 고르면 됩니다.";
      }

    } else if (step === 7) {
      stepBadge.textContent = "7단계";
      stepTitle.textContent = "결제하기";
      stepDesc.innerHTML =
        '장바구니 하단의 <strong>“주문하기”</strong> 버튼을 눌러 결제 화면으로 이동해 보세요.';
      if (stepInline) {
        stepInline.innerHTML =
          "<strong>[7단계]</strong> 아래 ‘주문하기’를 눌러 결제를 진행해 주세요.";
      }

      if (hintBox) {
        hintBox.style.display = "block";
        hintBox.style.top = "78%";
        hintBox.style.left = "40%";
        hintBox.textContent = "이 버튼을 누르면 결제 단계로 이동합니다.";
      }
    }
  }

  function nextStep() {
    if (learningState.currentStep < 7) {
      setStepUI(learningState.currentStep + 1);
    }
  }

  function prevStep() {
    if (learningState.currentStep > 1) {
      setStepUI(learningState.currentStep - 1);
    }
  }

  /* =========================
      상단 버튼들
  ========================= */
  const homeBtn  = document.querySelector(".app-back");
  const prevBtn  = document.getElementById("btn-prev-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevStep();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // 완전 리셋은 그냥 새로고침
      location.reload();
    });
  }

  /* =========================
      1단계: 매장에서 식사
  ========================= */
  const dineInButton = document.getElementById("btn-dine-in");
  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
      nextStep(); // → 2단계
    });
  }

  /* =========================
      클릭 이벤트 위임으로
      나머지 단계 감지
  ========================= */
  document.addEventListener("click", (event) => {
    const target = event.target;

    // 2단계: 버거 카테고리 클릭
    if (
      learningState.currentStep === 2 &&
      target.matches(".category-nav button") &&
      target.textContent.includes("버거")
    ) {
      nextStep(); // → 3단계
      return;
    }

    // 3단계: 리아불고기 카드 클릭
    if (learningState.currentStep === 3) {
      const card = target.closest(".item-card");
      if (card) {
        const nameEl = card.querySelector(".item-name");
        if (nameEl && nameEl.textContent.includes("리아불고기")) {
          nextStep(); // → 4단계 (옵션 화면으로 진입)
          return;
        }
      }
    }

    // 옵션 화면 공통
    const optionGroup = target.closest(".option-group");
    const choiceBtn   = target.closest(".choice-btn");

    // 4단계: 빵 업그레이드 선택
    if (
      learningState.currentStep === 4 &&
      optionGroup &&
      choiceBtn &&
      optionGroup.querySelector("h3") &&
      optionGroup.querySelector("h3").textContent.includes("빵 업그레이드")
    ) {
      nextStep(); // → 5단계
      return;
    }

    // 5단계: 디저트 선택
    if (
      learningState.currentStep === 5 &&
      optionGroup &&
      choiceBtn &&
      optionGroup.querySelector("h3") &&
      optionGroup.querySelector("h3").textContent.includes("디저트·치킨 선택")
    ) {
      nextStep(); // → 6단계
      return;
    }

    // 6단계: 음료 선택
    if (
      learningState.currentStep === 6 &&
      optionGroup &&
      choiceBtn &&
      optionGroup.querySelector("h3") &&
      optionGroup.querySelector("h3").textContent.includes("음료·커피 선택")
    ) {
      nextStep(); // → 7단계
      return;
    }

    // 7단계: 장바구니의 "주문하기" 버튼
    if (
      learningState.currentStep === 7 &&
      target.classList.contains("btn-pay")
    ) {
      // 여기서는 다음 단계는 없고, 안내만 유지
      // 필요하면 나중에 "결제 완료" 단계 추가 가능
      return;
    }
  });

  // 초기 UI 세팅
  setStepUI(1);
});

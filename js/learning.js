document.addEventListener("DOMContentLoaded", () => {
  // 이 페이지에 학습 패널이 없으면(실전 모드 등) 그냥 종료
  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  const body = document.body;

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

  if (!stepTitle || !stepBadge || !stepDesc || stepList.length === 0) {
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
      단계별 UI 묶어서 갱신하는 함수
  ==================================== */
  function setStepUI(step) {
    // step 리스트 표시 초기화
    stepList.forEach(li => {
      li.classList.remove("current");
      li.classList.remove("done");
    });
    // 이전 단계들은 done, 현재 단계는 current
    for (let i = 0; i < step - 1; i++) {
      stepList[i].classList.add("done");
    }
    stepList[step - 1].classList.add("current");

    // 단계별 텍스트 & 화살표 표시
    if (step === 1) {
      stepBadge.textContent = "1단계";
      stepTitle.textContent = "식사 장소 선택하기";
      stepDesc.innerHTML =
        '화면 가운데의 버튼 중에서 <strong>“매장에서 식사”</strong>를 눌러보세요.';
      body.classList.remove("show-burger-arrow");
    } else if (step === 2) {
      stepBadge.textContent = "2단계";
      stepTitle.textContent = "버거 메뉴 열기";
      stepDesc.innerHTML =
        '왼쪽 카테고리에서 <strong>"버거"</strong>를 눌러보세요.';
      body.classList.add("show-burger-arrow");
    } else if (step === 3) {
      stepBadge.textContent = "3단계";
      stepTitle.textContent = "리아불고기 선택하기";
      stepDesc.innerHTML =
        '버거 목록에서 <strong>"리아불고기"</strong>를 찾아 눌러보세요.';
      body.classList.remove("show-burger-arrow");
    }
  }

  /* ====================================
      1단계: "매장에서 식사" 클릭
  ==================================== */
  const dineInButton = document.getElementById("btn-dine-in");

  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
      completeStep1();
    });
  } else {
    console.warn("[learning.js] #btn-dine-in 버튼을 찾을 수 없습니다.");
  }

  function completeStep1() {
    learningState.currentStep = 2;
    setStepUI(2);
    console.log("✅ 1단계 완료 → 2단계로 이동");
  }

  /* ====================================
      2단계: "버거 카테고리" 클릭 감지
  ==================================== */
  document.addEventListener("click", (event) => {
    if (learningState.currentStep !== 2) return;

    const target = event.target;
    if (
      target.matches(".category-nav button") &&
      target.textContent.includes("버거")
    ) {
      completeStep2();
    }
  });

  function completeStep2() {
    learningState.currentStep = 3;
    setStepUI(3);
    console.log("✅ 2단계 완료 → 3단계 안내 표시");
  }

  /* ====================================
      '이전 단계로' / '처음부터 다시'
  ==================================== */
  const retryBtn = document.getElementById("btn-retry-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  function goToPreviousStep() {
    if (learningState.currentStep <= 1) return;

    const prev = learningState.currentStep - 1;
    learningState.currentStep = prev;
    setStepUI(prev);

    console.log(`🔙 이전 단계로 이동 → ${prev}단계`);
  }

  if (retryBtn) {
    retryBtn.onclick = goToPreviousStep;
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      // 완전 리셋: 페이지 새로고침
      location.reload();
    };
  }

  /* ====================================
      초기 UI 표시 (1단계)
  ==================================== */
  setStepUI(1);
});

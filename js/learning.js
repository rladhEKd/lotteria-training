document.addEventListener("DOMContentLoaded", () => {
  const learningPanel = document.querySelector(".learning-panel");
  if (!learningPanel) return;

  const learningState = {
    currentStep: 1
  };

  const stepTitle = document.querySelector(".step-title");
  const stepBadge = document.querySelector(".step-badge");
  const stepDesc  = document.querySelector(".step-description");
  const stepList  = document.querySelectorAll(".step-list li");

  if (!stepTitle || !stepBadge || !stepDesc || stepList.length === 0) {
    console.warn("[learning.js] 학습 패널 요소를 찾지 못했습니다.");
    return;
  }

  /* ---------- 상단 '홈으로' ---------- */
  const homeBtn = document.querySelector(".app-back");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  /* ====================================
     말풍선 공통 헬퍼
  ==================================== */
  function clearHints() {
    document.querySelectorAll(".hint-bubble").forEach(el => el.remove());
  }

  function showHintForStep(step) {
    clearHints();

    // 1단계: 매장에서 식사
    if (step === 1) {
      const btn = document.getElementById("btn-dine-in");
      if (!btn) return;
      const bubble = document.createElement("div");
      bubble.className = "hint-bubble hint-bottom-center";
      bubble.textContent = "여기를 눌러 매장에서 식사를 선택해요.";
      btn.appendChild(bubble);
    }

    // 2단계: 왼쪽 '버거' 카테고리
    if (step === 2) {
      const burgerBtn = [...document.querySelectorAll(".category-nav button")]
        .find(b => b.textContent.includes("버거"));
      if (!burgerBtn) return;
      const bubble = document.createElement("div");
      bubble.className = "hint-bubble hint-right-center";
      bubble.textContent = "여기를 눌러 '버거' 메뉴를 열어보세요.";
      burgerBtn.appendChild(bubble);
    }

    // 3단계 이후는 나중에(리아불고기, 빵/디저트/음료…) 계속 추가하면 됨
  }

  /* ====================================
     단계 UI 갱신 (상단 + 패널 공통)
  ==================================== */
  function updateStepUI(step) {
    learningState.currentStep = step;

    // 패널 step-list 표시
    stepList.forEach((li, idx) => {
      li.classList.remove("current", "done");
      const stepIndex = idx + 1;
      if (stepIndex < step) li.classList.add("done");
      if (stepIndex === step) li.classList.add("current");
    });

    // 상단 뱃지 / 타이틀 / 설명
    if (step === 1) {
      stepBadge.textContent = "1단계";
      stepTitle.textContent = "식사 장소 선택하기";
      stepDesc.innerHTML = `화면 가운데에서 <strong>“매장에서 식사”</strong>를 눌러주세요.`;
    } else if (step === 2) {
      stepBadge.textContent = "2단계";
      stepTitle.textContent = "버거 메뉴 열기";
      stepDesc.innerHTML = `왼쪽 메뉴에서 <strong>“버거”</strong> 탭을 눌러주세요.`;
    } else if (step === 3) {
      stepBadge.textContent = "3단계";
      stepTitle.textContent = "리아불고기 선택하기";
      stepDesc.innerHTML = `버거 목록에서 <strong>“리아불고기”</strong>를 눌러주세요.`;
    }
    // 4,5단계도 나중에 이어서 정의

    showHintForStep(step);
  }

  /* ====================================
      1단계: 매장에서 식사
  ==================================== */
  const dineInButton = document.getElementById("btn-dine-in");

  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
      completeStep1();
    });
  }

  function completeStep1() {
    console.log("✅ 1단계 완료 → 2단계로 이동");
    updateStepUI(2);
  }

  /* ====================================
      2단계: 버거 카테고리 클릭
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
    console.log("✅ 2단계 완료 → 3단계 안내 표시");
    updateStepUI(3);
  }

  /* ====================================
      이전 단계 / 처음부터 다시
  ==================================== */
  const prevBtn  = document.getElementById("btn-prev-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  if (prevBtn) {
    prevBtn.onclick = () => {
      const prev = Math.max(1, learningState.currentStep - 1);
      updateStepUI(prev);
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      updateStepUI(1);
    };
  }

  /* 초기 상태 세팅 */
  updateStepUI(1);
});

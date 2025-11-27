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

  // 헤더 한 줄 안내
  const headerStepLabel = document.querySelector(".learning-status-row .step-label");
  const headerStepBrief = document.querySelector(".learning-status-row .step-brief");

  /* ---------- 홈으로 ---------- */
  const homeBtn = document.querySelector(".app-back");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  /* ---------- 화살표 헬퍼 ---------- */
  function clearHints() {
    document.querySelectorAll(".hint-arrow").forEach(el => el.remove());
  }

  function showHintForStep(step) {
    clearHints();

    // 1단계: 매장에서 식사 버튼
    if (step === 1) {
      const btn = document.getElementById("btn-dine-in");
      if (!btn) return;
      const arrow = document.createElement("div");
      arrow.className = "hint-arrow hint-arrow-down";
      arrow.textContent = "↓";
      btn.appendChild(arrow);
    }

    // 2단계: 왼쪽 버거 탭
    if (step === 2) {
      const burgerBtn = [...document.querySelectorAll(".category-nav button")]
        .find(b => b.textContent.includes("버거"));
      if (!burgerBtn) return;
      const arrow = document.createElement("div");
      arrow.className = "hint-arrow hint-arrow-right";
      arrow.textContent = "→";
      burgerBtn.appendChild(arrow);
    }

    // 3단계 이후 화살표는 나중에 추가
  }

  /* ---------- 단계 UI 공통 업데이트 ---------- */
  function updateStepUI(step) {
    learningState.currentStep = step;

    // 패널 리스트
    stepList.forEach((li, idx) => {
      li.classList.remove("current", "done");
      const s = idx + 1;
      if (s < step) li.classList.add("done");
      if (s === step) li.classList.add("current");
    });

    // 패널 제목/설명
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

    // 헤더 한 줄 안내 텍스트
    if (headerStepLabel && headerStepBrief) {
      headerStepLabel.textContent = `[${step}단계]`;
      let brief = "";
      if (step === 1) brief = "가운데에서 ‘매장에서 식사’를 선택해 주세요.";
      else if (step === 2) brief = "왼쪽 메뉴에서 ‘버거’ 탭을 눌러 주세요.";
      else if (step === 3) brief = "버거 목록에서 ‘리아불고기’를 눌러 주세요.";
      headerStepBrief.textContent = brief;
    }

    showHintForStep(step);
  }

  /* ---------- 1단계: 매장에서 식사 ---------- */
  const dineInButton = document.getElementById("btn-dine-in");
  if (dineInButton) {
    dineInButton.addEventListener("click", () => {
      if (learningState.currentStep !== 1) return;
      console.log("✅ 1단계 완료 → 2단계");
      updateStepUI(2);
    });
  }

  /* ---------- 2단계: 버거 카테고리 클릭 ---------- */
  document.addEventListener("click", (event) => {
    if (learningState.currentStep !== 2) return;

    const target = event.target;
    if (
      target.matches(".category-nav button") &&
      target.textContent.includes("버거")
    ) {
      console.log("✅ 2단계 완료 → 3단계");
      updateStepUI(3);
    }
  });

  /* ---------- 이전 단계 / 처음부터 다시 ---------- */
  const prevBtn  = document.getElementById("btn-prev-step") || document.getElementById("btn-retry-step");
  const resetBtn = document.getElementById("btn-reset-mission");

  if (prevBtn) {
    prevBtn.onclick = () => {
      const prev = Math.max(1, learningState.currentStep - 1);
      updateStepUI(prev);
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      // 진짜 처음 화면(식사 장소 선택)까지 완전히 되돌리기
      location.reload();
    };
  }

  // 처음 로딩 시 1단계 상태 세팅
  updateStepUI(1);
});

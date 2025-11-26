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

  // 필수 요소가 없으면 동작 안 함
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

    // step-list 표시 업데이트
    stepList[0].classList.remove("current");
    stepList[0].classList.add("done");
    stepList[1].classList.add("current");

    // 패널 텍스트 업데이트
    stepBadge.textContent = "2단계";
    stepTitle.textContent = "버거 메뉴 열기";
    stepDesc.innerHTML = `왼쪽 카테고리에서 <strong>"버거"</strong>를 눌러보세요.`;

    console.log("✅ 1단계 완료 → 2단계로 이동");
  }

  /* ====================================
      2단계: "버거 카테고리" 클릭 감지
  ==================================== */

  // lotteria.js에서 카테고리 버튼을 동적으로 만들기 때문에
  // document 전체에 이벤트 위임
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

    stepList[1].classList.remove("current");
    stepList[1].classList.add("done");
    stepList[2].classList.add("current");

    stepBadge.textContent = "3단계";
    stepTitle.textContent = "리아불고기 선택하기";
    stepDesc.innerHTML = `버거 목록에서 <strong>"리아불고기"</strong>를 찾아 눌러보세요.`;

    console.log("✅ 2단계 완료 → 3단계 안내 표시");
  }

  /* ====================================
      다시 하기 / 전체 리셋
  ==================================== */

  const retryBtn  = document.getElementById("btn-retry-step");
  const resetBtn  = document.getElementById("btn-reset-mission");

  if (retryBtn) {
    retryBtn.onclick = () => {
      location.reload();
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      location.reload();
    };
  }
});

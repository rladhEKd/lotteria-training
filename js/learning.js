document.addEventListener("DOMContentLoaded", () => {

    /* ====================================
       공통 학습 상태
    ==================================== */
    const learningState = {
        currentStep: 1 // 1단계부터 시작
    };

    const stepTitle = document.querySelector(".step-title");
    const stepBadge = document.querySelector(".step-badge");
    const stepDesc = document.querySelector(".step-description");
    const stepList = document.querySelectorAll(".step-list li");
    const learningPanel = document.querySelector(".learning-panel");


    /* ====================================
        1단계: "매장에서 식사" 클릭
    ==================================== */
    const dineInButton = document.getElementById("btn-dine-in");

    dineInButton.addEventListener("click", () => {
        if (learningState.currentStep !== 1) return;
        completeStep1();
    });

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

        // ⭐ 학습 패널로 자동 스크롤 (보이도록)
        learningPanel.scrollIntoView({ behavior: "smooth" });
    }


    /* ====================================
        2단계: "버거 카테고리" 클릭 감지
    ==================================== */

    document.addEventListener("click", (event) => {
        if (learningState.currentStep !== 2) return;

        if (
            event.target.matches(".category-nav button") &&
            event.target.textContent.includes("버거")
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

        // ⭐ 패널을 다시 보여주기
        learningPanel.scrollIntoView({ behavior: "smooth" });
    }



    /* ====================================
         상단 '홈으로' 버튼 기능
    ==================================== */

    const topHomeBtn = document.getElementById("btn-go-home");
    if (topHomeBtn) {
        topHomeBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }


    /* ====================================
        다시 하기 / 전체 리셋
    ==================================== */

    document.getElementById("btn-retry-step").onclick = () => {
        location.reload();
    };

    document.getElementById("btn-reset-mission").onclick = () => {
        location.reload();
    };

});

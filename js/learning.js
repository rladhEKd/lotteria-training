document.addEventListener("DOMContentLoaded", () => {

    // =======================
    //   1단계 안내 로직
    // =======================
    const dineInButton = document.getElementById("btn-dine-in");

    dineInButton.addEventListener("click", () => {
        completeStep1();
    });

    function completeStep1() {
        // 패널 UI 업데이트
        document.querySelector(".step-description").innerHTML =
            "잘하셨어요! 이제 2단계에서 <strong>버거 메뉴</strong>를 열어볼 거예요.";

        document.querySelector(".step-list li.current").classList.remove("current");
        document.querySelector(".step-list li:nth-child(2)").classList.add("current");

        document.querySelector(".step-title").textContent = "버거 메뉴 열기";
        document.querySelector(".step-badge").textContent = "2단계";
    }

    // =======================
    //   다시 하기 / 리셋
    // =======================
    document.getElementById("btn-retry-step").onclick = () => {
        location.reload();
    };

    document.getElementById("btn-reset-mission").onclick = () => {
        location.reload();
    };

});

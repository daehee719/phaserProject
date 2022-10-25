const btn = document.querySelector("#btnRand");

btn.addEventListener("click", e => {
    let ratio = Math.random(); // 0 ~ 1 사이의 랜덤한 값을 반환한다.
    if (ratio < 0.5) {
        alert("예! 동윤이는 졸꺼에요");
    } else {
        alert("아니요! 그럴리가 없잖아요!");
    }
});
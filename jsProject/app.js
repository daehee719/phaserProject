window.addEventListener("load",()=>{
    let toggle = false;
      let btn = document.querySelector("#btn");
      let box = document.querySelector(".box");
      let btn2 = document.querySelector("#stop");
      let id;

      btn.addEventListener("click", () => {
        if (toggle == true) {
          box.classList.remove("on");
        } else {
          box.classList.add("on");
        }
        console.log(box.classList);
        if (toggle == false) {
          box.style.width = "100px";
          box.style.fontSize = toggle ? "18px" : "30px";
        } else {
          box.style.width = "300px";
        }
        toggle = !toggle;

        id = setInterval(() => {
          btn.click();
        }, 500);
      });

      btn2.addEventListener("click", () => {
        clearInterval(id);
      });
})

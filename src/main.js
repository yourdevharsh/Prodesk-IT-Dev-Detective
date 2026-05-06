document.addEventListener("DOMContentLoaded", () => {
  const normalModeBtn = document.getElementById("normalModeBtn");
  const battleModeBtn = document.getElementById("battleModeBtn");

  const normalModeCont = document.getElementById("normalMode");
  const battleModeCont = document.getElementById("battleMode");

  let active = "normal";

  normalModeBtn.addEventListener("click", () => {
    if (active !== "normal") {
      active = "normal";
      normalModeCont.style.display = "flex";
      battleModeCont.style.display = "none";
      normalModeBtn.style.backgroundColor = "#F8C463";
      normalModeBtn.style.fontSize = "1.1rem";
      battleModeBtn.style.backgroundColor = "white";
      battleModeBtn.style.fontSize = "1rem";
    }
  });

  battleModeBtn.addEventListener("click", () => {
    if (active !== "battle") {
      active = "battle";
      normalModeCont.style.display = "none";
      battleModeCont.style.display = "flex";
      battleModeBtn.style.backgroundColor = "#F8C463";
      battleModeBtn.style.fontSize = "1.1rem";
      normalModeBtn.style.backgroundColor = "white";
      normalModeBtn.style.fontSize = "1rem";
    }
  });
});

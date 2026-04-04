const loadingScreen = document.getElementById("loading-screen");

window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.style.opacity = "0";
    loadingScreen.style.visibility = "hidden";
  }, 350);
});

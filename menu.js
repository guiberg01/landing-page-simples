const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = navMenu.querySelectorAll("a");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

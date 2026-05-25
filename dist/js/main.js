// src/js/main.js
console.log("\u2705 Aplikacja uruchomiona");
var app = document.querySelector("#app");
if (app) {
  app.textContent = "Projekt gotowy do pracy";
}
var initWhyTabs = () => {
  const tabs = document.querySelectorAll(".why__tab");
  const slides = document.querySelectorAll(".why__slide");
  if (!tabs.length) return;
  const switchTab = (tabId) => {
    tabs.forEach((tab) => tab.classList.remove("why__tab--active"));
    const activeTab = document.querySelector(`.why__tab[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add("why__tab--active");
    slides.forEach((slide) => slide.classList.remove("why__slide--active"));
    const activeSlide = document.querySelector(`.why__slide[data-slide="${tabId}"]`);
    if (activeSlide) activeSlide.classList.add("why__slide--active");
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });
};
var initApproachTabs = () => {
  const tabs = document.querySelectorAll(".approach__tab");
  const slides = document.querySelectorAll(".approach__slide");
  if (!tabs.length) return;
  const switchTab = (tabId) => {
    tabs.forEach((tab) => tab.classList.remove("approach__tab--active"));
    const activeTab = document.querySelector(`.approach__tab[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add("approach__tab--active");
    slides.forEach((slide) => slide.classList.remove("approach__slide--active"));
    const activeSlide = document.querySelector(`.approach__slide[data-slide="${tabId}"]`);
    if (activeSlide) activeSlide.classList.add("approach__slide--active");
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  initWhyTabs();
  initApproachTabs();
});
//# sourceMappingURL=main.js.map

console.log('✅ Aplikacja uruchomiona');

const app = document.querySelector('#app');
if (app) {
    app.textContent = 'Projekt gotowy do pracy';
}

// Sekcja "Dlaczego my" – zakładki
const initWhyTabs = () => {
    const tabs = document.querySelectorAll('.why__tab');
    const slides = document.querySelectorAll('.why__slide');

    if (!tabs.length) return;

    const switchTab = (tabId) => {
        tabs.forEach((tab) => tab.classList.remove('why__tab--active'));
        const activeTab = document.querySelector(`.why__tab[data-tab="${tabId}"]`);
        if (activeTab) activeTab.classList.add('why__tab--active');
        slides.forEach((slide) => slide.classList.remove('why__slide--active'));
        const activeSlide = document.querySelector(`.why__slide[data-slide="${tabId}"]`);
        if (activeSlide) activeSlide.classList.add('why__slide--active');
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initWhyTabs();
});

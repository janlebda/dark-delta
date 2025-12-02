let darkModeEnabled = false;
let observer = null; // Nowy obserwator

function applyDarkModeToElement(element) {
  // Przykładowe elementy, dla których chcesz wymusić tło
  if (element.matches(".popover, .modal-content, .drawer, .card, .alert")) {
    element.classList.add("dark-mode-child");
  }
}

function startDarkMode() {
  if (darkModeEnabled) return;
  darkModeEnabled = true;
  document.body.classList.add("dark-mode");
  
  // 1. Uruchomienie obserwatora:
  if (!observer) {
    observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Tylko dla elementów
            applyDarkModeToElement(node);
            // Przeszukaj dodane węzły w poszukiwaniu potomków (głębokie ładowanie)
            node.querySelectorAll('*').forEach(applyDarkModeToElement);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function stopDarkMode() {
  darkModeEnabled = false;
  document.body.classList.remove("dark-mode");
  
  // 2. Zatrzymanie obserwatora i sprzątanie:
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  // Opcjonalnie usuń klasy ze wszystkich podrzędnych elementów
  document.querySelectorAll('.dark-mode-child').forEach(el => {
      el.classList.remove('dark-mode-child');
  });
}

// Reszta kodu pozostaje bez zmian
chrome.storage.local.get("enabled", (data) => {
  if (data.enabled) startDarkMode();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "enable") startDarkMode();
  if (msg.action === "disable") stopDarkMode();
});
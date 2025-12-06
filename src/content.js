let darkModeEnabled = false;
let observer = null;

function applyDarkModeToElement(element) {
  if (element.matches(".popover, .modal-content, .drawer, .card, .alert")) {
    element.classList.add("dark-mode-child");
  }
}

function startDarkMode() {
  if (darkModeEnabled) return;
  darkModeEnabled = true;
  document.body.classList.add("dark-mode");
  
  if (!observer) {
    observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            applyDarkModeToElement(node);
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
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  document.querySelectorAll('.dark-mode-child').forEach(el => {
      el.classList.remove('dark-mode-child');
  });
}

chrome.storage.local.get("enabled", (data) => {
  const enabled = data.enabled !== undefined ? data.enabled : true;
  if (enabled) startDarkMode();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "enable") startDarkMode();
  if (msg.action === "disable") stopDarkMode();
});
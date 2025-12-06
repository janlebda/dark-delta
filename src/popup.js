const toggle = document.getElementById("darkModeToggle");
const label = document.querySelector(".label-text");
const body = document.body;
const lightImage = document.getElementById("lightImage");
const darkImage = document.getElementById("darkImage");

function updatePopupTheme(enabled) {
  if (enabled) {
    body.style.setProperty("--tint", "rgba(0, 0, 0, 0.4)");
    body.style.color = "white";
    label.textContent = "Włączony";
  } else {
    body.style.setProperty("--tint", "rgba(212, 212, 212, 0.4)");
    body.style.color = "black";
    label.textContent = "Wyłączony";
  }
}

chrome.storage.local.get("enabled", data => {
  const enabled = data.enabled !== undefined ? data.enabled : true;
  toggle.checked = enabled;
  updatePopupTheme(enabled);
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  updatePopupTheme(enabled);
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: enabled ? "enable" : "disable" }
    );
  });
});
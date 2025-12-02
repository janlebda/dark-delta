const toggle = document.getElementById("darkModeToggle");
const label = document.querySelector(".label-text");
const body = document.body;
const lightImage = document.getElementById("lightImage");
const darkImage = document.getElementById("darkImage");

function updatePopupTheme(enabled) {
  if (enabled) {
    body.style.backgroundColor = "#0a161f";
    body.style.color = "white";
    label.textContent = "Włączony";
    lightImage.style.display = "none";
    darkImage.style.display = "block";
  } else {
    body.style.backgroundColor = "white";
    body.style.color = "black";
    label.textContent = "Wyłączony";
    lightImage.style.display = "block";
    darkImage.style.display = "none";
  }
}

chrome.storage.local.get("enabled", data => {
  const enabled = data.enabled || false;
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

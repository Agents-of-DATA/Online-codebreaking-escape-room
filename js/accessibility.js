const defaultAccessibilitySettings = {
  textSize: 100,
  font: "Arial, sans-serif",
  colourBlindMode: "none",
  contrast: 100,
  saturation: 100
};

function getColourBlindFilter(mode) {
  switch (mode) {
    case "protanopia":
      return "sepia(0.3) hue-rotate(-20deg)";
    case "deuteranopia":
      return "sepia(0.2) hue-rotate(20deg)";
    case "tritanopia":
      return "sepia(0.2) hue-rotate(140deg)";
    case "grayscale":
      return "grayscale(1)";
    default:
      return "";
  }
}

function applyAccessibilitySettings(settings) {
  const safeSettings = { ...defaultAccessibilitySettings, ...settings };

  document.documentElement.style.fontSize = `${safeSettings.textSize}%`;
  document.body.style.fontFamily = safeSettings.font;

  const colourBlindFilter = getColourBlindFilter(safeSettings.colourBlindMode);
  const filterString = [
    `contrast(${safeSettings.contrast}%)`,
    `saturate(${safeSettings.saturation}%)`,
    colourBlindFilter
  ]
    .filter(Boolean)
    .join(" ");

  document.body.style.filter = filterString;

  const textSize = document.getElementById("textSize");
  const textSizeValue = document.getElementById("textSizeValue");
  const fontSelect = document.getElementById("fontSelect");
  const colourBlindMode = document.getElementById("colourBlindMode");
  const contrast = document.getElementById("contrast");
  const contrastValue = document.getElementById("contrastValue");
  const saturation = document.getElementById("saturation");
  const saturationValue = document.getElementById("saturationValue");

  if (textSize) textSize.value = safeSettings.textSize;
  if (textSizeValue) textSizeValue.textContent = `${safeSettings.textSize}%`;

  if (fontSelect) fontSelect.value = safeSettings.font;
  if (colourBlindMode) colourBlindMode.value = safeSettings.colourBlindMode;

  if (contrast) contrast.value = safeSettings.contrast;
  if (contrastValue) contrastValue.textContent = `${safeSettings.contrast}%`;

  if (saturation) saturation.value = safeSettings.saturation;
  if (saturationValue) saturationValue.textContent = `${safeSettings.saturation}%`;
}

function getSavedAccessibilitySettings() {
  const saved = localStorage.getItem("accessibilitySettings");
  if (!saved) return defaultAccessibilitySettings;

  try {
    return { ...defaultAccessibilitySettings, ...JSON.parse(saved) };
  } catch {
    return defaultAccessibilitySettings;
  }
}

function getCurrentAccessibilitySettings() {
  const textSize = document.getElementById("textSize");
  const fontSelect = document.getElementById("fontSelect");
  const colourBlindMode = document.getElementById("colourBlindMode");
  const contrast = document.getElementById("contrast");
  const saturation = document.getElementById("saturation");

  return {
    textSize: textSize ? Number(textSize.value) : defaultAccessibilitySettings.textSize,
    font: fontSelect ? fontSelect.value : defaultAccessibilitySettings.font,
    colourBlindMode: colourBlindMode ? colourBlindMode.value : defaultAccessibilitySettings.colourBlindMode,
    contrast: contrast ? Number(contrast.value) : defaultAccessibilitySettings.contrast,
    saturation: saturation ? Number(saturation.value) : defaultAccessibilitySettings.saturation
  };
}

function setupAccessibilityControls() {
  const textSize = document.getElementById("textSize");
  const fontSelect = document.getElementById("fontSelect");
  const colourBlindMode = document.getElementById("colourBlindMode");
  const contrast = document.getElementById("contrast");
  const saturation = document.getElementById("saturation");
  const saveButton = document.getElementById("saveSettings");
  const resetButton = document.getElementById("resetSettings");

  const hasControls =
    textSize &&
    fontSelect &&
    colourBlindMode &&
    contrast &&
    saturation &&
    saveButton &&
    resetButton;

  if (!hasControls) return;

  function updateLiveSettings() {
    applyAccessibilitySettings(getCurrentAccessibilitySettings());
  }

  textSize.addEventListener("input", updateLiveSettings);
  fontSelect.addEventListener("change", updateLiveSettings);
  colourBlindMode.addEventListener("change", updateLiveSettings);
  contrast.addEventListener("input", updateLiveSettings);
  saturation.addEventListener("input", updateLiveSettings);

  saveButton.addEventListener("click", () => {
    const settings = getCurrentAccessibilitySettings();
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("accessibilitySettings");
    applyAccessibilitySettings(defaultAccessibilitySettings);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  applyAccessibilitySettings(getSavedAccessibilitySettings());
  setupAccessibilityControls();
});
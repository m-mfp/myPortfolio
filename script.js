// Dark mode toggle script with icon change
const toggleBtn = document.querySelectorAll("#darkModeToggle");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Change icon
  toggleBtn.forEach((btn) => {
    if (document.body.classList.contains("dark-mode")) {
      btn.textContent = "☀️"; // sun icon
    } else {
      btn.textContent = "🌙"; // moon icon
    }
  });

  // Save preference to localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
}

// Attach event listeners to all toggle buttons (for multiple pages)
toggleBtn.forEach((btn) => {
  btn.addEventListener("click", toggleDarkMode);
});

// Load saved theme preference on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleBtn.forEach((btn) => (btn.textContent = "☀️"));
  } else {
    toggleBtn.forEach((btn) => (btn.textContent = "🌙"));
  }
});

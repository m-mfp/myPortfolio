// dark mode
const body = document.body
const darkModeBtn = document.getElementById("switch-btn")
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    const isDarkMode = body.classList.contains("dark")
    console.log(isDarkMode)

    if (isDarkMode) {
        body.classList.remove('dark')
        toggleBtn.classList.remove('dark')
    } else {
        body.classList.add('dark')
        toggleBtn.classList.add('dark')
    }
})


// tooltip
const titlesLink = document.querySelectorAll("#titles a");

titlesLink.forEach((link) => {
    link.addEventListener("mouseover", () => {
        link.classList.add("show-tooltip");
    });

    link.addEventListener("mouseout", () => {
        link.classList.remove("show-tooltip");
    });
});
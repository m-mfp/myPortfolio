// dark mode
const body = document.body
const darkModeBtn = document.getElementById("switch-btn")
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    const isDarkMode = body.classList.contains("dark")
    if (isDarkMode) {
        body.classList.remove('dark')
        toggleBtn.classList.remove('dark')
        body.querySelector("#aboutme-section").classList.remove('dark')
    } else {
        body.classList.add('dark')
        toggleBtn.classList.add('dark')
        body.querySelector("#aboutme-section").classList.add('dark')
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


// videos
const skyrimVideo = document.querySelector(".skyrim-project"); // Use the correct class selector

skyrimVideo.addEventListener('play', () => {
    skyrimVideo.classList.add("playing");
});

skyrimVideo.addEventListener('pause', () => {
    skyrimVideo.classList.remove("playing"); // Remove the class when paused
});

skyrimVideo.addEventListener('ended', () => {
    skyrimVideo.classList.remove("playing"); // Remove the class when ended
});
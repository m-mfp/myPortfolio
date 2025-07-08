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


const handleVideoEvents = (videoElement) => {
    videoElement.addEventListener('play', () => videoElement.classList.add("playing"));
    videoElement.addEventListener('pause', () => videoElement.classList.remove("playing"));
    videoElement.addEventListener('ended', () => videoElement.classList.remove("playing"));
}

const skyrimVideo = document.querySelector(".skyrim-project");
const falloutVideo = document.querySelector(".fallout-project");

handleVideoEvents(skyrimVideo);
handleVideoEvents(falloutVideo);
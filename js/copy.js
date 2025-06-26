const body = document.body
const darkModeBtn = document.getElementById("switch-btn")

// const lightImageURL = 'url(images/marble-3534940.jpg)'
// body.style.backgroundImage = lightImageURL




const titleLinks = document.querySelectorAll("#titles a")

titleLinks.forEach((link) => {
    link.addEventListener('mouseover', () => {
        link.classList.add('show-tooltip')
    })

    link.addEventListener('mouseout', () => {
        link.classList.remove('show-tooltip')
    })
})

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
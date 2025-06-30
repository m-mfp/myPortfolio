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

// Skyrim Alchemy Scrapper
const output = document.querySelector('.output');
const ingredientSection = document.getElementById("ingredientSection")
const ingredientBtn = document.getElementById("ingredientBtn")
const selectIngredientBtn = document.getElementById("selectIngredientBtn")


document.addEventListener('DOMContentLoaded', function() {
    fetch('../data.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    ingredientBtn.addEventListener("click", () => {
                        fillSelectionBtn(results.data)
                        selectIngredientBtn.addEventListener("change", () => {
                            displayData(results.data, selectIngredientBtn)
                        })
                    })
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
});

function fillSelectionBtn(data) {
    selectIngredientBtn.innerHTML = `
        <option value="-" selected>--- Select Ingredient ---</option>
    `
    data.forEach(row => {
        selectIngredientBtn.innerHTML += `
            <option value="${row.Ingredient}">${row.Ingredient}</option>
        `
    })
}


// Display Data
function displayData(data, input) {
    const selectId = input.id;
    switch (selectId) {
        case 'selectIngredientBtn':
            var row = findEffect(data, input.value)
            break;
        default:
            break;
    }

    output.innerHTML = '';
    if (row) {
        Object.values(row).slice(1).forEach(effect => {
            div = document.createElement("div")
            div.id = "input"
            div.innerHTML = `<h2>${effect}</h2>`;
            output.appendChild(div)

            innerdiv = document.createElement("div")
            const ingredientList = findIngredients(data, effect)
            ingredientList.forEach(ing => {
                innerdiv.innerHTML += `<p>${ing}</p>`
            });
            div.appendChild(innerdiv)
        });
    }
}

// Find Effects for given Ingredient
function findEffect(data, selectIngredientBtn) {
    return data.find(row => row.Ingredient.toLowerCase() === selectIngredientBtn.toLowerCase());
}

function findIngredients(data, effect) {
    let ingredientList = []
    const headers = ["EffectOne", "EffectTwo", "EffectThree", "EffectFour"]

    data.forEach(row => {
        headers.forEach(head => {
            if(row[head].toLowerCase() == effect.toLowerCase()){
                ingredientList.push(row.Ingredient)
            }  
        })  
    });
    return ingredientList
}

// Ingredient Btn Listener
ingredientBtn.addEventListener("click", () => {
    effectBtn.disabled = !effectBtn.disabled; 
    ingredientBtn.classList.toggle("pressed")
    ingredientSection.classList.toggle("hidden")
    selectIngredientBtn.value = "-"
    output.innerHTML = '';
})






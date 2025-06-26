
const output = document.querySelector('.output');

const body = document.body
const darkModeBtn = document.getElementById("switch-btn")

const toggleBtn = document.getElementById("toggle-btn");

const ingredientSection = document.getElementById("ingredientSection")
const ingredientBtn = document.getElementById("ingredientBtn")
const selectIngredientBtn = document.getElementById("selectIngredientBtn")

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

document.addEventListener('DOMContentLoaded', function() {
    fetch('../data.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    selectIngredientBtn.addEventListener("change", () => {
                        displayData(results.data, selectIngredientBtn)
                    })
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
});

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

ingredientBtn.addEventListener("click", () => {
    effectBtn.disabled = !effectBtn.disabled; 
    ingredientBtn.classList.toggle("pressed")
    ingredientSection.classList.toggle("hidden")
    selectIngredientBtn.value = "-"
    output.innerHTML = '';
})

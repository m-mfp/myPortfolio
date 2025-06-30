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
const btns = document.querySelectorAll("button")
const ingredientBtn = document.getElementById("ingredientBtn")
const effectBtn = document.getElementById("effectBtn")
const selectIngredientBtn = document.getElementById("selectIngredientBtn")
const outputSection = document.getElementById("output-section")

document.addEventListener('DOMContentLoaded', function() {
    fetch('../data.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {

                    btns.forEach((btn) => {
                        btn.addEventListener("click", () => {
                            handleBtn(results.data, btn)
                        })
                    })
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
});

function handleBtn(data, btn) {

    while (outputSection.children.length > 1) {
        outputSection.removeChild(outputSection.firstChild);
    }

    var selectElement = document.createElement("select")
    selectElement.classList.add("selectBtn")
    outputSection.insertBefore(selectElement, outputSection.firstChild);

    if (btn.id == "ingredientBtn") {
        selectElement.id = "selectIngredientBtn"
        fillIngredientSelectBtn(data, selectElement)
        effectBtn.disabled = !effectBtn.disabled; 
        ingredientBtn.classList.toggle("pressed")
        outputSection.classList.toggle("hidden")
        
        selectElement.value = "-"
        output.innerHTML = '';
        selectElement.addEventListener("change", () => {
            displayIngredientData(data, selectElement)
        })
    } else if (btn.id == "effectBtn") {
        selectElement.id = "selectEffectBtn"
        fillEffectSelectBtn(data, selectElement)
        ingredientBtn.disabled = !ingredientBtn.disabled; 
        effectBtn.classList.toggle("pressed")
        outputSection.classList.toggle("hidden")

    selectElement.value = "-"
    output.innerHTML = '';
    selectElement.addEventListener("change", () => {
        displayEffectData(data, selectElement)
    })
    }
}

function fillIngredientSelectBtn(data, selectElement) {
    selectElement.innerHTML = `
        <option value="-" selected>--- Select Ingredient ---</option>
    `
    data.forEach(row => {
        selectElement.innerHTML += `<option value="${row.Ingredient}">${row.Ingredient}</option>`
    })
}

function fillEffectSelectBtn(data, selectElement) {
    selectElement.innerHTML = `
        <option value="-" selected>--- Select Effect ---</option>
    `
    let effects = new Set
    data.forEach(row => {
        effects.add(row.EffectOne)
        effects.add(row.EffectTwo)
        effects.add(row.EffectThree)
    })
    const effectsArray = [...effects]
    effectsArray.sort().forEach(effect => selectElement.innerHTML += `<option value="${effect}">${effect}</option>`)
}


// Display Ingredient Data
function displayIngredientData(data, input) {
    const selectId = input.id;
    switch (selectId) {
        case 'selectIngredientBtn':
            var row = findEffect(data, input.value)
            break;
        case 'selectEffectBtn':
            break
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

// Display Effect Data
function displayEffectData(data, input) {
    output.innerHTML = '';

    div = document.createElement("div")
    div.id = "input"
    div.innerHTML = `<h2>${input.value}</h2>`;
    output.appendChild(div)

    innerdiv = document.createElement("div")
    innerdiv.id = "effect-output"
    const ingredientList = findIngredients(data, input.value)
    ingredientList.forEach(ing => {
        innerdiv.innerHTML += `<p>${ing}</p>`
    });
    div.appendChild(innerdiv)
}

// Find Effects for given Ingredient
function findEffect(data, selectElement) {
    return data.find(row => row.Ingredient.toLowerCase() === selectElement.toLowerCase());
}

// Find Ingredients for given Effect
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




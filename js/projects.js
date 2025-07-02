
// dark mode
const body = document.body
const darkModeBtn = document.getElementById("switch-btn")
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    const isDarkMode = body.classList.contains("dark")
    if (isDarkMode) {
        body.classList.remove('dark')
        toggleBtn.classList.remove('dark')
    } else {
        body.classList.add('dark')
        toggleBtn.classList.add('dark')
    }
})

// Skyrim Alchemy Scrapper Functionalities
const output = document.querySelector('.output');
const btns = document.querySelectorAll("button");
const ingredientBtn = document.getElementById("ingredientBtn");
const effectBtn = document.getElementById("effectBtn");
const createPotionBtn = document.getElementById("createPotionBtn");
const selectIngredientBtn = document.getElementById("selectIngredientBtn");
const outputSection = document.getElementById("output-section");

document.addEventListener('DOMContentLoaded', function() {
    d3.csv("./data.csv")
    .then(function(data) {
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                handleBtn(data, btn)
            })
        })
    })
    .catch(function(error) {
        console.error('Error loading the CSV file:', error);
    });
});

function handleBtn(data, btn) {
    while (outputSection.children.length > 1) {
        outputSection.removeChild(outputSection.firstChild);
    }

    var selectElement = document.createElement("select")
    selectElement.classList.add("selectBtn")
    outputSection.insertBefore(selectElement, outputSection.firstChild);

    if (btn.id == "ingredientBtn") {
        findEffectsForGivenIngredient(selectElement, data)

    } else if (btn.id == "effectBtn") {
        findIngredientsForGivenEffect(selectElement, data)

    } else if (btn.id == "createPotionBtn") {
        createPotion(selectElement, data)
    }
}

// Choose Ingredient
function findEffectsForGivenIngredient(selectElement, data) {
    selectElement.id = "selectIngredientBtn"
    fillIngredientSelectBtn(data, selectElement)
    effectBtn.disabled = !effectBtn.disabled;
    createPotionBtn.disabled = !createPotionBtn.disabled;
    ingredientBtn.classList.toggle("pressed")
    outputSection.classList.toggle("hidden")
    
    selectElement.value = "-"
    output.innerHTML = '';
    selectElement.addEventListener("change", () => {
        displayIngredientData(data, selectElement)
    })
}

// Fill-in options for select btn
function fillIngredientSelectBtn(data, selectElement) {
    selectElement.innerHTML = `
        <option value="-" selected>--- Select Ingredient ---</option>
    `
    data.forEach(row => {
        selectElement.innerHTML += `<option value="${row.Ingredient}">${row.Ingredient}</option>`
    })
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
            div.classList.add("input")
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

// Choose Effect
function findIngredientsForGivenEffect(selectElement, data) {
    selectElement.id = "selectEffectBtn"
    fillEffectSelectBtn(data, selectElement)
    ingredientBtn.disabled = !ingredientBtn.disabled;
    createPotionBtn.disabled = !createPotionBtn.disabled;
    effectBtn.classList.toggle("pressed")
    outputSection.classList.toggle("hidden")

    selectElement.value = "-"
    output.innerHTML = '';
    selectElement.addEventListener("change", () => {
        displayEffectData(data, selectElement)
    })
}

// Fill options of select button
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

// Display Effect Data
function displayEffectData(data, input, btn=null) {
    if (btn == null) {
        output.innerHTML = '';


        div = document.createElement("div")
        div.classList.add("input")
        div.innerHTML = `<h2>${input.value}</h2>`;
        output.appendChild(div)

        const ingredientList = findIngredients(data, input.value)
        ingredientList.sort()
        ingredientList.forEach(ing => {
            div.innerHTML += `<p>${ing}</p>`
        });
        output.appendChild(div)

    } else if (btn == "add-effect") {
        // Create Potion
        if (output.children.length == 3) {
            const alertModal = document.getElementById("alert-modal")
            alertModal.innerHTML = `
                <h3>Too many Effects!</h3>
                <p>The max number of effects per potion is 3.</p>
            `
            alertModal.classList.add("show")
            setTimeout(() => {
                alertModal.classList.remove("show")
            }, 2000)
        } else {
            div = document.createElement("div")
            div.classList.add("input")
            div.classList.add("potion")
            let newId = input.value.toLowerCase().replace(/\s+/g, "-")
            // div.id = newId;
            div.innerHTML = `<h2>${input.value}</h2>`;
            output.appendChild(div)

            // close btn
            createCloseBtn(div, newId)

            // append the ingredients
            const ingredientList = findIngredients(data, input.value)
            ingredientList.sort()
            ingredientList.forEach(ing => {
                div.innerHTML += `<p>${ing}</p>`
            });
            output.appendChild(div)
        }
    }
}

// Small Close button on each selected effect for potion
function createCloseBtn(div, effect) {
    const closeBtn = document.createElement("span")
    closeBtn.classList.add("small-close-btn")
    closeBtn.id = effect
    closeBtn.innerHTML = "&#10006;";
    div.appendChild(closeBtn)
}

// Create Potion
function createPotion(selectElement, data) {

    selectElement.id = "selectEffectBtn"
    fillEffectSelectBtn(data, selectElement)

    var addEffect = document.createElement("button")
    addEffect.classList.add("button")
    addEffect.innerText = "Add Effect"
    addEffect.id = "add-effect"
    outputSection.insertBefore(addEffect, outputSection.children[1]);

    ingredientBtn.disabled = !ingredientBtn.disabled;
    effectBtn.disabled = !effectBtn.disabled;
    createPotionBtn.classList.toggle("pressed")
    outputSection.classList.toggle("hidden")

    selectElement.value = "-"
    output.innerHTML = '';

    addEffect.addEventListener("click", (e) => {
        if (selectElement.value == "-") {
            const alertModal = document.getElementById("alert-modal")
            alertModal.innerHTML = `
                <h3>Choose an Effect!<h3>
                <p>Needs to have at least 1 effect.<p>
            `
            alertModal.classList.add("show")
            setTimeout(() => {
                alertModal.classList.remove("show")
                alertModal.innerHTML = ""
            }, 2000)
        } else {
            displayEffectData(data, selectElement, e.target.id)
            
            let newId = selectElement.value.toLowerCase().replace(/\s+/g, "-")
            document.getElementById(newId).addEventListener("click", (e) => {
                e.target.parentNode.remove()

                // Recalculate common ingredients
                removeHighlight(data, commonIngredients)
            })
            
            if (output.children.length > 1) {
                var commonIngredients = findCommonIng(data, output)
            }
            
            // Finding common ingredientes between selected effects
            findCommonIngredients(output, commonIngredients)
        }
    })
}

function removeHighlight(data, commonIngredients) {
    const output = document.querySelector(".output");
    for (let child of output.children) {
        for (let p in child.children) {
            let ingredient = child.children[p];
            if (p < 2 || !ingredient.innerText) { continue}
            ingredient.classList.remove("common-ingredient-tag");
        }
    }

    if (output.children.length > 1) {
        commonIngredients = findCommonIng(data, output);
        findCommonIngredients(output, commonIngredients);
    }
}

function findCommonIngredients(output, commonIngredients) {
    for (let child of output.children) {
        for (let p in child.children) {
            let ingredient = child.children[p]
            if (p < 2 || !ingredient.innerText) {continue}

            if (commonIngredients){
                if (commonIngredients.has(ingredient.innerText)) {
                    ingredient.classList.add("common-ingredient-tag")
                }
            }
        }
    }

    const potionDiv = document.querySelectorAll('.potion');
    for (let a of potionDiv) {
        let b = a.querySelectorAll("p")
        for (let p of b) {
            if (p.className == "") {
                p.parentNode.appendChild(p)
            }
        }
    }
    commonIngredients = []
}

function findCommonIng(data, output) {
    let allIngredients = [];
    for (let child of output.children) {
        let effect = child.children[0].innerText;
        let ingList = findIngredients(data, effect);
        allIngredients.push(ingList);
    }

    let commonIngredients = [];
    for (let i = 0; i < allIngredients.length; i++) {
        for (let j = i + 1; j < allIngredients.length; j++) {
            for (let a of allIngredients[i]) {
                for (let b of allIngredients[j]) {
                    if (a === b) {
                        commonIngredients.push(a);
                    }
                }
            }
        }
    }
    return new Set(commonIngredients);
}

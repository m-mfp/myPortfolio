
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

var commonIngredients = {}

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
    } else if (btn.id == "effectBtn") {
        selectElement.id = "selectEffectBtn"
        fillEffectSelectBtn(data, selectElement)
        ingredientBtn.disabled = !ingredientBtn.disabled;
        createPotionBtn.disabled = !createPotionBtn.disabled;
        effectBtn.classList.toggle("pressed")
        outputSection.classList.toggle("hidden")

        selectElement.value = "-"
        output.innerHTML = '';
        selectElement.addEventListener("change", () => {
            displayEffectData(data, selectElement, null)
        })
    } else if (btn.id == "createPotionBtn") {
        selectElement.id = "selectEffectBtn"
        fillEffectSelectBtn(data, selectElement)

        var addElement = document.createElement("button")
        addElement.classList.add("button")
        addElement.innerText = "Add Effect"
        addElement.id = "add-effect"
        outputSection.insertBefore(addElement, outputSection.children[1]);

        ingredientBtn.disabled = !ingredientBtn.disabled;
        effectBtn.disabled = !effectBtn.disabled;
        createPotionBtn.classList.toggle("pressed")
        outputSection.classList.toggle("hidden")

        selectElement.value = "-"
        output.innerHTML = '';

        addElement.addEventListener("click", (e) => {
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
            }
        })
}}

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

// Display Effect Data
function displayEffectData(data, input, btn=null) {
    if (btn == null) {
        output.innerHTML = '';


        div = document.createElement("div")
        div.classList.add("input")
        div.id = input.value.toLowerCase().replace(/\s+/g, "-");
        div.innerHTML = `<h2>${input.value}</h2>`;
        output.appendChild(div)

        const ingredientList = findIngredients(data, input.value)
        ingredientList.forEach(ing => {
            div.innerHTML += `<p>${ing}</p>`
        });
        output.appendChild(div)

    } else if (btn == "add-effect") {
        // CREATE POTION
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
            div.id = input.value.toLowerCase().replace(/\s+/g, "-");
            div.innerHTML = `<h2>${input.value}</h2>`;
            output.appendChild(div)

            // close btn
            const closeBtn = document.createElement("span")
            closeBtn.classList.add("small-close-btn")
            closeBtn.innerHTML = "&#10006;";
            div.appendChild(closeBtn)


            // append the ingredients
            const ingredientList = findIngredients(data, input.value)
            ingredientList.forEach(ing => {
                div.innerHTML += `<p>${ing}</p>`
            });
            output.appendChild(div)


        }
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




// function findCommonIngredients(input, ingredientList, div) {
//     commonIngredients[input] = ingredientList;

//     var result = []

//     if (div.children.length == 1) {
//         return null;
//     } else {
//         const commonValues = [];
//         const keys = Object.keys(commonIngredients);

//         for (let i = 0; i < keys.length; i++) {
//             for (let j = i + 1; j < keys.length; j++) {
//                 const firstList = commonIngredients[keys[i]];
//                 const secondList = commonIngredients[keys[j]];
//                 const commonSet = new Set(firstList);
//                 const commonInBoth = secondList.filter(item => commonSet.has(item));

//                 if (commonInBoth.length > 0) {
//                     commonValues.push({
//                         keys: [keys[i], keys[j]],
//                         common: commonInBoth
//                     });
//                 }

//                 if (keys.length === 3) {
//                     for (let k = j + 1; k < keys.length; k++) {
//                         const thirdList = commonIngredients[keys[k]];
//                         const commonInThree = commonInBoth.filter(item => thirdList.includes(item));

//                         if (commonInThree.length > 0) {
//                             commonValues.push({
//                                 keys: [keys[i], keys[j], keys[k]],
//                                 common: commonInThree
//                             });
//                         }
//                     }
//                 }
//             }
//         }
        
//         commonValues.forEach(({ _, common }) => {
//             result.push(...common)
//         });
//     }
//     return new Set(result)
// }





// function getCommonIngredients(ingredientList, output) {

//     commonIngredients

//     for (let child of output.children) {
//         const effect = child.firstChild.innerText
//         console.log("Effect:", effect)
//         for (let el in child.children) {
//             const ing = child.children[el].innerText
//             if (ing) {
//                 if (ingredientList.includes(ing)) {
//                     console.log("ingredientList contains:", ing)
//                 }
                
//             }
            
//         }
//     }
// }



/* 
<div class="input" id="cure-disease">
    <h2>Cure Disease</h2>
    <span class="small-close-btn"></span>
    <p>Charred Skeever Hide</p>
    <p>Hawk Feathers</p>
    <p>Mudcrab Chitin</p>
    <p>Vampire Dust</p>
    <p>Felsaad Tern Feathers</p>
    <p>Chokeweed</p>
    <p>Hunger Tongue</p>
    <p>Juvenile Mudcrab</p>
    <p>Red Kelp Gas Bladder</p>
    <p>Scrib Jelly</p>
    <p>Spadefish</p>
    <p>Withering Moon</p>
</div>
<div class="input" id="damage-health">
    <h2>Damage Health</h2>
    <span id="small-close-btn"></span>
</div> */
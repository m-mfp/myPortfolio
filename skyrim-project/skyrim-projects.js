// Dark Mode
const toggleBtn = document.querySelectorAll("#darkModeToggle");
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  toggleBtn.forEach((btn) => {
    if (document.body.classList.contains("dark-mode")) {
      btn.textContent = "☀️";
    } else {
      btn.textContent = "🌙";
    }
  });
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
}
toggleBtn.forEach((btn) => {
  btn.addEventListener("click", toggleDarkMode);
});
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleBtn.forEach((btn) => (btn.textContent = "☀️"));
  } else {
    toggleBtn.forEach((btn) => (btn.textContent = "🌙"));
  }
});

// Skyrim Alchemy Scrapper Functionalities
const output = document.querySelector(".output");
const btns = document.querySelectorAll("button");
const ingredientBtn = document.getElementById("ingredientBtn");
const effectBtn = document.getElementById("effectBtn");
const createPotionBtn = document.getElementById("createPotionBtn");
const outputSection = document.getElementById("output-section");

document.addEventListener("DOMContentLoaded", function () {
  d3.csv("../db/data.csv")
    .then(function (data) {
      btns.forEach((btn) => {
        if (btn.id != "darkModeToggle") {
          btn.addEventListener("click", () => {
            handleBtn(data, btn);
          });
        }
      });
    })
    .catch(function (error) {
      console.error("Error loading the CSV file:", error);
    });
});

function handleBtn(data, btn) {
  while (outputSection.children.length > 1) {
    outputSection.removeChild(outputSection.firstChild);
  }
  var selectElement = document.createElement("select");
  selectElement.classList.add("selectBtn");
  outputSection.insertBefore(selectElement, outputSection.firstChild);
  if (btn.id == "ingredientBtn") {
    findEffectsForGivenIngredient(selectElement, data);
  } else if (btn.id == "effectBtn") {
    findIngredientsForGivenEffect(selectElement, data);
  } else if (btn.id == "createPotionBtn") {
    createPotion(selectElement, data);
  }
}

// Choose Ingredient
function findEffectsForGivenIngredient(selectElement, data) {
  selectElement.id = "selectIngredientBtn";
  fillIngredientSelectBtn(data, selectElement);
  effectBtn.disabled = !effectBtn.disabled;
  createPotionBtn.disabled = !createPotionBtn.disabled;
  ingredientBtn.classList.toggle("pressed");
  outputSection.classList.toggle("hidden");
  selectElement.value = "-";
  output.innerHTML = "";
  selectElement.addEventListener("change", () => {
    displayIngredientData(data, selectElement);
  });
}

// Fill-in options for select btn
function fillIngredientSelectBtn(data, selectElement) {
  selectElement.innerHTML = `<option value="-" selected>--- Select Ingredient ---</option>`;
  data.forEach((row) => {
    selectElement.innerHTML += `<option value="${row.Ingredient}">${row.Ingredient}</option>`;
  });
}

// Display Ingredient Data
function displayIngredientData(data, input) {
  if (input.id !== "selectIngredientBtn") return;
  const selectedRow = findEffect(data, input.value);
  if (!selectedRow) return;
  output.innerHTML = "";
  const selectedEffects = Object.values(selectedRow).slice(1).filter(Boolean);
  selectedEffects.forEach(effect => {
    const div = document.createElement("div");
    div.classList.add("input");
    div.innerHTML = `<h2>${effect}</h2><div></div>`;
    output.appendChild(div);
    const innerdiv = div.querySelector("div");
    findIngredients(data, effect).forEach(ing => {
      innerdiv.innerHTML += `<p>${ing}</p>`;
    });
  });

  // Find and highlight with unique colors
  const matches = [];
  data.forEach(row => {
    if (row.Ingredient === selectedRow.Ingredient) return;
    const shared = selectedEffects.filter(eff => Object.values(row).slice(1).includes(eff));
    if (shared.length >= 2) {
      matches.push(row.Ingredient);
    }
  });
  applyUniqueHighlights(matches);
}

// Find Effects for given Ingredient
function findEffect(data, selectElement) {
  return data.find(
    (row) => row.Ingredient.toLowerCase() === selectElement.toLowerCase()
  );
}

// Find Ingredients for given Effect
function findIngredients(data, effect) {
  let ingredientList = [];
  const headers = ["EffectOne", "EffectTwo", "EffectThree", "EffectFour"];
  data.forEach((row) => {
    headers.forEach((head) => {
      if (row[head] && row[head].toLowerCase() == effect.toLowerCase()) {
        ingredientList.push(row.Ingredient);
      }
    });
  });
  return ingredientList;
}

// Choose Effect
function findIngredientsForGivenEffect(selectElement, data) {
  selectElement.id = "selectEffectBtn";
  fillEffectSelectBtn(data, selectElement);
  ingredientBtn.disabled = !ingredientBtn.disabled;
  createPotionBtn.disabled = !createPotionBtn.disabled;
  effectBtn.classList.toggle("pressed");
  outputSection.classList.toggle("hidden");
  selectElement.value = "-";
  output.innerHTML = "";
  selectElement.addEventListener("change", () => {
    displayEffectData(data, selectElement);
  });
}

// Fill options of select button
function fillEffectSelectBtn(data, selectElement) {
  selectElement.innerHTML = `<option value="-" selected>--- Select Effect ---</option>`;
  let effects = new Set();
  data.forEach((row) => {
    effects.add(row.EffectOne);
    effects.add(row.EffectTwo);
    effects.add(row.EffectThree);
    effects.add(row.EffectFour);
  });
  [...effects].sort().forEach((effect) => {
    selectElement.innerHTML += `<option value="${effect}">${effect}</option>`;
  });
}

// Display Effect Data
function displayEffectData(data, input, btn = null) {
  if (btn == null) {
    output.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("input");
    div.innerHTML = `<h2>${input.value}</h2>`;
    output.appendChild(div);
    findIngredients(data, input.value).sort().forEach((ing) => {
      div.innerHTML += `<p>${ing}</p>`;
    });
  } else if (btn == "add-effect") {
    const div = document.createElement("div");
    div.classList.add("input", "potion");
    const newId = input.value.toLowerCase().replace(/\s+/g, "-");
    div.innerHTML = `<h2>${input.value}</h2>`;
    output.appendChild(div);
    createCloseBtn(div, newId);
    findIngredients(data, input.value).sort().forEach((ing) => {
      div.innerHTML += `<p>${ing}</p>`;
    });
  }
}

// Small Close button
function createCloseBtn(div, effect) {
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("small-close-btn", effect);
  closeBtn.innerHTML = "&#10006;";
  div.appendChild(closeBtn);
}

// Create Potion
function createPotion(selectElement, data) {
  selectElement.id = "selectEffectBtn";
  fillEffectSelectBtn(data, selectElement);
  const addEffect = document.createElement("button");
  addEffect.classList.add("button");
  addEffect.innerText = "Add Effect";
  addEffect.id = "add-effect";
  outputSection.insertBefore(addEffect, outputSection.children[1]);

  const ingredientsCounter = document.createElement("span");
  ingredientsCounter.id = "ingredients-counter";
  ingredientsCounter.innerText = "0 ingredients";
  outputSection.insertBefore(ingredientsCounter, outputSection.children[2]);

  ingredientBtn.disabled = !ingredientBtn.disabled;
  effectBtn.disabled = !effectBtn.disabled;
  createPotionBtn.classList.toggle("pressed");
  outputSection.classList.toggle("hidden");
  selectElement.value = "-";
  output.innerHTML = "";

  addEffect.addEventListener("click", () => {
    if (selectElement.value == "-") {
      const alertModal = document.getElementById("alert-modal");
      alertModal.innerHTML = `<h3>Choose an Effect!</h3><p>Needs to have an effect selected.</p>`;
      alertModal.classList.add("show");
      setTimeout(() => {
        alertModal.classList.remove("show");
        alertModal.innerHTML = "";
      }, 2000);
    } else {
      displayEffectData(data, selectElement, "add-effect");
      const newId = selectElement.value.toLowerCase().replace(/\s+/g, "-");
      document.querySelectorAll(`.${newId}`).forEach(btn => {
        btn.addEventListener("click", () => {
          btn.parentNode.remove();
          const common = findCommonIng(data, output);
          applyUniqueHighlights([...common]);
          updateCounter(common.size);
        });
      });
      const commonIngredients = findCommonIng(data, output);
      applyUniqueHighlights([...commonIngredients]);
      updateCounter(commonIngredients.size);
    }
  });
}

// NEW: Apply unique colored highlights
function applyUniqueHighlights(ingredientList) {
  // Clear old unique classes
  document.querySelectorAll("[class^='common-ingredient-']").forEach(el => {
    el.className = el.className.replace(/common-ingredient-\d+/g, '').trim();
  });
  if (ingredientList.length === 0) {
    updateCounter(0);
    return;
  }
  const sorted = [...ingredientList].sort();
  sorted.forEach((ing, index) => {
    const colorClass = `common-ingredient-${(index % 8) + 1}`;
    document.querySelectorAll(".output p").forEach(p => {
      if (p.textContent.trim() === ing) {
        p.classList.add(colorClass);
      }
    });
  });
  updateCounter(sorted.length);
}

// NEW: Update counter
function updateCounter(count) {
  const counter = document.getElementById("ingredients-counter");
  if (!counter) return;
  counter.innerText = `${count} ingredients`;
  if (count > 3) {
    counter.style.textShadow = "1px 0 8px var(--color-primary-light)";
  } else if (count > 0) {
    counter.style.textShadow = "1px 0 8px green";
  } else {
    counter.style.textShadow = "none";
  }
}

// Keep only this (old functions removed)
function findCommonIng(data, output) {
  let allIngredients = [];
  for (let child of output.children) {
    if (!child.querySelector("h2")) continue;
    let effect = child.querySelector("h2").innerText;
    let ingList = findIngredients(data, effect);
    allIngredients.push(ingList);
  }
  let common = [];
  for (let i = 0; i < allIngredients.length; i++) {
    for (let j = i + 1; j < allIngredients.length; j++) {
      for (let a of allIngredients[i]) {
        if (allIngredients[j].includes(a)) {
          common.push(a);
        }
      }
    }
  }
  return new Set(common);
}
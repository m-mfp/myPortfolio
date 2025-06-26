



const ingredient = document.getElementById("ingredient")

document.addEventListener('DOMContentLoaded', function() {
    fetch('../data.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    ingredient.addEventListener("change", () => {
                        displayData(results.data, ingredient.value)
                    })
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
});


function displayData(data, selectedIngredient) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    data.forEach(row => {
        if (row.Ingredient.toLowerCase() == selectedIngredient.toLowerCase()) {
            output.innerHTML = `
                <h3>${row.Ingredient}</h3>
                <p>${row.EffectOne}</p>
                <p>${row.EffectTwo}</p>
                <p>${row.EffectThree}</p>
                <p>${row.EffectFour}</p>
            `;
        }
    });
}

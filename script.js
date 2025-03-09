// Initialize nutrition values
let nutritionValues = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Find our container to scope all operations
    const container = document.querySelector('.shake-builder-container');
    if (!container) return;
    
    // Set up event listeners
    setupCalculator(container);
    
    // Ensure sticky header works by forcing it to recalculate its position
    forceRepaint(container.querySelector('.sticky-nutrition-header'));
});

// Helper function to force a repaint on an element
function forceRepaint(element) {
    if (!element) return;
    element.style.display = 'none';
    void element.offsetHeight; // Trigger reflow
    element.style.display = 'block';
}

function setupCalculator(container) {
    // Size options
    container.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            selectSize(container, this);
        });
    });
    
    // Radio options
    container.querySelectorAll('.option-item[data-type="radio"]').forEach(option => {
        option.addEventListener('click', function() {
            selectRadioOption(container, this);
        });
    });
    
    // Checkbox options
    container.querySelectorAll('.option-item[data-type="checkbox"]').forEach(option => {
        option.addEventListener('click', function() {
            toggleCheckboxOption(container, this);
        });
    });
    
    // Prevent input events from bubbling to avoid double-toggling
    container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

function selectSize(container, element) {
    // Deselect all size options
    container.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select the clicked option
    element.classList.add('selected');
    
    // Update nutrition
    calculateNutrition(container);
}

function selectRadioOption(container, element) {
    const group = element.getAttribute('data-group');
    
    // Deselect all options in the same group
    container.querySelectorAll(`.option-item[data-type="radio"][data-group="${group}"]`).forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });
    
    // Select the clicked option
    element.classList.add('selected');
    const radioInput = element.querySelector('input[type="radio"]');
    if (radioInput) radioInput.checked = true;
    
    // Update nutrition
    calculateNutrition(container);
}

function toggleCheckboxOption(container, element) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    
    // Toggle checkbox and selection state
    checkbox.checked = !checkbox.checked;
    element.classList.toggle('selected', checkbox.checked);
    
    // Update nutrition
    calculateNutrition(container);
}

function calculateNutrition(container) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Get size multiplier
    const selectedSize = container.querySelector('.size-option.selected');
    let sizeMultiplier = 1; // Default to medium
    
    if (selectedSize) {
        if (selectedSize.textContent.includes('Small')) sizeMultiplier = 0.75;
        if (selectedSize.textContent.includes('Large')) sizeMultiplier = 1.25;
    }
    
    // Calculate from selected radio options
    container.querySelectorAll('.option-item.selected[data-type="radio"]').forEach(option => {
        const nutritionDiv = option.querySelector('.option-nutrition');
        if (nutritionDiv) {
            totalCalories += parseInt(nutritionDiv.children[0].textContent.split(': ')[1]) || 0;
            totalProtein += parseFloat(nutritionDiv.children[1].textContent.split(': ')[1]) || 0;
            totalCarbs += parseFloat(nutritionDiv.children[2].textContent.split(': ')[1]) || 0;
            totalFat += parseFloat(nutritionDiv.children[3].textContent.split(': ')[1]) || 0;
        }
    });
    
    // Calculate from selected checkbox options
    container.querySelectorAll('.option-item.selected[data-type="checkbox"]').forEach(option => {
        const nutritionDiv = option.querySelector('.option-nutrition');
        if (nutritionDiv) {
            totalCalories += parseInt(nutritionDiv.children[0].textContent.split(': ')[1]) || 0;
            totalProtein += parseFloat(nutritionDiv.children[1].textContent.split(': ')[1]) || 0;
            totalCarbs += parseFloat(nutritionDiv.children[2].textContent.split(': ')[1]) || 0;
            totalFat += parseFloat(nutritionDiv.children[3].textContent.split(': ')[1]) || 0;
        }
    });
    
    // Apply size multiplier
    totalCalories = Math.round(totalCalories * sizeMultiplier);
    totalProtein = Math.round(totalProtein * sizeMultiplier * 10) / 10;
    totalCarbs = Math.round(totalCarbs * sizeMultiplier * 10) / 10;
    totalFat = Math.round(totalFat * sizeMultiplier * 10) / 10;
    
    // Store values
    nutritionValues = {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
    };
    
    // Update display
    updateNutritionDisplay(container);
}

function updateNutritionDisplay(container) {
    // Update nutrition values in the display
    const caloriesEl = container.querySelector('#total-calories');
    const proteinEl = container.querySelector('#total-protein');
    const carbsEl = container.querySelector('#total-carbs');
    const fatEl = container.querySelector('#total-fat');
    
    if (caloriesEl) caloriesEl.textContent = nutritionValues.calories;
    if (proteinEl) proteinEl.textContent = nutritionValues.protein + 'g';
    if (carbsEl) carbsEl.textContent = nutritionValues.carbs + 'g';
    if (fatEl) fatEl.textContent = nutritionValues.fat + 'g';
}
/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

const addIngredientInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientInput = document.getElementById("delete-ingredient-name-input");

const ingredientListContainer = document.getElementById("ingredient-list");

const addIngredientBtn = document.getElementById("add-ingredient-submit-button");
const deleteIngredientBtn = document.getElementById("delete-ingredient-submit-button");

const searchInput = document.getElementById("search-input");
const adminLink = document.getElementById("back-link");

const getAuth = () => sessionStorage.getItem("auth-token") || "";
const isAdmin = () => sessionStorage.getItem("is-admin") === "true";
const ingredientHeaders = () => {
    const head = { "Content-Type": "application/json" }
    const token = getAuth();
    if (token) head.Authorization = `Bearer ${token}`;
    return head;
}

/* TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
if (addIngredientInput) addIngredientBtn.addEventListener("click", addIngredient);
if (deleteIngredientInput) deleteIngredientBtn.addEventListener("click", deleteIngredient);
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients().catch(console.error);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    const name = addIngredientInput.value.trim();
    if (!name) {
        alert("Invalid name");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: ingredientHeaders(),
            body: JSON.stringify(body)
        });
        if (response.status === 201 || response.ok) {
            addIngredientInput.value = "";
            await getIngredients();
            alert("Ingredient added");
        } else {
            const msg = await response.text().catch(() => "");
            alert(msg || "Failed to add ingredients");
        }
    } catch (err) {
        console.error("Add ingredient error:", err);
        alert("Add ingredient failed");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            headers: ingredientHeaders(),
        });
        if (response.status === 201 || response.ok) {
            const data = await response.text().catch(() => "");
            ingredients = data;
            refreshIngredientList();
        } else {
            const msg = await response.text().catch(() => "");
            alert(msg || "Failed to get ingredients");
            return;
        }
    } catch (err) {
        console.error("Get ingredient error:", err);
        alert("Get ingredient failed");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const name = deleteIngredientInput.value.trim();
    if (!name) {
        alert("Invalid name");
        return;
    }
    try {
        if (!ingredientListContainer.length) await getIngredients();
        const match = ingredients.find(r => String(r.name).toLowerCase() === name.toLowerCase());
        if (!match) {
            alert("Could not find a match for the ingredient");
            return;
        }

        const url = `${BASE_URL}/ingredients/${encodeURIComponent(match.id)}`;
        const response = await fetch(url, {
            method: "DELETE",
            header: ingredientHeaders(),
        });
        if (response.ok) {
            deleteIngredientInput.value = "";
            await getIngredients();
            alert("Ingredient deleted");
        } else {
            const msg = await response.text().catch(() => "");
            alert(msg || "Failed to delete ingredient");
        }
    } catch (err) {
        console.error("Delte error:", err);
        alert("Delete failed");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r.name;
        ingredientListContainer.appendChild(li);
    });
}

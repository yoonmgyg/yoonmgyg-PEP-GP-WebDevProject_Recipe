/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const recipeList = document.getElementById("recipe-list");

    const addNameInput = document.getElementById("add-recipe-name-input");
    const addInstrInput = document.getElementById("add-recipe-instructions-input");
    const addSubmitBtn = document.getElementById("add-recipe-submit-input");

    const updateNameInput = document.getElementById("update-recipe-name-input");
    const updateInstrInput = document.getElementById("update-recipe-instructions-input");
    const updateSubmitBtn = document.getElementById("update-recipe-submit-input");

    const deleteNameInput = document.getElementById("delete-recipe-name-input");
    const deleteSubmitBtn = document.getElementById("delete-recipe-submit-input");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    const getAuth = () => sessionStorage.getItem("auth-token") || "";
    const isAdmin = () => sessionStorage.getItem("is-admin") === "true";
    const recipeHeaders = () => {
        const head = { "Content-Type": "application/json" }
        const token = getAuth();
        if (token) head.Authorization = `Bearer ${token}`;
        return head;
    }
    if (getAuth() && logoutButton) {
        logoutButton.style.display = "inline-block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (isAdmin() && adminLink) {
        adminLink.style.display= "inline";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    if (addSubmitBtn) addSubmitBtn.addEventListener("click", addRecipe);
    if (updateSubmitBtn) updateSubmitBtn.addEventListener("click", updateRecipe);
    if (deleteSubmitBtn) deleteSubmitBtn.addEventListener("click", deleteRecipe);
    if (searchButton) searchButton.addEventListener("click", searchRecipes);
    if (logoutButton) logoutButton.addEventListener("click", processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */

    getRecipes().catch(console.error);


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and notify user
     */
    async function searchRecipes() {
        // Implement search logic here
       const searchTerm = searchInput.value.trim();
       try {
        const params = new URLSearchParams({ name: searchTerm });
        const url = `${BASE_URL}/recipes?${params.toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: recipeHeaders()
        });

        if (!response.ok) {
            const msg = await response.text().catch(() => "");
            notify(msg || "Search response was not successful");
            return;
        }
        const data = await response.json().catch(() => []);
        recipes = data;
        refreshRecipeList();
       } catch (err) {
        console.error("Search error:", err);
        notify("Search failed");
       }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addNameInput.value.trim();
        const instructions = addInstrInput.value.trim();
        if (!name || !instructions) {
            notify("Invalid name and instructions");
            return;
        }

        const body = { name, instructions };
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: recipeHeaders(),
                body: JSON.stringify(body)
            });

            if (response.status === 201 || response.ok) {
                addNameInput.value = "";
                addInstrInput.value = "";
                await getRecipes();
                notify("Recipe added");
            } else {
                const msg = await response.text().catch(() => "");
                notify(msg || "Failed to add recipe");
            } 
        } catch (err) {
            console.error("Add recipe error:", err);
            notify("Add recipe failed");
        }

    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateNameInput.value.trim();
        const instructions = updateInstrInput.value.trim();
        if (!name || !instructions) {
            notify("Invalid name and instructions");
            return;
        }

        const body = { name, instructions };
        try {
            if (!recipes.length) await getRecipes();
            const match = recipes.find(r => String(r.name).toLowerCase() === name.toLowerCase());
            if (!match) {
                notify("Could not find a match for the recipe");
                return;
            }

            const url = `${BASE_URL}/recipes/${encodeURIComponent(match.id)}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: recipeHeaders(),
                body: JSON.stringify({ instructions: instructions })
            });

            if (response.ok) {
                updateNameInput.value = "";
                updateInstrInput.value = "";
                await getRecipes();
                notify("Recipe updated");
            } else {
                const msg = await response.text().catch(() => "");
                notify(msg || "Failed to update recipe");
            }
        } catch (err) {
            console.error("Update error:", err);
            notify("Update failed");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {        
        const name =  deleteNameInput.value.trim();
        if (!name) {
            notify("Invalid name");
            return;
        }
        try {
            if (!recipes.length) await getRecipes();
            const match = recipes.find(r => String(r.name).toLowerCase() === name.toLowerCase());
            if (!match) {
                notify("Could not find a match for the recipe");
                return;
            }

            const url = `${BASE_URL}/recipes/${encodeURIComponent(match.id)}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: recipeHeaders(),
            });

            if (response.ok) {
                deleteNameInput.value = "";
                await getRecipes();
                notify("Recipe deleted");
            } else {
                const msg = await response.text().catch(() => "");
                notify(msg || "Failed to delete recipe");
            }
        } catch (err) {
            console.error("Delete error:", err);
            notify("Delete failed");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
       try {
        const url = `${BASE_URL}/recipes`;
        const response = await fetch(url, {
            method: "GET",
            headers: recipeHeaders()
        });

        if (!response.ok) {
            const msg = await response.text().catch(() => "");
            notify(msg || "Failed to get recipes");
            return;
        }
        const data = await response.json().catch(() => []);
        recipes = data;
        refreshRecipeList();
       } catch (err) {
        console.error("Get error:", err);
        notify("Get failed");
       }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        recipes.forEach(r => {
            const li = document.createElement("li");
            const name = r.name;
            const instructions = r.instructions;
            li.textContent = `${name}: ${instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: notify the user
     */
    async function processLogout() {
       try {
        const url = `${BASE_URL}/logout`;
        const response = await fetch(url, {
            method: "POST",
            headers: recipeHeaders()
        });

        if (!response.ok) {
            const msg = await response.text().catch(() => "");
            notify(msg || "Failed to logout");
            return;
        }
       } catch (err) {
        console.error("Logout error:", err);
        notify("Logout failed");
       } finally {
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("is-admin");
        window.location.href = "../login/login-page.html";
       }
    }

});

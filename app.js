const input = document.querySelector(".input");
const button = document.querySelector(".button");
const container = document.getElementById("recipes-container");
const recipieDetails = document.getElementById("recipe-popup");
const recipieContent = recipieDetails.querySelector(".recipie-content");
const closeBtn = document.getElementById("close-popup");

let currentMeals = [];
let currentPage = 1;
const recipesPerPage = 6;

function renderPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    const mealsToShow = currentMeals.slice(start, end);

    mealsToShow.forEach((meal) => {
        const recipie = document.createElement("div");
        recipie.classList.add("recipie");
        recipie.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h2>${meal.strMeal}</h2>
            <p>${meal.strArea} dish</p>
            <p>${meal.strCategory}</p>
        `;
        const btn = document.createElement("button");
        btn.textContent = "View Recipe";
        recipie.appendChild(btn);

        btn.addEventListener("click", () => {
            openpopup(meal);
        });

        container.appendChild(recipie);
    });

    renderPagination();
}

function renderPagination() {
    const oldPagination = document.getElementById("pagination");
    if (oldPagination) oldPagination.remove();

    if (currentMeals.length <= recipesPerPage) return;

    const pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.style.textAlign = "center";
    pagination.style.margin = "20px 0";

    const totalPages = Math.ceil(currentMeals.length / recipesPerPage);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.style.margin = "0 5px";
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.style.margin = "0 3px";
        pageBtn.disabled = i === currentPage;
        if(i === currentPage) {
            pageBtn.style.fontWeight = "bold";
            pageBtn.style.backgroundColor = "#d32f2f";
            pageBtn.style.color = "#fff8e1";
            pageBtn.style.border = "none";
            pageBtn.style.borderRadius = "4px";
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        pagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.style.margin = "0 5px";
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    pagination.appendChild(nextBtn);

    container.after(pagination);
}

const fetchrecipie = async (inp) => {
    try {
        const data = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${inp}`
        );
        const resp = await data.json();

        if (!resp.meals) {
            container.innerHTML = `<h2 style="text-align:center;">No results found for "${inp}".</h2>`;
            const oldPagination = document.getElementById("pagination");
            if (oldPagination) oldPagination.remove();
            return;
        }

        currentMeals = resp.meals;
        currentPage = 1;
        renderPage(currentPage);
    } catch (err) {
        container.innerHTML = "<h2 style='text-align:center;'>Error fetching data. Try again.</h2>";
        const oldPagination = document.getElementById("pagination");
        if (oldPagination) oldPagination.remove();
    }
};

const showIngr = (meal) => {
    let inglist = "";
    for (let i = 1; i <= 20; i++) {
        const ingr = meal[`strIngredient${i}`];
        if (ingr && ingr.trim() !== "") {
            const measure = meal[`strMeasure${i}`] || "";
            inglist += `<li>${measure} ${ingr}</li>`;
        } else break;
    }
    return inglist;
};

const openpopup = (meal) => {
    recipieContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>${showIngr(meal)}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <p><a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
    `;
    recipieDetails.style.display = "block";
};

closeBtn.addEventListener("click", () => {
    recipieDetails.style.display = "none";
});

const form = document.getElementById("search-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
        container.innerHTML = `<h2 style="text-align:center;">Please type a meal in search bar.</h2>`;
        const oldPagination = document.getElementById("pagination");
        if (oldPagination) oldPagination.remove();
        return;
    }
    fetchrecipie(text);
});

window.addEventListener("DOMContentLoaded", async () => {
    const keyword = "chicken";

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`);
        const resp = await data.json();

        if (!resp.meals) {
            container.innerHTML = `<h2 style="text-align:center;">No featured recipes found.</h2>`;
            return;
        }

        currentMeals = resp.meals.slice(0, 3);
        currentPage = 1;
        renderPage(currentPage);
    } catch (err) {
        container.innerHTML = "<h2 style='text-align:center;'>Error loading featured recipes.</h2>";
    }
});

const contactForm = document.getElementById("contact-form");
const contactMessage = document.getElementById("contact-message");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactMessage.textContent = "Our team will verify your recipe. Thanks!";
    contactForm.reset();
});

window.addEventListener("click", (e) => {
    if (e.target === recipieDetails) {
        recipieDetails.style.display = "none";
    }
});

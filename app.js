const input = document.querySelector(".input");
const button = document.querySelector(".button");
const container = document.querySelector(".container");
const recipieDetails = document.querySelector(".recipie-details");
const recipieContent = document.querySelector(".recipie-content");
const closeBtn = document.querySelector(".close-btn");
const fetchrecipie = async (inp) => {
    container.innerHTML="<h2>Please Wait.....</h2>";
    try{
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inp}`);
        const resp = await data.json();
        container.innerHTML="";
        resp.meals.forEach(meal => {
            const recipie = document.createElement('div');
            recipie.classList.add('recipie');
            recipie.innerHTML = `<img src="${meal.strMealThumb}">
            <h2>${meal.strMeal}</h2>
            <p>${meal.strArea} dish</p>
            <p>${meal.strCategory}</p>
            `;
            const button=document.createElement('button');
            button.innerHTML="View Recipie";
            recipie.appendChild(button);
            button.addEventListener('click',()=>{
                openpopup(meal);
            })
            container.appendChild(recipie);
        });
    }
    catch(err){
        container.innerHTML="<h2>Please Check the spelling....</h2>";
    }
}

const showIngr=(meal)=>{
    let inglist="";
    for(let i=1;i<=20;i++){
        const ingr=meal[`strIngredient${i}`];
        if(ingr){
            const measure=meal[`strMeasure${i}`];
            inglist+=`<li>${measure} ${ingr}</li>`;
        }
        else break;
    }
    return inglist;
}

const openpopup = (meal) => {
    recipieContent.innerHTML=`
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients: </h3>
        <ul>${showIngr(meal)}</ul>
        <div>
            <h3>Instructions: </h3>
            <p>${meal.strInstructions}</p><br>
            <p><a href="${meal.strYoutube}">Click Here For Youtube link...</a></p>
            
        </div>
    `
    recipieContent.parentElement.style.display="block";
}

closeBtn.addEventListener("click",()=>{
    recipieContent.parentElement.style.display="none";
});

button.addEventListener("click", () => {
    let text = input.value.trim();
    if(!text){
        container.innerHTML=`<h2>Please type a meal in search bar</h2>`;
        return;
    }
    fetchrecipie(text);
});

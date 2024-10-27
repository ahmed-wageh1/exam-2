///<reference types="../@types/jquery" />

$('.open-close-icon').on("click",function(){
  $('aside ul  ').toggle(1000)
})

$(".open-close-icon").on("click", function () {
  $(".sidebar-left").animate(
    { width: "toggle", paddingInline: "toggle", marginInline: "toggle" },
    1000,
    function () {
      $(".open-close-icon").toggleClass(" fa-xmark");
    }
  );
});

$(function () {
  $(".loader").fadeOut(1000, function () {
    $(".loading").fadeOut(500, function () {
      $("body").css("overflow", "auto");
    });
  });
});

// شغالة تمام من غير تعديل فيها
async function getData() {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=`
    );
    let data = await res.json();
    diplayRandomMeals(data.meals);
  } catch (error) { }
}

getData();

// اتعدل فيها 

function diplayRandomMeals(meals) {
  let cartona = "";
  for (let i = 0; i < meals.length; i++) {
    // اتضاف ال id علي ال div كلها خلي بالك
    cartona += `

    <div class="col-md-3 category"         id=${meals[i].idMeal}>
      <div class="card ">
        <img class="w-100" src="${meals[i].strMealThumb}" alt="">
        <div class="layer  ">
          <h3 class="text-black"> ${meals[i].strMeal}</h3>
        </div>
      </div>
    </div>

`;
    document.getElementById("rowDataHome").innerHTML = cartona;

    const catList = document.querySelectorAll(".category");

    // مش عايزة دة
    // for (let i = 0; i < catList.length; i++) {
    //   catList[i].addEventListener("click", function () {
    //     localStorage.setItem("cataName", catList[i].innerText)
    //     location.href = "../instructions.html"

    //   })
    // }

    ////////////////////////////////Updated//////////////////////

    for (let i = 0; i < catList.length; i++) {
      catList[i].addEventListener("click", function () {
        localStorage.setItem("mealID", this.id); // بخزن ال id وال this بتشير علي ال elemnt اللي دوست عليه
       
        location.href = "./instructions.html";
      });
    }
  }
}

// async function getInstructionCat(cataName) {

// اتعدل فيها  
async function getInstructionCat(mealID) {
  // console.log(mealID);

  try {
    // let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealID}`) ال api اتعدل لل بياخد مني ال id
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );

    let data = await res.json();

    displayInstructionCat(data.meals);
  } catch (error) {
    console.error(error);
  }
}

if (location.pathname.endsWith("/instructions.html")) {
  // getInstructionCat(localStorage.getItem("cataName")) مش هتبقي كدة هتبقي زي اللي تحت بجيب ال id
  getInstructionCat(localStorage.getItem("mealID"));
}

// متعدلش فيها 
function displayInstructionCat(meals) {
 

  let cartona = "";

  for (let i = 0; i < meals.length; i++) {
    let meal = meals[i]; // Access each individual meal object
    let ingredients = "";

    // Loop through the 20 possible ingredient slots
    for (let j = 1; j <= 20; j++) {
      if (meal[`strIngredient${j}`]) {
        ingredients += `<li class="alert alert-info m-2 p-1">
          ${meal[`strMeasure${j}`]} ${meal[`strIngredient${j}`]}
        </li>`;
      }
    }

    // Handle tags, if available
    let tags = meal.strTags?.split(",") || []; // Fallback to empty array if tags are null/undefined
    let tagsStr = tags
      .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
      .join("");

    // Build the HTML structure
    cartona += `
      <div class="col-md-4 ">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area:</span> ${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category:</span> ${meal.strCategory}</h3>

        <h3>Recipes:</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
          ${ingredients}
        </ul>

        <h3>Tags:</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
          ${tagsStr}
        </ul>

        <a rel="noopener" target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a rel="noopener" target="_blank" href="${meal.strYoutube}" class="btn btn-danger">YouTube</a>
      </div>`;
  }

  // Insert the generated content into the DOM
  document.getElementById("rowDataInstructions").innerHTML = cartona;
}

//---------------------------------------Search--------------------------------------

const inputName = document.getElementById("srhBN");

// Listen to keyup event for live search

// متعدلش فيها 
inputName?.addEventListener("keyup", function () {
  const searchValue = inputName.value.trim();
  getMeal(searchValue);
});

// Function to fetch meal data from API

// متعدلش فيها 
async function getMeal(Name) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${Name}`
    );
    const data = await res.json();

    if (data.meals === null) {
      displayMealsSearch([]);
    } else {
      displayMealsSearch(data.meals);
    }
  } catch (error) {
    console.log("Error fetching meal data:", error);
    displayError("Failed to load meals. Please try again.");
  }
}

// Function to display meal cards
// متعدلش فيها 
function displayMealsSearch(meals) {
  let cartona = "";

  if (meals.length === 0) {
    cartona = `<p class="text-center">No meals found. Try searching for another dish.</p>`;
  } else {
    meals.forEach((meal) => {
      cartona += `
        <div class="col-md-3 mealSearchName"    id=${meal.idMeal}>
          <div class="card">
            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="layer">
              <h3 class="text-black">${meal.strMeal}</h3>
            </div>
          </div>
        </div>`;
    });
  }

  document.getElementById("rowSearch").innerHTML = cartona;

  const catList = document.querySelectorAll(".mealSearchName");

  for (let i = 0; i < catList.length; i++) {
    catList[i].addEventListener("click", function () {
      localStorage.setItem("mealID", this.id);
      console.log(localStorage.getItem("mealID"));
      location.href = "./instructions.html";
    
    });
  }

}

// Optional: Function to display an error message
// متعدلش فيها 
function displayError(message) {
  document.getElementById(
    "rowSearch"
  ).innerHTML = `<p class="text-center text-danger">${message}</p>`;
}

// اتعملت فوق خلي بالك من تكرار اسامي ال function
// async function getInstructionCat(cataName) {
//   try {
//     let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${cataName}`)
//     let data = await res.json()

//     displayInstructionCat(data.meals)
//   } catch (error) {

//     console.log(error)
//   }
// }

// متعدلش فيها 
const inputLetter = document.getElementById("srhBL");
inputLetter?.addEventListener("keyup", function () {
  const letter = inputLetter.value.trim();
  getMeal(letter);
});

//---------------------(end Section Search)--------------------------------------//
// متعدلش فيها 

async function getCategories() {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const data = await res.json();
  displayCategories(data.categories);
  // console.log(data.categories);
}
// متعدلش فيها 

function displayCategories(listcategories) {
  let cartona = "";
  for (let i = 0; i < listcategories.length; i++) {
    cartona += `

    <div class="col-md-3 category ">
      <div class="card text-black">
         <img class="w-100" src="${listcategories[i].strCategoryThumb}" alt="${listcategories[i].strCategoryThumb
      }">
        <div class="layer ">
          <h3>${listcategories[i].strCategory}</h3>
          <p class="mx-auto">${listcategories[i].strCategoryDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}}</p>
        </div>
      </div>
    </div>

`;

    document.getElementById("rowDataCat").innerHTML = cartona;

    const catList = document.querySelectorAll(".category");

    for (let i = 0; i < catList.length; i++) {
      catList[i].addEventListener("click", function () {
        localStorage.setItem("cataName", listcategories[i].strCategory);
        localStorage.getItem("cataName");
        location.href = "../typemeal.html";
      });
    }
  }
}

if (location.pathname.endsWith("/categories.html")) {
  getCategories();
}
//----------------------------------------------------

// متعدلش فيها 

async function getMealtype(mealtype) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealtype}`
  );
  const data = await res.json();
  displayMealtype(data.meals.slice(0, 20));
}

// اتعدل فيها

function displayMealtype(mealtypelist) {
  let cartona = "";
  for (let i = 0; i < mealtypelist.length; i++) {
    // اتضاف ال id علي ال div كلها خلي بالك

    cartona += `
     <div class="col-md-3 category"     id=${mealtypelist[i].idMeal}          >
            <div class="card ">
              <img class="w-100" src="${mealtypelist[i].strMealThumb} " alt="">
              <div class="layer  ">
                <h3 class="text-black">${mealtypelist[i].strMeal}</h3>
                  
              </div>
            </div>
          </div>
    
     `;
  }
  document.getElementById("rowDataTypeMeal").innerHTML = cartona;

  const mealstypeies = document.querySelectorAll(".category");
  // مش عايزة دة

  // for (let i = 0; i < mealstypeies.length; i++) {
  //   mealstypeies[i].addEventListener("click", function () {
  //     localStorage.setItem("mealtype", mealtypelist[i].strMeal)
  //     console.log(localStorage.getItem("mealtype"));
  //   })
  // }

  //
  for (let i = 0; i < mealstypeies.length; i++) {
    mealstypeies[i].addEventListener("click", function () {
      console.log(this.id);
      localStorage.setItem("mealID", this.id); // بخزن ال id وال this بتشير علي ال elemnt اللي دوست عليه
      location.href = "../instructions.html";

      // هنا اوديه علي طول بردو علي نفس ال path دة عشان يتحقق ال condtion اللي انت عامله فوق
      /*

if (location.pathname.endsWith("/instructions.html")) {
getInstructionCat(localStorage.getItem("mealID"))
}
يروح يعني ينادي علي الفانكشن دي ونمشي بنفس الترتيب بتاع ال details في الهوم 

      */
    });
  }
}


// كل اللي جاي دة متعدلش فيه حاجة لاخر سطر


if (location.pathname.endsWith("/typemeal.html")) {
  getMealtype(localStorage.getItem("cataName"));
}

//Beef and Mustard Pie

//-----

// Fetch list of areas
async function getArea() {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    const data = await res.json();
    displayArea(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Error fetching areas:", error);
  }
}

// Display areas in cards
function displayArea(listareas) {
  let cartona = "";

  listareas.forEach((area) => {
    cartona += `
      <div class="col-md-3 category">
        <div class="card-icon text-center">
          <i class="fa-solid fa-house-laptop"></i>
          <h3>${area.strArea}</h3>
        </div>
      </div>`;
  });

  document.getElementById("rowDataArea").innerHTML = cartona;

  document.querySelectorAll(".category").forEach((areaCard, index) => {
    areaCard.addEventListener("click", () => {
      localStorage.setItem("areaName", listareas[index].strArea);
      location.href = "../areameals.html";
    });
  });
}

// Fetch meals based on area
async function getMealsOfareas(area) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const data = await res.json();
    displayMealsOfArea(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Error fetching meals for area:", error);
  }
}

// Display meals for a selected area
function displayMealsOfArea(mealsarealist) {
  let cartona = "";

  mealsarealist.forEach((meal) => {
    cartona += `
      <div class="col-md-3 mealArea " id=${meal.idMeal}>
        <div class="card">
          <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="layer">
            <h3 class="text-black">${meal.strMeal}</h3>
          </div>
        </div>
      </div>`;
  });

  document.getElementById("rowDataTypeAreaMeal").innerHTML = cartona;

  const catelist= document.querySelectorAll(".mealArea")
  for (let i = 0; i < catelist.length; i++) {
    catelist[i].addEventListener("click", function(){
 localStorage.setItem("mealID", this.id);
 console.log(localStorage.getItem("mealID"));
 
 location.href = "../instructions.html";

    
    })
    
  }

}

// Run the getArea function only on the `area.html` page
if (location.pathname.endsWith("/area.html")) {
  getArea();
}

// Run the getMealsOfareas function only on the `areameals.html` page
if (location.pathname.endsWith("/areameals.html")) {
  const areaName = localStorage.getItem("areaName");
  if (areaName) getMealsOfareas(areaName);
}

//-----

async function getIngredients() {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const data = await res.json();

  displayIngredients(data.meals.slice(0, 20));
}

function displayIngredients(listIngredients) {
  let cartona = "";
  for (let i = 0; i < listIngredients.length; i++) {
    cartona += `
 

    <div class="col-md-3 category">
      <div class="card-icon text-center">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
           <h3>${listIngredients[i].strIngredient}</h3>
           <p>${listIngredients[i].strDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}</p>
      </div>
    </div>
 
 `;
  }
  document.getElementById("rowDataIngredients").innerHTML = cartona;

  const ingredientlist = document.querySelectorAll(".category");
  for (let i = 0; i < ingredientlist.length; i++) {
    ingredientlist[i].addEventListener("click", function () {
      localStorage.setItem("ingredient", listIngredients[i].strIngredient);

      console.log(localStorage.getItem("ingredient"));
      location.href = "ingredientmeals.html";
    });
  }
}

async function getIngredientsMeal(ingredient) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await res.json();
  displayIngredientsMeals(data.meals.slice(0, 20));
}

function displayIngredientsMeals(listIngredients) {
  let cartona = "";
  for (let i = 0; i < listIngredients.length; i++) {
    cartona += `
            <div class="col-md-3 ingreMeal"   id=${listIngredients[i].idMeal}>
            <div class="card ">
              <img class="w-100" src="${listIngredients[i].strMealThumb}" alt="Card image cap">

              <div class="layer  ">
                <h3 class="text-black">${listIngredients[i].strMeal}</h3>
                  
              </div>
            </div>
          </div>
    
    `;
  }
  document.getElementById("rowDataIngredientMeals").innerHTML = cartona;

  const catelist=document.querySelectorAll('.ingreMeal')
  for (let i = 0; i < catelist.length; i++) {
   catelist[i].addEventListener("click", function () {

    localStorage.setItem("mealID",this.id)
    console.log(localStorage.getItem("mealID"))
    location.href=" instructions.html"
   })
    
  }
}

if (location.pathname.endsWith("/ingredients.html")) {
  getIngredients();
}

if (location.pathname.endsWith("/ingredientmeals.html")) {
  getIngredientsMeal(localStorage.getItem("ingredient"));
}

// Selecting inputs and alerts
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const ageInput = document.getElementById("ageInput");
const passwordInput = document.getElementById("passwordInput");
const repasswordInput = document.getElementById("repasswordInput");
const submitBtn = document.getElementById("submitBtn");

// Alert elements
const nameAlert = document.getElementById("nameAlert");
const emailAlert = document.getElementById("emailAlert");
const phoneAlert = document.getElementById("phoneAlert");
const ageAlert = document.getElementById("ageAlert");
const passwordAlert = document.getElementById("passwordAlert");
const repasswordAlert = document.getElementById("repasswordAlert");

// Regular expressions for validation
const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const ageRegex = /^(1[89]|[2-9]\d|100)$/; // Age between 18-100
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


// Validation functions
function validateName() {
  const isValid = nameRegex.test(nameInput.value);
  toggleAlert(nameAlert, !isValid);
  return isValid;
}

function validateEmail() {
  const isValid = emailRegex.test(emailInput.value);
  toggleAlert(emailAlert, !isValid);
  return isValid;
}

function validatePhone() {
  const isValid = phoneRegex.test(phoneInput.value);
  toggleAlert(phoneAlert, !isValid);
  return isValid;
}

function validateAge() {
  const isValid = ageRegex.test(ageInput.value);
  toggleAlert(ageAlert, !isValid);
  return isValid;
}

function validatePassword() {
  const isValid = passwordRegex.test(passwordInput.value);
  toggleAlert(passwordAlert, !isValid);
  return isValid;
}

function validateRepassword() {
  const isValid = passwordInput.value === repasswordInput.value && passwordInput.value !== "";
  toggleAlert(repasswordAlert, !isValid);
  return isValid;
}

// Toggle alert visibility
function toggleAlert(alertElement, show) {
  alertElement.classList.toggle("d-none", !show);
}

// Enable or disable submit button
function validateForm() {
  const isFormValid =
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    validateRepassword();
  submitBtn.disabled = !isFormValid;
}

// Event listeners for real-time validation
nameInput?.addEventListener("input", () => {
  validateName();
 
});

emailInput?.addEventListener("input", () => {
  validateEmail();

});

phoneInput?.addEventListener("input", () => {
  validatePhone();
 
});

ageInput?.addEventListener("input", () => {
  validateAge();
 
});

passwordInput?.addEventListener("input", () => {
  validatePassword();

});

repasswordInput?.addEventListener("input", () => {
  validateRepassword();
 
});
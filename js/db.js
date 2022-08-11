// enable offline data
db.enablePersistence().catch(function (err) {
  if (err.code == "failed-precondition") {
    // probably multible tabs open at once
    console.log("persistance failed");
  } else if (err.code == "unimplemented") {
    // lack of browser support for the feature
    console.log("persistance not available");
  }
});

// real-time listener
db.collection("pwa-food-app/WUaKOiAYNuhemEwMKfqa/recipes").onSnapshot(
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // add document data to web page
        renderRecipe(change.doc.data(), change.doc.id);
      }
      if (change.type === "removed") {
        // remove document data from web page
        removeRecipe(change.doc.id);
      }
    });
  }
);

// add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("pwa-food-app/WUaKOiAYNuhemEwMKfqa/recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

// delete recipe
const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const id = event.target.getAttribute("data-id");
    db.collection("pwa-food-app/WUaKOiAYNuhemEwMKfqa/recipes").doc(id).delete();
  }
});

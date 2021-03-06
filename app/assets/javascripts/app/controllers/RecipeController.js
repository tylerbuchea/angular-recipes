RecipeController.$inject = ["FlashService", "$state", "$stateParams", "DataService", "ingredients", "recipe"];
function RecipeController(FlashService, $state, $stateParams, DataService, ingredients, recipe) {

  var ctrl = this
  ctrl.ingredients = ingredients.data

  if ($stateParams.id)
    {
      ctrl.recipe = recipe.data
      ctrl.display = true
    }
  else
    {
      ctrl.recipe = {
                    title: "",
                    directions: [{place: 1, content: ""}],
                    recipe_ingredients: [{place: 1, name: "", quantity_prep: ""}]
                  }
    }

  ctrl.setIngredient = function(selectedValue, ingredientEntry){
    if (selectedValue)
    { ingredientEntry.name = selectedValue.name }
    else
    { ingredientEntry.name = "" }
  }

  ctrl.addStep = function(){
    var index = ctrl.recipe.directions.length+1
    ctrl.recipe.directions.push({place: index, content: ""})
  }

  ctrl.addIng = function(){
    var index = ctrl.recipe.recipe_ingredients.length+1
    ctrl.recipe.recipe_ingredients.push({place: index, name: "", quantity_prep: ""})
  }

  ctrl.removeEntry = function(entry, array){
    array.splice(array.indexOf(entry), 1)
  }

  ctrl.dragControlListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) {
      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
    },
    itemMoved: function(event) {},
    orderChanged: function(event) {},
  };

  ctrl.submit = function(){
    ctrl.recipe.recipe_ingredients.forEach(function(i){i.place = (ctrl.recipe.recipe_ingredients.indexOf(i)+1)});
    ctrl.recipe.ingredients_attributes=ctrl.recipe.recipe_ingredients
    ctrl.recipe.directions.forEach(function(i){i.place = (ctrl.recipe.directions.indexOf(i)+1)});
    ctrl.recipe.directions_attributes = ctrl.recipe.directions
    delete ctrl.recipe.directions
    delete ctrl.recipe.recipe_ingredients

    if (!ctrl.recipe.id) {
        DataService.postRecipe(ctrl.recipe)
        .then(function(result){
          $state.go('home.recipe', {id: result.data.id});
          FlashService.flashCreate();
        });
      }
    else {
      DataService.updateRecipe(ctrl.recipe)
      .then(function(result){
        $state.go($state.$current, null, { reload: true });
        FlashService.flashUpdate();
      });
    }
  };

  ctrl.deleteRecipe = function(){
    if (confirm('Are you sure?'))
    {
      DataService.deleteRecipe(ctrl.recipe.id)
      .then(function(result){
        $state.go('home.recipes');
        FlashService.flashDelete();
      })
    }
  }

}
angular
  .module('app')
  .controller('RecipeController', RecipeController);

const express = require('express');
const app = express();
const port = 3000;

const recipes = require('./data');

app.use(express.json());

app.get('/', (req, res) => res.json(recipes));

app.put('/recipes/:id', function(req, res) {
  const { id } = req.params;
  const { name, ingredientes } = req.body;
  
  const foundRecipeIndex = recipes.findIndex((recipe) => recipe.id === Number(id));

  const isRecipeNotFound = foundRecipeIndex < 0;
  
  if (isRecipeNotFound) throw new Error('Recipe not found');

  if (!name || !ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0) {
    throw new Error('You must provide name AND/OR ingredients');
  }

  const updatedRecipe = { id: Number(id), name, ingredientes };
  
  recipes[foundRecipeIndex] = updatedRecipe;

  return res.status(200).json(recipes[foundRecipeIndex]);
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Recipe not found') {
    return res.status(404).json({ error: err.message });
  }
  if (err && err.message === 'You must provide name AND/OR ingredients') {
    return res.status(400).json({ error: err.message });
  } 
  return res.json(500).json({ error: err.message });
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
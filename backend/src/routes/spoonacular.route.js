import express from 'express';
import { getRecipesByIngredients, getRecipeDetailsByName,saveRecipe, getSavedRecipes, updateRecipe, deleteRecipe } from '../controllers/spoonacular.controller.js';
import VerifyToken from '../../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/spoonacular/by-ingredients
router.post('/by-ingredients', VerifyToken, getRecipesByIngredients);

// POST /api/spoonacular/by-name
router.post('/by-name', VerifyToken, getRecipeDetailsByName);

// POST /api/spoonacular/save
router.post('/save', VerifyToken, saveRecipe);

// GET /api/spoonacular/saved
router.get('/saved', VerifyToken, getSavedRecipes);
// PUT /api/spoonacular/update/:id
router.put('/update/:id', VerifyToken, updateRecipe);
// DELETE /api/spoonacular/delete/:id
router.delete('/delete/:id', VerifyToken, deleteRecipe);

export default router; 
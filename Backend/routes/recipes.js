import express from "express";
import Recipe from "../models/Recipe.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * 🔐 GET All Recipes (only of logged-in user, optional category)
 */
router.get("/", protect, async (req, res) => {
  const { category } = req.query;

  try {
    const filter = {
      createdBy: req.user._id, // ✅ only user's own recipes
      ...(category ? { category } : {}),
    };

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error("🔥 Error in GET /api/recipes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔐 SEARCH Recipes by title or ingredients (only user's)
 */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;
  try {
    const recipes = await Recipe.find({
      createdBy: req.user._id, // ✅ only user's own recipes
      $or: [
        { title: { $regex: query, $options: "i" } },
        { ingredients: { $regex: query, $options: "i" } },
      ],
    });
    res.json(recipes);
  } catch (error) {
    console.error("🔥 Error in GET /api/recipes/search:", error);
    res.status(500).json({ message: "Search error", error: error.message });
  }
});

/**
 * 🔐 POST - Create Recipe
 */
router.post("/", protect, async (req, res) => {
  const { title, ingredients, instructions, category, photoUrl, cookingTime } = req.body;

  try {
    if (!title || !ingredients || !instructions || !category || !photoUrl || !cookingTime) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      category,
      photoUrl,
      cookingTime,
      createdBy: req.user._id, // ✅ assign owner
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("🔥 Error creating recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔐 GET Single Recipe (only if it belongs to user)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(recipe);
  } catch (err) {
    console.error("🔥 Error fetching recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔐 PUT - Update Recipe (only if owned)
 */
router.put("/:id", protect, async (req, res) => {
  const { title, ingredients, instructions, category, photoUrl, cookingTime } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.category = category || recipe.category;
    recipe.photoUrl = photoUrl || recipe.photoUrl;
    recipe.cookingTime = cookingTime || recipe.cookingTime;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    console.error("🔥 Error updating recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔐 DELETE - Recipe (only if owned)
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

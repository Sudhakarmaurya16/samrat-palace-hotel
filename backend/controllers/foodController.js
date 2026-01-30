// import Food from "../models/Food.js"; // .js extension zaroori hai

// // 1. GET ALL FOODS
// export const getAllFoods = async (req, res) => {
//   try {
//     const foods = await Food.find();
//     res.status(200).json(foods);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching menu" });
//   }
// };

// // 2. CREATE FOOD
// export const createFood = async (req, res) => {
//   try {
//     const newFood = new Food(req.body);
//     const savedFood = await newFood.save();
//     res.status(201).json(savedFood);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating food item" });
//   }
// };

// // 3. DELETE FOOD
// export const deleteFood = async (req, res) => {
//   try {
//     await Food.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Food item deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting food item" });
//   }
// };

import Food from "../models/Food.js";

// 1. GET ALL FOODS
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

// 2. CREATE FOOD (Ye fix kiya hai)
export const createFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    // Error Terminal mein print hoga
    console.error("Error creating food:", error);
    // Frontend ko exact error bhejein
    res
      .status(500)
      .json({ message: "Error creating food item", error: error.message });
  }
};

// 3. DELETE FOOD
export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Food item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting food item" });
  }
};

// ... Upar wala purana code waisa hi rahega ...

// 4. UPDATE FOOD (Ye naya function add karein)
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    // req.body se naya data lekar update karein
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFood);
  } catch (error) {
    console.error("Error updating food:", error);
    res
      .status(500)
      .json({ message: "Error updating food item", error: error.message });
  }
};

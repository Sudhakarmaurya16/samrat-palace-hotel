import React, { useEffect, useState } from "react";
import {
  fetchAllFoods,
  addFood,
  deleteFood,
  updateFood,
} from "../services/api";
import "./styles/AdminFoods.css";

function AdminFoods() {
  const [foods, setFoods] = useState([]);

  // ✨ Edit Mode track karne ke liye state
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Fast Food",
    desc: "",
    image: "",
  });

  // Load Data
  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const data = await fetchAllFoods();
      setFoods(data);
    } catch (error) {
      console.error("Error loading foods", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✨ Edit Button Click Handler
  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      desc: food.desc,
      image: food.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✨ Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      category: "Fast Food",
      desc: "",
      image: "",
    });
  };

  // Handle Form Submit (Add OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Please fill details");

    try {
      if (editingId) {
        // ✨ UPDATE KAREIN
        await updateFood(editingId, formData);
        alert("Food Item Updated Successfully!");
        setEditingId(null);
      } else {
        // ✨ ADD KAREIN
        await addFood(formData);
        alert("Food Item Added Successfully!");
      }

      // Form Reset
      setFormData({
        name: "",
        price: "",
        category: "Fast Food",
        desc: "",
        image: "",
      });
      loadFoods(); // Refresh list
    } catch (error) {
      alert("Failed to save food");
      console.error(error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteFood(id);
        loadFoods();
      } catch (error) {
        alert("Failed to delete food");
      }
    }
  };

  return (
    <div className="admin-foods-container">
      <h2>Manage Restaurant Menu</h2>

      {/* --- FORM SECTION --- */}
      <div className="food-form-card">
        <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>

        <form onSubmit={handleSubmit} className="food-form">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Fast Food">Fast Food</option>
            <option value="Lunch">Lunch</option>
            <option value="Dessert">Dessert</option>
            <option value="Dinner">Dinner</option>
            <option value="Drinks">Drinks</option>
          </select>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />
          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={handleChange}
          />

          <div className="form-buttons">
            <button
              type="submit"
              className={editingId ? "update-btn" : "add-btn"}
            >
              {editingId ? "Update Item" : "Add to Menu"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- FOOD LIST TABLE --- */}
      <div className="food-list">
        <h3>Current Menu Items</h3>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.length > 0 ? (
              foods.map((food) => (
                <tr key={food._id}>
                  <td>
                    {/* ✅ FIXED IMAGE CODE HERE */}
                    <img
                      src={
                        food.image
                          ? food.image
                          : "https://placehold.co/50?text=Food"
                      }
                      alt={food.name}
                      className="table-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/50?text=No+Img";
                      }}
                    />
                  </td>
                  <td>{food.name}</td>
                  <td>{food.category}</td>
                  <td>₹{food.price}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(food)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(food._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No items found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFoods;

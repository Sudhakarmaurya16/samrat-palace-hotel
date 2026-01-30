import React from "react";

function FoodCard({ food, onAdd }) {
  return (
    <div className="food-card-3d">
      <div className="card-inner">
        <div className="card-front">
          <div className="image-box">
            <img
              src={food.image || "https://placehold.co/300x200?text=Food"}
              alt={food.name}
              onError={(e) =>
                (e.target.src = "https://placehold.co/300x200?text=No+Image")
              }
            />
            <span className="price-badge">₹{food.price}</span>
          </div>
          <div className="content-box">
            <h3>{food.name}</h3>
            <p className="category-tag">{food.category}</p>
            <p className="desc">{food.desc || "Delicious and fresh."}</p>

            {/* ✅ Button calls the parent function */}
            <button className="order-btn" onClick={() => onAdd(food)}>
              Add to Plate ➕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;

const express = require('express');
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
}= require('../controllers/cartController')

const { isAuthenticated} = require('../middleware/auth');

// 🔒 All routes are protected (user must be logged in)
router.get("/", isAuthenticated, getCart); // Get logged-in user's cart
router.post("/", isAuthenticated, addToCart); // Add or update item in cart
router.delete("/:productId", isAuthenticated, removeFromCart); // Remove single item from cart
router.delete("/", isAuthenticated, clearCart); // Clear all items from cart

export default router;
const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrderById,
  getOrderStats,
  getOrdersByUserId,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrder,
  deleteOrder,
  getAllOrders,
} = require('../controllers/orderController');

const { isAuthenticated, isAdmin } = require('../middleware/auth');

// 🌍 User routes (authenticated users)
router.post('/', isAuthenticated, createOrder); // Create a new order
router.get('/my-orders', isAuthenticated, getMyOrders); // Get logged-in user's orders
router.get('/user/:userId', isAuthenticated, getOrdersByUserId); // Get orders by user ID
router.get('/:id', isAuthenticated, getOrderById); // Get order by ID

// 🔒 Admin routes
router.get('/', isAuthenticated, isAdmin, getAllOrders); // Get all orders
router.get('/stats', isAuthenticated, isAdmin, getOrderStats); // Order statistics
router.put('/:id/pay', isAuthenticated, isAdmin, updateOrderToPaid); // Mark order as paid
router.put('/:id/deliver', isAuthenticated, isAdmin, updateOrderToDelivered); // Mark order as delivered
router.put('/:id', isAuthenticated, isAdmin, updateOrder); // Update order
router.delete('/:id', isAuthenticated, isAdmin, deleteOrder); // Delete order

module.exports = router;

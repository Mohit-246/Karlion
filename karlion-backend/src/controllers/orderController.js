const Order = require("../model/dbSchema");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentmethods,
      itemprice,
      shippingprice,
      totalprice,
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    const order = new Order({
      user: req.user._id, // Assuming user ID comes from auth middleware
      orderItems,
      shippingAddress,
      paymentmethods,
      itemprice,
      shippingprice,
      totalprice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error creating order",
      error: err.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: err.message,
    });
  }
};

// Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone address")
      .populate("orderItems.Product", "name imageion");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: err.message,
    });
  }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.Product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching your orders",
      error: err.message,
    });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: err.message,
    });
  }
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentresults = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as paid",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error updating order to paid",
      error: err.message,
    });
  }
};

// Update order to delivered
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error updating order to delivered",
      error: err.message,
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update fields if provided
    if (req.body.shippingAddress)
      order.shippingAddress = req.body.shippingAddress;
    if (req.body.paymentmethods) order.paymentmethods = req.body.paymentmethods;
    if (req.body.itemprice) order.itemprice = req.body.itemprice;
    if (req.body.shippingprice) order.shippingprice = req.body.shippingprice;
    if (req.body.totalprice) order.totalprice = req.body.totalprice;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error updating order",
      error: err.message,
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: err.message,
    });
  }
};

// Get paid orders
const getPaidOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true })
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ paidAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching paid orders",
      error: err.message,
    });
  }
};

// Get delivered orders
const getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDelivered: true })
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ deliveredAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching delivered orders",
      error: err.message,
    });
  }
};

// Get pending orders (not paid)
const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: false })
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders",
      error: err.message,
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const pendingOrders = await Order.countDocuments({ isPaid: false });

    // Calculate total revenue from paid orders
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$totalprice" } },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        paidOrders,
        deliveredOrders,
        pendingOrders,
        totalRevenue: totalRevenue.toFixed(2),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: err.message,
    });
  }
};

// Get recent orders
const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.Product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent orders",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderStats,
  getOrdersByUserId,
  paidOrders,
  getPendingOrders,
  getRecentOrders,
  getMyOrders,
  totalOrders,
  deleteOrder,
  getAllOrders,
  updateOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
};

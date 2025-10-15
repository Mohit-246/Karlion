const { Order } = require("../model/dbSchema");

/*================================
   🧾 ORDER CONTROLLER — Handles all order-related operations
  ===============================*/

/*   📦 CREATE NEW ORDER*/
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

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    const order = new Order({
      user: req.user._id,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

/*   ✏️ USER: UPDATE THEIR OWN ORDER*/
const updateMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // Ensure the logged-in user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this order",
      });
    }

    // Prevent editing if paid or delivered
    if (order.isPaid)
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit a paid order" });
    if (order.isDelivered)
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit a delivered order" });

    // Allowed editable fields
    const editableFields = [
      "shippingAddress",
      "orderItems",
      "paymentmethods",
      "itemprice",
      "shippingprice",
      "totalprice",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) order[field] = req.body[field];
    });

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

/*   🚫 USER: CANCEL THEIR OWN ORDER*/
const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    if (order.isPaid)
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel a paid order" });
    if (order.isDelivered)
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel a delivered order" });

    order.status = "Cancelled";
    order.cancelledAt = Date.now();

    const cancelledOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

/*   👤 USER: GET THEIR OWN ORDERS*/
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your orders",
      error: error.message,
    });
  }
};

/*   👤 ADMIN: GET ORDERS BY USER ID*/
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

/*   📦 GET ORDER BY ID*/
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone address")
      .populate("orderItems.Product", "name image");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};

/*   💰 UPDATE ORDER TO PAID*/
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order to paid",
      error: error.message,
    });
  }
};

/*   📦 UPDATE ORDER TO DELIVERED*/
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order to delivered",
      error: error.message,
    });
  }
};

/*   🛠️ ADMIN: UPDATE ORDER (Full Control)*/
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const updatableFields = [
      "shippingAddress",
      "paymentmethods",
      "itemprice",
      "shippingprice",
      "totalprice",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) order[field] = req.body[field];
    });

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

/*   ❌ DELETE ORDER*/
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

/*   📊 ADMIN: GET ALL ORDERS*/
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

/*   📈 ADMIN: GET ORDER STATISTICS*/
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const pendingOrders = await Order.countDocuments({ isPaid: false });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error.message,
    });
  }
};

/*   🕒 ADMIN: GET RECENT ORDERS*/
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent orders",
      error: error.message,
    });
  }
};

/*   💸 ADMIN: GET PAID / DELIVERED / PENDING ORDERS*/
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching paid orders",
      error: error.message,
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching delivered orders",
      error: error.message,
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  updateMyOrder,
  cancelMyOrder,
  getMyOrders,
  getOrdersByUserId,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getOrderStats,
  getRecentOrders,
  getPaidOrders,
  getDeliveredOrders,
  getPendingOrders,
};

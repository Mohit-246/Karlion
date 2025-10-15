const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.salt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("users", userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  acturalprice: { type: Number, required: true },
  discountedprice: { type: Number, required: true },
  image: [{ type: String, required: true }],
  quantity: { type: Number, required: true },
  Category: { type: String, required: true },
  Page: { type: String, required: true },
  sizes: [{ type: String, required: true }],
});
const Product = mongoose.model("products", productSchema);

const orderitemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: String, required: true },
  Product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});
const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  postalcode: { type: String, required: true },
  state: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        Product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentmethods: {
      type: String,
      required: true,
      enum: ["COD", "Razorpay", "Stripe", "PayPal"],
      default: "COD",
    },

    paymentresults: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    itemprice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingprice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalprice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: { type: Date },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: { type: Date },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    cancelledAt: { type: Date },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
const Order = mongoose.model("Orders", orderSchema);

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { User, Product, Order, Cart };

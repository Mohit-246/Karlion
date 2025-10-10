const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  password: { type: String, require: true },
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
  name: { type: String, require: true },
  description: { type: String, require: true },
  acturalprice: { type: Number, require: true },
  discountedprice: { type: Number, require: true },
  image: [{ type: String, require: true }],
  quantity: { type: Number, require: true },
  Category: { type: String, require: true },
  Page: { type: String, require: true },
  sizes: [{ type: String, require: true }],
});
const Product = mongoose.model("products", productSchema);

const orderitemSchema = new mongoose.Schema({
  name: { type: String, require: true },
  qty: { type: String, require: true },
  img: { type: String, require: true },
  price: { type: String, require: true },
  Product: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Product",
  },
});
const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, require: true },
  city: { type: String, require: true },
  postalcode: { type: String, require: true },
  state: { type: String, require: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    orderItems: [orderitemSchema],
    shippingAddress: shippingAddressSchema,
    paymentmethods: {
      type: String,
      require: true,
    },
    paymentresults: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemprice: {
      type: String,
      require: true,
      default: 0.0,
    },
    shippingprice: {
      type: String,
      require: true,
      default: 0.0,
    },
    totalprice: {
      type: String,
      require: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
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

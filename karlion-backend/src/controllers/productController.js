const Product = require('../model/dbSchema')
//Create New Product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get ALL Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(`Error${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

//Geting Products By Category
const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ Category: category });
    res.json(products);
  } catch (error) {
    console.error(`Error ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

//Getting products by Page {Mens, Women, Kid}
const getProductbyPage = async (req, res) => {
  const page = req.params.page;
  try {
    const products = await Products.find({ Page: page });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById({ productId });

    if (!product) {
      res.status(500).json({ message: "Product not Found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update the Product
const updateProductbyId = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = Product.findByIdAndUpdate(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete the Product
const deleteProduct = async (req, res) => {
  try {
    const product = Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getProductById,
  updateProductbyId,
  deleteProduct,
};

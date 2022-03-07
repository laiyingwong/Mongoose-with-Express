const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");

// ***********************
// INTEGRATE MONGO WITH JS
// ***********************
// Connect JS file to a Mongo database via Mongoose
// Create a database called 'farmStand'
mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

// Set up the path for 'views' directory
app.set("views", path.join(__dirname, "views"));
// Set EJS as the view engine
app.set("view engine", "ejs");

// To parse form data in POST request body as url encoded data (otherwise req.body is undefined):
app.use(express.urlencoded({ extended: true }));
// To 'fake' put/patch/delete requests:
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

// *********************
// SET UP EXPRESS ROUTES
// *********************

// ============ Home Page ============
app.get("/products", async (req, res) => {
  // find all products
  // `.find()` returns a thenable query object, we can use `.then()` or alternatively, `async` and `await` to get a resolved value from it

  // filtering by category
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

// ======= Create a New Product =======
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

// ===== Individual Product Info =====
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

// ========== Edit a Product ==========
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

// ========= Delete a Product =========
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

// *******
// SERVER
// *******
app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000!");
});

const mongoose = require("mongoose");

// ***************
// DEFINE A SCHEMA
// ***************
// Schema is a mapping of different collection keys from Mongo to different types in JavaScript.
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // `required` is a built-in Mongoose validation, by default it's set to false
    // setting `required` to true makes name to be mandatory when creating a new product
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // categories is an array only consisting of strings or values that can be casted into strings (e.g 123 => '123')
  category: {
    type: String,
    lowercase: true,
    // `enum` creates a validator that checks if the value is in the given array
    enum: ["fruit", "vegetable", "dairy"],
  },
});

// ***************
// DEFINE A MODEL
// ***************
// Models are JavaScript classes that we make with the assistance of Mongoose to represent information in a Mongo database.
// The model name should be singular and capitalized ('Product'). Mongoose will pluralize and lowercase it ('products') and make it a collection.
const Product = mongoose.model("Product", productSchema);

// export the model
module.exports = Product;

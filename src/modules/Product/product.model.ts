import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Color", "Size"
  values: [{ type: String, required: true }], // Example: ["Red", "Blue", "Green"] or ["Small", "Medium", "Large"]
});

const ProductSchema = new mongoose.Schema(
  {
    //  Basic Information
    productCode: { type: String, required: true, unique: true }, // Unique Identifier
    title: { type: String, required: true },
    brand: { type: String, required: true }, // Brand/Company/Author
    manufacturer: { type: String },
    description: { type: String, required: true }, // Full description
    shortDescription: { type: String, required: true }, // Brief summary
    keyFeatures: [{ type: String }], // List of main features
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    condition: { type: String, enum: ["New", "Used", "Refurbished"], required: true }, // Product Condition

    //  Pricing & Stock
    stock: { type: Number, required: true }, // Available quantity
    price: { type: Number, required: true }, // Original Price
    discountPrice: { type: Number, default: null }, // Discounted Price (if applicable)

    //  Variants (Different Versions of the Product)
    variants: [VariantSchema], // Example: [{ name: "Color", value: "Red" }, { name: "Size", value: "M" }]

    //  Additional Information
    specifications: { type: Map, of: String }, // Example: { "Processor": "Intel i7", "RAM": "16GB" }

    //  Store & Seller Information
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;

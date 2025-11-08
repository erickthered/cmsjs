"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    position: {
        type: Number,
        required: true,
        default: 0,
    },
});
const Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.default = Category;

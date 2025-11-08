"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    keywords: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    summary: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
});
const Article = (0, mongoose_1.model)('Article', ArticleSchema);
exports.default = Article;

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Article from '../models/Article';
import Category from '../models/Category';

interface AuthRequest extends Request {
  user?: { id: string; group: string };
}

// Helper function to generate a slug from a title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
};

// Create a new article (Admin or Editor)
export const createArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, category, slug, keywords, description, summary, content } = req.body;

  try {
    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const articleSlug = slug || generateSlug(title);

    let existingArticle = await Article.findOne({ slug: articleSlug });
    if (existingArticle) {
      return res.status(400).json({ message: 'Article with this slug already exists' });
    }

    const newArticle = new Article({
      title,
      category,
      slug: articleSlug,
      keywords,
      description,
      summary,
      content,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
};

// Get all articles (Public)
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await Article.find().populate('category', 'name slug');
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

// Get single article by ID or slug (Public)
export const getArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let article;

    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await Article.findById(id).populate('category', 'name slug');
    }

    if (!article) {
      article = await Article.findOne({ slug: id }).populate('category', 'name slug');
    }

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// Update article (Admin or Editor - can only update their own articles)
export const updateArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, category, slug, keywords, description, summary, content } = req.body;

  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Editors can only update their own articles (if we implement article ownership)
    // For now, assuming any editor can update any article, but this can be refined.
    // if (req.user?.group === 'editor' && article.author.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized to update this article' });
    // }

    // Check if category exists if provided
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      article.category = category;
    }

    const updatedSlug = slug || generateSlug(title || article.title);

    // Check for slug uniqueness if it's changed
    if (updatedSlug !== article.slug) {
      const existingArticleWithSlug = await Article.findOne({ slug: updatedSlug });
      if (existingArticleWithSlug && String(existingArticleWithSlug._id) !== req.params.id) {
        return res.status(400).json({ message: 'Article with this slug already exists' });
      }
    }

    article.title = title || article.title;
    article.slug = updatedSlug;
    article.keywords = keywords || article.keywords;
    article.description = description || article.description;
    article.summary = summary || article.summary;
    article.content = content || article.content;

    const updatedArticle = await article.save();
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

// Delete article (Admin only)
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article removed' });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

// Helper function to generate a slug from a name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
};

// Create a new category (Admin only)
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, slug, description, position } = req.body;

  try {
    const categorySlug = slug || generateSlug(name);

    let existingCategory = await Category.findOne({ slug: categorySlug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const newCategory = new Category({
      name,
      slug: categorySlug,
      description,
      position,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort({ position: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Get single category by ID or slug
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let category;

    // Check if the ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }

    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// Update category (Admin only)
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, slug, description, position } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedSlug = slug || generateSlug(name || category.name);

    // Check for slug uniqueness if it's changed
    if (updatedSlug !== category.slug) {
      const existingCategoryWithSlug = await Category.findOne({ slug: updatedSlug });
      if (existingCategoryWithSlug && String(existingCategoryWithSlug._id) !== req.params.id) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }

    category.name = name || category.name;
    category.slug = updatedSlug;
    category.description = description || category.description;
    category.position = position !== undefined ? position : category.position;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

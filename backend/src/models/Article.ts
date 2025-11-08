import { Schema, model, Document } from 'mongoose';
import { ICategory } from './Category';

export interface IArticle extends Document {
  title: string;
  category: ICategory['_id'];
  slug: string;
  keywords?: string;
  description?: string;
  summary?: string;
  content: string;
}

const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
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

const Article = model<IArticle>('Article', ArticleSchema);

export default Article;

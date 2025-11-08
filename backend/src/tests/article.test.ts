import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Category from '../models/Category';
import Article from '../models/Article';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let editorToken: string;
let categoryId: string;

jest.setTimeout(30000); // Set a higher timeout for the test suite

describe('Article Endpoints', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({});
    await Category.deleteMany({});
    await Article.deleteMany({});

    // Register an admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        fullName: 'Admin User',
        password: 'password123',
      });
    adminToken = adminRes.body.token;

    // Register an editor user
    const editorRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'editor@test.com',
        fullName: 'Editor User',
        password: 'password123',
      });
    editorToken = editorRes.body.token;

    // Create a category for articles
    const categoryRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Category for Articles',
        position: 1,
      });
    categoryId = categoryRes.body._id;
  });

  afterEach(async () => {
    await Article.deleteMany({}); // Clear articles after each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should create a new article (admin or editor)', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Article',
        category: categoryId,
        content: 'This is the content of the test article.',
        summary: 'A summary',
        keywords: 'test, article',
        description: 'Test article description',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Article');
    expect(res.body).toHaveProperty('slug', 'test-article');
    expect(res.body.category).toEqual(categoryId);
  });

  it('should not create an article with a duplicate slug', async () => {
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Duplicate Slug Article',
        category: categoryId,
        content: 'Content',
      });

    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Duplicate Slug Article',
        category: categoryId,
        content: 'Content',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Article with this slug already exists');
  });

  it('should get all articles (public access)', async () => {
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article One',
        category: categoryId,
        content: 'Content One',
      });
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        title: 'Article Two',
        category: categoryId,
        content: 'Content Two',
      });

    const res = await request(app).get('/api/articles');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toHaveProperty('title', 'Article One');
    expect(res.body[0]).toHaveProperty('category');
    expect(res.body[0].category).toHaveProperty('name', 'Test Category for Articles');
  });

  it('should get a single article by ID (public access)', async () => {
    const createRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Single Article',
        category: categoryId,
        content: 'Content for single article',
      });

    const articleId = createRes.body._id;

    const res = await request(app).get(`/api/articles/${articleId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Single Article');
    expect(res.body).toHaveProperty('category');
    expect(res.body.category).toHaveProperty('name', 'Test Category for Articles');
  });

  it('should get a single article by slug (public access)', async () => {
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Slug Article',
        slug: 'custom-article-slug',
        category: categoryId,
        content: 'Content for slug article',
      });

    const res = await request(app).get('/api/articles/custom-article-slug');

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Slug Article');
  });

  it('should update an article (admin or editor)', async () => {
    const createRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article to Update',
        category: categoryId,
        content: 'Original content',
      });

    const articleId = createRes.body._id;
    const updatedTitle = 'Updated Article Title';

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        title: updatedTitle,
        content: 'Updated content',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual(updatedTitle);
    expect(res.body.content).toEqual('Updated content');
  });

  it('should not update an article with a duplicate slug', async () => {
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article 1',
        category: categoryId,
        content: 'Content 1',
      });

    const createRes2 = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article 2',
        category: categoryId,
        content: 'Content 2',
      });

    const articleId2 = createRes2.body._id;

    const res = await request(app)
      .put(`/api/articles/${articleId2}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: 'article-1', // Attempt to change slug to an existing one
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Article with this slug already exists');
  });

  it('should delete an article (admin only)', async () => {
    const createRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article to Delete',
        category: categoryId,
        content: 'Content to delete',
      });

    const articleId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Article removed');

    const deletedArticle = await Article.findById(articleId);
    expect(deletedArticle).toBeNull();
  });

  it('should not delete an article (editor cannot access)', async () => {
    const createRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Article to Delete by Editor',
        category: categoryId,
        content: 'Content to delete by editor',
      });

    const articleId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });
});

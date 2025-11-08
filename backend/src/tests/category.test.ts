import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Category from '../models/Category';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let editorToken: string;

jest.setTimeout(30000); // Set a higher timeout for the test suite

describe('Category Endpoints', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({});
    await Category.deleteMany({});

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
  });

  afterEach(async () => {
    await Category.deleteMany({}); // Clear categories after each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should create a new category (admin only)', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Category',
        description: 'A test category',
        position: 1,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Category');
    expect(res.body).toHaveProperty('slug', 'test-category');
  });

  it('should not create a new category (editor cannot access)', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        name: 'Editor Category',
        description: 'An editor category',
        position: 2,
      });

    expect(res.statusCode).toEqual(403);
  });

  it('should get all categories (public access)', async () => {
    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category A',
        position: 2,
      });
    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category B',
        position: 1,
      });

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].name).toEqual('Category B'); // Sorted by position
  });

  it('should get a single category by ID (public access)', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Single Category',
        position: 1,
      });

    const categoryId = createRes.body._id;

    const res = await request(app).get(`/api/categories/${categoryId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Single Category');
  });

  it('should get a single category by slug (public access)', async () => {
    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Slug Category',
        slug: 'custom-slug',
        position: 1,
      });

    const res = await request(app).get('/api/categories/custom-slug');

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Slug Category');
  });

  it('should update a category (admin only)', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category to Update',
        position: 1,
      });

    const categoryId = createRes.body._id;
    const updatedName = 'Updated Category Name';

    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: updatedName,
        position: 5,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updatedName);
    expect(res.body.position).toEqual(5);
  });

  it('should not update a category (editor cannot access)', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category to Update by Editor',
        position: 1,
      });

    const categoryId = createRes.body._id;

    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        name: 'Attempted Update',
      });

    expect(res.statusCode).toEqual(403);
  });

  it('should delete a category (admin only)', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category to Delete',
        position: 1,
      });

    const categoryId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Category removed');

    const deletedCategory = await Category.findById(categoryId);
    expect(deletedCategory).toBeNull();
  });

  it('should not delete a category (editor cannot access)', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Category to Delete by Editor',
        position: 1,
      });

    const categoryId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });
});

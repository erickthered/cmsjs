import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

jest.setTimeout(30000); // Set a higher timeout for the test suite

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should register a new user as admin if it`s the first user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@example.com',
        fullName: 'Admin User',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');

    const user = await User.findOne({ email: 'admin@example.com' });
    expect(user).toBeDefined();
    expect(user?.group).toBe('admin');
  });

  it('should register a new user as editor if not the first user', async () => {
    // Register an admin first
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@example.com',
        fullName: 'Admin User',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'editor@example.com',
        fullName: 'Editor User',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');

    const user = await User.findOne({ email: 'editor@example.com' });
    expect(user).toBeDefined();
    expect(user?.group).toBe('editor');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        fullName: 'Another Test User',
        password: 'anotherpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'login@example.com',
        fullName: 'Login User',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials (wrong password)', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'wrongpass@example.com',
        fullName: 'Wrong Pass User',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should not login with invalid credentials (user not found)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

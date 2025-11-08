import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let adminUserId: string;
let editorToken: string;
let editorUserId: string;

jest.setTimeout(30000); // Set a higher timeout for the test suite

describe('User Endpoints', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({});

    // Register an admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        fullName: 'Admin User',
        password: 'password123',
      });
    adminToken = adminRes.body.token;
    adminUserId = adminRes.body.user._id; // Assuming the register endpoint returns the user object

    // Register an editor user
    const editorRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'editor@test.com',
        fullName: 'Editor User',
        password: 'password123',
      });
    editorToken = editorRes.body.token;
    editorUserId = editorRes.body.user._id; // Assuming the register endpoint returns the user object
  });

  afterEach(async () => {
    // Clean up after each test if necessary, though beforeAll handles initial setup
    // For user tests, we might want to keep the admin/editor users for subsequent tests
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // Admin and Editor users
    expect(res.body[0]).not.toHaveProperty('password');
  });

  it('should not get all users (editor cannot access)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });

  it('should get a user by ID (admin only)', async () => {
    const res = await request(app)
      .get(`/api/users/${editorUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('editor@test.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should not get a user by ID (editor cannot access)', async () => {
    const res = await request(app)
      .get(`/api/users/${adminUserId}`)
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });

  it('should update a user (admin only)', async () => {
    const updatedFullName = 'Updated Editor Name';
    const res = await request(app)
      .put(`/api/users/${editorUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: updatedFullName,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.fullName).toEqual(updatedFullName);
  });

  it('should not update a user (editor cannot access)', async () => {
    const res = await request(app)
      .put(`/api/users/${adminUserId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        fullName: 'Attempted Update',
      });

    expect(res.statusCode).toEqual(403);
  });

  it('should delete a user (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/users/${editorUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User removed');

    const deletedUser = await User.findById(editorUserId);
    expect(deletedUser).toBeNull();
  });

  it('should not delete a user (editor cannot access)', async () => {
    const res = await request(app)
      .delete(`/api/users/${adminUserId}`)
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });
});

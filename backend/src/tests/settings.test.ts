import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Settings from '../models/Settings';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let editorToken: string;

jest.setTimeout(30000); // Set a higher timeout for the test suite

describe('Settings Endpoints', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({});
    await Settings.deleteMany({});

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
    await Settings.deleteMany({}); // Clear settings after each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should get default settings if none exist (admin only)', async () => {
    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('maintenanceMode', false);
    expect(res.body).toHaveProperty('userRegistration', true);
    expect(res.body).toHaveProperty('theme', 'default');
    expect(res.body).toHaveProperty('caching', false);
  });

  it('should not get settings (editor cannot access)', async () => {
    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.statusCode).toEqual(403);
  });

  it('should update settings (admin only)', async () => {
    const updatedSettings = {
      googleTagManagerId: 'GTM-12345',
      maintenanceMode: true,
      userRegistration: false,
      theme: 'dark',
      caching: true,
      customJs: 'console.log("hello");',
      customCss: 'body { background-color: black; }',
    };

    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedSettings);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('googleTagManagerId', updatedSettings.googleTagManagerId);
    expect(res.body).toHaveProperty('maintenanceMode', updatedSettings.maintenanceMode);
    expect(res.body).toHaveProperty('userRegistration', updatedSettings.userRegistration);
    expect(res.body).toHaveProperty('theme', updatedSettings.theme);
    expect(res.body).toHaveProperty('caching', updatedSettings.caching);
    expect(res.body).toHaveProperty('customJs', updatedSettings.customJs);
    expect(res.body).toHaveProperty('customCss', updatedSettings.customCss);
  });

  it('should not update settings (editor cannot access)', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({
        maintenanceMode: true,
      });

    expect(res.statusCode).toEqual(403);
  });
});

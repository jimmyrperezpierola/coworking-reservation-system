// __tests__/auth.test.js
const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');
const bcrypt = require('bcrypt');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Crear usuario de prueba directamente
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({
      email: 'testadmin@example.com',
      password: hashedPassword,
      isAdmin: true
    });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'testpassword'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
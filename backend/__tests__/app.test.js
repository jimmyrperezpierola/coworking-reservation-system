const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('debería devolver un mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});
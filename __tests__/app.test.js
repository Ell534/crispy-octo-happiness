const app = require('../app.js');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('/api/categories', () => {
  it('200: GET responds with an array of all cateory objects with the properties slug and description', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

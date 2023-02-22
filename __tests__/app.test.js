const app = require('../app.js');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
const { toBeSortedBy, toBeSorted } = require('jest-sorted');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('/api/categories', () => {
  it('200: GET responds with an array of all category objects with the properties slug and description', () => {
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
  it('status: 404 - responds with an error message when passed a route that does not exist', () => {
    return request(app)
      .get('/api/notAPath')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found');
      });
  });
});

describe('/api/reviews', () => {
  it('200: GET responds with an array of review objects sorted by descending date', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at', { descending: true });
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe('/api/reviews/:review_id', () => {
  it('responds with a review object with corresponding id from path', () => {
    return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Array);
        expect(review).toHaveLength(1);
        expect(review).toMatchObject([
          {
            review_id: 1,
            title: 'Agricola',
            review_body: 'Farmyard fun!',
            designer: 'Uwe Rosenberg',
            review_img_url:
              'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
            votes: 1,
            category: 'euro game',
            owner: 'mallionaire',
            created_at: '2021-01-18T10:00:20.514Z',
          },
        ]);
      });
  });
  it('404: responds with review not found given a valid id that does not exist', () => {
    return request(app)
      .get('/api/reviews/20')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('This review ID does not Exist');
      });
  });
  it('400: responds with bad request when given an id that is not a number', () => {
    return request(app)
      .get('/api/reviews/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('POST: /api/reviews/:review_id/comments', () => {
  it('201: request body accepts an object with username and body, responds with the posted comment', () => {
    const requestBody = {
      username: 'mallionaire',
      body: 'This game is fantastic!',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Object);
        expect(comment).toMatchObject({
          comment_id: 7,
          body: 'This game is fantastic!',
          review_id: 1,
          author: 'mallionaire',
          votes: 0,
          created_at: expect.any(String),
        });
        console.log(comment);
      });
  });
});

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
  it('404: responds with an error message when passed a route that does not exist', () => {
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
  it('200: GET should accept queries to select reviews by category specified, sort_by given column and order by asc or desc', () => {
    return request(app)
      .get(
        '/api/reviews?category=social deduction&sort_by=reviews.votes&order=asc'
      )
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeSortedBy('votes');
      });
  });
  it('200: GET should return an empty array when a category that exists but has no reviews is selected', () => {
    return request(app)
      .get(`/api/reviews?category=children's games`)
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([])
      });
  });
  it('404: category does not exist when given a valid but non existent category', () => {
    return request(app)
      .get('/api/reviews?category=banana&sort_by=reviews.votes&order=asc')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('This category does not exist');
      });
  });
  it('400: sort_by query is not valid', () => {
    return request(app)
      .get('/api/reviews?category=social deduction&sort_by=banana&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Sort Request');
      });
  });
  it('400: order query is not valid', () => {
    return request(app)
      .get('/api/reviews?category=social deduction&sort_by=title&order=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Order Request');
      });
  });
  it('400: category in query is invalid e.g 999', () => {
    return request(app)
      .get('/api/reviews?category=999')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad Category Request')
      })
  });
});

describe('/api/reviews/:review_id', () => {
  it('200: GET responds with a review object with corresponding id from path', () => {
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
        expect(body.msg).toBe('This review ID does not exist');
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

describe('/api/reviews/:review_id/comments', () => {
  it('200: GET responds with an array of comments for the given review id, sorted by most recent comment first', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy('created_at', { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  it('404: responds with review not found given a valid id that does not exist', () => {
    return request(app)
      .get('/api/reviews/20/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('This review ID does not exist');
      });
  });
  it('400: responds with bad request when given an id that is not a number  ', () => {
    return request(app)
      .get('/api/reviews/banana/comments')
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
      });
  });
  it('400: malformed request - request body is missing not null values', () => {
    const requestBody = {
      username: 'mallionaire',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Malformed Request');
      });
  });
  it('400: username in request body does not exist in db', () => {
    const requestBody = {
      username: 'notAUser',
      body: 'test',
    };
    return request(app)
      .post('/api/reviews/1/comments')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid User');
      });
  });
  it('400: invalid review id', () => {
    const requestBody = {
      username: 'mallionaire',
      body: 'This game is fantastic!',
    };
    return request(app)
      .post('/api/reviews/banana/comments')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  it('404: review id not found', () => {
    const requestBody = {
      username: 'mallionaire',
      body: 'This game is fantastic!',
    };
    return request(app)
      .post('/api/reviews/20/comments')
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('This review ID does not exist');
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  it('200: responds with the updated review', () => {
    const requestBody = {
      inc_votes: 10,
    };
    return request(app)
      .patch('/api/reviews/1')
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        expect(review).toMatchObject({
          review_id: 1,
          title: 'Agricola',
          category: 'euro game',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_body: 'Farmyard fun!',
          review_img_url:
            'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
          created_at: '2021-01-18T10:00:20.514Z',
          votes: 11,
        });
      });
  });
  it('400: malformed request - request body is missing not null values', () => {
    const requestBody = {
      inc_votes: null,
    };
    return request(app)
      .patch('/api/reviews/1')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Malformed Request');
      });
  });
  it('400: invalid review id', () => {
    const requestBody = {
      inc_votes: 10,
    };
    return request(app)
      .patch('/api/reviews/banana')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  it('400: incorrect datatype in req body', () => {
    const requestBody = {
      inc_votes: 'word',
    };
    return request(app)
      .patch('/api/reviews/1')
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  it('404: non-existent id', () => {
    const requestBody = {
      inc_votes: 10,
    };
    return request(app)
      .patch('/api/reviews/9999')
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('This review ID does not exist');
      });
  });
});

describe('GET /api/users', () => {
  it('200: GET responds with array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

// describe('DELETE /api/comments/:comment_id', () => {
//   it('204: deletes the comment specified by comment_id', () => {
//     return request(app)
//       .delete('/api/comments/')
//   });
// });
const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a secret', async () => {
    const expected = {
      title: 'I am a secret',
      description: 'A really secret secret.',
    };
    const res = await request(app).post('/api/v1/secrets').send(expected);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      createdAt: expect.any(String),
    });
  });
});

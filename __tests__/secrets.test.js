const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'Test Last Name',
  email: 'test@test.com',
  password: '12345',
};

describe('secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('can create a secret if signed in', async () => {
    const agent = request.agent(app);
    await UserService.create(mockUser);
    const { email, password } = mockUser;

    await agent.post('/api/v1/users/sessions').send({ email, password });
    const expected = {
      title: 'I am a secret',
      description: 'A really secret secret.',
    };
    const res = await agent.post('/api/v1/secrets').send(expected);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      createdAt: expect.any(String),
    });
  });

  it('gets a list of secrets if signed in', async () => {
    const expected = [
      {
        id: expect.any(String),
        title: 'Secret 1',
        description: 'The first big secret, I will never tell you.',
        createdAt: expect.any(String),
      },
      {
        id: expect.any(String),
        title: 'Secret 2',
        description: 'The second secret, I might tell.',
        createdAt: expect.any(String),
      },
    ];
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual(expected);
  });
});

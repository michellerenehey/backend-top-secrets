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

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    const agent = request.agent(app);
    await UserService.create(mockUser);
    const { email, password } = mockUser;

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    expect(res.body).toEqual({
      message: 'Signed in successfully!',
    });
  });

  it('returns 401 error & message if user does not exist', async () => {
    const agent = request.agent(app);
    const { email, password } = mockUser;

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    expect(res.body).toEqual({
      message: 'Invalid credentials',
      status: 401,
    });
  });

  it('signs out an existing user', async () => {
    const agent = request.agent(app);
    await UserService.create(mockUser);
    const { email, password } = mockUser;

    await agent.post('/api/v1/users/sessions').send({ email, password });

    const res = await agent.delete('/api/v1/users/sessions');

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});

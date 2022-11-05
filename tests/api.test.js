require('dotenv').config();
const supertest = require('supertest');

const app = require('../src/index.js');

const authHeader = {
  authorization: process.env.GIT_KEY
}

/**
 * Test authorization middleware
 */
describe('Auth', () => {
  test("No auth", async () => {
    const response = await supertest(app).get('/').expect(401);
  });

  test("Auth", async () => {
    const response = await supertest(app).get('/').set(authHeader).expect(404);
  });

});

/**
 * Test GET questions endpoint
 */
describe('GET /qa/questions', () => {

  //TODO: Queries

  /**
   * No product_id provided
   */
  test("No product_id provided", async () => {
    const response = await supertest(app).get('/qa/questions').set(authHeader).expect(422);
  });

  /**
   * Malformed product_id provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).get('/qa/questions').set(authHeader).expect(422);
  });

  /**
   * Good request
   */
  test("Status 200 good request", async () => {
    const response = await supertest(app).get('/qa/questions?product_id=66642').set(authHeader).expect(200);
  });
});

/**
 * Test GET answers endpoint
 */
describe('GET /qa/questions/question_id/answers', () => {

  //TODO: Queries


  /**
   * Malformed question_id provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).get('/qa/questions/a/answers').set(authHeader).expect(422);
  });

  /**
   * Good request
   */
  test("Status 200 good request", async () => {
    const response = await supertest(app).get('/qa/questions/66642/answers').set(authHeader).expect(200);
  });
});

/**
 * Test POST questions endpoint
 */
describe('POST /qa/questions', () => {
  //TODO: Queries

  let goodData = {
    product_id: 66642,
    body: 'Howdy!',
    name: 'Bobby',
    email: 'milril@gma.il'
  }

  /**
   * Good request
   */
  test("Status 201 good request", async () => {
    const response = await supertest(app).post('/qa/questions?product_id=a').set(authHeader).send(goodData).expect(201);
  });

  /**
   * No product_id provided
   */
  test("No product_id provided", async () => {
    const response = await supertest(app).post('/qa/questions').set(authHeader).expect(422);
  });

  let malformedIdData = {...goodData, product_id: 'a'}

  /**
   * Malformed product_id provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).post('/qa/questions?product_id=a').set(authHeader).send(malformedIdData).expect(422);
  });

  let invalidNameData = {...goodData, name: ''}

  /**
   * Malformed product_id provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).post('/qa/questions?product_id=a').set(authHeader).send(malformedIdData).expect(422);
  });

  /**
   * Invalid name provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).post('/qa/questions?product_id=a').set(authHeader).send(malformedIdData).expect(422);
  });

  /**
   * Invalid email provided
   */
  test("Malformed product_id provided", async () => {
    const response = await supertest(app).post('/qa/questions?product_id=a').set(authHeader).send(malformedIdData).expect(422);
  });
});
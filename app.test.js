jest.setTimeout(300000);
const request = require("supertest");
const app = require("./app");
const fs = require('fs');
const config = require('./config')

describe('/GET -> /files/:publicKey', () => {
  test("It should response the GET method", async () => {
    const response = await request(app)
      .get(`/files/${config.publicKey}`);
    expect(response.statusCode).toBe(200);
  });

  test("It should response the POST method", async () => {
    const filePath = `${__dirname}/test-upload/diu.jpeg`;
    const file = fs.readFileSync(filePath);
    const response = await request(app)
      .post("/files")
      .attach('file', file);
    expect(response.statusCode).toBe(201);
  });

  test("It should response the DELETE method", async () => {
    const response = await request(app)
      .delete(`/files/${config.privateKey}`)
    expect(response.statusCode).toBe(200);
  });

  test("It should response the POST method", async () => {
    const filePath = `${__dirname}/test-upload/diu.jpeg`;
    const response = await request(app)
      .post("/files")
      .attach('file', filePath);
    expect(response.statusCode).toBe(201);
  });

});

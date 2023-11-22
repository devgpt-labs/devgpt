const request = require('supertest');
const express = require('express');
const select_files = require('../modules/select_files');

const app = express();
app.use(express.json());
app.post('/select-files', select_files);

describe('POST /select-files', () => {
  test('should respond with 400 status code for invalid parameters', async () => {
    const response = await request(app)
      .post('/select-files')
      .send({ prunedLofaf: null, task: null });
    expect(response.statusCode).toBe(400);
  });

  test('should respond with 200 status code for valid parameters', async () => {
    const response = await request(app)
      .post('/select-files')
      .send({ prunedLofaf: ['file1.js', 'file2.js'], task: 'Write unit tests' });
    expect(response.statusCode).toBe(200);
  });

  // Add more tests as needed
});

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import request from 'supertest';
import app from '../app';
import { originalDirectory, processedDirectory } from '../utils/image-resizer';

test.before(async () => {
  await fs.mkdir(originalDirectory, { recursive: true });
  await sharp({ create: { width: 20, height: 10, channels: 3, background: 'steelblue' } }).jpeg().toFile(path.join(originalDirectory, 'test-image.jpg'));
});
test.after(async () => {
  await fs.rm(path.join(originalDirectory, 'test-image.jpg'), { force: true });
  await fs.rm(path.join(processedDirectory, 'test-image-8x6.jpg'), { force: true });
});
test('resizes a requested source image', async () => {
  const response = await request(app).get('/api/images?filename=test-image.jpg&width=8&height=6');
  assert.equal(response.status, 200);
  const metadata = await sharp(response.body).metadata();
  assert.deepEqual({ width: metadata.width, height: metadata.height }, { width: 8, height: 6 });
});
test('returns 404 for a missing source image', async () => {
  const response = await request(app).get('/api/images?filename=missing.jpg&width=120&height=80');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'source image was not found' });
});
test('rejects missing or invalid dimensions', async () => {
  const response = await request(app).get('/api/images?filename=mountain.jpg&width=wide&height=0');
  assert.equal(response.status, 400);
  assert.match(response.body.error, /integers from 1 to 5000/);
});
test('rejects path traversal and unsupported files', async () => {
  const response = await request(app).get('/api/images?filename=../secret.txt&width=100&height=100');
  assert.equal(response.status, 400);
  assert.match(response.body.error, /supported image file name/);
});
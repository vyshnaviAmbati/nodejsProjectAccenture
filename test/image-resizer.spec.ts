import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  originalDirectory,
  processedDirectory,
  resizeImage,
} from '../utils/image-resizer';

describe('resizeImage', () => {
  const sourceFilename = 'direct-test-image.jpg';
  const outputFilename = 'direct-test-image-8x6.jpg';
  const sourcePath = path.join(originalDirectory, sourceFilename);
  const outputPath = path.join(processedDirectory, outputFilename);

  beforeAll(async () => {
    await fs.mkdir(originalDirectory, { recursive: true });
    await sharp({
      create: { width: 20, height: 10, channels: 3, background: 'steelblue' },
    })
      .jpeg()
      .toFile(sourcePath);
  });

  afterAll(async () => {
    await fs.rm(sourcePath, { force: true });
    await fs.rm(outputPath, { force: true });
  });

  it('resizes a valid image when called directly', async () => {
    const result = await resizeImage(sourceFilename, 8, 6);
    const metadata = await sharp(result.outputPath).metadata();

    expect(result.outputFilename).toBe(outputFilename);
    expect(metadata.width).toBe(8);
    expect(metadata.height).toBe(6);
  });

  it('rejects an invalid source image', async () => {
    await expectAsync(resizeImage('missing-image.jpg', 8, 6)).toBeRejected();
    await expectAsync(resizeImage(sourceFilename, 0, 6)).toBeRejected();
  });
});

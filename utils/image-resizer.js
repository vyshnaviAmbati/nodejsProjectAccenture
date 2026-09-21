const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const originalDirectory = path.join(__dirname, '..', 'assets', 'originals');
const processedDirectory = path.join(__dirname, '..', 'assets', 'processed');

async function resizeImage(filename, width, height) {
  const extension = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, extension);
  const sourcePath = path.join(originalDirectory, filename);
  const outputFilename = `${baseName}-${width}x${height}${extension}`;
  const outputPath = path.join(processedDirectory, outputFilename);

  await fs.access(sourcePath);
  await fs.mkdir(processedDirectory, { recursive: true });
  try {
    await fs.access(outputPath);
  } catch {
    await sharp(sourcePath).resize(width, height).toFile(outputPath);
  }

  return { outputFilename, outputPath };
}

module.exports = { originalDirectory, processedDirectory, resizeImage };

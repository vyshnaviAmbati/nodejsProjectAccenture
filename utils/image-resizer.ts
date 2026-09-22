import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const projectRoot = path.join(__dirname, '..', '..');
export const originalDirectory = path.join(projectRoot, 'assets', 'originals');
export const processedDirectory = path.join(projectRoot, 'assets', 'processed');
export async function resizeImage(filename: string, width: number, height: number): Promise<{ outputFilename: string; outputPath: string }> {
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
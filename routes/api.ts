import express, { Request } from 'express';
import path from 'path';
import { resizeImage } from '../utils/image-resizer';

const router = express.Router();
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
function queryValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
router.get('/images', async (req: Request, res) => {
  const filename = queryValue(req.query.filename);
  const width = Number(queryValue(req.query.width));
  const height = Number(queryValue(req.query.height));
  const extension = path.extname(filename).toLowerCase();
  if (!filename || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 5000 || height > 5000) {
    return res.status(400).json({ error: 'filename, width, and height are required; width and height must be integers from 1 to 5000' });
  }
  if (path.basename(filename) !== filename || !allowedExtensions.has(extension)) {
    return res.status(400).json({ error: 'filename must be a supported image file name' });
  }
  try {
    const { outputPath } = await resizeImage(filename, width, height);
    return res.sendFile(outputPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'ENOTFOUND') return res.status(404).json({ error: 'source image was not found' });
    return res.status(500).json({ error: 'image could not be processed' });
  }
});
export = router;
import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
  let width = Number(req.query.width) || 800;
  let height = Number(req.query.height) || 500;
  width = Math.min(Math.max(Math.round(width), 1), 5000);
  height = Math.min(Math.max(Math.round(height), 1), 5000);
  res.render('index', { title: 'Himalayas Image Resizer', width, height });
});
export = router;
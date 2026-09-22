import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import apiRouter from './routes/api';

const app = express();
const projectRoot = path.join(__dirname, '..');
app.set('views', path.join(projectRoot, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(projectRoot, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(createError(404)),
);
app.use(
  (
    error: Error & { status?: number },
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(error.status || 500);
    res.render('error');
  },
);
export = app;

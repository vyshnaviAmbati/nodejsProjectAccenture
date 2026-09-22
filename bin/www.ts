#!/usr/bin/env node
import http from 'http';
import debugFactory from 'debug';
import app from '../app';

const debug = debugFactory('express:server');
const port = normalizePort(process.env.PORT || '8081');
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(value: string): number | string | false {
  const parsedPort = Number.parseInt(value, 10);
  return Number.isNaN(parsedPort)
    ? value
    : parsedPort >= 0
      ? parsedPort
      : false;
}
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  if (error.code === 'EACCES') {
    console.error(`${bind} requires elevated privileges`);
    process.exit(1);
  }
  if (error.code === 'EADDRINUSE') {
    console.error(`${bind} is already in use`);
    process.exit(1);
  }
  throw error;
}
function onListening(): void {
  const address = server.address();
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;
  debug(`Listening on ${bind}`);
}

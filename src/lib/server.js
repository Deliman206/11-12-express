'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import doodadRoutes from '../route/doodad-router';

const app = express();
let server = null;
app.use(doodadRoutes);
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(process.env.MONGODB_URI, process.env.PORT, 'checking MONGODB URI and PORT');
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };

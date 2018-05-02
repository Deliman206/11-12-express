'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-error';
import Doodad from '../model/doodad';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const doodadRouter = new Router();

doodadRouter.post('/api/doodad', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'POST: Processing a request to /api/doodad');
  if (!request.body.name) {
    logger.log(logger.INFO, 'POST: Responding with 417 Status No Name Given');
    return next(new HttpErrors(417, 'Name is required'));
  }
  if (!request.body.size) {
    logger.log(logger.INFO, 'POST: Responding with 417 Status No Size Given');
    return next(new HttpErrors(417, 'Size is required'));
  }
  return new Doodad(request.body).save()
    .then((doodad) => {
      logger.log(logger.INFO, 'POST: Responding with 202 Status Passed to MongoDB');
      logger.log(logger.INFO, `The new Doodad is ${doodad} and had id {doodad.id}`);
      return response.json(doodad);
    })
    .catch(next);
});
doodadRouter.get('/api/doodad', (request, response, next) => {
  logger.log(logger.INFO, 'GET: Processing a request');

  return Doodad.find()
    .then((collection) => {
      if (!collection) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - No response');
        return next(new HttpErrors(404, 'No Response'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(collection);
    })
    .catch(next);
});
doodadRouter.get('/api/doodad/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'GET: Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'GET: Responding with 417 Status No Id given');
    return next(new HttpErrors(417, 'No Id for query'));
  }
  return Doodad.findById(request.params.id)
    .then((doodad) => {
      if (!doodad) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!doodad');
        return next(new HttpErrors(404, 'No doodad found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(doodad);
    })
    .catch(next);
});
doodadRouter.delete('/api/doodad/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'DELETE: Processing Request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'GET: Responding with 417 Status No Id given');
    return next(new HttpErrors(417, 'No doodad found'));    
  }
  return Doodad.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'DELETE: Responding with 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default doodadRouter;

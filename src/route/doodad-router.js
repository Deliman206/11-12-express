'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Doodad from '../model/doodad';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const doodadRouter = new Router();

doodadRouter.post('/api/doodad', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST: Processing a request to /api/doodad');
  if (!request.body.name) {
    logger.log(logger.INFO, 'POST: Responding with 417 Status No Name Given');
    return response.status(417);
  }
  if (!request.body.size) {
    logger.log(logger.INFO, 'POST: Responding with 417 Status No Size Given');
    return response.status(417);
  }
  return new Doodad(request.body).save()
    .then((doodad) => {
      logger.log(logger.INFO, 'POST: Responding with 202 Status Passed to MongoDB');
      logger.log(logger.INFO, `The new Doodad is ${doodad} and had id {doodad.id}`);
      return response.json(doodad);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});
doodadRouter.get('/api/doodad', (request, response) => {
  logger.log(logger.INFO, 'GET: Processing a request');

  return Doodad.collection.find()
    .then((collection) => {
      if (!collection) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - No Collection');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(collection);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to collection failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - collection not found');
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});
doodadRouter.get('/api/doodad/:id', (request, response) => {
  logger.log(logger.INFO, 'GET: Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'GET: Responding with 417 Status No Id given');
    return response.status(417);
  }
  return Doodad.findById(request.params.id)
    .then((doodad) => {
      if (!doodad) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!doodad');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(doodad);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});
doodadRouter.delete('/api/doodad/delete/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE: Processing Request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'GET: Responding with 417 Status No Id given');
    return response.status(417);
  }
  return Doodad.collection.findOneAndDelete(request.params.id)
    .then((doodad) => {
      if (!doodad) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!doodad');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE: Responding with 204 status code');
      return response.status(204);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default doodadRouter;

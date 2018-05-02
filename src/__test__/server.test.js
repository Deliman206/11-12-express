'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Doodad from '../model/doodad';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/doodad`;
const createDoodadMock = () => {
  return new Doodad({
    name: faker.lorem.words(10),
    size: faker.lorem.words(25),
    color: faker.commerce.color(),
    usage: faker.lorem.words(15),
  }).save();
};

describe('Routes for /api/doodad', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Doodad.remove({}));
  describe('POST /api/doodad', () => {
    test('POST - It should respond with a 200 status ', () => {
      const doodadToPost = {
        name: faker.lorem.words(10),
        size: faker.lorem.words(25),
        color: faker.commerce.color(),
        usage: faker.lorem.words(15),
      };
      return superagent.post(apiURL)
        .send(doodadToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(doodadToPost.name);
          expect(response.body.size).toEqual(doodadToPost.size);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('POST - It should respond with a 417 status if no Size', () => {
      const doodadToPost = {
        name: faker.lorem.words(2),
        color: faker.commerce.color(),
        usage: faker.lorem.words(15),
      };
      return superagent.post(apiURL)
        .send(doodadToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(417);
        });
    });
    test('POST - It should respond with a 417 status if no name', () => {
      const doodadToPost = {
        size: faker.lorem.words(2),
        color: faker.commerce.color(),
        usage: faker.lorem.words(15),
      };
      return superagent.post(apiURL)
        .send(doodadToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(417);
        });
    });
    test('POST - It should respond with a 500 status if internal error', () => {
      // return superagent.post(apiURL)          
      //   .then(Promise.reject)
      //   .catch((response) => {
      //     expect(response.status).toEqual(500);
      //   });
    });
  });
  describe('GET /api/doodad/:id', () => {
    test('Should get 417 error code because no query Id', () => {
      return superagent.get(`${apiURL}`)
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(417);
        });
    });
    test('should respond with 200 if there are no errors', () => {
      let doodadToTest = null; 
      return createDoodadMock() 
        .then((doodad) => {
          doodadToTest = doodad;
          return superagent.get(`${apiURL}/${doodad._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(doodadToTest.name);
          expect(response.body.size).toEqual(doodadToTest.size);
        });
    });
    test('should respond with 404 if there is no note to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('GET /api/doodad', () => {
    test('should respond with 200 if there are no errors', () => {
      return superagent.get(apiURL)
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
    test('should respond with 404 if there is no note to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/doodad/:id', () => {
    test('Should get 417 error code because no query Id', () => {
      return superagent.delete(`${apiURL}`)
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(417);
        });
    });
    test('Should get 404 error code because no Match Id', () => {
      return superagent.delete(`${apiURL}/1234`)
        .then(() => {})
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('Should get 204 status code for successful deletion', () => {
      // let doodadToTest = null;       
      return createDoodadMock()
        .then((doodad) => {
          // doodadToTest = doodad;
          return superagent.delete(`${apiURL}/${doodad._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });   
});

'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Doodad from '../model/doodad';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/doodad`;
console.log(process.env.MONGODB_URI, 'testing URI');
console.log(apiURL, 'Checking API URL');
const createDoodadMock = () => {
  return new Doodad({
    name: faker.lorem.words(10),
    size: faker.lorem.words(25),
    color: faker.commerce.color(),
    usage: faker.lorem.words(15),
  }).save();
};

describe('POST /api/doodad', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Doodad.remove({}));
  
  test('POST - It should respond with a 200 status ', () => {
    const doodadToPost = {
      name: faker.lorem.words(2),
      size: faker.lorem.words(2),
      color: faker.commerce.color(),
      usage: faker.lorem.words(15),
    };
    return superagent.post(apiURL)
      .send(doodadToPost)
      .then((response) => {
        console.log('Is it hitting here inside return');
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(doodadToPost.name);
        expect(response.body.size).toEqual(doodadToPost.size);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      })
      .catch(err => console.log(err, 'this is catch for post'));
  });
  test('POST - It should respond with a 417 status ', () => {
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
  describe('GET /api/doodad', () => {
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
});

# Technology used
1. restify - web service framework optimized for building rest api. Optimized for introspection and performance.
2. docker/docker-compose - for easier creation, deployment and running applications.
3. mongoose - MongoDB object modeling tool designed to work in an asynchronous environment.
4. mongodb - non-sql, schema-less document oriented storage.
5. jest 
6. supertest

# Running the app
1. open a new terminal and run the code below
```bash
$ docker-compose up
```
2. once done, open the app at http://localhost:4000
- Note: if you have some port conflict, change the docker-compose.yaml port to a new a port

# Running the test
1. running mongodb; make sure you have a running mongodb in your local and is accessible using this URI
```javascript
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
```
- if you don't have, you could run this instead
```bash
$ docker-compose up mongo
```
2. then, run the test (on a separate terminal)
```bash
$ yarn test
```
or
```bash
$ npm run test
```
- Note: if you have a different mongodb uri to connect to, change the URI in the ./script/jestTestSetup.js file before running the test

# Using the app
Postman could be used to try the application

Below are the exposed routes of the api
1. POST /friends
  - input example
  ```json
  {
    "friends": ["test1@test.com", "test2@test.com"]
  }
  ```
  - output
  ```json
  {
    "success": true
  }
  ```
2. GET /friends/:email
 - url example
  ```json
  http://localhost:4000/friends/test1@test.com
  ```
  - output
  ```json
 {
    "success": true,
    "friends": [
        "test2@ttest.com"
    ],
    "count": 1
}
  ```

3. POST /friends/common
 ```json
  {
    "friends": ["test1@test.com", "test2@test.com"]
  }
  ```
  - output
  ```json
  {
    "count": 1,
    "friends": [
      "test3@test.com",
    ],
    "success": true
  }
  ```

4. POST /friends/subscribe
```json
  {
    "requestor": "test1@test.com", 
    "target": "test2@test.com"
  }
  ```
  - output
  ```json
  {
    "success": true
  }
  ```

5. POST /friends/block
```json
  {
    "requestor": "test1@test.com", 
    "target": "test2@test.com"
  }
  ```
  - output
  ```json
  {
    "success": true
  }
  ```
6. POST /friends/post
```json
  {
    "sender": "test1@test.com", 
    "text": "Hello World! test2@test.com"
  }
  ```
  - output
  ```json
  {
    "recipients": [
      "test2@test.com",
      "test3@test.com"
    ],
    "success": true
  }
  ```

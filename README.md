# Technology used
1. restify - web service framework optimized for building rest api. Optimized for introspection and performance.
2. docker/docker-compose - for easier creation, deployment and running applications
3. mongoose - common ORM for mongodb
4. mongodb - non-sql, schema-less document oriented storage.
5. jest 
6. superagent

# Running the app
1. open a new terminal and run the code below
```bash
$ docker-compose up
```
2. once done, you could access the app the http://localhost:4000
- Note: if you have some port conflict, you could change the docker-compose.yaml port to a new a port

# Running the test
1. running mongodb, make sure you have a running mongodb in your local and it accessible using this URI
```javascript
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
```
- if you don't have you could run this instead
```bash
$ docker-compose up mongo
```
2. then, run the test
```bash
$ yarn test
```
or
```bash
npm run test
```
- Note: if you have a different mongodb uri set to connect to, change the URI in the ./script/jestTestSetup.js file

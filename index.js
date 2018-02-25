import restify from 'restify';
import restifyPromise from 'restify-await-promise';
import mongoose from 'mongoose';

import config from './config';

const respond = (req, res, next) => {
    res.send('hello world' + req.params.name);
};

const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());

server.get('/test', respond)

server.listen(config.port, () => {
    mongoose.connect(config.db.uri);

    const db = mongoose.connection;

    db.on('error', err => {
        console.error(err);
        process.exit(1);
    });

    db.once('open', () => {
        console.log('connected db>>>', config.db.uri)
        console.log(`Server is listening on port ${config.port}`);
    });
});
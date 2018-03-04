import restify from 'restify';
import restifyPromise from 'restify-await-promise';
import mongoose from 'mongoose';
import config from './config';
import routes from './routes';

const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());

restifyPromise.install(server)
routes(server);

mongoose.connect(config.db.uri);
const db = mongoose.connection;

db.on('error', err => {
    console.error(err);
    process.exit(1);
});


db.on('open', () => {
    if (process.env.NODE_ENV !== 'test') {
        server.listen(config.port, () => {
            console.log('Mongodb URI: ', process.env.MONGODB_URI || config.db.uri)
            console.log('%s listening at %s', server.name, server.url);
        });
    }
});

module.exports = { server, mongoose };

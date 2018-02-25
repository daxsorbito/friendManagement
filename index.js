import restify from 'restify';
import restifyPromise from 'restify-await-promise';
import mongoose from 'mongoose';
import routes from './routes';

import config from './config';

const respond = (req, res, next) => {
    res.send('hello shit kkskksk ' + req.params.name);
};

const server = restify.createServer();
const errorTransformer = {
    transform: function(exceptionThrownByRoute) {
        //Always blame the user
        console.log('transform>>>', exceptionThrownByRoute)
            // exceptionThrownByRoute.statusCode = 400;
        return exceptionThrownByRoute;
    }
}
const options = {
    errorTransformer
};
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
            console.log('%s listening at %s', server.name, server.url);
        });
    }
});
module.exports = { server, mongoose };
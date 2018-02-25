import error from 'restify-errors';
import Friends from '../models/friends';
import _ from 'lodash';
import utils from '../utils';

module.exports = (server) => {
    server.post('/friends', async(req, res, next) => {
        try {
            if (!req.is('application/json')) {
                res.send(new error.InvalidContentError({}, `Expects 'application/json'`));
                return next();
            }
            const friends = _.get(req, ['body', 'friends'], []);
            const result = await Friends.addFriends(friends);
            res.send({ success: true })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });

}
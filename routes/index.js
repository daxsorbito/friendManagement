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
    server.get('/friends/:email', async(req, res, next) => {
        try {
            const email = _.get(req, ['params', 'email'], '');
            const result = await Friends.getAllFriends(email);
            res.send({ success: true, friends: result, count: result.length })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });
    server.post('/friends/common', async(req, res, next) => {
        try {
            if (!req.is('application/json')) {
                res.send(new error.InvalidContentError({}, `Expects 'application/json'`));
                return next();
            }
            const friends = _.get(req, ['body', 'friends'], []);
            const result = await Friends.getCommonFriends(friends);
            res.send({ success: true, friends: result, count: result.length })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });
    server.post('/friends/subscribe', async(req, res, next) => {
        try {
            if (!req.is('application/json')) {
                res.send(new error.InvalidContentError({}, `Expects 'application/json'`));
                return next();
            }
            const requestor = _.get(req, ['body', 'requestor'], '');
            const target = _.get(req, ['body', 'target'], '');
            const result = await Friends.subscribe(requestor, target);
            res.send({ success: true })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });
    server.post('/friends/block', async(req, res, next) => {
        try {
            if (!req.is('application/json')) {
                res.send(new error.InvalidContentError({}, `Expects 'application/json'`));
                return next();
            }
            const requestor = _.get(req, ['body', 'requestor'], '');
            const target = _.get(req, ['body', 'target'], '');
            console.log('api block>>>', requestor, target)
            const result = await Friends.block(requestor, target);
            res.send({ success: true })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });
    server.post('/friends/post', async(req, res, next) => {
        try {
            if (!req.is('application/json')) {
                res.send(new error.InvalidContentError({}, `Expects 'application/json'`));
                return next();
            }
            const sender = _.get(req, ['body', 'sender'], '');
            const text = _.get(req, ['body', 'text'], '');
            const result = await Friends.getListOfFriendsToBeNotified(sender, text);
            res.send({ success: true, recipients: result })
        } catch (e) {
            utils.restifyErrorWrapper(res, e);
        }
        next();
    });
}
import Friends from '../schema/friends';
import _ from 'lodash';
import helper from '../utils';

const add = async(email, otherFields) => {
    const newFriends = new Friends({ userEmail: email, ...otherFields });
    const result = await newFriends.save();
    return result;
};

const addFriends = async(emails) => {
    helper.validateEmails(emails);
    const results = [];

    for (let email of emails) {
        const friendsList = emails.filter(i => i !== email);
        let foundUser = await Friends.findOne({ userEmail: email });
        if (!foundUser) {
            foundUser = await add(email, { friends: friendsList });
        } else {
            foundUser = await Friends.update({ _id: foundUser._id }, {
                friends: _.uniq([...friendsList, ...foundUser.friends])
            });
        }
        results.push(foundUser);
    };

    return results;
}

const getAllFriends = async(email) => {
    helper.validateEmail(email);
    const result = await Friends.findOne({ userEmail: email }, { friends: 1, _id: 0 });
    if (!result) {
        helper.throwNotFoundError();
    }
    return result.friends;
}

const getCommonFriends = async(emails) => {
    helper.validateEmails(emails);
    const results = await Friends.find({ userEmail: { '$in': emails } }, { friends: 1, _id: 0 });
    if (results.length !== emails.length) {
        return [];
    }
    return _.intersection(...results.map(i => _.get(i, 'friends', [])));
}

const subscribe = async(requestor, target) => {
    const combinedEmails = [requestor, target];
    helper.validateEmails(combinedEmails);
    const allUsers = await Friends.find({ userEmail: { '$in': combinedEmails } }, { userEmail: 1, subscribers: 1 });

    const requestorUser = allUsers.filter(i => i.userEmail === requestor);
    const targetUser = allUsers.filter(i => i.userEmail === target);

    if (!requestorUser.length) {
        helper.throwNotFoundError('requestor');
    }
    if (!targetUser.length) {
        helper.throwNotFoundError('target');
    }

    const result = await Friends
        .update({ userEmail: target }, { subscribers: _.uniq([..._.get(targetUser, 'subscribers', []), requestor]) });

    return result;
}

const block = async(requestor, target) => {
    const combinedEmails = [requestor, target];
    helper.validateEmails(combinedEmails);
    const allUsers = await Friends.find({ userEmail: { '$in': combinedEmails } }, { userEmail: 1, blocked: 1 });
    const requestorUser = allUsers.filter(i => i.userEmail === requestor);
    const targetUser = allUsers.filter(i => i.userEmail === target);
    if (!requestorUser.length) {
        helper.throwNotFoundError('requestor');
    }
    if (!targetUser.length) {
        helper.throwNotFoundError('target');
    }

    const result = await Friends
        .update({ _id: requestorUser[0]._id }, { blocked: _.uniq([..._.get(requestorUser, '0.blocked', []), target]) });

    return result;
}

const getListOfFriendsToBeNotified = async(email, msg) => {
    helper.validateEmail(email);
    const mentions = helper.extractEmailMentions(msg || '') || [];
    const requestorData = await Friends.findOne({ userEmail: email }, { userEmail: 1, subscribers: 1, friends: 1, blocked: 1 });

    const blocked = _.get(requestorData, 'blocked', []);
    const tentativeRecipients = _.uniq([
        ...mentions,
        ..._.get(requestorData, 'friends', []),
        ..._.get(requestorData, 'subscribers', []),
    ]);

    const result = tentativeRecipients.filter(i => blocked.indexOf(i) === -1);
    return result;
}

module.exports = {
    add,
    addFriends,
    getAllFriends,
    getCommonFriends,
    subscribe,
    block,
    getListOfFriendsToBeNotified
}
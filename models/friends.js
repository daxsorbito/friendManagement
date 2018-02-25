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



module.exports = {
    add,
    addFriends,
    getAllFriends,
    getCommonFriends,
}
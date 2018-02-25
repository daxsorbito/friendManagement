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


module.exports = {
    add,
    addFriends,
}
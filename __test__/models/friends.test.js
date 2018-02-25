import Friends from '../../models/friends'
import config from '../../config';
import mongoose from 'mongoose';

const selectProjection = {
    userEmail: 1,
    friends: 1,
    blocked: 1,
    subscribers: 1,
    _id: 0
}

describe('Friends model test', () => {
    beforeAll(async() => {
        await mongoose.connect(config.db.uri);
    });

    afterAll(async() => {
        try {
            await mongoose.disconnect();
        } catch (e) {
            console.log(e);
        }

    });

    beforeEach(async() => {
        await mongoose.models.Friends.remove(); // remove this later
    });
    afterEach(async() => {
        await mongoose.models.Friends.remove();
    });

    describe('addFriends# method tests', () => {
        it('should be able to add and connect friends', async() => {
            expect.assertions(1);
            // user with an existing friend that is part of the request 
            await Friends.add('test1@test.com', { friends: ['test2@test.com'] });
            // user with an existing friend that is not part of the request
            await Friends.add('test2@test.com', { friends: ['test_doestnot_exist@test.com'] });
            const friendEmails = ['test1@test.com', 'test2@test.com', 'test3@test.com'];

            await Friends.addFriends(friendEmails);

            const testUsers = await mongoose.models
                .Friends.find({
                        $or: [
                            { userEmail: 'test1@test.com' },
                            { userEmail: 'test2@test.com' },
                            { userEmail: 'test3@test.com' }
                        ]
                    },
                    selectProjection);
            expect(testUsers).toMatchSnapshot();
        });

        it('should throw an exception if payload is invalid', async() => {
            expect.assertions(1);
            try {
                await Friends.addFriends({});
            } catch (e) {
                expect(e.message).toEqual('Invalid friends payload.');
            }
        });

        it('should throw an exception if payload contains an invalid email', async() => {
            expect.assertions(1);
            try {
                await Friends.addFriends(['test@test.com', 'INVALID_EMAIL']);
            } catch (e) {
                expect(e.message).toEqual('Invalid email on one of the friends payload.');
            }
        });

        it('should throw an exception if email payload is less than 2', async() => {
            expect.assertions(1);
            try {
                await Friends.addFriends(['test@test.com']);
            } catch (e) {
                expect(e.message).toEqual('Insufficient number of email addresses supplied.');
            }
        });
    });

    describe('getAllFriends# method tests', () => {
        it('should be able to retrive friends', async() => {
            expect.assertions(3);
            await Friends.add('test1@test.com', { friends: ['test2@test.com', 'test3@test.com'] });
            const friends = ['test1@test.com', 'test2@test.com', 'test3@test.com'];

            await Friends.addFriends(friends);
            for (let email of friends) {
                expect(await Friends.getAllFriends(email)).toMatchSnapshot();
            }
        });

        it('should throw an exception if email is invalid', async() => {
            expect.assertions(1);
            try {
                await Friends.getAllFriends('INVALID_EMAIL');
            } catch (e) {
                expect(e.message).toEqual('Invalid email address.');
            }
        });

        it('should throw an exception if email is not found', async() => {
            expect.assertions(1);
            try {
                await Friends.getAllFriends('test1@test.com');
            } catch (e) {
                expect(e.message).toEqual('Resource not found.');
            }
        });
    });

    describe('getCommonFriends# method tests', () => {
        it('should be able to retrieve common friends', async() => {
            const friendEmails = ['test1@test.com', 'test2@test.com', 'test3@test.com'];
            await Friends.addFriends(friendEmails);

            const results = await Friends.getCommonFriends(['test1@test.com', 'test3@test.com']);

            expect(results).toMatchSnapshot();
        });

        it('should be not be able to retrieve common friends', async() => {
            const friendEmails = ['test1@test.com', 'test2@test.com', 'test3@test.com'];
            await Friends.addFriends(friendEmails);

            const results = await Friends.getCommonFriends(['test1@test.com', 'test5@test.com']);

            expect(results).toMatchSnapshot();
        });
    });

    describe('subscribe# method tests', () => {
        it('should be able to set the subcription', async() => {
            expect.assertions(2);
            await Friends.add('test1@test.com');
            await Friends.add('test2@test.com');

            const results = await Friends.subscribe('test2@test.com', 'test1@test.com');

            expect(results).toMatchSnapshot();

            const target = await mongoose.models.Friends.find({ userEmail: 'test1@test.com' },
                selectProjection);

            expect(target).toMatchSnapshot();
        });

        it('should throw an exception if requestor is not found', async() => {
            expect.assertions(1);
            await Friends.add('test1@test.com');

            try {
                await Friends.subscribe('NOTFOUND@test.com', 'test1@test.com');
            } catch (e) {
                expect(e.message).toEqual('Resource not found. --requestor');
            }
        });
        it('should throw an exception if target is not found', async() => {
            expect.assertions(1);
            await Friends.add('test1@test.com');

            try {
                await Friends.subscribe('test1@test.com', 'NOTFOUND@test.com');
            } catch (e) {
                expect(e.message).toEqual('Resource not found. --target');
            }
        });
    });

    describe('block# method tests', () => {
        it('should be able to set the subcription', async() => {
            expect.assertions(2);
            await Friends.add('test1@test.com');
            await Friends.add('test2@test.com');

            const results = await Friends.block('test1@test.com', 'test2@test.com');

            expect(results).toMatchSnapshot();

            const target = await mongoose.models.Friends.find({ userEmail: 'test1@test.com' },
                selectProjection);

            expect(target).toMatchSnapshot();
        });

        it('should throw an exception if requestor is not found', async() => {
            expect.assertions(1);
            await Friends.add('test1@test.com');

            try {
                await Friends.block('NOTFOUND@test.com', 'test1@test.com');
            } catch (e) {
                expect(e.message).toEqual('Resource not found. --requestor');
            }
        });
        it('should throw an exception if target is not found', async() => {
            expect.assertions(1);
            await Friends.add('test1@test.com');

            try {
                await Friends.block('test1@test.com', 'NOTFOUND@test.com');
            } catch (e) {
                expect(e.message).toEqual('Resource not found. --target');
            }
        });
    });


})
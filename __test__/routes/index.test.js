import request from 'supertest';
import { server, mongoose } from '../../index';

describe('routes test', () => {
    afterAll(async() => {
        await mongoose.disconnect();
    });
    afterEach(async() => {
        await mongoose.models.Friends.remove();
    });

    describe('POST# /friends', () => {
        it('should pass if correct data is passed', async() => {
            const result = await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com'] });
            expect(result.body).toMatchSnapshot();
        });

        it('should fail if content type is not json', async() => {
            const result = await request(server).post('/friends').send('test');
            expect(result.statusCode).toEqual(400);
            expect(result.body).toMatchSnapshot();
        });

        it('should fail if only one email is supplied in the payload', async() => {
            const result = await request(server).post('/friends')
                .send({ friends: ['test1@test.com'] });
            expect(result.statusCode).toEqual(400);
            expect(result.body).toMatchSnapshot();
        });

        it('should fail if payload is not array', async() => {
            const result = await request(server).post('/friends')
                .send({ friends: { email: 'test1@test.com' } });
            expect(result.statusCode).toEqual(400);
            expect(result.body).toMatchSnapshot();
        });
    });

    describe('GET# /friends/:email', () => {
        it('should pass if email is found', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com'] });

            const result = await request(server).get('/friends/test1@test.com');

            expect(result.body).toMatchSnapshot();
        });

        it('should fail if email is invalid', async() => {
            const result = await request(server).get('/friends/INVALID_EMAIL');

            expect(result.statusCode).toEqual(400);
            expect(result.body).toMatchSnapshot();
        });

        it('should fail if email is not found', async() => {
            const result = await request(server).get('/friends/test1@test.com');

            expect(result.statusCode).toEqual(404);
            expect(result.body).toMatchSnapshot();
        });
    });

    describe('POST# /friends/common', () => {
        it('should pass if both has common friends', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/common')
                .send({ friends: ['test1@test.com', 'test3@test.com'] });

            expect(result.body).toMatchSnapshot();
        });

        it('should pass if there are no common friends', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/common')
                .send({ friends: ['test1@test.com', 'test5@test.com'] });

            expect(result.body).toMatchSnapshot();
        });
    });

    describe('POST# /friends/subscribe', () => {
        it('should pass if both requestor and target are valid', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/subscribe')
                .send({ requestor: 'test2@test.com', target: 'test1@test.com' });

            expect(result.body).toMatchSnapshot();
        });

        it('should not pass if requestor is not found', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/subscribe')
                .send({ requestor: 'NOTFOUND@test.com', target: 'test1@test.com' });

            expect(result.body).toMatchSnapshot();
        });

        it('should not pass if target is not found', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/subscribe')
                .send({ requestor: 'test1@test.com', target: 'NOTFOUND@test.com' });

            expect(result.body).toMatchSnapshot();
        });
    });

    describe('POST# /friends/block', () => {
        it('should pass if both requestor and target are valid', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/block')
                .send({ requestor: 'test2@test.com', target: 'test1@test.com' });

            expect(result.body).toMatchSnapshot();
        });

        it('should not pass if requestor is not found', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/block')
                .send({ requestor: 'NOTFOUND@test.com', target: 'test1@test.com' });

            expect(result.body).toMatchSnapshot();
        });

        it('should not pass if target is not found', async() => {
            await request(server)
                .post('/friends').send({ friends: ['test1@test.com', 'test2@test.com', 'test3@test.com'] });

            const result = await request(server)
                .post('/friends/block')
                .send({ requestor: 'test1@test.com', target: 'NOTFOUND@test.com' });

            expect(result.body).toMatchSnapshot();
        });
    });


});
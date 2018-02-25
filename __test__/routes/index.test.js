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


});
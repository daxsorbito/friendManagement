import request from 'supertest';
import { server, mongoose } from '../../index';

describe('routes test', () => {
    it('should connect to mongoose', () => {
        expect(process.env.MONGODB_URI).toEqual('mongodb://127.0.0.1:27017/test')
    });

});
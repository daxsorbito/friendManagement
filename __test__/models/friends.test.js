import config from '../../config';
import mongoose from 'mongoose';

describe('model test', () => {
    it('should connect to mongoose', () => {
        expect(process.env.MONGODB_URI).toEqual('mongodb://127.0.0.1:27017/test')
    });
})
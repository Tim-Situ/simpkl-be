const app = require('../index');
const request = require('supertest')

describe('API Pengumuman', () => {
    it('GET /pengumuman - should return all items', async () => {
        const res = await request(app).get('/pengumuman/all');
        expect(res.statusCode).toBe(200);
    });
})
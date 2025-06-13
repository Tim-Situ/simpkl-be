const app = require('../index');
const request = require('supertest')

describe('API Pengumuman', () => {
    it('GET /pengumuman - Menampilkan seluruh data pengumuman', async () => {
        const res = await request(app).get('/pengumuman/all');
        expect(res.statusCode).toBe(200);

        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);

        const firstItem = res.body.data[0];
        expect(firstItem).toHaveProperty('id');
        expect(firstItem).toHaveProperty('pengumuman');
        expect(firstItem).toHaveProperty('status');
        expect(firstItem).toHaveProperty('createdBy');
        expect(firstItem).toHaveProperty('updatedBy');
        expect(firstItem).toHaveProperty('createdAt');
        expect(firstItem).toHaveProperty('updatedAt');
    });
})
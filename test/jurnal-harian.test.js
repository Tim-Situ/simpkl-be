const app = require('../index');
const request = require('supertest')

let id_jurnal

describe("POST /jurnal-harian/create - Upload Jurnal Harian", () => {
    it("Harus berhasil mengunggah jurnal", async () => {
        const res = await request(app)
            .post("/jurnal-harian/create")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_SISWA)
            .field("hari", "Senin")
            .field("tanggal", "2025-06-01")
            .field("jenis_pekerjaan", "Menulis Laporan")
            .field("deskripsi_pekerjaan", "Menulis laporan harian PKL")
            .field("bentuk_kegiatan", "Individu")
            .field("jam_mulai", "08:00:00")
            .field("jam_selesai", "10:00:00")
            .field("staf", "Bu Lilis")
            .attach("foto", Buffer.from("dummy-image"), {
                filename: "foto.jpg",
                contentType: "image/jpeg"
            });
            

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");

        id_jurnal = res.body.data.id
    });

    it("harus gagal jika inputan tidak lengkap", async () => {
        const res = await request(app)
            .post("/jurnal-harian/create")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_SISWA)
            .field("hari", "Senin") // tidak lengkap
            .attach("foto", Buffer.from("dummy-image"), {
                filename: "foto.jpg",
                contentType: "image/jpeg"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message");
    });
});


describe("POST /jurnal-harian/approval-guru - Approval Guru Pembimbing", () => {
    it("harus berhasil menambahkan catatan pembimbing", async () => {
        const res = await request(app)
            .post("/jurnal-harian/approval-guru")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_GURU)
            .send({
                id: id_jurnal,
                catatan_pembimbing: "Bagus, lanjutkan",
                status: "DITERIMA"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Catatan pembimbing berhasil ditambahkan...");
        expect(res.body).toHaveProperty("data");
    });

    it("harus gagal jika inputan tidak lengkap", async () => {
        const res = await request(app)
            .post("/jurnal-harian/approval-guru")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_GURU)
            .send({
                id: id_jurnal,
                // catatan_pembimbing missing
                status: "DITERIMA"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message");
    });

    it("harus mengembalikan 403 jika diakses oleh guru yang tidak membimbing", async () => {
        const res = await request(app)
            .post("/jurnal-harian/approval-guru")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_GURU_TIDAK_AKSES)
            .send({
                id: id_jurnal,
                catatan_pembimbing: "Tidak ada akses",
                status: "DITERIMA"
            });

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message", "Anda tidak memiliki akses ke jurnal ini...");
    });

    it("harus mengembalikan 404 jika jurnal tidak ditemukan", async () => {
        const res = await request(app)
            .post("/jurnal-harian/approval-guru")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_GURU)
            .send({
                id: "b1377fd9-f689-468b-907c-865e88fexxxx",
                catatan_pembimbing: "Coba cek lagi",
                status: "DITOLAK"
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message", "Data jurnal harian tidak ditemukan...");
    });
});


describe("DELETE /jurnal-harian/delete - Hapus Jurnal Harian", () => {

    it("harus menghapus jurnal harian dengan sukses", async () => {
        const res = await request(app)
            .delete("/jurnal-harian/delete")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_SISWA)
            .send({
                id: id_jurnal
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Jurnal harian berhasil dihapus...");
    });

    it("harus gagal ketika jurnal tidak ditemukan", async () => {
        const res = await request(app)
            .delete("/jurnal-harian/delete")
            .set("Authorization", "Bearer " + process.env.TES_TOKEN_SISWA)
            .send({
                id: "b1377fd9-f689-468b-907c-865e88fexxxx"
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message", "Data Jurnal Harian tidak ditemukan...");
    });
});


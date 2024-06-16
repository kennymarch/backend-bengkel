import Pemesanan from "../models/PemesananModel.js";
import User from "../models/UserModel.js";

export const getPemesanan = async (req, res) =>{
    try {

        if(req.role  === 'admin'){
            var response = await Pemesanan.findAll({
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        } else {
            response = await Pemesanan.findAll({
                include:[{
                    model: User,
                    attributes:['name','email']
                }],
                where: {
                    userId: req.userId
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPemesananById = async(req, res) =>{
    try {
        const pemesanan = await Pemesanan.findOne({
            where:{
                uuid: req.params.uuid,
                userId: req.userId
            }
        });
        if(!pemesanan) return res.status(404).json({msg: "Data tidak ditemukan"});

        res.status(200).json(pemesanan);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createPemesanan = async(req, res) =>{
    const nama_pemesan = req.body.nama_pemesan;
    const jenis_kustom = req.body.jenis_kustom;
    const perkiraan_harga = req.body.perkiraan_harga;
    const nomor_telepon_pelanggan = req.body.nomor_telepon_pelanggan;

    try {
        await Pemesanan.create({
            nama_pemesan: nama_pemesan,
            jenis_kustom: jenis_kustom,
            perkiraan_harga: perkiraan_harga,
            nomor_telepon_pelanggan: nomor_telepon_pelanggan,
            userId: req.userId
        });
        res.status(201).json({msg: "Pemesanan berhasil dibuat"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updatePemesanan = async(req, res) =>{
    try {
        const pemesanan = await Pemesanan.findOne({
            where:{
                uuid: req.params.uuid
            },
            include:[{
                model: User,
                attributes:['id', 'uuid', 'name', 'role','email']
            }]
        });
        if(!pemesanan) return res.status(404).json({msg: "Data tidak ditemukan"});
        
        const nama_pemesan = req.body.nama_pemesan;
        const jenis_kustom = req.body.jenis_kustom;
        const perkiraan_harga = req.body.perkiraan_harga;
        const nomor_telepon_pelanggan = req.body.nomor_telepon_pelanggan;
        const selesai = req.body.selesai;

        if(req.role  === 'admin') {
            await Pemesanan.update({
                nama_pemesan,
                jenis_kustom,
                perkiraan_harga,
                nomor_telepon_pelanggan,
            },{
                where:{
                    id: pemesanan.id
                }
            });
        } else {
            if(req.userId !== pemesanan.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Pemesanan.update({
                nama_pemesan,
                jenis_kustom,
                perkiraan_harga,
                nomor_telepon_pelanggan,
            },{
                where:{
                    id: pemesanan.id
                }
            });
        }
        res.status(200).json({msg: "Pemesanan berhasil diperbarui"});
    } catch (error) {
        res.status(500).json({msg: "Pastikan semua data terisi dengan benar dan tidak ada yang kosong. Mohon periksa kembali!"});
    }
}

export const deletePemesanan = async(req, res) =>{
    try {
        const pemesanan = await Pemesanan.findOne({
            where:{
                uuid: req.params.uuid
            },
            include:[{
                model: User,
                attributes:['id', 'uuid', 'name', 'role','email']
            }]
        });
        if(!pemesanan) return res.status(404).json({msg: "Data tidak ditemukan"});

        if(req.role  === 'admin') {
            await Pemesanan.destroy({
                where:{
                    id: pemesanan.id
                }
            });
        } else {
            if(req.userId !== pemesanan.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Pemesanan.destroy({
                where:{
                    id: pemesanan.id
                }
            });
        }
        res.status(200).json({msg: "Pemesanan berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
import KustomSelesai from "../models/KustomSelesaiModel.js";
import Pemesanan from "../models/PemesananModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getKustomSelesai = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await KustomSelesai.findAll({
                include:[
                    {
                        model: User, 
                        attributes:['name','email']
                    },
                    {
                        model: Pemesanan, 
                    }
                ]
            });
        }else{
            response = await KustomSelesai.findAll({
                where:{
                    userId: req.userId
                },
                include:[
                    {
                        model: User, 
                        attributes:['name','email']
                    },
                    {
                        model: Pemesanan, 
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getKustomSelesaiById = async(req, res) =>{
    try {
        const kustomSelesai = await KustomSelesai.findOne({
            where:{
                uuid: req.params.uuid
            }
        });
        if(!kustomSelesai) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await KustomSelesai.findOne({
                where:{
                    id: kustomSelesai.id
                },
                include:[
                    {
                        model: User, 
                        attributes:['name','email']
                    },
                    {
                        model: Pemesanan, 
                    }
                ]
            });
        }else{
            response = await KustomSelesai.findOne({
                where:{
                    [Op.and]:[{id: kustomSelesai.id}, {userId: req.userId}]
                },
                include:[
                    {
                        model: User, 
                        attributes:['name','email']
                    },
                    {
                        model: Pemesanan, 
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createKustomSelesai = async(req, res) =>{
    try {
        if(req.files === null ) return res.status(400).json({msg: 'Tidak ada file gambar yang diuploud. Silahkan uploud file gambar terlebih dahulu'})

        const harga_akhir = req.body.harga_akhir;
        const uuid = req.body.uuid;
        const estimasi_pengerjaan = req.body.estimasi_pengerjaan;
        const file = req.files.file;

        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/hasil-kustom/${fileName}`;
        const allowedType = ['.png', '.jpg', 'jpeg'];
        
        
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Gambar tidak sesuai!"});
        if(fileSize > 20000000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 20MB"});

        const pemesanan = await Pemesanan.findOne({
            where: {
                uuid: uuid
            }
        });
        if(!pemesanan) return res.status(404).json({msg: "Data produk tidak ditemukan!"})
    
        await KustomSelesai.create({
            harga_akhir,
            estimasi_pengerjaan,
            image: fileName,
            url: url,
            userId: req.userId,
            pemesananId: pemesanan.id,
        });
        await Pemesanan.update({selesai: true},{
            where: {
                uuid: pemesanan.uuid
            }
        });
        res.status(201).json({msg: "Barang masuk berhasil ditambahkan"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateKustomSelesai = async(req, res) =>{
    try {
        const kustomSelesai = await KustomSelesai.findOne({
            where:{
                uuid: req.params.uuid
            }
        });
        if(!kustomSelesai) return res.status(404).json({msg: "Data tidak ditemukan"});
        
        // const name = req.body.title;
        // const typeProduct = req.body.type;
        // const brand = req.body.brand;
        // const quantity = req.body.quantites;
        const harga_akhir = req.body.harga_akhir;
        const uuid = req.body.uuid;
        const estimasi_pengerjaan = req.body.estimasi_pengerjaan;
        const file = req.files.file;

        let fileName = "";
        if(req.files === null) {
            fileName = product.image;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = ['.png', '.jpg', 'jpeg'];

            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Gambar tidak sesuai!"});
            if(fileSize > 20000000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 20MB"});
            const filePath = `./public/images/hasil-kustom/${product.image}`;
            fs.unlinkSync(filePath);
            file.mv(`./public/images/hasil-kustom/${fileName}`);
        }

        const image = fileName;
        const url = `${req.protocol}://${req.get("host")}/images/hasil-kustom/${fileName}`;
    
        if(req.role === "admin"){
            await KustomSelesai.update({
                harga_akhir,
                estimasi_pengerjaan,
            },{
                where:{
                    id: kustomSelesai.id
                }
            });
            
            await KustomSelesai.update({image, url},{
                where:{
                    id: kustomSelesai.id
                }
            });
        }else{
            if(req.userId !== kustomSelesai.userId) return res.status(403).json({msg: "Akses terlarang"});
            await KustomSelesai.update({
                harga_akhir,
                estimasi_pengerjaan,
            },{
                where:{
                    [Op.and]:[{id: kustomSelesai.id}, {userId: req.userId}]
                }
            });

            await KustomSelesai.update({image, url},{
                where:{
                    [Op.and]:[{id: kustomSelesai.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Barang masuk berhasil diperbarui"});
    } catch (error) {
        res.status(500).json({msg: "Pastikan semua data terisi dengan benar dan tidak ada yang kosong. Mohon periksa kembali!"});
    }
}

export const deleteKustomSelesai = async(req, res) =>{
    try {
        const kustomSelesai = await KustomSelesai.findOne({
            where:{
                uuid: req.params.uuid
            }
        });
        if(!kustomSelesai) return res.status(404).json({msg: "Data tidak ditemukan"});

        const filePath = `./public/images/hasil-kustom/${product.image}`
        fs.unlinkSync(filePath);
        
        const pemesanan = await Pemesanan.findOne({
            where: {
                id: kustomSelesai.pemesananId
            }
        })
        if(!pemesanan) return res.status(404).json({msg: "Data tidak ditemukan"});

        if(req.role === "admin"){
            await KustomSelesai.destroy({
                where:{
                    id: kustomSelesai.id
                }
            });
        }else{
            if(req.userId !== kustomSelesai.userId) return res.status(403).json({msg: "Akses terlarang"});
            await KustomSelesai.destroy({
                where:{
                    [Op.and]:[{id: kustomSelesai.id}, {userId: req.userId}]
                }
            });
        }

        await Pemesanan.update({selesai: false}, {
            where: {
                uuid: pemesanan.uuid
            }
        })

        res.status(200).json({msg: "Barang masuk berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
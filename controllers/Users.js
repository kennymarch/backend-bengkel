import User from "../models/UserModel.js";
import argon2 from "argon2";
import fs from "fs";
import path from "path";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid', 'name', 'email', 'role', 'image', 'url']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role', 'image', 'url'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    if(req.files === null ) return res.status(400).json({msg: 'Tidak ada file gambar yang diuploud. Silahkan uploud file gambar terlebih dahulu'})

    const name = req.body.nameUser;
    const email = req.body.emailUser;
    const password = req.body.password;
    const confPassword = req.body.confPassword;
    const role = req.body.role;
    const file = req.files.file;

    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Gambar tidak sesuai!"});
    if(fileSize > 10000000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 10MB"});

    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            image: fileName,
            url: url
        });
        file.mv(`./public/images/users/${fileName}`)
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

    let fileName = "";

    const name = req.body.nameUser;
    const email = req.body.emailUser;
    const password = req.body.password;
    const confPassword = req.body.confPassword;
    const role = req.body.role;

    let hashPassword;
    if(password === "" || password === null || password === undefined){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }

    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });

        if(req.files === null) {
            fileName = user.image;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = ['.png', '.jpg', 'jpeg'];

            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Gambar tidak sesuai!"});
            if(fileSize > 20000000) return res.status(422).json({msg: "Gambar harus lebih kecil dari 20MB"});
            const filePath = `./public/images/users/${user.image}`;
            fs.unlinkSync(filePath);
            file.mv(`./public/images/users/${fileName}`);
        }

        const image = fileName;
        const url = `${req.protocol}://${req.get("host")}/images/users/${image}`;

        await User.update({ image, url },{
            where:{
                id: user.id
            }
        });

        res.status(200).json({msg: "User diperbarui"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.role === 'admin') return res.status(403).json({msg: 'Akses terlarang. Tidak bisa menghapus Admin!!'})
    const filePath = `./public/images/users/${user.image}`

    try {
        fs.unlinkSync(filePath);
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User dihapus"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
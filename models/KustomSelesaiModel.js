import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Pemesanan from "./PemesananModel.js";

const { DataTypes } = Sequelize;

const KustomSelesai = db.define("kustom_selesai", {
  uuid:{
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate:{
        notEmpty: true
    }
  },
  harga_akhir: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        notEmpty: true
    }
  },
  tanggal_selesai: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
        notEmpty: true
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
        notEmpty: true
    }
    },
  url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true
      }
  },
  userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
          notEmpty: true
      }
  },
  pemesananId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        name: "kustom_selesai_pemesananId_key",
        msg: "Pemesanan ini sudah ditambahkan"
      },
      validate:{
          notEmpty: true
      }
  }
}, { freezeTableName: true});

Users.hasMany(KustomSelesai);
KustomSelesai.belongsTo(Users, { foreignKey: "userId", onDelete: "CASCADE" });

Pemesanan.hasMany(KustomSelesai);
KustomSelesai.belongsTo(Pemesanan, { foreignKey: "pemesananId", onDelete: "CASCADE" });

export default KustomSelesai;

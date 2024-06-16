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
  pemesananUuid: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: Pemesanan,
        key: 'uuid'
    }
  },
  nama_pemesan: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
        notEmpty: true,
        len: [3, 100]
    }
  },
  harga_akhir: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        notEmpty: true
    }
  },
  estimasi_pengerjaan: {
    type: DataTypes.INTEGER,
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
      validate:{
          notEmpty: true
      }
  }
});

Users.hasMany(KustomSelesai);
KustomSelesai.belongsTo(Users, { foreignKey: "userId" });

Pemesanan.hasMany(KustomSelesai);
KustomSelesai.belongsTo(Pemesanan, { foreignKey: "pemesananId" });

export default KustomSelesai;

const { response } = require("express");

const MesaAlcalde = require("../models/mesa_alcalde");
const Usuario = require('../models/usuario');
const aws = require('aws-sdk');
const fs = require('fs');


const getMesaAlcalde = async (req, res = response) => {
  const uid = req.uid;
  // console.log(uid);
  const usuarioDB = await Usuario.findById(uid);
  // console.log(usuarioDB.recinto);

  if (usuarioDB.role === "ADMIN_ROLE") {

    const mesasAlcalde = await MesaAlcalde.find()
      // .populate("usuario", "nombre img")
      .populate("recinto", "nombre img");
    res.json({
      ok: true,
      mesasAlcalde,
    });
  } else {
    const mesasAlcalde = await MesaAlcalde.find({ recinto: { _id: usuarioDB.recinto } })
      .populate("recinto", "nombre img");
        // .populate("Recinto", "nombre img");
    res.json({
      ok: true,
      mesasAlcalde,
    });
  }
};


const getMesaAlcaldeBuscar = async (req, res = response) => {
  const uid = req.uid;
  
  const usuarioDB = await Usuario.findById(uid);
  const busqueda = req.params.busqueda || '';
  const regex    = new RegExp( busqueda, 'i' );

  if (usuarioDB.role === "ADMIN_ROLE") {
    const mesaAlcalde = await MesaAlcalde.find({ codigo: regex })
    .populate("usuario", "nombre img");
      res.json({
        ok: true,
        mesaAlcalde,
      });
  } else {
    const mesaAlcalde = await MesaAlcalde.find({ recinto: { _id: usuarioDB.recinto } })
        .populate("usuario", "nombre img");
      res.json({
        ok: true,
        mesaAlcalde,
      });
  }
};

const getMesaAlcaldeById = async (req, res = response) => {
  const id = req.params.id;

  const mesaAlcalde = await MesaAlcalde.findById(id)
    .populate("usuario", "nombre img")
    .populate("recinto", "nombre img");

  res.json({
    ok: true,
    mesaAlcalde,
  });
};

const getMesaAlcaldeByCodido = async (req, res = response) => {
  const codigo = req.params.codigo;

  const mesaAlcalde = await MesaAlcalde.find({ codigo: codigo })
  .populate("usuario", "nombre img");

  res.json({
    ok: true,
    mesaAlcalde,
  });
};

const crearMesaAlcalde = async (req, res = response) => {
  const uid = req.uid;
  const mesaAlcalde = new MesaAlcalde({
    usuario: uid,
    ...req.body,
  });

  try {
    const mesaAlcaldeDB = await mesaAlcalde.save();

    res.json({
      ok: true,
      mesaAlcalde: mesaAlcaldeDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMesaAlcalde = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const mesaAlcalde = await MesaAlcalde.findById(id);

    if (!mesaAlcalde) {
      return res.status(404).json({
        ok: true,
        msg: "Mesa Alcalde no encontrado por id",
      });
    }

    const cambiosMesaAlcalde = {
      ...req.body,
      usuario: uid,
    };

    const mesaAlcaldeActualizado = await MesaAlcalde.findByIdAndUpdate(
      id,
      cambiosMesaAlcalde,
      { new: true }
    );

    res.json({
      ok: true,
      MesaAlcalde: mesaAlcaldeActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const resetMesaAlcalde = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const mesaAlcalde = await MesaAlcalde.findById(id);

    if (!mesaAlcalde) {
      return res.status(404).json({
        ok: true,
        msg: "Mesa Alcalde no encontrado por id",
      });
    }

    const cambiosMesaAlcalde = {
      ...req.body,
      a_llenada: false,
      a_sumate: 0,
      a_fpv: 0,
      a_pdc: 0,
      a_somos: 0,
      a_mas_ipsp: 0,
      a_ca: 0,
      a_mts: 0,
      a_pan_bol: 0,
      a_ucs: 0,
      a_blancos: 0,
      a_nulos: 0,
      c_llenada: false,
      c_sumate: 0,
      c_fpv: 0,
      c_pdc: 0,
      c_somos: 0,
      c_mas_ipsp: 0,
      c_ca: 0,
      c_mts: 0,
      c_pan_bol: 0,
      c_ucs: 0,
      c_blancos: 0,
      c_nulos: 0,
      img_1: "",
      img_2: "",
      img_3: "",
      fotoenviada: false,
      observada: false,
      revisadafoto: false,
      revisadaacta: false,
      usuario: uid,
    };

    const mesaAlcaldeActualizado = await MesaAlcalde.findByIdAndUpdate(
      id,
      cambiosMesaAlcalde,
      { new: true }
    );

    res.json({
      ok: true,
      MesaAlcalde: mesaAlcaldeActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};







const crearfoto = async (req, res = response) => {
  const idMesaAlcalde = req.params.id
  const uid = req.uid;
  const usuarioDB = await Usuario.findById(uid);
  // const recintoId = usuarioDB.recinto

  const mesaAlcalde = await MesaAlcalde.findById(idMesaAlcalde);
  if (!mesaAlcalde) {
    return res.status(404).json({
      ok: true,
      msg: "Mesa de Alcalde no encontrada",
    });
  }
  const codigoMesa = mesaAlcalde.codigo;
  const recintoId = mesaAlcalde.recinto

  let ResponseData = [];
  // console.log(req.body.codigo);
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION
  });
  const file = req.files;
  const s3 = new aws.S3();
  file.map((item) => {
      var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${recintoId}/${codigoMesa}_${item.originalname}`,
        Body: fs.createReadStream(item.path),
        ACL: 'public-read'
  };
    s3.upload(params, async (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }
      if (data) {
        ResponseData.push(data);      
        fs.unlinkSync(item.path); // Empty temp folder
        if(ResponseData.length === file.length) {
          
          try {
              // const mesaAlcalde = await MesaAlcalde.findById(idMesaAlcalde);
              const cambiosMesaAlcalde = {
                ...req.body,
                fotoenviada: true,
                usuario: uid,
              };
              if(ResponseData[0]) cambiosMesaAlcalde.img_1 = ResponseData[0].Location
              if(ResponseData[1]) cambiosMesaAlcalde.img_2 = ResponseData[1].Location
              if(ResponseData[2]) cambiosMesaAlcalde.img_3 = ResponseData[2].Location         
              const mesaAlcaldeActualizado = await MesaAlcalde.findByIdAndUpdate(
                idMesaAlcalde,
                cambiosMesaAlcalde,
                { new: true }
              );
          
              res.json({
                ok: true,
                MesaAlcalde: mesaAlcaldeActualizado,
              });
          } catch (error) {
              console.log(error);          
              res.status(500).json({
                ok: false,
                msg: "Hable con el administrador",
              });
          }
        }      
      }

    });
  })
};



module.exports = {
  getMesaAlcalde,
  getMesaAlcaldeBuscar,
  crearMesaAlcalde,
  actualizarMesaAlcalde,
  resetMesaAlcalde,
  getMesaAlcaldeById,
  getMesaAlcaldeByCodido,
  crearfoto
};

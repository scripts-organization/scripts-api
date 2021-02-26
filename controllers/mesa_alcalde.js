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


const getMesaAlcaldeReporte = async (req, res = response) => {
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
    // .find({ recinto: { _id: usuarioDB.recinto }})
    const votosAlcalde = await MesaAlcalde
    .aggregate(
      [
        { "$match": { "recinto": usuarioDB.recinto }},
        { "$match": { "a_llenada": true }},
        { 
          $group: 
            { 
              _id: "$recinto",
              a_sumate: { $sum: "$a_sumate"},
              a_fpv: { $sum: "$a_fpv"},
              a_pdc: { $sum: "$a_pdc"},
              a_somos: { $sum: "$a_somos"},
              a_mas_ipsp: { $sum: "$a_mas_ipsp"},
              a_ca: { $sum: "$a_ca"},
              a_mts: { $sum: "$a_mts"},
              a_pan_bol: { $sum: "$a_pan_bol"},
              a_ucs: { $sum: "$a_ucs"}
            }
        }
      ]
    )
    let porcentaje = new Object();
    const votos = votosAlcalde[0];
    if ( votos ) {
      const total = votos.a_sumate + 
                    votos.a_fpv + 
                    votos.a_pdc + 
                    votos.a_somos + 
                    votos.a_mas_ipsp + 
                    votos.a_ca + 
                    votos.a_mts +
                    votos.a_pan_bol +
                    votos.a_ucs
    
      porcentaje.a_sumate = Number(((votos.a_sumate * 100) / total).toFixed(2));
      porcentaje.a_fpv = Number(((votos.a_fpv * 100) / total).toFixed(2));
      porcentaje.a_pdc = Number(((votos.a_pdc * 100) / total).toFixed(2));
      porcentaje.a_somos = Number(((votos.a_somos * 100) / total).toFixed(2));
      porcentaje.a_mas_ipsp = Number(((votos.a_mas_ipsp * 100) / total).toFixed(2));
      porcentaje.a_ca = Number(((votos.a_ca * 100) / total).toFixed(2));
      porcentaje.a_mts = Number(((votos.a_mts * 100) / total).toFixed(2));
      porcentaje.a_pan_bol = Number(((votos.a_pan_bol * 100) / total).toFixed(2));
      porcentaje.a_ucs = Number(((votos.a_ucs * 100) / total).toFixed(2));
    }
    // console.log("result: " + result.a_sumate)
      //.populate("recinto", "nombre img");
        // .populate("Recinto", "nombre img");
    res.json({
      ok: true,
      votosAlcalde,
      porcentaje
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
  getMesaAlcaldeReporte,
  crearMesaAlcalde,
  actualizarMesaAlcalde,
  resetMesaAlcalde,
  getMesaAlcaldeById,
  getMesaAlcaldeByCodido,
  crearfoto
};

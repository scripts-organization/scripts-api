const { response } = require("express");

const MesaAlcalde = require("../models/mesa_alcalde");
const Usuario = require('../models/usuario');

const getMesaAlcalde = async (req, res = response) => {
  const uid = req.uid;
  // console.log(uid);
  const usuarioDB = await Usuario.findById(uid);
  console.log(usuarioDB.recinto);

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

  const mesaAlcalde = await MesaAlcalde.findById(id).populate("usuario", "nombre img");

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


module.exports = {
  getMesaAlcalde,
  getMesaAlcaldeBuscar,
  crearMesaAlcalde,
  actualizarMesaAlcalde,
  getMesaAlcaldeById,
  getMesaAlcaldeByCodido
};

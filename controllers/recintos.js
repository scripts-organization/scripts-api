const { response } = require("express");

const Recinto = require("../models/recinto");

const getRecintos = async (req, res = response) => {
  const recintos = await Recinto.find().populate("usuario", "nombre img");

  res.json({
    ok: true,
    recintos,
  });
};

const getRecintoById = async (req, res = response) => {
  const id = req.params.id;

  const recinto = await Recinto.findById(id).populate("usuario", "nombre img");

  res.json({
    ok: true,
    recinto,
  });
};

const crearRecinto = async (req, res = response) => {
  const uid = req.uid;
  const recinto = new Recinto({
    usuario: uid,
    ...req.body,
  });

  try {
    const recintoDB = await recinto.save();

    res.json({
      ok: true,
      recinto: recintoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarRecinto = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const recinto = await Recinto.findById(id);

    if (!recinto) {
      return res.status(404).json({
        ok: true,
        msg: "Recinto no encontrado por id",
      });
    }

    const cambiosRecinto = {
      ...req.body,
      usuario: uid,
    };

    const recintoActualizado = await Recinto.findByIdAndUpdate(
      id,
      cambiosRecinto,
      { new: true }
    );

    res.json({
      ok: true,
      recinto: recintoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarRecinto = async (req, res = response) => {
  const id = req.params.id;

  try {
    const recinto = await Recinto.findById(id);

    if (!recinto) {
      return res.status(404).json({
        ok: true,
        msg: "Recinto no encontrado por id",
      });
    }

    await Recinto.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Recinto eliminado",
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
  getRecintos,
  crearRecinto,
  actualizarRecinto,
  borrarRecinto,
  getRecintoById
};

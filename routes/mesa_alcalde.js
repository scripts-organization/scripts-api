/*
    Recintos
    ruta: '/api/Recintos'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getMesaAlcalde,
  getMesaAlcaldeBuscar,
  crearMesaAlcalde,
  actualizarMesaAlcalde,
  resetMesaAlcalde,
  getMesaAlcaldeById,
  getMesaAlcaldeByCodido,
  crearfoto,
} = require("../controllers/mesa_alcalde");

const router = Router();

router.get("/", validarJWT, getMesaAlcalde);
router.get("/:id", validarJWT, getMesaAlcaldeById);
router.get("/codigo/:codigo", validarJWT, getMesaAlcaldeByCodido);
router.get("/buscar/:busqueda", validarJWT, getMesaAlcaldeBuscar);

router.post(
  "/",
  [
    validarJWT,
    // check("codigo", "El codigo del Recinto es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearMesaAlcalde
);

router.put(
  "/:id",
  [
    validarJWT,
    // check("sumate", "los datos de la casilla sumate son necesarios")
    //   .not()
    //   .isEmpty(),
    validarCampos,
  ],
  actualizarMesaAlcalde
);

router.put(
  "/reset/:id",
  [
    validarJWT,
    // check("sumate", "los datos de la casilla sumate son necesarios")
    //   .not()
    //   .isEmpty(),
    validarCampos,
  ],
  resetMesaAlcalde
);

router.put(
  "/foto/:id",
  [
    validarJWT,
    // check("codigo", "El codigo del Recinto es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearfoto
);

module.exports = router;

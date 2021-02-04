/*
    Recintos
    ruta: '/api/Recintos'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getRecintos,
  crearRecinto,
  actualizarRecinto,
  borrarRecinto,
  getRecintoById
} = require("../controllers/Recintos");

const router = Router();

router.get("/", getRecintos);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del Recinto es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearRecinto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del Recinto es necesario").not().isEmpty(),
    validarCampos,
  ],
  actualizarRecinto
);

router.get( '/:id',
    
    getRecintoById
);


router.delete("/:id", validarJWT, borrarRecinto);

module.exports = router;

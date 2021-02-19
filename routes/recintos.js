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
  getRecintosBuscar,
  crearRecinto,
  actualizarRecinto,
  borrarRecinto,
  getRecintoById,
} = require("../controllers/recintos");

const router = Router();

router.get("/", validarJWT, getRecintos);
router.get("/:id", validarJWT, getRecintoById);
router.get("/buscar/:busqueda", validarJWT, getRecintosBuscar);

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

router.delete("/:id", validarJWT, borrarRecinto);

module.exports = router;

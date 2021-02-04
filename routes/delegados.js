/*
    delegados
    ruta: '/api/delegado'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getDelegados,
    getDelegadosBuscar,
    getDelegadosPorRecinto,
    crearDelegado,
    actualizarDelegado,
    borrarDelegado,
    getDelegadoById
} = require('../controllers/delegados')


const router = Router();

router.get( '/', validarJWT, getDelegados );
router.get( '/:id', validarJWT, getDelegadoById );
router.get("/buscar/:busqueda",validarJWT, getDelegadosBuscar);



router.get( '/recinto/:idRecinto', validarJWT, getDelegadosPorRecinto );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del delegado es necesario').not().isEmpty(),
        check('recinto','El recinto id debe de ser válido').isMongoId(),
        validarCampos
    ], 
    crearDelegado 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('recinto','El recinto id debe de ser válido').isMongoId(),
        validarCampos
    ],
    actualizarDelegado
);

router.delete( '/:id',
    validarJWT,
    borrarDelegado
);





module.exports = router;




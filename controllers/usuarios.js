const { response } = require('express');
const bcrypt = require('bcryptjs');
const os = require('os');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    let date = new Date();
    const infoCluster = {
        os: os.hostname(),
        curr_hour: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    
    }

    const uid = req.uid;
    const usuarioDB = await Usuario.findById(uid);

    const desde = Number(req.query.desde) || 0;

    if (usuarioDB.role === "ADMIN_ROLE") {
            const [usuarios, total] = await Promise.all([
                Usuario.find({}, "nombre email jefe celular role asistencia google img")
                .populate("recinto", "nombre img")
                .skip(desde)
                .limit(50),

                Usuario.countDocuments(),
            ]);
            res.json({
                ok: true,
                usuarios,
                total,
                infoCluster,
        
            });
        } else {
            const [usuarios, total] = await Promise.all([
                Usuario.find({recinto: { _id: usuarioDB.recinto }}, "nombre email jefe celular role asistencia google img")
                .populate("recinto", "nombre img")
                .skip(desde)
                .limit(50),

                Usuario.countDocuments(),
            ]);
            res.json({
                ok: true,
                usuarios,
                total,
                infoCluster,
        
            });
        }
}


const getUsuariosOperators = async(req, res) => {

    const [usuarios, total] = await Promise.all([
        Usuario.find({"role" : "OPERATOR_ROLE"}, "nombre celular role"),
        Usuario.countDocuments(),
    ]);
    res.json({
        ok: true,
        usuarios,
        total
    });
        
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
    
        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}


const actualizarUsuario = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarUsuario = async(req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}



module.exports = {
    getUsuarios,
    getUsuariosOperators,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
const { response } = require('express');

const Delegado = require('../models/delegado');

const getDelegados = async(req, res = response) => {
    const delegados = await Delegado.find()
                                .populate('usuario','nombre img')
                                .populate('recinto','nombre img')


    res.json({
        ok: true,
        delegados
    })
}

const getDelegadoById = async(req, res = response) => {
    const id = req.params.id;

    try {
        const delegado = await Delegado.findById(id)
                                    .populate('usuario','nombre img')
                                    .populate('recinto','nombre img');
    
        res.json({
            ok: true,
            delegado
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
}

const crearDelegado = async (req, res = response) => {

    const uid = req.uid;
    const delegado = new Delegado({
        usuario: uid,
        ...req.body
    });


    try {

        const delegadoDB = await delegado.save();

        
        res.json({
            ok: true,
            delegado: delegadoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador '
        })
    }


}

const actualizarDelegado = async(req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.uid;

    try {
        
        const delegado = await Delegado.findById( id );

        if ( !delegado ) {
            return res.status(404).json({
                ok: true,
                msg: 'delegado no encontrado por id',
            });
        }

        const cambiosDelegado = {
            ...req.body,
            usuario: uid
        }

        const delegadoActualizado = await Delegado.findByIdAndUpdate( id, cambiosDelegado, { new: true } );


        res.json({
            ok: true,
            delegado: delegadoActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const borrarDelegado = async (req, res = response) => {
   
    const id  = req.params.id;

    try {
        
        const delegado = await Delegado.findById( id );

        if ( !delegado ) {
            return res.status(404).json({
                ok: true,
                msg: 'delegado no encontrado por id',
            });
        }

        await Delegado.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Delegado borrado'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = {
    getDelegados,
    crearDelegado,
    actualizarDelegado,
    borrarDelegado,
    getDelegadoById
}
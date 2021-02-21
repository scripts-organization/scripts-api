const { Schema, model } = require("mongoose");

const MesaAlcaldeSchema = Schema(
  {
    codigo: {
      type: String,
      unique: true,
      required: true,
    },
    numero: {
      type: Number,
    },
    habilitados: {
      type: Number,
    },
    a_llenada: {
      type: Boolean,
      default: false
    },
    a_sumate: {
      type: Number,
      default: 0
    },
    a_fpv: {
      type: Number,
      default: 0
    },
    a_pdc: {
      type: Number,
      default: 0
      },
    a_somos: {
      type: Number,
      default: 0
    },
    a_mas_ipsp: {
      type: Number,
      default: 0
      },
    a_ca: {
      type: Number,
      default: 0
    },
    a_mts: {
      type: Number,
      default: 0
      },
    a_pan_bol: {
      type: Number,
      default: 0
    },
    a_ucs: {
      type: Number,
      default: 0
    },
    a_blancos: {
      type: Number,
      default: 0
    },
    a_nulos: {
      type: Number,
      default: 0
    },
    c_llenada: {
      type: Boolean,
      default: false
    },
    c_sumate: {
      type: Number,
      default: 0
    },
    c_fpv: {
      type: Number,
      default: 0
    },
    c_pdc: {
      type: Number,
      default: 0
      },
    c_somos: {
      type: Number,
      default: 0
    },
    c_mas_ipsp: {
      type: Number,
      default: 0
      },
    c_ca: {
      type: Number,
      default: 0
    },
    c_mts: {
      type: Number,
      default: 0
      },
    c_pan_bol: {
      type: Number,
      default: 0
    },
    c_ucs: {
      type: Number,
      default: 0
    },
    c_blancos: {
      type: Number,
      default: 0
    },
    c_nulos: {
      type: Number,
      default: 0
    },
    img_1: {
      type: String,
      default: ""
    },
    img_2: {
      type: String,
      default: ""
    },
    img_3: {
      type: String,
      default: ""
    },
    fotoenviada: {
      type: Boolean,
      default: false
    },
    observada: {
      type: Boolean,
      default: false
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    recinto: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Recinto"
    },
    revisadafoto: {
      type: Boolean,
      default: false
    },
    revisorfoto: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    revisadaacta: {
      type: Boolean,
      default: false
    },
    revisoracta: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { collection: "mesasAlcalde" }
);

MesaAlcaldeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("MesaAlcalde", MesaAlcaldeSchema);

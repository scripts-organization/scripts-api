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
    llenada: {
      type: Boolean,
      default: false
    },
    sumate: {
      type: Number,
      default: 0
    },
    fpv: {
      type: Number,
      default: 0
    },
    pdc: {
      type: Number,
      default: 0
      },
    somos: {
      type: Number,
      default: 0
    },
    mas_ipsp: {
      type: Number,
      default: 0
      },
    ca: {
      type: Number,
      default: 0
    },
    mts: {
      type: Number,
      default: 0
      },
    pan_bol: {
      type: Number,
      default: 0
    },
    ucs: {
      type: Number,
      default: 0
    },
    blancos: {
      type: Number,
      default: 0
    },
    nulos: {
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

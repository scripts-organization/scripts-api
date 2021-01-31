const { Schema, model } = require("mongoose");

const DelegadoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  ci: {
    type: String,
    required: true,
  },
  celular: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
  },

  img: {
    type: String,
  },
  usuario: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  recinto: {
    type: Schema.Types.ObjectId,
    ref: "Recinto",
    required: true,
  },
});

DelegadoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Delegado", DelegadoSchema);

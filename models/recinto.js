const { Schema, model } = require("mongoose");

const RecintoSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
    },
    distrito: {
      type: String,
    },
    cantidadmesas: {
      type: Number,
    },
    img: {
      type: String,
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { collection: "recintos" }
);

RecintoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Recinto", RecintoSchema);

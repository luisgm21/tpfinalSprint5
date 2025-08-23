import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: String, // Almacena data.name.nativeName.official
    capital: [String],
    languages: {
        type: Map,
        of: String
    },
    borders: [String],
    area: Number,
    population: Number,
    gini: {
        type: Map,
        of: Number
    },
    abr: String, // Código de 3 letras del país (cca3)
    timezones: [String],
    tipoDato: {type: String, default: 'country'},
    creador: {type: String, default: 'Gonzalo Morelli'},
}, {
    timestamps: true 
});

const Country = mongoose.model('Country', countrySchema,'Grupo-19');

export default Country;
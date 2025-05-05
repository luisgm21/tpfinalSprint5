import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: {
        common: String,
        official: String,
        nativeName: {
            type: Map,
            of: {
                official: String,
                common: String
            }
        }
    },
    independent: Boolean,
    status: String,
    unMember: Boolean,
    currencies: {
        type: Map,
        of: {
            name: String,
            symbol: String
        }
    },
    capital: [String],
    region: String,
    subregion: String,
    languages: {
        type: Map,
        of: String
    },
    latlng: [Number],
    landlocked: Boolean,
    borders: [String],
    area: Number,
    flag: String,
    maps: {
        googleMaps: String,
        openStreetMaps: String
    },
    population: Number,
    gini: {
        type: Map,
        of: Number
    },
    fifa: String,
    timezones: [String],
    continents: [String],
    flags: {
        png: String,
        svg: String,
        alt: String
    },
    startOfWeek: String,
    capitalInfo: {
        latlng: [Number]
    },
    tipoDato:{type: String, default: 'country'},
    creador: {type: String, default: 'Gonzalo Morelli'},
}, {
    timestamps: true 
});

const Country = mongoose.model('Country', countrySchema,'Grupo-11');

export default Country;
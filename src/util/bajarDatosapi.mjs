import mongoose from 'mongoose';
import { connectDB } from '../config/dbConfig.mjs';
import Country from '../models/country.mjs';

const transformLanguages = (languagesData) => {
    if (!languagesData) return new Map();
    return new Map(Object.entries(languagesData));
};

const transformCountryData = (data) => {
    if (!data.languages?.spa) {
        return null;
    }
    return {
        name: data.name.nativeName.spa.official,
        capital: data.capital || [],
        languages: transformLanguages(data.languages),
        borders: data.borders || [],
        area: data.area || 0,
        population: data.population || 0,
        gini: new Map(Object.entries(data.gini || {})),
        abr: data.cca3 || '',
        timezones: data.timezones || [],
    };
};

async function obtenerYGuardarPaises() {
    try {
        await connectDB();
        
        const response = await fetch('https://restcountries.com/v3.1/region/america');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        
        const data = await response.json();
        const paisesTransformados = data
            .map(transformCountryData)
            .filter(pais => pais !== null);
        
            console.log('Paises transformados:', paisesTransformados);
            console.log('Paises transformados:', paisesTransformados.length);

        const resultado = await Country.insertMany(paisesTransformados);
        
        console.log(`Se han guardado ${resultado.length} países en la base de datos`);
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error al obtener o guardar los datos:', error);
        await mongoose.connection.close();
        throw error;
    }
}

obtenerYGuardarPaises();
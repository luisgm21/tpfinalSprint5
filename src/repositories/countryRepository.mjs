import Country from "../models/country.mjs";
import IRepository from "./IRepository.mjs";

class CountryRepository extends IRepository {
    async obtenerporId(id) {
        try {
            const country = await Country.findById(id);
            if (!country) {
                throw new Error(`Pais con id ${id} no encontrado`);
            }
            return country;
        }
        catch (error) {
            throw new Error(`Error al buscar pais con id: ${id}: ${error.message}`);
        }       
    }

    async obtenerTodos() {
        try {
            const countries = await Country.find({ 
                creador: 'Gonzalo Morelli',
                tipoDato: 'country' 
            });
            return countries;
        }
        catch (error) {
            throw new Error(`Error al obtener todos los paises: ${error.message}`);
        }        
    }

    async obtenerUltimo() {
        try {
            // Intentar ordenar por createdAt si está disponible
            let country = await Country.findOne({}).sort({ createdAt: -1 }).limit(1);
            if (!country) {
                // Fallback: ordenar por _id descendente
                country = await Country.findOne({}).sort({ _id: -1 }).limit(1);
            }
            return country;
        } catch (error) {
            throw new Error(`Error al obtener el último país: ${error.message}`);
        }
    }


    async agregar(countryData) {
        try {
            // Crear una nueva instancia del modelo Country
            const newCountry = new Country({
                name: countryData.name,
                capital: countryData.capital || [],
                languages: countryData.languages || new Map(),
                borders: countryData.borders || [],
                area: countryData.area || 0,
                population: countryData.population || 0,
                gini: countryData.gini || new Map(),
                abr: countryData.abr || '',
                timezones: countryData.timezones || [],
                // Los campos tipoDato y creador se asignarán automáticamente por los defaults
            });

            // Guardar en la base de datos
            const savedCountry = await newCountry.save();
            return savedCountry;
        }
        catch (error) {
            throw new Error(`Error al agregar el país: ${error.message}`);
        }
    }

    async editar(id, countryData) {
        try {
            // Verificar si el país existe
            const existingCountry = await Country.findById(id);
            if (!existingCountry) {
                throw new Error(`País con id ${id} no encontrado`);
            }

            // Preparar los datos a actualizar
            const updateData = {
                name: countryData.name || existingCountry.name,
                capital: countryData.capital || existingCountry.capital,
                languages: countryData.languages || existingCountry.languages,
                borders: countryData.borders || existingCountry.borders,
                area: countryData.area !== undefined ? countryData.area : existingCountry.area,
                population: countryData.population !== undefined ? countryData.population : existingCountry.population,
                gini: countryData.gini || existingCountry.gini,
                abr: countryData.abr || existingCountry.abr,
                timezones: countryData.timezones || existingCountry.timezones,
            };

            // Actualizar el país y devolver el documento actualizado
            const updatedCountry = await Country.findByIdAndUpdate(
                id, 
                updateData, 
                { 
                    new: true, // Devolver el documento actualizado
                    runValidators: true // Ejecutar validaciones del schema
                }
            );

            return updatedCountry;
        }
        catch (error) {
            throw new Error(`Error al editar el país con id ${id}: ${error.message}`);
        }
    }

    async eliminar(id) {
        try {
            // Verificar si el país existe
            const existingCountry = await Country.findById(id);
            if (!existingCountry) {
                throw new Error(`País con id ${id} no encontrado`);
            }

            // Eliminar el país
            const deletedCountry = await Country.findByIdAndDelete(id);
            
            return {
                success: true,
                message: `País "${deletedCountry.name}" eliminado correctamente`,
                deletedCountry: deletedCountry
            };
        }
        catch (error) {
            throw new Error(`Error al eliminar el país con id ${id}: ${error.message}`);
        }
    }

}

export default new CountryRepository();
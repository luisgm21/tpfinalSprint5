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
            const countries = await Country.find({ creador: 'Gonzalo Morelli' } );
            return countries;
        }
        catch (error) {
            throw new Error(`Error al obtener todos los paises: ${error.message}`);
        }        
    }

}
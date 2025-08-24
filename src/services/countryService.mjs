import countryRepository from "../repositories/countryRepository.mjs";

export async function obtenerPaises(){
    return await countryRepository.obtenerTodos();
}

export async function obtenerPaisPorId(id){
    return await countryRepository.obtenerporId(id);
}

export async function agregarPais(countryData){
    return await countryRepository.agregar(countryData);
}

export async function editarPais(id, countryData){
    return await countryRepository.editar(id, countryData);
}

export async function eliminarPais(id){
    return await countryRepository.eliminar(id);
}

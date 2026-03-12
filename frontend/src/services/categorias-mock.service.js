import arrayCategoria from '../datos-mock/categorias-mock';
async function Buscar() {
     return arrayCategoria;
}
async function BuscarPorId(IdCategoria) {
      return arrayCategoria.find((categoria) => categoria.IdCategoria === IdCategoria);
}
async function Agregar(categoria) {
    categoria.IdCategoria = arrayCategoria.length + 1;  // simula autoincremental
    arrayCategoria.push(categoria);
}
async function Modificar(categoria) {
    let categoriaEncontrado = arrayCategoria.find((categoriafind) => categoriafind.IdCategoria === categoria.IdCategoria);
    if (categoriaEncontrado) {
        categoriaEncontrado.Nombre = categoria.Nombre;
    }
}
async function Eliminar(IdCategoria){
    let categoriaEncontrado = arrayCategoria.find((categoriafind) => categoriafind.IdCategoria === IdCategoria);
    if (categoriaEncontrado) {
        arrayCategoria.splice(arrayCategoria.indexOf(categoriaEncontrado), 1);
    }
}
export const categoriasMockService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};

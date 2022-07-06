const contenedorModal = document.querySelector(".modal-contenedor")
const botonAbrir = document.querySelector("#boton-carrito")
const botonCerrar = document.querySelector("#carritoCerrar")
const modalCarrito = document.querySelector(".modal-carrito")

botonAbrir.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
})
botonCerrar.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
})

contenedorModal.addEventListener('click', () => {
    botonCerrar.click()
})

modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation()
})
//Selecciones.

const carac = document.querySelector("#lugar");
const carritoContenedor = document.querySelector("#segundo");
const eliminador = document.querySelector("#eliminador");
const precio = document.querySelector("#precioTotal")

//Eventos

eliminador.addEventListener("click", eliminarCarrito)

//Array

let productos = []
let carrito = []
let carritoenLS = recorrercarritoLS();
if (carritoenLS.length > 0) carrito = carritoenLS
renderCarrito()

//class y constructor 

class Producto {
    constructor(id, titulo, img, texto, precio) {
        this.titulo = titulo;
        this.img = img;
        this.texto = texto;
        this.precio = precio;
        this.id = id;
    }
}

//Llamada a la API y generacion de productos en el HTML.

fetch('../json/stock.json')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
        productos = datos;

        datos.forEach((ele) => {
            const { titulo, img, texto, precio, id } = ele
            carac.innerHTML += `
            <div class="space">
                <h3 class="title">${titulo}</h1>
                <img class="img" alt="Producto" src=${img}>
                <p class="parrafo">${texto}</p>
                <p class="parrafo">Precio: <b>${precio}</b></p>
                <div class="contenedor">
                    <button onclick="agregarAlCarrito(${id})" class="btn">Agregar</button>
                </div>
            </div>
            `
        })
    })
    .catch(() => {
        alert("No existen datos en la base de datos.")
    })

//Funciones

//Nos fijamos si hay archivos JSON en el localstorage.
//Igualamos el obj al JSON.parse(localStorage.getItem("producto " + count)), ya que en caso de no existir ese producto en especifico la funcion devuelve false y cancela el while.

function recorrercarritoLS() {
    let carritos = []
    let count = 0;
    let obj = JSON.parse(localStorage.getItem("producto " + count))
    while (obj) {
        carritos.push(obj);
        count++
        obj = JSON.parse(localStorage.getItem("producto " + count))
    }
    return carritos

}

//Agregamos un producto que se vera en nuestro localstorage.

function agregarAlCarrito(iden) {
    let item = productos.find((prod) => prod.id === iden);
    const { titulo, img, texto, precio, id } = item
    const productoNuevo = new Producto(id, titulo, img, texto, precio);
    carrito.push(productoNuevo);

    if (carrito.length > 0) {
        itemJSON = JSON.stringify(item)
        localStorage.setItem("producto " + (carrito.length - 1), itemJSON)
    }
    const Guardar = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Guardar.fire({
        icon: 'success',
        title: 'El producto fue agregado con exito.'
    })
    carritoenLS = recorrercarritoLS();
    renderCarrito()
    precioTotal()
}

//Creamos el producto en el carrito.

function renderCarrito() {

    carritoContenedor.innerHTML = ""

    carrito.forEach((elemen) => {

        const { titulo, precio, id } = elemen

        var dive = document.createElement("div");
        dive.classList.add("carrito-container");

        dive.innerHTML = `
        <h5>Producto: ${titulo}</h5>
        <p>Precio : ${precio}</h5>
        <button onclick="eliminarProducto(${id})" class="boton-elim">Eliminar</button>
    `
        carritoContenedor.append(dive)
    })
}

//Eliminamos un producto a partir de la id dada en el HTML de rendercarrito y eliminamos todo el localstorage.

function eliminarProducto(id) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    if (id) {
        localStorage.clear()

        const item = carrito.find((producto) => producto.id === id);

        const indice = carrito.indexOf(item);

        carrito.splice(indice, 1);

        agregarAlCarrote(carrito)
        carritoenLS = recorrercarritoLS();
        renderCarrito()
        precioTotal()
        Toast.fire({
            icon: 'success',
            title: 'El producto fue removido con exito.'
        })
    }

}

//Una vez que eliminamos todo el local storage, tomamos el carrito sin el elemento que eliminamos y pusheamos cada elemento al localstorage otra vez.

function agregarAlCarrote(array) {
    array.forEach((elementu, pos) => {
        itemJSON = JSON.stringify(elementu)
        localStorage.setItem("producto " + pos, itemJSON)
    })

    renderCarrito()
    precioTotal()
}

//Eliminacion total del carrito.

function eliminarCarrito() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Cuidado',
        text: "Seguro que quiere eliminar el carrito?",
        icon: 'warning',
        showCancelButton: true,
        witdh: '1000px',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            localStorage.clear()

            carritoenLS = recorrercarritoLS();
            renderCarrito();
            precioTotal()
            swalWithBootstrapButtons.fire(
                'Eliminado!',
                'El carrito se ha eliminado con exito.',
                'Exito'
            )
        }
    })
}

//Nos devuelve el valor del precio total.

function precioTotal() {
    let total = 0;
    carrito.forEach((product) => {
        total += product.precio;
    })
    precio.innerText = total;
}
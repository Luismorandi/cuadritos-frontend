/*-----------------------------------ARRAYS DEL PROYECTO--------------------------------*/
localStorage.getItem(`productos`) === null ? listaProductos = [{nombre: 'Cuadro 1', precioPrincipal:1500, precio: 1500, cantidad: 10, cantidadPrecio: 10, id: 0},{nombre: 'Cuadro 2', precioPrincipal:2500, precio: 2500, cantidad: 10, cantidadPrecio: 10, id: 1},{nombre: 'Cuadro 3', precioPrincipal:1000, precio: 1000, cantidad: 10, cantidadPrecio: 10, id: 2},{nombre: 'Cuadro 4',precioPrincipal:11500, precio: 11500, cantidad: 10, cantidadPrecio: 10, id: 3}]: listaProductos= JSON.parse(localStorage.getItem(`productos`));
let carritoCompras = []; // son los objetos que van a ser agregados al carritos desde los objetos del ecommerce (listaProductos)
localStorage.setItem(`productos`, JSON.stringify(listaProductos));
listaProductos = JSON.parse(localStorage.getItem(`productos`));
localStorage.getItem(`productosCarrito`) === null ? carritoCompras = [] : carritoCompras = JSON.parse(localStorage.getItem(`productosCarrito`));
localStorage.getItem(`printAmountToCart`) === null ? printAmountToCarts = [] : printAmountToCarts = JSON.parse(localStorage.getItem(`printAmountToCart`));


carritoCompras.forEach(carritoCompras=> {
    printItemToCart(carritoCompras)

}); 

carritoCompras.forEach(carritoCompras=> {
    comprarCarrito(carritoCompras)

}); 

document.body.onload = totalCompra()
document.body.onload = printAmountToCart()


function totalCompra(){ 

    let printAmountToCarts = 0;
    printAmountToCarts = carritoCompras.reduce((acumulador, obj) => acumulador + obj.precio, 0 );
    let th = document.getElementById("thread22");
    th.innerHTML= `$${printAmountToCarts}`;
    } ;
    
    
function  comprarCarrito (carritoCompras) {
    tr= document.createElement("tr")
    tr.setAttribute(`id`, `id.${carritoCompras.id}`)
   tr.innerHTML = 

   `<td>
   <img src="../img/Cuadro1.PNG" width= 100>
   </td>
   <td>${carritoCompras.nombre}</td>
   <td>$${carritoCompras.precio}</td>
 ` 
   document.getElementById("thread3").appendChild(tr);
}

/* -------------------INSERTAR  ARTICULO AL CARRITO ------------------ */

///////IMPRIME ARTICULOS AGREGADOS AL CARRITO/////////
function  printItemToCart (carritoCompras) {
    tr= document.createElement("tr")
    tr.setAttribute(`id`, `id.${carritoCompras.id}`)
   tr.innerHTML = 

   `<td>
   <img src="../img/Cuadro1.PNG" width= 100>
   </td>
   <td>${carritoCompras.nombre}</td>
   <td>$${carritoCompras.precio}</td>
   <td>
   <a href="#" class="borrar-platillo" onclick = deleteProductToCart(${carritoCompras.id})> X </a>
   </td> ` 
   document.getElementById("thread").appendChild(tr);
}

//////////IMPRIME EL TOTAL DEL CARRITO EN LA SECCION CARRITO////////// 
function printAmountToCart(){ 

    let printAmountToCarts = 0;
    printAmountToCarts = carritoCompras.reduce((acumulador, obj) => acumulador + obj.precio, 0 );
    let th = document.getElementById("thread2");
    th.innerHTML= `$${printAmountToCarts}`;
    localStorage.setItem(`printAmountToCart`, JSON.stringify(printAmountToCarts));

    } ;


///////// FUNCION PARA ELIMINAR ARTICULOS DE LA SECCION CARRITOS Y LOS ELIMINA DEL ARRAY "carritoCompras" ///////

function deleteProductToCart (prodId){
    let aidi= document.getElementById(`id.${prodId}`);
    aidi.parentNode.removeChild(aidi);
    let item= carritoCompras.find((obj) =>    prodId === obj.id);
    let item5 = carritoCompras.indexOf(item);
    carritoCompras.splice(item5, 1);
    carritoCompras = localStorage.setItem(`productosCarrito`, JSON.stringify(carritoCompras));
    carritoCompras= JSON.parse(localStorage.getItem(`productosCarrito`));
//luego de eliminarlo, hace otra vez la cuenta del total del carrito//
    printAmountToCart();
    }


/*--------------------------------- COMIENZO DE FUNCIONES PARA GUARDAR/ ACTUALIZAR CARRITO DE COMPRAS EN EL STORAGE------------------------------ */


//FUNCION PARA GUARDAR EL ARTICULO DE LOS ARTICULOS AL ARRAY CARRITOCOMPRAS AL STORAGE//
 function guardarLocalStorage(producto){
    carritoCompras= this.obtenerProductoLocasStorage();
    carritoCompras.push(producto);
    localStorage.setItem(`productosCarrito`, JSON.stringify(carritoCompras));

}

//FUNCION  PARA LEER EL LOCAL STORAGE PARA TENERLO ACTUALIZO EN LA FUNCION ANTERIOR//
function obtenerProductoLocasStorage(){
    let productosLs;
    localStorage.getItem(`productosCarrito`) === null ? productosLs = [] : productosLs= JSON.parse(localStorage.getItem(`productosCarrito`));

    return  productosLs;
};

function guardarLocalStorageProductos(producto){
    listaProductos.push(producto);
    localStorage.setItem(`productos`, JSON.stringify(listaProductos));


}
//FUNCION PARA VACIAR EL CARRITO DE COMPRAS ///
function eliminarCarritoCompras(){
    carritoCompras = []
    localStorage.setItem(`productosCarrito`, JSON.stringify(carritoCompras));
    location.reload();

    }

/*-------------------------COMPRAR EL CARRITO-------------------------*/

//FUNCION PARA RESTAR LA CANTIDAD DE CUADROS DEL LOCAL STORAGE// 
function restarStock() {
        for (producto of carritoCompras){
            let objeto= listaProductos.find((obj) =>    producto.id === obj.id);
            let indice = listaProductos.indexOf(objeto)
            listaProductos.splice(indice,1, {nombre: `${objeto.nombre}`, precioPrincipal: parseInt(`${objeto.precioPrincipal}`), precio: parseInt(`${objeto.precio}`), cantidad: parseInt(`${objeto.cantidad -1}`), cantidadPrecio: parseInt(`${objeto.cantidadPrecio}`),  id: parseInt(`${objeto.id}`)})
            localStorage.setItem(`productos`, JSON.stringify(listaProductos));
            
    }}
//FUNCION PARA ATUALIZAR EL PRECIO DEL CUADRO UNA VEZ QUE SE RESTA EL STOCK// 
function nuevoPrecio() {
        for (producto of carritoCompras){
            let objeto= listaProductos.find((obj) =>    producto.id === obj.id);
            let indice = listaProductos.indexOf(objeto)
            let nuevoPrecio = (((100- ((objeto.cantidad *100) / objeto.cantidadPrecio )) /100) +1 )  *  objeto.precio;
            listaProductos.splice(indice,1, {nombre: `${objeto.nombre}`, precioPrincipal: parseInt(`${objeto.precioPrincipal}`), precio: parseInt(`${nuevoPrecio}`), cantidad: parseInt(`${objeto.cantidad}`), cantidadPrecio: parseInt(`${objeto.cantidadPrecio}`),  id: parseInt(`${objeto.id}`)})
            localStorage.setItem(`productos`, JSON.stringify(listaProductos));

    }}

    
//FUNCION QUE SE ACTIVA CUANDO APRIETAS EL BOTON COMPRAR// 
   function  comprarCarritoCompras ()
   {
       
       restarStock();
       nuevoPrecio();
        carritoCompras = [];
        localStorage.setItem(`productosCarrito`, JSON.stringify(carritoCompras));
        Swal.fire(
            '¡Exelente!',
            'Tu compra fue realizada con exito. Te llegará el Link de pago a tu mail',
            'success'
        ).then((result)=> {
              if(result = true){
                location.reload()}

          
              })}

let th1 = document.getElementById("thread234")
// FUNCION PARA CONVERTIR EL PRECIO TOTAL A USD//
const totalBitcoin = () => {
    
    fetch("https://api.bluelytics.com.ar/v2/latest")
    .then(response => response.json())
    .then((result) => {
        let resultado =result.blue.value_sell
        th1.innerHTML +=`
        <td> ${(JSON.parse(localStorage.getItem(`printAmountToCart`)) /(resultado)).toFixed(2)}<td/>`

    }
    
    )}

    
    document.body.onload = totalBitcoin()

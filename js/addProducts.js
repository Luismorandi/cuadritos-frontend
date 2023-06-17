// Repositorio de datos
class DatosRepository {
  async axiosGetProducts() {
    try {
      const response = await axios.get('https://carritos-refactor-api-production.up.railway.app/manage-products');
      return response.data;
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }
  }

  async axiosAddProducts(product) {
    const body = [{
      "name": product.name,
      "principalPrice": product.principalPrice,
      "stockPrice": product.stockPrice
    }];

    try {
      const response = await axios.post('https://carritos-refactor-api-production.up.railway.app/manage-products/add-products', body);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  obtenerDatosLocalStorage(clave) {
    const datosString = localStorage.getItem(clave);
    return JSON.parse(datosString);
  }

  guardarDatosLocalStorage(clave, datos) {
    const datosString = JSON.stringify(datos);
    localStorage.setItem(clave, datosString);
  }

  eliminarDatosLocalStorage(clave) {
    localStorage.removeItem(clave);
  }
}

// Singleton para acceder al Repositorio de datos
class RepositorioDatos {
  constructor() {
    if (!RepositorioDatos.instance) {
      RepositorioDatos.instance = new DatosRepository();
    }
  }

  getInstance() {
    return RepositorioDatos.instance;
  }
}

// Uso del repositorio de datos
const repository = new RepositorioDatos().getInstance();

// Funciones utilizadas en el front
const getProducts = async () => {
  return await repository.axiosGetProducts();
}

const addProductToCart = (product) => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];
  cart.push(product);
  repository.guardarDatosLocalStorage('productosCarrito', cart);
}

const deleteProductFromCart = (prodId) => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];
  const updatedCart = cart.filter(product => product._id.toString() !== prodId.toString());
  repository.guardarDatosLocalStorage('productosCarrito', updatedCart);
}

const calculateCartTotal = () => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];
  const total = cart.reduce((acumulador, obj) => acumulador + parseInt(obj.price), 0);
  return Math.round(total);
}

const insertProductToCart = (prodId) => {
  const item = products.find((producto) => producto._id === prodId);
  printItemToCart(item);
  addProductToCart(item);
  printAmountToCart();
  Toastify({
    text: "Artículo agregado al carrito",
    duration: 3000,
    style: {
      background: "#ff523b",
    }
  }).showToast();
}

// Función para imprimir un artículo en el carrito
const printItemToCart = (item) => {
  const tr = document.createElement("tr");
  tr.setAttribute(`id`, `id.${item._id}`);
  tr.innerHTML = `
    <td>
      <img src="../img/Cuadro1.PNG" width="100">
    </td>
    <td>${item.name}</td>
    <td>$${Math.round(item.price)}</td>
    <td>
      <a href="#" class="borrar-platillo" onclick="deleteProductToCart('${item._id}')">X</a>
    </td>`;

  document.getElementById("thread").appendChild(tr);
}

const printAmountToCart = () => {
  const total =calculateCartTotal()
  const roundedTotal = Math.round(total);

  const th = document.getElementById("thread2");
  th.innerHTML = `$${roundedTotal}`;
}

const deleteProductToCart = (prodId) => {
  const productId = document.getElementById(`id.${prodId}`);
  productId.parentNode.removeChild(productId);
  deleteProductFromCart(prodId);
  printAmountToCart();
}

const printCards = async () => {
  const products = await getProducts();
  const sectionProductos = document.getElementById("sectionProductos");
  sectionProductos.innerHTML = "";

  products.forEach((product) => {
    printCardOfProductToHome(product);
  });
}

let carritoCompras = repository.obtenerDatosLocalStorage('productosCarritos');

function newProduct() {
  const product = {
    name: document.getElementById("nombre").value,
    principalPrice: parseFloat(document.getElementById("precio").value),
    stockPrice: parseInt(document.getElementById("cantidad").value),
  };

  return product;
}

const formulario = document.querySelector("#formulario");
const cargarProducto = document.querySelector("#botonAgregarProducto");

const printCart = () => {
  const carrito = repository.obtenerDatosLocalStorage('productosCarrito') || [];

  carrito.forEach((item) => {
    printItemToCart(item);
  });
}

document.body.onload = () => {
  printAmountToCart();
}

const agregarProducto = async () => {
  const product = newProduct();
  repository.axiosAddProducts(product);
  return product;
};

cargarProducto.onclick = (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const cantidad = document.getElementById("cantidad").value;

  if (nombre.length === 0) {
    swal("Tienes que ingresar el nombre del producto");
    return;
  } else if (precio.length === 0) {
    swal("Tienes que ingresar el precio del producto");
    return;
  } else if (cantidad.length === 0) {
    swal("Tienes que ingresar las unidades que ingresarán al stock");
    return;
  }

  agregarProducto();

  swal("Excelente", `${nombre} fue agregado al stock de la tienda`, "success");
  document.getElementById("formulario").reset();
}

const initProducts = async () => {
  products = await getProducts();
  printCart();
  printAmountToCart();
}

initProducts();

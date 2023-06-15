// Repositorio de datos
class DatosRepository {
  async axiosGetProducts() {
    try {
      const response = await axios.get('http://localhost:3100/manage-products');
      return response.data;
    } catch (error) {
      console.error('Ocurrió un error:', error);
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

const getProducts = async () => {
  return await repository.axiosGetProducts();
}

// Funciones para manipulación del carrito
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

// Buscador
const searchFilter = () => {
  const textoBuscador = buscador.value.toLowerCase();
  const sectionProductos = document.getElementById("sectionProductos");
  sectionProductos.innerHTML = "";

  if (textoBuscador === "") {
    products.forEach(product => {
      printCardOfProductToHome(product);
    });
  } else {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(textoBuscador)
    );

    filteredProducts.forEach(product => {
      printCardOfProductToHome(product);
    });
  }
}

botonBuscador.addEventListener("click", searchFilter);
buscador.addEventListener("keyup", searchFilter);
const printCardOfProductToHome = (product) => {
  const nodo = document.createElement("div");
  nodo.className = "content";
  nodo.innerHTML = `
    <img src="./img/Cuadro1.PNG" alt="" class="imagenesEco">
    <h3 class="ache3">${product.name}</h3>
    <span class="cantidadUnidades"> Está subiendo su valor <b> ¡Quedan solo ${product.stock} unidades!</b> &#128293;</span>
    <h6 class="ache6" >  <del>$${Math.round(product.principalPrice)}</del> | $${Math.round(product.price)}</h6>
    <button class="buy-4 buttonCard" id="${product._id}" onclick="insertProductToCart('${product._id}')"> Agregar carrito</button>`;

  sectionProductos.appendChild(nodo);
}

// Función para insertar un producto en el carrito
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
      <img src="./img/Cuadro1.PNG" width="100">
    </td>
    <td>${item.name}</td>
    <td>$${Math.round(item.price)}</td>
    <td>
      <a href="#" class="borrar-platillo" onclick="deleteProductToCart('${item._id}')">X</a>
    </td>`;

  document.getElementById("thread").appendChild(tr);
}

// Función para imprimir el total del carrito
const printAmountToCart = () => {
  const th = document.getElementById("thread2");
  th.innerHTML = `$${Math.round(calculateCartTotal())}`;
}

// Función para eliminar un producto del carrito
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

const printCart = () => {
  const carrito = repository.obtenerDatosLocalStorage('productosCarrito') || [];

  carrito.forEach((item) => {
    printItemToCart(item);
  });
}

// Inicialización de la página Home
const initHome = async () => {
  products = await getProducts();
  printCards();
  printCart();
  printAmountToCart();
}

initHome();
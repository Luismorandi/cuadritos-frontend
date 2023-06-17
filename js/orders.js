const form = document.getElementById('myForm');




// Repositorio de datos


class DatosRepository {
  async axiosCreateOrder(items, form) {
    const body = {
      "items": items,
      "form": form,
    };
    try {
      const response = await axios.post('https://carritos-refactor-api-production.up.railway.app/manage-orders', body);
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
    console.log(clave, datos)
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

const deleteProductFromCart = (prodId) => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];
  const updatedCart = cart.filter(product => product._id.toString() !== prodId.toString());
  repository.guardarDatosLocalStorage('productosCarrito', updatedCart);
};

const calculateCartTotal = () => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];
  const total = cart.reduce((acumulador, obj) => acumulador + parseInt(obj.price), 0);
  return Math.round(total);
};

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
};

const printAmountToCart = () => {
  const total = calculateCartTotal();
  const roundedTotal = Math.round(total);
  const th = document.getElementById("thread2");
  th.innerHTML = `$${roundedTotal}`;
};

const deleteProductToCart = (prodId) => {
  const productId = document.getElementById(`id.${prodId}`);
  productId.parentNode.removeChild(productId);
  deleteProductFromCart(prodId);
  printAmountToCart();
};

const printCart = () => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];

  cart.forEach((item) => {
    printItemToCart(item);
  });
};

const printProducts = () => {
  const cart = repository.obtenerDatosLocalStorage('productosCarrito') || [];

  cart.forEach((item) => {
    comprarCarrito(item);
  });
};



const totalCompra = () => {
  const total = calculateCartTotal();
  let th = document.getElementById("thread22");
  th.innerHTML = `$${Math.round(total.toFixed(2))}`;
  totalUsd();
};

const comprarCarrito = (carritoCompras) => {
  tr = document.createElement("tr");
  tr.setAttribute(`id`, `id.${carritoCompras._id}`);
  tr.innerHTML = `
    <td>
      <img src="../img/Cuadro1.PNG" width=100>
    </td>
    <td>${carritoCompras.name}</td>
    <td>$${Math.round(carritoCompras.price)}</td>
  `;
  document.getElementById("thread3").appendChild(tr);
};

const comprarCarritoCompras = async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const lastName = document.getElementById('lastname').value;
  const address = document.getElementById('address').value;
  const carritoCompras = repository.obtenerDatosLocalStorage('carritoCompras') || [];
  await repository.axiosCreateOrder(carritoCompras, { email: email, name: name, lastName: lastName, adress: address });
  repository.guardarDatosLocalStorage('productosCarrito', []);
  Swal.fire(
    '¡Excelente!',
    'Tu compra fue realizada con éxito. Te llegará el Link de pago a tu correo',
    'success'
  ).then((result) => {
    if (result) {
      location.reload();
    }
  });
};

let th1 = document.getElementById("thread234");

// Función para convertir el precio total a USD
const totalUsd = () => {
  fetch("https://api.bluelytics.com.ar/v2/latest")
    .then(response => response.json())
    .then((result) => {
      let resultado = result.blue.value_sell;
      th1.innerHTML += `
        <td>${(JSON.parse(calculateCartTotal()) / resultado).toFixed(2)}<td/>
      `;
    });
};

const initProducts = async () => {
  printCart();
  printAmountToCart();
  printProducts();
  totalCompra();
};

initProducts();
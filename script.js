// Obtener icon
function obtenerIconoColor(color) {
  switch (color) {
    case "green":
      return "assets/img/icon-eyes/eye-green.png";
    case "blue":
      return "assets/img/icon-eyes/eye-blue.png";
    case "brown":
      return "assets/img/icon-eyes/eye-brown.png";
    case "violet":
      return "assets/img/icon-eyes/eye-violet.png";
    case "pink":
      return "assets/img/icon-eyes/eye-pink.png";
    case "grey":
      return "assets/img/icon-eyes/eye-grey.png";
    default:
      return "assets/img/icon-eyes/eye-green.png";
  }
}

// Generar una card
function generarCard(producto) {
  const iconoColor = obtenerIconoColor(producto.color);

  return `
  <div class="col-lg-4 col-md-4 col-sm-6 col-12 mb-4">
    <div class="card h-100">
      <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
      <div class="card-body d-flex align-items-center justify-content-center">
        <div class="d-flex align-items-center justify-content-center w-100">
          <div class="me-3">
            <img src="${iconoColor}" width="50">
          </div>
          <div class="text-center">
            <h5 class="section-title mb-1">${producto.nombre}</h5>
            <p class="section-text mb-0">${producto.precio}</p>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mb-3">
        <button class="btn btn-dark" onclick="comprar(${producto.id})">
          <i class="fa-solid fa-cart-plus me-2"></i>Comprar
        </button>
      </div>
    </div>
  </div>
`;
}

// Obtener parámetros de la URL
function obtenerParametroURL(parametro) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parametro);
}

// Obtener colores de los productos
function obtenerColoresUnicos() {
  const colores = [...new Set(productos.map((producto) => producto.color))];
  return colores;
}

// Generar filtros de color
function generarFiltrosColor() {
  const container = document.getElementById("filtros-color");
  if (!container) return;

  const colores = obtenerColoresUnicos();
  const colorFiltroURL = obtenerParametroURL("color");
  const coloresFiltroURL = obtenerParametroURL("colors");

  let coloresSeleccionados = [];
  if (colorFiltroURL) {
    coloresSeleccionados = [colorFiltroURL];
  } else if (coloresFiltroURL) {
    coloresSeleccionados = coloresFiltroURL.split(",");
  }

  let html = "";
  colores.forEach((color) => {
    const iconoColor = obtenerIconoColor(color);
    const isChecked = coloresSeleccionados.includes(color) ? "checked" : "";

    html += `
      <div class="form-check d-flex align-items-center mb-2">
        <input class="form-check-input me-2" type="checkbox" value="${color}" 
               id="color-${color}" ${isChecked} onchange="aplicarFiltroColor()">
        <img src="${iconoColor}" width="30" class="me-2" alt="${color}">
        <label class="form-check-label text-capitalize" for="color-${color}">
          ${color}
        </label>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Aplicar filtro de color
function aplicarFiltroColor() {
  const checkboxes = document.querySelectorAll(
    '#filtros-color input[type="checkbox"]:checked'
  );
  const coloresSeleccionados = Array.from(checkboxes).map((cb) => cb.value);

  if (coloresSeleccionados.length === 0) {
    window.location.href = "productos.html";
  } else if (coloresSeleccionados.length === 1) {
    window.location.href = `productos.html?color=${coloresSeleccionados[0]}`;
  } else if (coloresSeleccionados === 6) {
    window.location.href = "productos.html";
  } else {
    window.location.href = `productos.html?colors=${coloresSeleccionados.join(
      ","
    )}`;
  }
}

// Limpiar filtros
function limpiarFiltros() {
  window.location.href = "productos.html";
}

// filtrar productos por color
function filtrarProductosPorColor() {
  const colorFiltro = obtenerParametroURL("color");
  const coloresFiltro = obtenerParametroURL("colors");

  // Si no hay filtros, mostrar todos los productos
  if (!colorFiltro && !coloresFiltro) {
    return productos;
  }

  // Si hay un solo color
  if (colorFiltro) {
    return productos.filter((producto) => producto.color === colorFiltro);
  }

  // Si hay múltiples colores
  if (coloresFiltro) {
    const coloresArray = coloresFiltro.split(",");
    return productos.filter((producto) =>
      coloresArray.includes(producto.color)
    );
  }

  return productos;
}

// Renderizar productos filtrados
function renderizarProductos() {
  const container = document.getElementById("productos-container");
  const tituloElement = document.getElementById("titulo");

  if (!container) return;

  const colorFiltro = obtenerParametroURL("color");
  const coloresFiltro = obtenerParametroURL("colors");
  const productosFiltrados = filtrarProductosPorColor();

  // Generar HTML para los productos
  let html = "";
  productosFiltrados.forEach((producto) => {
    html += generarCard(producto);
  });

  container.innerHTML = html;
}

function sendNewsletter() {
  const email = document.getElementById("newsletterEmail").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    alert("Por favor, ingresa un correo válido.");
    return;
  }

  alert("¡Gracias por suscribirte!");
  document.getElementById("newsletterEmail").value = "";
}

function comprarLista() {
  window.location.href = "productos.html";
}

function comprar(id) {
  localStorage.setItem("productoSeleccionado", id);
  window.location.href = "datos-personales.html";
}

function mostrarResumenCompra() {
  const resumenContainer = document.getElementById("resumen-compra");
  if (!resumenContainer) return;

  const productoId = localStorage.getItem("productoSeleccionado");
  if (!productoId) {
    resumenContainer.innerHTML =
      '<p class="text-muted">No hay productos seleccionados</p>';
    return;
  }

  // Buscar el producto por ID
  const producto = productos.find((p) => p.id == productoId);
  if (!producto) {
    resumenContainer.innerHTML =
      '<p class="text-muted">Producto no encontrado</p>';
    return;
  }

  const iconoColor = obtenerIconoColor(producto.color);

  resumenContainer.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img src="${iconoColor}" width="40" class="me-3" alt="${producto.color}">
        <div>
          <h6 class="mb-0">${producto.nombre}</h6>
          <small class="text-muted">Cantidad: 1</small>
        </div>
      </div>
      <div class="text-end">
        <strong>${producto.precio}</strong>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
      <strong>Envio:</strong>
      <p>pendiente</p>
    </div>
    <div class="d-flex justify-content-between">
      <strong>Total:</strong>
      <strong>${producto.precio}</strong>
    </div>
  `;
}

function mostrarResumenCompraFinal() {
  const resumenContainer = document.getElementById("resumen-compra-final");
  if (!resumenContainer) return;

  const productoId = localStorage.getItem("productoSeleccionado");
  if (!productoId) {
    resumenContainer.innerHTML =
      '<p class="text-muted">No hay productos seleccionados</p>';
    return;
  }

  // Buscar el producto por ID
  const producto = productos.find((p) => p.id == productoId);
  if (!producto) {
    resumenContainer.innerHTML =
      '<p class="text-muted">Producto no encontrado</p>';
    return;
  }

  const iconoColor = obtenerIconoColor(producto.color);

  resumenContainer.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img src="${iconoColor}" width="40" class="me-3" alt="${producto.color}">
        <div>
          <h6 class="mb-0">${producto.nombre}</h6>
          <small class="text-muted">Cantidad: 1</small>
        </div>
      </div>
      <div class="text-end">
        <strong>${producto.precio}</strong>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
      <strong>Envio:</strong>
      <p>$5.000</p>
    </div>
    <div class="d-flex justify-content-between">
      <strong>Total:</strong>
      <strong>$30.000</strong>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  // Para datos personales
  const formDatos = document.getElementById("formDatosPersonales");
  if (formDatos) {
    formDatos.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (form.checkValidity()) {
        irDireccion();
      } else {
        form.classList.add("was-validated");
      }
    });
  }

  // Para dirección de envío
  const formDireccion = document.getElementById("direccionEnvio");
  if (formDireccion) {
    formDireccion.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (form.checkValidity()) {
        irPago();
      } else {
        form.classList.add("was-validated");
      }
    });
  }

  // Para pago
  const pagoForm = document.getElementById("pagoForm");
  if (pagoForm) {
    pagoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (form.checkValidity()) {
        irDetalle();
      } else {
        form.classList.add("was-validated");
      }
    });
  }

  //Contacto
  const formContacto = document.getElementById("formContacto");
  if (formContacto) {
    formContacto.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (form.checkValidity()) {
        alert("Gracias por contactarnos, te responderemos a la brevedad")
        form.reset();
      } else {
        form.classList.add("was-validated");
      }
    });
  }


  const fechaInput = document.getElementById("fechaVencimiento");
  fechaInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    this.value = value;
  });

  const numeroTarjetaInput = document.getElementById("numeroTarjeta");
  numeroTarjetaInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    this.value = value;
  });


  const cvvInput = document.getElementById("cvv");
  cvvInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    this.value = value;
  });
});

function irDireccion() {
  window.location.href = "direccion.html";
}

function irPago() {
  window.location.href = "pago.html";
}

function volverDatos() {
  window.location.href = "datos-personales.html";
}

function irDetalle(){
  window.location.href = "detalle.html";
}

// Inicializar página
document.addEventListener("DOMContentLoaded", function () {
  generarFiltrosColor();
  renderizarProductos();
  mostrarResumenCompra();
  mostrarResumenCompraFinal();
});

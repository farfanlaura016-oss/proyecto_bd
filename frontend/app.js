const API_URL = "https://proyecto-bd-wm9m.onrender.com";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
// CONTACTO
const formContacto = document.getElementById("formularioContacto");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        // MODO ACTUALIZAR (PUT)
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        // MODO CREAR (POST)
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// Formulario de contactooo
if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreContacto").value.trim();
    const email = document.getElementById("emailContacto").value.trim();
    const asunto = document.getElementById("asuntoContacto").value.trim();
    const comentarios = document.getElementById("comentariosContacto").value.trim();
    try {
      const respuesta = await fetch(`${API_URL}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, asunto, comentarios })
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        alert(resultado.mensaje || "No se pudo enviar el mensaje");
        return;
      }
      alert("¡Mensaje enviado correctamente!");
      formContacto.reset();
      cargarMensajes();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("No se pudo conectar con el servidor");
    }
  });
}


// Consultar y mostrar mensajes
async function cargarMensajes() {
  const listaMensajes = document.getElementById("listaMensajes");
  if (!listaMensajes) return;
  try {
    const respuesta = await fetch(`${API_URL}/contacto`);
    const mensajes = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los mensajes");
    }
    listaMensajes.innerHTML = "";
    if (mensajes.length === 0) {
      listaMensajes.textContent = "No hay mensajes recibidos.";
      return;
    }
    mensajes.forEach((mensaje) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");
      const titulo = document.createElement("h3");
      titulo.textContent = mensaje.asunto;
      const nombre = document.createElement("p");
      nombre.textContent = `Nombre: ${mensaje.nombre}`;
      const email = document.createElement("p");
      email.textContent = `Correo: ${mensaje.email}`;
      const comentarios = document.createElement("p");
      comentarios.textContent = `Mensaje: ${mensaje.comentarios}`;
      const boton = document.createElement("button");
      boton.textContent = "Eliminar mensaje";
      boton.classList.add("btn-eliminar");
      boton.addEventListener("click", () => eliminarMensaje(mensaje.id));
      elemento.append(titulo, nombre, email, comentarios, boton);
      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
    listaMensajes.textContent = "Error al cargar los mensajes.";
  }
}


// Eliminar un mensaje
async function eliminarMensaje(id) {
  if (!confirm("¿Deseas eliminar este mensaje?")) return;
  try {
    const respuesta = await fetch(`${API_URL}/contacto/${id}`, {
      method: "DELETE"
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      alert(resultado.mensaje || "No se pudo eliminar el mensaje");
      return;
    }
    alert("Mensaje eliminado correctamente");
    cargarMensajes();
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    alert("No se pudo conectar con el servidor");
  }
}

// Llamado inicial al cargar la página
cargarProductos();
cargarMensajes();
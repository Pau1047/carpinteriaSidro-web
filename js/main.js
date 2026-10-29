// ---------- Menú móvil ----------
const boton = document.getElementById("boton-menu");
const menu = document.getElementById("menu");

boton.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  boton.setAttribute("aria-expanded", abierto);
});

// Al tocar un enlace del menú, se cierra
menu.addEventListener("click", (evento) => {
  if (evento.target.closest("a")) {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  }
});

// ---------- Aparición al hacer scroll ----------
const elementos = document.querySelectorAll(".trabajo, .seccion_cabecera");

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

elementos.forEach((elemento) => {
  elemento.classList.add("aparecer");
  observador.observe(elemento);
});

// ---------- Botón flotante de WhatsApp ----------
const portada = document.querySelector(".paginaprincipal");
const whatsapp = document.getElementById("whatsapp-flotante");

const vigilante = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    whatsapp.classList.toggle("visible", !entrada.isIntersecting);
  });
}, { threshold: 0.1 });

vigilante.observe(portada);
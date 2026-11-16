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
const elementos = document.querySelectorAll(
  ".trabajo, .seccion_cabecera, .servicio, .contacto_tarjeta, .contacto_accion"
);

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

// ---------- resaltar en el menú la sección actual ----------
const secciones = document.querySelectorAll("section[id]");
const enlacesMenu = document.querySelectorAll('.menu a[href^="#"]');

const vigilanteSecciones = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;

    enlacesMenu.forEach((enlace) => {
      const activo = enlace.getAttribute("href") === `#${entrada.target.id}`;
      enlace.classList.toggle("activo", activo);
      if (activo) {
        enlace.setAttribute("aria-current", "true");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

secciones.forEach((seccion) => vigilanteSecciones.observe(seccion));

// ---------- Fondo animado: serrín flotando ----------
const lienzo = document.getElementById("fondo-particulas");
const ctx = lienzo.getContext("2d");
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

let ancho = 0;
let alto = 0;
let particulas = [];
let animacion = null;

// posición del ratón para que las partículas se aparten
const raton = { x: null, y: null };
const radioRaton = 110;

window.addEventListener("pointermove", (evento) => {
  if (evento.pointerType !== "mouse") return;
  raton.x = evento.clientX;
  raton.y = evento.clientY;
});

document.documentElement.addEventListener("mouseleave", () => {
  raton.x = null;
  raton.y = null;
});

function nuevaParticula(aleatoriaEnPantalla) {
  return {
    x: Math.random() * ancho,
    y: aleatoriaEnPantalla ? Math.random() * alto : -10,
    radio: Math.random() * 1.8 + 0.6,
    velocidadY: Math.random() * 0.25 + 0.08,
    deriva: Math.random() * 0.3 - 0.15,
    opacidad: Math.random() * 0.4 + 0.15,
    fase: Math.random() * Math.PI * 2,
  };
}

function crearParticulas() {
  const cantidad = Math.min(60, Math.floor((ancho * alto) / 20000));
  particulas = Array.from({ length: cantidad }, () => nuevaParticula(true));
}

function ajustarLienzo() {
  const escala = window.devicePixelRatio || 1;
  ancho = window.innerWidth;
  alto = window.innerHeight;
  lienzo.width = ancho * escala;
  lienzo.height = alto * escala;
  ctx.setTransform(escala, 0, 0, escala, 0, 0);
  crearParticulas();
}

function dibujar() {
  ctx.clearRect(0, 0, ancho, alto);

  particulas.forEach((p, i) => {
    p.y += p.velocidadY;
    p.fase += 0.01;
    p.x += p.deriva + Math.sin(p.fase) * 0.2;

    // si el ratón está cerca, la partícula se aparta
    if (raton.x !== null) {
      const dx = p.x - raton.x;
      const dy = p.y - raton.y;
      const distancia = Math.hypot(dx, dy);
      if (distancia > 0 && distancia < radioRaton) {
        const fuerza = (radioRaton - distancia) / radioRaton;
        p.x += (dx / distancia) * fuerza * 3;
        p.y += (dy / distancia) * fuerza * 3;
      }
    }

    // Si sale de la pantalla, vuelve a nacer arriba
    if (p.y > alto + 10 || p.x < -10 || p.x > ancho + 10) {
      particulas[i] = nuevaParticula(false);
      return;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 135, 74, ${p.opacidad})`;
    ctx.fill();
  });

  animacion = requestAnimationFrame(dibujar);
}

function iniciar() {
  if (animacion === null) {
    animacion = requestAnimationFrame(dibujar);
  }
}

function parar() {
  cancelAnimationFrame(animacion);
  animacion = null;
}

ajustarLienzo();
window.addEventListener("resize", ajustarLienzo);

// Si la pestaña no se ve, se pausa para no gastar batería
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    parar();
  } else if (!reducirMovimiento.matches) {
    iniciar();
  }
});

if (!reducirMovimiento.matches) {
  iniciar();
}

// ---------- Parallax en la foto de la portada ----------
const fotoPortada = document.querySelector(".paginaprincipal_foto");
let esperandoFotograma = false;

function moverFoto() {
  const desplazamiento = window.scrollY;
  if (desplazamiento < window.innerHeight * 1.2) {
    fotoPortada.style.transform = `translateY(${desplazamiento * 0.25}px)`;
  }
  esperandoFotograma = false;
}

if (!reducirMovimiento.matches) {
  window.addEventListener("scroll", () => {
    if (!esperandoFotograma) {
      esperandoFotograma = true;
      requestAnimationFrame(moverFoto);
    }
  }, { passive: true });
}
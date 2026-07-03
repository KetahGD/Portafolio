const galleries = {
  findme: {
    title: "FindMe!",
    images: [
      ["assets/findme-dashboard.png", "Dashboard vendedor de FindMe"],
      ["assets/findme-chat.png", "Chat comprador vendedor en FindMe"],
      ["assets/findme-publish.png", "Formulario para subir producto en FindMe"],
      ["assets/findme-banners.png", "Generador de banners IA en FindMe"]
    ]
  },
  peluches: {
    title: "Peluches Store - Catálogo Textil",
    images: [
      ["assets/peluches-home.png", "Inicio del catálogo textil"],
      ["assets/peluches-catalog.png", "Catálogo de telas"],
      ["assets/peluches-detail.png", "Detalle de producto textil"]
    ]
  },
  humanitos: {
    title: "Humanitos en Construccion",
    images: [
      ["assets/humanitos-hero.png", "Hero de Humanitos en Construccion"],
      ["assets/humanitos-module.png", "Modulo educativo de Humanitos"]
    ]
  },
  dragones: {
    title: "Dragones Maps",
    images: [
      ["assets/dragones-map.png", "Mapa interactivo de Dragones Maps"],
      ["assets/dragones-calendar.png", "Calendario académico en Dragones Maps"]
    ]
  },
  english: {
    title: "English Course - Evolve 3",
    images: [
      ["assets/english-vocab.png", "Vista de vocabulario de English Course"],
      ["assets/english-grammar.png", "Vista de gramática de English Course"],
      ["assets/english-expressions.png", "Vista de expresiones de English Course"]
    ]
  },
  electrolab: {
    title: "ElectroLab",
    images: [
      ["assets/electrolab-catalogo.jpeg", "Catálogo de ElectroLab"],
      ["assets/electrolab-inventario.jpeg", "Gestión de inventario de ElectroLab"],
      ["assets/electrolab-productos.jpeg", "Gestión de productos de ElectroLab"]
    ]
  }
};

const modal = document.querySelector("#galleryModal");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryImage = document.querySelector("#galleryImage");
const galleryControls = document.querySelector("#galleryControls");
let activeGallery = null;

function renderGallery(galleryKey, index = 0) {
  const gallery = galleries[galleryKey];
  if (!gallery) return;

  activeGallery = galleryKey;
  const [src, alt] = gallery.images[index];
  galleryTitle.textContent = gallery.title;
  galleryImage.src = src;
  galleryImage.alt = alt;
  galleryControls.innerHTML = "";

  gallery.images.forEach((_, buttonIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(buttonIndex + 1).padStart(2, "0");
    button.className = buttonIndex === index ? "active" : "";
    button.addEventListener("click", () => renderGallery(galleryKey, buttonIndex));
    galleryControls.appendChild(button);
  });

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  modal.hidden = true;
  galleryImage.src = "";
  activeGallery = null;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-gallery]").forEach((button) => {
  button.addEventListener("click", () => renderGallery(button.dataset.openGallery));
});

document.querySelectorAll("[data-close-gallery]").forEach((item) => {
  item.addEventListener("click", closeGallery);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeGallery();
  if (!activeGallery || modal.hidden || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;

  const current = galleries[activeGallery].images.findIndex(([src]) => src === galleryImage.getAttribute("src"));
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const next = (current + delta + galleries[activeGallery].images.length) % galleries[activeGallery].images.length;
  renderGallery(activeGallery, next);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.38 });

sections.forEach((section) => navObserver.observe(section));

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 940px)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 3.5;
    const rotateX = ((y / rect.height) - 0.5) * -3.5;
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const canvas = document.querySelector("#starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let animationFrame = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(96, Math.floor(window.innerWidth / 18));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speed: 0.12 + Math.random() * 0.42,
    size: 0.7 + Math.random() * 1.6,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.y += star.speed;
    star.pulse += 0.025;
    if (star.y > window.innerHeight + 12) {
      star.y = -12;
      star.x = Math.random() * window.innerWidth;
    }

    const alpha = 0.32 + Math.sin(star.pulse) * 0.18;
    ctx.fillStyle = `rgba(255, 45, 73, ${alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
  animationFrame = requestAnimationFrame(drawStars);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  drawStars();
  window.addEventListener("resize", resizeCanvas);
} else {
  canvas.remove();
}

window.addEventListener("pagehide", () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});

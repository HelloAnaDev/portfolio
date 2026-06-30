document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ==================
     DARK / LIGHT THEME
     ================== */

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const doc = document.documentElement;
      const newTheme = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
      doc.setAttribute("data-theme", newTheme);
      const icon = themeBtn.querySelector("i");
      if (icon) {
        icon.className = newTheme === "dark" ? "fa-regular fa-lightbulb" : "fa-solid fa-lightbulb";
      }
    });
  }


  /* ==================
     ACCESIBILIDAD
     ================== */

  const accBtn = document.getElementById("acc-toggle");
  const accDropdown = document.getElementById("acc-dropdown");

  if (accBtn && accDropdown) {
    accBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = accDropdown.style.display === "flex";
      accDropdown.style.display = isOpen ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (!accDropdown.contains(e.target) && e.target !== accBtn) {
        accDropdown.style.display = "none";
      }
    });
  }

  const applyAccessibility = (mode) => {
    document.body.classList.remove("access-contrast", "access-text-lg", "access-dyslexia");
    document.body.classList.add(`access-${mode}`);
  };

  const resetAccessibility = () => {
    document.body.classList.remove("access-contrast", "access-text-lg", "access-dyslexia");
  };

  const accContrast = document.getElementById("acc-contrast");
  const accTextLg   = document.getElementById("acc-text-lg");
  const accDyslexia = document.getElementById("acc-dyslexia");
  const accReset    = document.getElementById("acc-reset");

  if (accContrast) accContrast.addEventListener("click", () => applyAccessibility("contrast"));
  if (accTextLg)   accTextLg.addEventListener("click",   () => applyAccessibility("text-lg"));
  if (accDyslexia) accDyslexia.addEventListener("click", () => applyAccessibility("dyslexia"));
  if (accReset)    accReset.addEventListener("click",    () => resetAccessibility());

  /* ==================
     STICKY PHRASE OVERLAY — Mejorado (Interrupción rápida)
     ================== */

  const spoOverlay = document.getElementById("sticky-phrase-overlay");
  const spoText1   = document.getElementById("spo-text-1");
  const spoNum1    = document.getElementById("spo-num-1");
  const spoCursor1 = document.getElementById("spo-cursor-1");


const currentLang = document.documentElement.lang || 'es';

const translations = {
  es: {
    hero: { 
      num: "01", 
      text: "Hola, soy <em>Ana</em> — Frontend Dev & <em>WordPress</em>" 
    },
    projects_top: { 
      num: "02", 
      text: "Proyectos <em>reales</em>, para <em>clientes reales</em>" 
    },
    about_formation: { 
      num: "03", 
      text: "<em>Formación</em> técnica + <em>experiencia</em> en varios sectores" 
    },
    cta_banner: { 
      num: "04", 
      text: "¿Buscas una nueva incorporación? <em>Hablemos</em>." 
    }
  },
  en: {
    hero: { 
      num: "01", 
      text: "Hi, I'm <em>Ana</em> — Frontend Dev & <em>WordPress</em>" 
    },
    projects_top: { 
      num: "02", 
      text: "<em>Real</em> projects, for <em>real</em> clients" 
    },
    about_formation: { 
      num: "03", 
      text: "Technical background + <em>experience</em> across multiple <em>sectors</em>" 
    },
    cta_banner: { 
      num: "04", 
      text: "Looking to hire? <em>Let's talk</em>" 
    }
  }
};

const spoPhrases = translations[currentLang];

  let currentPhraseKey = "";
  let typeTimeout = null;

  const setPhrase = (key) => {
    // Si la frase que toca es LA MISMA que ya hay, no hace nada
    if (key === currentPhraseKey) return; 
    currentPhraseKey = key;

    const phraseData = spoPhrases[key];

    if (spoNum1) {
      spoNum1.textContent = phraseData.num;
    }

    // Cortamos de raíz cualquier animación de escritura anterior
    clearTimeout(typeTimeout);
    spoText1.innerHTML = "";

    const typeHTML = (el, html, speed) => {
      let i = 0;
      let currentHTML = "";
      el.innerHTML = "";

      const tick = () => {
        // Si el usuario cambia de sección MIENTRAS escribimos, cancelamos este bucle
        if (currentPhraseKey !== key) return;

        if (i < html.length) {
          if (html[i] === "<") {
            let tag = "";
            while (html[i] !== ">" && i < html.length) {
              tag += html[i];
              i++;
            }
            tag += ">"; 
            i++; 
            
            currentHTML += tag;
            el.innerHTML = currentHTML;
            tick(); 
            return;
          } else {
            currentHTML += html[i];
            el.innerHTML = currentHTML;
            i++;
          }
          typeTimeout = setTimeout(tick, speed);
        }
      };
      tick();
    };

    typeHTML(spoText1, phraseData.text, 42);
  };

  // --- SCROLL TRIGGERS ---
  const projectsSection = document.getElementById("projects");
  const aboutSection    = document.getElementById("about-footer");

  if (spoOverlay && projectsSection) {
    // 1. Entrar en Proyectos
    ScrollTrigger.create({
      trigger: projectsSection,
      start: "top 60%",
      onEnter: () => {
        spoOverlay.classList.add("visible");
        setPhrase("projects_top");
      },
      onLeaveBack: () => {
        spoOverlay.classList.remove("visible");
        currentPhraseKey = "";
      }
    });

    // 2. Entrar en Sobre Mí / Formación
    if (aboutSection) {
      ScrollTrigger.create({
        trigger: aboutSection,
        start: "top 60%",
        onEnter:     () => setPhrase("about_formation"),
        onEnterBack: () => setPhrase("about_formation"),
        onLeaveBack: () => setPhrase("projects_top")
      });
    }

    // 3. Entrar en el Banner Final (CTA) - (Ahora dentro del bloque correcto)
    const ctaBanner = document.querySelector(".cta-banner-section");
    if (ctaBanner) {
      ScrollTrigger.create({
        trigger: ctaBanner,
        start: "top 80%",
        onEnter:     () => setPhrase("cta_banner"),
        onEnterBack: () => setPhrase("cta_banner"),
        onLeaveBack: () => setPhrase("about_formation")
      });
    }
  }

  /* ==================
     HERO GSAP ENTRANCE
     ================== */

  gsap.from(".hero-text-line", {
    opacity: 0,
    x: -40,
    duration: 1,
    stagger: 0.18,
    ease: "power3.out"
  });

  gsap.from(".hero-tagline, .learn-more-btn", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.6,
    stagger: 0.15,
    ease: "power2.out"
  });

  /* ==================
     VER MÁS PROYECTOS
     ================== */

  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      document.querySelectorAll(".hidden-project").forEach(el => {
        el.style.display = "flex";
      });
      loadMoreBtn.style.display = "none";
      ScrollTrigger.refresh();
    });
  }


  /* ==================
     FADE-UP GENERAL
     ================== */

  const fadeUpElements = gsap.utils.toArray(
    ".job-timeline-card, .academic-block-cv, .tech-stack-cv-footer, .project-text-card"
  );

  fadeUpElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 45,
      duration: 0.8,
      ease: "power2.out"
    });
  });

/* ==================
     SIDEBAR NAV ACTIVO (Corregido y Optimizado)
     ================== */

  const navItems = gsap.utils.toArray(".nav-item");

  // Obtenemos dinámicamente los elementos de destino usando los 'href' del propio menú
  const contentSections = navItems
    .map(item => {
      const href = item.getAttribute("href");
      return href && href.startsWith("#") ? document.querySelector(href) : null;
    })
    .filter(el => el !== null); // Filtra elementos inexistentes o enlaces externos

  window.addEventListener("scroll", () => {
    let activeId = "";
    const scrollPosition = window.scrollY;

    // 1. Caso Borde: Si está muy cerca del top, forzamos que el primer elemento (Inicio) esté activo
    if (scrollPosition < 100) {
      const firstHref = navItems[0]?.getAttribute("href");
      if (firstHref && firstHref.startsWith("#")) {
        activeId = firstHref.replace("#", "");
      }
    } else {
      // 2. Comportamiento por scroll para el resto de la página
      contentSections.forEach((section) => {
        const top    = section.offsetTop;
        // Un margen fijo (ej. 150px) suele ser más fiable y orgánico que 'height / 3'
        if (scrollPosition >= top - 150) {
          activeId = section.getAttribute("id");
        }
      });
    }

    // 3. Asignación de la clase active (evitando conflictos con strings vacíos)
    navItems.forEach((item) => {
      item.classList.remove("active");
      const href = item.getAttribute("href");
      
      if (activeId && href && href.includes(activeId)) {
        item.classList.add("active");
      }
    });
  }, { passive: true });

  /* ==================
     SNAP VERTICAL IMÁGENES (solo escritorio)
     ================== */

  if (window.innerWidth > 1024) {
    const visualTracks = gsap.utils.toArray(".proj-visuals-track");

    visualTracks.forEach((track) => {
      ScrollTrigger.create({
        trigger: track,
        start: "top center",
        end: "bottom center",
        snap: {
          snapTo: "children",
          duration: { min: 0.2, max: 0.5 },
          delay: 0.08,
          ease: "power1.inOut"
        }
      });
    });
  }

});

/* ==================
   LIGHTBOX GALERÍA
   ================== */

const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxImg     = document.getElementById("lightbox-img");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose   = document.getElementById("lightbox-close");
const lightboxPrev    = document.getElementById("lightbox-prev");
const lightboxNext    = document.getElementById("lightbox-next");

let lightboxImages = [];
let lightboxIndex  = 0;

const openLightbox = (images, index) => {
  lightboxImages = images;
  lightboxIndex  = index;
  updateLightbox();
  lightboxOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOverlay.classList.remove("active");
  document.body.style.overflow = "";
};

const updateLightbox = () => {
  lightboxImg.style.opacity = "0";
  setTimeout(() => {
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    lightboxImg.style.opacity = "1";
  }, 150);
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  lightboxPrev.style.visibility = lightboxImages.length > 1 ? "visible" : "hidden";
  lightboxNext.style.visibility = lightboxImages.length > 1 ? "visible" : "hidden";
};

document.querySelectorAll(".proj-visuals-track").forEach((track) => {
  const imgs = Array.from(track.querySelectorAll(".visual-panel img"));
  imgs.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(imgs, i));
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightboxOverlay) {
  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightboxOverlay.classList.contains("active")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")  { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; updateLightbox(); }
  if (e.key === "ArrowRight") { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; updateLightbox(); }
});

// ==============boton descargar cv=========//
// Lógica para el botón de descargar CV
const cvDropdownBtn = document.getElementById('cv-dropdown-btn');
const cvDropdownMenu = document.getElementById('cv-dropdown-menu');

if (cvDropdownBtn && cvDropdownMenu) {
  // Abre o cierra el menú al hacer clic en el botón
  cvDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague y cierre el menú de inmediato
    cvDropdownMenu.classList.toggle('show');
  });

  // Cierra el menú si haces clic en cualquier otro lugar de la página
  document.addEventListener('click', (e) => {
    if (!cvDropdownMenu.contains(e.target) && e.target !== cvDropdownBtn) {
      cvDropdownMenu.classList.remove('show');
    }
  });
}
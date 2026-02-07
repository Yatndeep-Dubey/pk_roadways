// ========== Hero Carousel Section - Dynamic from metadata.json ==========
(function () {
  const carouselContainer = document.getElementById('carousel');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  if (!carouselContainer || !indicatorsContainer) return;

  fetch('metadata.json')
    .then((res) => res.json())
    .then((data) => {
      const slides = Array.isArray(data.hero_caraousel_section) ? data.hero_caraousel_section : [];
      if (slides.length === 0) return;

      // Render slides
      slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-slide ${index === 0 ? 'carousel-visible' : 'carousel-hidden'} absolute inset-0`;
        
        const buttonsHTML = slide.showButtons ? `
          <div class="mt-6 flex justify-center gap-4">
            <a href="#contact"
              class="inline-flex items-center gap-3 px-5 py-3 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold shadow hover:scale-[1.02] transition">Get
              a Quote</a>
            <a href="#services"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-white/10 text-white/90 hover:bg-white/6 transition">Our
              Services</a>
          </div>
        ` : '';

        slideDiv.innerHTML = `
          <img src="${slide.image}" alt="${slide.alt}"
            class="w-full h-full object-cover object-center" style="object-position: center;" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center px-6 max-w-3xl rounded-2xl py-8">
              <${index === 0 ? 'h1' : 'h2'} class="text-3xl sm:text-4xl md:text-5xl font-bold text-white">${slide.title}</${index === 0 ? 'h1' : 'h2'}>
              <p class="mt-3 text-lg sm:text-xl text-slate-100">${slide.description}</p>
              ${buttonsHTML}
            </div>
          </div>
        `;
        carouselContainer.appendChild(slideDiv);
      });

      // Render indicators
      slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `indicator ${index === 0 ? 'indicator-active' : 'indicator-inactive'}`;
        indicator.setAttribute('data-slide', index);
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicatorsContainer.appendChild(indicator);
      });

      // Initialize carousel logic
      const slideElements = Array.from(document.querySelectorAll('.carousel-slide'));
      const indicatorElements = Array.from(document.querySelectorAll('[data-slide]'));
      let idx = 0;

      const show = (newIdx) => {
        slideElements.forEach((s, i) => {
          if (i === newIdx) {
            s.classList.remove('carousel-hidden');
            s.classList.add('carousel-visible');
          } else {
            s.classList.remove('carousel-visible');
            s.classList.add('carousel-hidden');
          }
        });
        indicatorElements.forEach((dot, i) => {
          if (i === newIdx) {
            dot.classList.remove('indicator-inactive');
            dot.classList.add('indicator-active');
          } else {
            dot.classList.remove('indicator-active');
            dot.classList.add('indicator-inactive');
          }
        });
        idx = newIdx;
      };

      let interval = setInterval(() => show((idx + 1) % slideElements.length), 5000);

      indicatorElements.forEach(btn => {
        btn.addEventListener('click', () => {
          clearInterval(interval);
          show(Number(btn.getAttribute('data-slide')));
          interval = setInterval(() => show((idx + 1) % slideElements.length), 5000);
        });
      });
    })
    .catch((err) => {
      console.error('Failed to load carousel data:', err);
    });
})();

// Mobile menu toggle with sliding effect
(function () {
  const btn = document.getElementById('btnMobile');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '✖' : '☰';
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.textContent = '☰';
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Header scroll effects
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  const glass = document.querySelector(".glass-backdrop");

  // Add/remove shadow
  if (window.scrollY > 50) {
    header.classList.add("shadow-md");
  } else {
    header.classList.remove("shadow-md");
  }

  // Adjust glass background opacity
  if (window.scrollY > 20) {
    glass.style.background = "rgba(10, 15, 30, 0.75)";
  } else {
    glass.style.background = "rgba(10, 15, 30, 0.55)";
  }
});

// Modal Elements
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

// ========== Gallery Section - Dynamic from metadata.json ==========
(function () {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  fetch('metadata.json')
    .then((res) => res.json())
    .then((data) => {
      const images = Array.isArray(data.gallery) ? data.gallery : [];
      if (images.length === 0) return;

      // Sort in descending order - newest images first
      images.reverse();

      images.forEach((img) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer';
        imgDiv.innerHTML = `<img src="${img.image}" alt="${img.alt}" class="w-full h-36 object-cover gallery-img">`;
        galleryGrid.appendChild(imgDiv);
      });

      // Click any gallery image to open modal
      document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", () => {
          modal.classList.remove("hidden");
          modalImg.src = img.src;
        });
      });
    })
    .catch((err) => {
      console.error('Failed to load gallery data:', err);
    });
})();

// Close modal on X click
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Close modal on outside click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// ========== Network Section - Dynamic from metadata.json ==========
(function () {
  const networkGrid = document.getElementById("networkGrid");
  if (!networkGrid) return;

  const renderCard = (network) => {
    const name = network.name || "PK Roadways";
    const city = network.city || "";
    const address = network.address || "";
    const person = network.person || "";
    const email = network.email || "";

    return `
      <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
        <h4 class="text-lg font-semibold text-white">${name} <span class="text-amber-400">${city}</span></h4>
        ${address ? `<p class="mt-2 text-slate-200"><strong>Address:</strong> ${address}</p>` : ""}
        ${person ? `<p class="mt-2 text-slate-200"><strong>Person Name:</strong> ${person}</p>` : ""}
        ${email ? `<p class="mt-2"><a href="mailto:${email}" class="text-amber-400 hover:underline">${email}</a></p>` : ""}
      </div>
    `;
  };

  fetch("metadata.json")
    .then((res) => res.json())
    .then((data) => {
      const networks = Array.isArray(data.our_networks) ? data.our_networks : [];
      networkGrid.innerHTML = networks.map(renderCard).join("");
    })
    .catch((err) => {
      console.error("Failed to load network data:", err);
    });
})();

// ========== Enquiry Form - Form submission ==========
const scriptURL = "https://script.google.com/macros/s/AKfycbwyLQLVVoqHf384xT31LzGwHkmmmUTa1rdFg2tNMPH846adjPsCw4SYwVQg5a2azbr5/exec"

const form = document.getElementById("enquiryForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");
const responseMessage = document.getElementById("responseMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validation
  const fullName = form.full_name.value.trim();
  const phone = form.phone.value.trim();
  
  // Clear previous error messages
  responseMessage.innerHTML = "";
  responseMessage.classList.remove("text-red-600", "text-green-600");

  // Validate name - only letters and spaces allowed
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(fullName)) {
    responseMessage.innerHTML = "❌ Name should only contain letters and spaces";
    responseMessage.classList.add("text-red-600");
    return;
  }

  // Validate phone - exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    responseMessage.innerHTML = "❌ Phone number must be exactly 10 digits";
    responseMessage.classList.add("text-red-600");
    return;
  }

  // Show loader
  loader.classList.remove("hidden");
  btnText.textContent = "Sending...";
  submitBtn.disabled = true;

  const data = {
    full_name: fullName,
    email: form.email.value,
    phone: phone,
    company: form.company.value,
    message: form.message.value
  };

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (json.status === "success") {
      responseMessage.innerHTML = "✅ Your enquiry has been submitted!";
      responseMessage.classList.add("text-green-600");
      form.reset();
    } else {
      responseMessage.innerHTML = "❌ Something went wrong. Please try again.";
      responseMessage.classList.add("text-red-600");
    }
  } catch (err) {
    responseMessage.innerHTML = "⚠️ Network error. Try again later.";
    responseMessage.classList.add("text-red-600");
  }

  // Hide loader and reset button
  loader.classList.add("hidden");
  btnText.textContent = "Submit Enquiry";
  submitBtn.disabled = false;
});

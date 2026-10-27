const images = [
  { title: "Alpine Lake", category: "Nature", description: "Clear water surrounded by dramatic mountain peaks.", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85" },
  { title: "City at Golden Hour", category: "Cities", description: "A skyline glowing beneath a colorful evening sky.", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85" },
  { title: "Golden Companion", category: "Animals", description: "A cheerful dog enjoying a sunny day outdoors.", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85" },
  { title: "Coastal Escape", category: "Travel", description: "Colorful homes tucked along a beautiful coastline.", url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85" },
  { title: "Forest Waterfall", category: "Nature", description: "A peaceful waterfall hidden in a lush green forest.", url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85" },
  { title: "Into the Mountains", category: "People", description: "A traveler pauses to take in a mountain view.", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" },
  { title: "Butterfly Garden", category: "Nature", description: "A delicate butterfly resting among flowers.", url: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?auto=format&fit=crop&w=1200&q=85" },
  { title: "Bridge After Dark", category: "Cities", description: "An iconic bridge shining over the river at night.", url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85" },
  { title: "Sunset Shore", category: "Travel", description: "Warm sunset colors reflected across a quiet beach.", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85" },
  { title: "Highland View", category: "Nature", description: "A wide-open view of rugged peaks and blue skies.", url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=85" },
  { title: "Curious Fox", category: "Animals", description: "A wild fox captured in a quiet natural setting.", url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85" },
  { title: "Old Town Streets", category: "Travel", description: "A charming street full of character and history.", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=85" }
];

const gallery = document.getElementById("gallery");
const galleryCount = document.getElementById("galleryCount");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxFavorite = document.getElementById("lightboxFavorite");
const closeLightboxButton = document.getElementById("closeLightbox");
const prevButton = document.getElementById("prevImage");
const nextButton = document.getElementById("nextImage");

let activeCategory = "All";
let visibleImages = [...images];
let activeIndex = 0;
const favorites = new Set();

function renderGallery() {
  visibleImages = activeCategory === "All"
    ? [...images]
    : images.filter(image => image.category === activeCategory);

  gallery.innerHTML = "";

  visibleImages.forEach((image, index) => {
    const originalIndex = images.indexOf(image);
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${image.title}`);

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.title;
    img.loading = "lazy";
    img.onerror = () => { img.alt = `${image.title} (image could not load)`; };

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const openButton = document.createElement("button");
    openButton.className = "icon-btn";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `View ${image.title}`);
    openButton.textContent = "⌕";
    openButton.addEventListener("click", event => {
      event.stopPropagation();
      openLightbox(index);
    });

    const favoriteButton = document.createElement("button");
    favoriteButton.className = `favorite-btn ${favorites.has(originalIndex) ? "is-favorite" : ""}`;
    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-label", favorites.has(originalIndex) ? "Remove favorite" : "Add to favorites");
    favoriteButton.textContent = favorites.has(originalIndex) ? "♥" : "♡";
    favoriteButton.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(originalIndex);
      renderGallery();
    });

    actions.append(openButton, favoriteButton);

    const info = document.createElement("div");
    info.className = "card-info";
    const category = document.createElement("p");
    category.className = "card-category";
    category.textContent = image.category;
    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = image.title;
    info.append(category, title);
    card.append(img, actions, info);
    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
    gallery.appendChild(card);
  });

  galleryCount.textContent = `Showing ${visibleImages.length} ${visibleImages.length === 1 ? "image" : "images"}`;
}

function openLightbox(index) {
  activeIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const image = visibleImages[activeIndex];
  if (!image) return;
  lightboxImage.src = image.url;
  lightboxImage.alt = image.title;
  lightboxTitle.textContent = image.title;
  lightboxCategory.textContent = image.category;
  lightboxDescription.textContent = image.description;
  lightboxCounter.textContent = `${activeIndex + 1} / ${visibleImages.length}`;
  const originalIndex = images.indexOf(image);
  const isFavorite = favorites.has(originalIndex);
  lightboxFavorite.textContent = isFavorite ? "♥" : "♡";
  lightboxFavorite.classList.toggle("is-favorite", isFavorite);
  lightboxFavorite.setAttribute("aria-label", isFavorite ? "Remove from favorites" : "Add to favorites");
  prevButton.disabled = visibleImages.length < 2;
  nextButton.disabled = visibleImages.length < 2;
}

function moveImage(direction) {
  if (!visibleImages.length) return;
  activeIndex = (activeIndex + direction + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

function toggleFavorite(originalIndex) {
  if (favorites.has(originalIndex)) favorites.delete(originalIndex);
  else favorites.add(originalIndex);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderGallery();
    if (lightbox.classList.contains("open")) closeLightbox();
  });
});

closeLightboxButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => moveImage(-1));
nextButton.addEventListener("click", () => moveImage(1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
lightboxFavorite.addEventListener("click", () => {
  const originalIndex = images.indexOf(visibleImages[activeIndex]);
  toggleFavorite(originalIndex);
  updateLightbox();
  renderGallery();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
});

renderGallery();

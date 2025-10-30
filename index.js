const trendingSection = document.getElementById("trending-section");
const recommendationSection = document.getElementById("recommendation-section");

let allMovies = []; // store movies from API globally

// Fetch movies from API
async function fetchMovies() {
  try {
    const response = await fetch("https://mimic-server-api.vercel.app/movies");
    if (!response.ok) throw new Error("Failed to fetch movies");
    const data = await response.json();
    allMovies = data; // save all movies
    return data;
  } catch (err) {
    console.error("Error fetching:", err);
    return [];
  }
}

// Create movie card
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card movie-card";
  card.innerHTML = `
    <img src="${movie.poster_path}" class="card-img-top" alt="${movie.title}" />
    <div class="card-body p-2">
      <h6 class="card-title text-white">${movie.title}</h6>
    </div>
  `;
  card.addEventListener("click", () => showMovieModal(movie));
  return card;
}

// Show modal with movie details
function showMovieModal(movie) {
  const movieModal = document.getElementById("movieModal");
  const movieVideo = document.getElementById("movieVideo");

  document.getElementById("modalTitle").textContent = movie.title;
  document.getElementById("modalOriginalTitle").textContent =
    movie.original_title || movie.title;
  document.getElementById("modalReleaseDate").textContent =
    movie.release_date || "N/A";
  document.getElementById("modalLanguage").textContent =
    movie.original_language || "N/A";
  document.getElementById("modalPoster").src = movie.poster_path;

  // Reset video
  document.getElementById("videoContainer").style.display = "none";
  document.getElementById("modalPoster").style.display = "block";

  window.currentMovie = movie;

  const modal = new bootstrap.Modal(movieModal);
  modal.show();

  // Pause video when modal closes
  movieModal.addEventListener("hidden.bs.modal", () => {
    movieVideo.pause();
  });
}

// Render movies to UI
async function renderMovies() {
  const data = await fetchMovies();

  data.slice(0, 100).forEach((movie) => {
    trendingSection.appendChild(createMovieCard(movie));
  });

  data.slice(100, 200).forEach((movie) => {
    recommendationSection.appendChild(createMovieCard(movie));
  });
}

// Initialize app
renderMovies();

// Navbar buttons
const homeBtn = document.getElementById("homeBtn");
const searchBtn = document.getElementById("searchBtn");
const addBtn = document.getElementById("addBtn");
const profileBtn = document.getElementById("profileBtn");
const bellIcon = document.getElementById("bellIcon");

// Home
homeBtn.addEventListener("click", () => {
  alert("🏠 You are already on the home page.");
});

// ✅ SEARCH — searches inside API movies
searchBtn.addEventListener("click", () => {
  let query = prompt("🔍 Enter movie name to search:").trim().toLowerCase();
  if (!query) return alert("Please enter a movie name!");

  // Simple Tamil-to-Tanglish transliteration map
  const tamilToTanglish = (text) => {
    const map = {
      அ: "a", ஆ: "aa", இ: "i", ஈ: "ii", உ: "u", ஊ: "uu", எ: "e", ஏ: "ee", ஐ: "ai", ஒ: "o", ஓ: "oo", ஔ: "au",
      க: "ka", ச: "sa", ட: "ta", த: "tha", ப: "pa", ன: "na", ம: "ma", ய: "ya", ர: "ra", ல: "la", வ: "va",
      ள: "la", ழ: "zha", ன்: "n", ண: "na", ந: "na", ஷ: "sha", ஸ: "sa", ஹ: "ha"
    };
    return text
      .split("")
      .map(ch => map[ch] || ch)
      .join("")
      .toLowerCase();
  };

  const foundMovie = allMovies.find(movie => {
    const title = movie.title.toLowerCase();
    const transliterated = tamilToTanglish(title);
    return (
      title.includes(query) || transliterated.includes(query)
    );
  });

  if (foundMovie) {
    showMovieModal(foundMovie);
  } else {
    alert("❌ Movie not found!");
  }
});

// Add
addBtn.addEventListener("click", () => alert("➕ Add button clicked!"));

// Profile
profileBtn.addEventListener("click", () => alert("👤 Profile button clicked!"));

// Notifications
bellIcon.addEventListener("click", () => alert("🔔 No new notifications."));

// Watch now button
const watchBtn = document.getElementById("watchBtn");
watchBtn.addEventListener("click", () => {
  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("movieVideo");
  const source = document.getElementById("movieSource");

  source.src = videoUrl;
  video.load();
  video.play();

  videoContainer.style.display = "block";
  document.getElementById("modalPoster").style.display = "none";
});

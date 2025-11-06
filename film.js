// Key: 28f9634c
// https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

let currentMovies = [];

// Fetch flicks (movies) from API and load them
async function loadMovies(searchTerm) {
  const getMovie = await fetch(
    `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c`
  );
  const data = await getMovie.json();
  // console.log(data.Search);
  if (data.Response == "True") {
    currentMovies = data.Search; // Store movies globally
    searchList.classList.remove("hide__search--list");
    displayMovieList(data.Search);
  }
}

// To have something displayed as the user types in the search bar; nothing is displayed by default because of hide__search--list
function findMovies() {
  // Null check to prevent error
  if (!movieSearchBox) return;

  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    // This displays movies when you first type because otherwise, the default is display:none on hide__search--list
    // searchList.classList.remove("hide__search--list");
    loadMovies(searchTerm);
  } else {
    // This displays none again if the user hasn't typed anything in the search bar or deleted what they typed (searchTerm is null)
    searchList.classList.add("hide__search--list");
  }
}

// The list of movies displayed from the user's search
function displayMovieList(movies) {
  // Null check to prevent error
  if (!searchList) return;

  searchList.innerHTML = "";
  for (let movieId = 0; movieId < movies.length; movieId++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[movieId].imdbID; // Setting the movie id in the data id
    movieListItem.classList.add("search__list--item");
    let moviePoster =
      movies[movieId].Poster != "N/A"
        ? movies[movieId].Poster
        : "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search__item--thumbnail">
          <img src = "${moviePoster}">
        </div>
        <div class = "search__item--info">
          <h3>${movies[movieId].Title}</h3>
          <p>${movies[movieId].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  // Null check to prevent error
  if (!searchList) return;

  const searchListMovies = searchList.querySelectorAll(".search__list--item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide__search--list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=28f9634c`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  // Null check to prevent error
  if (!resultGrid) return;

  resultGrid.innerHTML = `
    <div class = "result__grid">
      <div class = "movie-poster">
        <img src = "${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt = "movie poster">
      </div>
      <div class = "movie__info">
        <h3 class = "movie__title">${details.Title}</h3>
        <ul class = "movie__misc--info">
          <li class = "year">Year: ${details.Year}</li>
          <li class = "rated">Ratings: ${details.Rated}</li>
          <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
      </div>
    </div>
    `;
}

window.addEventListener("click", (event) => {
  if (
    event.target.className != "form__control" &&
    event.target.className != "filter__option" &&
    event.target.className != "filter__class"
  ) {
    searchList.classList.add("hide__search--list");
  }
});

// Hides movie result so movie search can display over it
const hideResultGrid = document.getElementById("result-grid");
const searchFocus = document.getElementById("movie-search-box");

searchFocus.addEventListener("focus", () => {
  hideResultGrid.style.display = "none";
});

searchFocus.addEventListener("blur", () => {
  hideResultGrid.style.display = "block";
});

// Reset button will clear the search
function clearInput() {
  document.getElementById("result-grid").style.display = "none";
  document.getElementsByClassName("search__list--item").style.display = "none";
}

function filterMovies(event) {
  renderMovies(event.target.value);
}

// Filter section for sorting movies (by year and by name)
function renderMovies(filter) {
  const moviesArray = currentMovies;

  if (!moviesArray) return;

  // Clone array to avoid mutating original data
  let sortedArray = [...moviesArray];

  if (filter === "Oldest_To_Newest") {
    sortedArray.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (filter === "Newest_To_Oldest") {
    sortedArray.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filter === "A_To_Z") {
    sortedArray.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter === "Z_To_A") {
    sortedArray.sort((a, b) => b.Title.localeCompare(a.Title));
  }

  // Clear previous results
  searchList.innerHTML = "";

  // Append and render sorted movies
  sortedArray.forEach((movie) => {
    let movieItem = document.createElement("div");
    movieItem.className = "search__list--item";
    movieItem.dataset.id = movie.imdbID;
    let poster = movie.Poster != "N/A" ? movie.Poster : "image_not_found.png";

    movieItem.innerHTML = `
      <div class="search__item--thumbnail">
        <img src="${poster}">
      </div>
      <div class="search__item--info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;
    searchList.appendChild(movieItem);
  });

  loadMovieDetails(); // reattach event handlers if needed
}

<template>
  <section class="h-screen w-screen flex flex-col bg-color-1">
    <div class="flex flex-col items-center flex-grow overflow-y-auto">
      <nav class="mx-8 my-5">
        <div class="flex gap-7">
          <div class="flex gap-3 mb-4">
            <div class="relative">
              <img
                class="w-12 h-12 rounded-full"
                src="../assets/img/gengar.png"
                alt="Gengar"
              />
              <span
                class="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"
              ></span>
            </div>
            <div>
              <p class="font-inter font-regular text-sm text-color-3">
                Hi, Gengar!
              </p>
              <p class="font-inter font-semi-bold text-base text-color-3">
                Let’s watch a movie together!
              </p>
            </div>
          </div>
          <img class="w-10 mt-[-19px]" :src="notificationImg" />
        </div>
        <div
          class="search-container bg-color-4 border-2 border-color-3 rounded-xl py-4 px-5 mb-5"
        >
          <div class="flex gap-3 items-center">
            <img :src="searchImg" class="search-icon" />
            <input
              class="search-input w-full bg-color-4 focus:outline-none text-sm"
              type="text"
              placeholder="Search movie, cinema, genre..."
              v-model="searchTerm"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>
        </div>
        <div class="flex justify-between mb-3">
          <p class="text-lg text-color-3 font-semi-bold">Now playing</p>
          <p class="text-sm text-color-2 font-semi-bold mt-1">See all</p>
        </div>
      </nav>
      <main class="w-full">
        <div class="movie-carousel w-full mx-auto">
          <Carousel :itemsToShow="1.8" :wrapAround="true" :transition="500">
            <Slide v-for="movie in filteredMovies" :key="movie.id">
              <div
                class="carousel__item w-[204px] h-[405px] flex flex-col items-center justify-center text-center rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              >
                <img
                  :src="movie.poster"
                  :alt="movie.title"
                  class="movie-poster w-[214px] h-[319px] object-fill rounded-[20px] px-[5px]"
                />
                <h3
                  class="movie-title text-[18px] font-bold mt-[10px] text-color-3 max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
                  :title="movie.title"
                >
                  {{ movie.title }}
                </h3>
                <p class="movie-genre text-[14px] text-color-3 opacity-50">
                  {{ movie.genre[0] }}
                </p>
              </div>
            </Slide>
            <template #addons>
              <Pagination class="custom-pagination" />
            </template>
          </Carousel>
        </div>
        <div
          v-if="filteredMovies.length === 0"
          class="text-center text-color-3 mt-5"
        >
          <p>No movies found matching your search criteria.</p>
        </div>
        <div class="flex justify-between mb-3 mx-8">
          <p class="text-lg text-color-3 font-semi-bold">Coming soon</p>
          <p class="text-sm text-color-2 font-semi-bold mt-1">See all</p>
        </div>
        <div class="overflow-y-auto h-72 mb-24">
          <div
            class="bg-color-4 rounded-3xl mb-2 p-2.5 flex gap-5 mx-8"
            v-for="movie in filteredSoonMovies"
            :key="movie.id"
          >
            <img class="w-20 rounded-3xl object-cover" :src="movie.poster" />
            <div class="flex flex-col p-2.5 gap-2.5">
              <p class="text-color-3 font-semi-bold">{{ movie.title }}</p>
              <p class="text-color-2 text-sm">{{ movie.genre[0] }}</p>
              <p class="text-color-3 text-sm">
                {{ movie.sinopsis.slice(0, 60) + "..." }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="filteredSoonMovies.length === 0"
          class="text-center text-color-3 mt-5"
        >
          <p>No upcoming movies found matching your search criteria.</p>
        </div>
      </main>
      <footer
        class="w-[393px] h-[93px] flex gap-12 py-7 bg-color-4 justify-center rounded-2xl fixed bottom-0 border border-[rgba(255,255,255,0.2)]"
      >
        <img
          class="w-9 h-9"
          :src="homeRedImg"
        />
        <img class="w-9 h-9" :src="browseImg" />
        <img
          class="w-9 h-9"
          :src="ticketWhiteImg"
        />
        <img class="w-9 h-9" :src="profileImg" />
      </footer>
    </div>
  </section>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import notificationImg from "../assets/img/notification.svg";
import searchImg from "../assets/img/search.svg";
import pointWhiteImg from "../assets/img/pointWhite.svg";
import pointRedImg from "../assets/img/pointRed.svg";
import browseImg from "../assets/img/browse.svg";
import homeRedImg from "../assets/img/homeRed.svg";
import homeWhiteImg from "../assets/img/homeWhite.svg";
import profileImg from "../assets/img/profile.svg";
import ticketWhiteImg from "../assets/img/ticketWhite.svg";

export default {
  name: "Cinema",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      home: false,
      ticket: false,
      notificationImg,
      searchImg,
      pointWhiteImg,
      pointRedImg,
      homeRedImg,
      browseImg,
      profileImg,
      ticketWhiteImg,
      movies: [],
      soon: [],
      searchTerm: "",
      isSearchFocused: false,
    };
  },
  computed: {
    filteredMovies() {
      return this.movies.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          movie.genre.some((g) =>
            g.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        );
      });
    },
    searchContainerClass() {
      return {
        "search-container-focused": this.isSearchFocused,
      };
    },
    filteredSoonMovies() {
      return this.soon.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          movie.genre.some((g) =>
            g.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        );
      });
    },
  },
  mounted() {
    this.getMovies();
  },
  methods: {
    onFocus() {
      this.isSearchFocused = true;
    },
    onBlur() {
      this.isSearchFocused = false;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async getMovies() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        sessionStorage.removeItem("token");
        console.error("No token found, redirecting to home");
        this.$router.push("/");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/movies/v1", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          this.movies = data.filter((movie) => movie.status === "cartelera");
          this.soon = data.filter((movie) => movie.status === "soon");
          console.log(this.soon);
          console.log(this.movies);
        } else {
          console.log(data.message);
        }

        if (data.error) {
          console.log(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

.my-input {
  font-family: "Montserrat", sans-serif;
}

p {
  font-family: "Inter", sans-serif;
}

.carousel__viewport {
  perspective: 2000px;
  overflow: visible;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}

.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.1);
}

.carousel__pagination-button::after {
  display: block;
  content: "";
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 100px;
}

.carousel__pagination-button--active::after {
  background-color: #fe0000;
  width: 24px;
}

.search-input::placeholder {
  color: white;
  font-family: "Montserrat", sans-serif;
}

.search-input {
  color: white;
  transition: background-color 0.3s;
}

.search-container-focused {
  background-color: #777;
}

.custom-pagination {
  display: none;
}
</style>

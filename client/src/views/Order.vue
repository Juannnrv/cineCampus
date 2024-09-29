<template>
    <main class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1">
      <section class="bg-color-4 px-8 pb-10">
        <Header :headerText="'Order Summary'" @arrow-clicked="goToSeats" />
        <div class="mt-5 flex flex-row gap-4">
          <figure class="w-28 h-36 rounded-xl">
            <img :src="movie.poster" alt="movie" class="w-full h-full object-cover rounded-xl" />
            <figcaption class="sr-only">{{ movie.title }}</figcaption>
          </figure>
          <div class="flex flex-col gap-2">
            <h1 class="interTittle text-color-2">{{ movie.title }}</h1>
            <div class="flex flex-row gap-1">
              <p class="interSmall text-color-3 opacity-50 mb-6">
                {{ formattedGenres }}
              </p>
            </div>
            <p class="inter text-sm text-color-3 font-600">CAMPUSLANDS</p>
            <p class="interSmall text-color-3 opacity-50">{{ sessionData.date }}</p>
          </div>
        </div>
      </section>
      <section class="mt-5 w-[333px]">
        <div class="flex gap-1 -ml-5">
          <p class="interSmall text-color-3 opacity-50">ORDER NUMBER:</p>
          <p class="interSmall text-color-3">{{ showID }}</p>
        </div>
      </section>
      <section class="mt-5 mb-3.5 w-[435px] px-8">
        <article>
          <div class="flex flex-row justify-between">
            <p class="interMedium">{{ sessionData.seats.length }} TICKETS</p>
            <div class="flex gap-1.5">
              <p class="interMedium" v-for="(seat, index) in sessionData.seats" :key="index">
                {{ seat }}<span v-if="index < sessionData.seats.length - 1">,</span>
              </p>
            </div>
          </div>
          <hr class="my-3.5 text-color-3 opacity-50">
          <div class="flex flex-row justify-between" v-if="seatCounts.normal !== 0">
            <p class="interMedium">REGULAR SEAT</p>
            <p class="interMedium">$ 00,00 x {{ seatCounts.normal }}</p>
          </div>
          <hr class="my-3.5 text-color-3 opacity-50" v-if="seatCounts.premium !== 0 && seatCounts.normal !== 0">
          <div class="flex flex-row justify-between" v-if="seatCounts.premium !== 0">
            <p class="interMedium">PREMIUM SEAT</p>
            <p class="interMedium">$ 50,00 x {{ seatCounts.premium }}</p>
          </div>
          <hr class="my-3.5 text-color-3 opacity-50">
          <div class="flex flex-row justify-between">
            <p class="interMedium">SERVICE FEE</p>
            <p class="interMedium">$ 1,99 x 1</p>
          </div>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import Header from "../components/Header.vue";
  
  export default {
    name: "Order",
    components: {
      Header,
    },
    data() {
      return {
        movie: {},
      };
    },
    computed: {
      formattedGenres() {
        return this.movie.genre ? this.movie.genre.join(", ") : "";
      },
      sessionData() {
        return {
          date: sessionStorage.getItem("selectedDateTime"),
          seats: JSON.parse(sessionStorage.getItem("selectedSeats") || "[]"),
          price: sessionStorage.getItem("totalPrice"),
        };
      },
      showID() {
        return this.$route.params.showId;
      },
      seatCounts() {
        const counts = { normal: 0, premium: 0 };
        this.sessionData.seats.forEach(seat => {
          const row = seat.charAt(0).toUpperCase();
          if (row >= 'A' && row <= 'C') {
            counts.normal++;
          } else if (row >= 'D' && row <= 'F') {
            counts.premium++;
          }
        });
        return counts;
      },
    },
    mounted() {
      this.getOrderInfo();
    },
    methods: {
      goToSeats() {
        this.$router.push(`/seats/${this.$route.params.movieId}`);
      },
      getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      },
      async getOrderInfo() {
        try {
          const token = this.getCookie("token");
          if (!token) {
            console.error("No token found");
            this.goToLogin();
            return;
          }
          const response = await fetch(
            `http://localhost:5000/movies/v1/${this.$route.params.movieId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            this.movie = data;
          } else {
            console.log("Failed to fetch data");
          }
        } catch (error) {
          console.error(error);
        }
      },
      goToLogin() {
        this.$router.push("/login");
      },
    },
  };
  </script>
  
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
  
  .inter {
    font-family: "Inter", sans-serif;
  }
  
  .interTittle {
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 600;
  }
  
  .interSmall {
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
  }
  
  .interMedium {
    font-family: "Inter", sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: white;
    opacity: 50%;
  }
  </style>
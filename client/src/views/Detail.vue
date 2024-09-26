<template>
  <section
    class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1"
  >
      <Header :headerText="'Cinema Selection'" @arrow-clicked="goToCinema" />
      <img
        class="w-[367px] h-[204px] rounded-2xl object-cover object-center mb-2.5"
        :src="movie.poster"
      />
      <main class="flex flex-col w-[330px] mb-12">
        <div class="flex justify-between mb-2.5">
          <div>
            <p class="parrafo">{{ movie.title }}</p>
            <p class="parrafoSmall">{{ movie.genre.join(", ") }}</p>
          </div>
          <div
            class="bg-color-2 text-color-3 w-[84px] h-[22px] p-1 poppinsSemiBold gap-1.5 flex rounded"
          >
            <img :src="watchImg" class="w-[12px] h-[11px]" />
            <a :href="movie.trailer" target="_blank" class="watchSmall"
              >Watch Trailer</a
            >
          </div>
        </div>
        <p class="text-sm text-color-3 inter mb-6">{{ movie.sinopsis }}</p>
        <p class="parrafo mb-4">Cast</p>
        <div class="flex flex-row overflow-x-hidden gap-3.5">
          <div v-for="(member, index) in movie.cast" :key="index" class="flex">
            <img
              :src="member.photo"
              class="w-[41px] h-[41px] rounded-full object-cover"
            />
            <div class="flex flex-col ml-2 mb-7 w-[100px]">
              <p class="poppinsSemiBold mt-2">{{ member.name }}</p>
              <p class="poppinsLight">{{ member.character }}</p>
            </div>
          </div>
        </div>
        <p class="parrafo mb-4">Cinema</p>
        <div
          class="bg-color-4 border-2 border-color-2 rounded-xl w-[333px] h-[60px] flex justify-between items-center px-4"
        >
          <div class="flex flex-col justify-center">
            <p class="poppins text-color-3 text-sm font-600">Campuslands</p>
            <p class="poppinsLight">Zona Franca, Santander</p>
          </div>
          <img
            :src="campusImg"
            class="w-[48px] h-[48px] rounded-xl object-cover"
          />
        </div>
      </main>
      <footer @click="goToSeats">
        <div v-if="movie.status === 'cartelera'">
          <Button :text="'Book Now'" />
        </div>
        <div v-else>
          <Button buttonClass="bg-color-2 w-[333px] parrafo p-3.5 mb-2" :text="'Coming Soon...'" />
        </div>
      </footer>
  </section>
</template>

<script>
import Header from "../components/Header.vue";
import Button from "../components/Button.vue";
import watchImg from "../assets/img/watch.svg";
import campusImg from "../assets/img/campuslands.png";

export default {
  name: "Detail",
  components: {
    Header,
    Button,
  },
  data() {
    return {
      movie: {},
      watchImg,
      campusImg,
    };
  },
  created() {
    this.getMovie();
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async getMovie() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        }
        const response = await fetch(
          `http://localhost:5000/movies/v1/${this.$route.params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          this.movie = await response.json();
          console.log("Movie fetched", this.movie);
        } else {
          console.error("Error fetching movie", response);
        }
      } catch (error) {
        console.error("Error fetching movie", error);
      }
    },
    goToCinema() {
      this.$router.push("/cine");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToSeats() {
      this.$router.push(`/seats/${this.$route.params.id}`);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.inter {
  font-family: "Inter", sans-serif;
}

.poppins {
  font-family: "Poppins", sans-serif;
}

.poppinsSemiBold {
  font-family: "Poppins", sans-serif;
  font-size: 8px;
  color: #ffffff;
  font-weight: 600;
}

.poppinsLight {
  font-family: "Poppins", sans-serif;
  font-size: 8px;
  color: #ffffff;
  font-weight: 300;
}

.parrafo {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
}

.watchSmall {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 8px;
  color: #ffffff;
}

.parrafoSmall {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #ffffff;
}
</style>

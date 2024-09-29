<template>
  <section
    class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1"
  >
    <Header :headerText="'Ticket'" @arrow-clicked="goToCinema" />
    <div class="w-[325px] h-[650px] bg-white rounded-[20px] p-[26px]">
      <img
        class="w-[283px] h-[113px] rounded-lg object-cover mb-2"
        :src="movie.poster"
      />
      <h2 class="poppinsLarge">
        {{ movie.title }}
      </h2>
      <p class="poppins text-color-8 text-sm mb-[26px]">
        Show this ticket at the entrance
      </p>
      <hr class="mb-[15px]" />
      <div class="flex justify-between items-start mb-[43px]">
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2">Cinema</span>
          <span class="poppinsLarge">CAMPUSLANDS</span>
        </div>
        <img class="w-[47px] h-[48px] rounded-sm" :src="campusImg" />
      </div>
      <div class="flex justify-between mb-[19px]">
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2">Date</span>
          <span class="poppinsInfo">{{ formattedDate }}</span>
        </div>
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2 mr-10">Time</span>
          <span class="poppinsInfo">{{ formattedTime }}</span>
        </div>
      </div>

      <div class="flex justify-between mb-[19px]">
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2">Cinema Hall #</span>
          <span class="poppinsInfo">{{ cinemas[cinemaIndex] }}</span>
        </div>
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2 mr-10">Seat</span>
          <div class="flex gap-1">
            <span
              class="poppinsInfo"
              v-for="(seat, index) in sessionData.seats"
              :key="index"
              >{{ seat
              }}<span v-if="index < sessionData.seats.length - 1">,</span></span
            >
          </div>
        </div>
      </div>

      <div class="flex justify-between mb-[19px]">
        <div class="flex flex-col">
          <span class="poppinsMedium mb-2">Cost</span>
          <span class="poppinsInfo">$ {{ sessionData.price }}</span>
        </div>
        <div class="flex flex-col mr-1">
          <span class="poppinsMedium mb-2">Order ID</span>
          <span class="poppinsInfo">{{
            $route.params.movementId.slice(0, 9)
          }}</span>
        </div>
      </div>
      <img :src="lineBarImg" class="my-[21px] px-[-25px]" />
      <img :src="barcodeImg" class="my-[21px] w-[267px] h-[49px]" />
    </div>
  </section>
</template>

<script>
import Header from "../components/Header.vue";
import campusImg from "../assets/img/campuslands.png";
import lineBarImg from "../assets/img/lineBar.svg";
import JsBarcode from "jsbarcode";
import { format } from "date-fns/fp";

export default {
  name: "Ticket",
  components: {
    Header,
  },
  data() {
    return {
      movie: {},
      show: {},
      campusImg,
      lineBarImg,
      barcodeImg: "",
      cinemas: [
        "Artemis",
        "Sputnik",
        "Apolo",
        "Cosmos",
        "Kepler",
        "Skylab",
        "Hunters",
      ],
      cinemaIndex: 0,
    };
  },
  mounted() {
    this.getMovie();
    this.getShow();
    this.generateBarcode();
    this.cinemaIndex = Math.floor(Math.random() * this.cinemas.length);
  },
  computed: {
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
    movieID() {
      return this.$route.params.movieId;
    },
    movementID() {
      return this.$route.params.movementId;
    },
    formattedDate() {
      const date = new Date(this.sessionData.date);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    formattedTime() {
      const date = new Date(this.sessionData.date);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  methods: {
    goToCinema() {
      this.$router.push(`/cine`);
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async getMovie() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          this.$router.push("/login");
        }
        const response = await fetch(
          `http://localhost:5000/movies/v1/${this.movieID}`,
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
          this.movie = data;
          console.log("movie", this.movie);
        } else {
          const errorData = await response.json();
          console.error("Error fetching movie:", errorData);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    },
    async getShow() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          this.$router.push("/login");
        }
        const response = await fetch(
          `http://localhost:5000/shows/seats/v1/${this.movieID}`,
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
          this.show = data;
          console.log("show", this.show);
        } else {
          const errorData = await response.json();
          console.error("Error fetching show:", errorData);
        }
      } catch (error) {
        console.error("Error fetching show:", error);
      }
    },
    generateBarcode() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const barcodeData = `ticket/${this.movieID}/${this.showID}/${this.movementID}`;

      JsBarcode(svg, barcodeData, {
        format: "CODE128",
        lineColor: "#000000",
        width: 65,
        height: 40,
        displayValue: true,
      });

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        this.barcodeImg = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.poppins {
  font-family: "Poppins", sans-serif;
}

.poppinsLarge {
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #000000;
}

.poppinsMedium {
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: bold;
  color: #787878;
}

.poppinsInfo {
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  font-weight: bold;
  color: #000000;
}
</style>

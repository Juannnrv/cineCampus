<template>
    <section
      class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1"
    >
      <Header :headerText="'Ticket'" @arrow-clicked="goToOrder" />
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
            <span class="poppinsLarge">HARTONO MALL 12</span>
          </div>
          <img class="w-[47px] h-[48px] rounded-sm" :src="campusImg" />
        </div>
        <div class="flex justify-between mb-[19px]">
          <div class="flex flex-col">
            <span class="poppinsMedium mb-2">Date</span>
            <span class="poppinsInfo">Sun , Feb 12th 2023</span>
          </div>
          <div class="flex flex-col">
            <span class="poppinsMedium mb-2 mr-10">Time</span>
            <span class="poppinsInfo">13:00</span>
          </div>
        </div>
  
        <div class="flex justify-between mb-[19px]">
          <div class="flex flex-col">
            <span class="poppinsMedium mb-2">Cinema Hall #</span>
            <span class="poppinsInfo">Cinema A</span>
          </div>
          <div class="flex flex-col">
            <span class="poppinsMedium mb-2 mr-10">Seat</span>
            <span class="poppinsInfo">C5</span>
          </div>
        </div>
  
        <div class="flex justify-between mb-[19px]">
          <div class="flex flex-col">
            <span class="poppinsMedium mb-2">Cost</span>
            <span class="poppinsInfo">$26,99</span>
          </div>
          <div class="flex flex-col mr-1">
            <span class="poppinsMedium mb-2">Order ID</span>
            <span class="poppinsInfo">12345678</span>
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
      };
    },
    mounted() {
      this.getMovie();
      this.getShow();
      this.generateBarcode();
    },
    methods: {
      goToOrder() {
        this.$router.push("/order/:movieId/:showId");
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
            this.movie = data;
            console.log(this.movie);
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
            `http://localhost:5000/shows/seats/v1${this.$route.params.showId}`,
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
            console.log(this.show);
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
        const barcodeData = `ticket/${this.$route.params.movieId}/${this.$route.params.showId}/${this.$route.params.movementId}`;
        console.log("Barcode Data:", barcodeData); // Debugging line
  
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
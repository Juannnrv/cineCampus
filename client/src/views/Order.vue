<template>
  <main
    class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1"
  >
    <section class="bg-color-4 px-8 pb-10">
      <Header :headerText="'Order Summary'" @arrow-clicked="goToSeats" />
      <div class="mt-5 flex flex-row gap-4">
        <figure class="w-28 h-36 rounded-xl">
          <img
            :src="movie.poster"
            alt="movie"
            class="w-full h-full object-cover rounded-xl"
          />
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
          <p class="interSmall text-color-3 opacity-50">
            {{ sessionData.date }}
          </p>
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
            <p
              class="interMedium"
              v-for="(seat, index) in sessionData.seats"
              :key="index"
            >
              {{ seat
              }}<span v-if="index < sessionData.seats.length - 1">,</span>
            </p>
          </div>
        </div>
        <hr class="my-3.5 text-color-3 opacity-50" />
        <div
          class="flex flex-row justify-between"
          v-if="seatCounts.normal !== 0"
        >
          <p class="interMedium">REGULAR SEAT</p>
          <p class="interMedium">$ 00,00 x {{ seatCounts.normal }}</p>
        </div>
        <hr
          class="my-3.5 text-color-3 opacity-50"
          v-if="seatCounts.premium !== 0 && seatCounts.normal !== 0"
        />
        <div
          class="flex flex-row justify-between"
          v-if="seatCounts.premium !== 0"
        >
          <p class="interMedium">PREMIUM SEAT</p>
          <p class="interMedium">$ 50,00 x {{ seatCounts.premium }}</p>
        </div>
        <hr class="my-3.5 text-color-3 opacity-50" />
        <div class="flex flex-row justify-between">
          <p class="interMedium">SERVICE FEE</p>
          <p class="interMedium">$ 1,99 x 1</p>
        </div>
      </article>
      <article>
        <p class="text-lg text-color-3 font-medium inter mb-2 mt-6">
          Payment method
        </p>
        <div
          class="flex flex-row justify-between bg-color-4 border-1 border-color-3 border-opacity-20 w-full h-[70px] rounded-lg p-3.5 mb-4 border-inside"
          v-if="userCard"
        >
          <div class="flex gap-5">
            <img
              :src="mastercardImg"
              alt="mastercard"
              class="w-[66px] h-[44px]"
            />
            <div class="">
              <p class="poppins text-color-3 font-medium text-[15px]">
                MasterCard
              </p>
              <p class="poppins text-color-3 font-medium text-[12px]">
                **** **** 0998 7865
              </p>
            </div>
          </div>
          <img
            :src="check ? checkImg : noCheckImg"
            alt="check"
            class="w-[21px] h-[21px] mt-2.5 cursor-pointer"
            @click="toogleCheck"
          />
        </div>
        <div
          class="flex flex-row justify-between w-full bg-color-7 px-3.5 py-3 rounded-lg"
        >
          <p class="inter text-color-3 opacity-80 font-medium text-[13px]">
            Complete your payment in
          </p>
          <p class="text-color-2 opacity-80 font-medium text-[13px]">
            {{ formattedTimeLeft }}
          </p>
        </div>
      </article>
      <p v-if="errorMsg" class="poppins text-color-2 font-medium text-[15px] mt-5">{{ errorMsg }}</p>
      <footer class="mt-16 mb-5">
        <Button
          text="Buy ticket"
          buttonClass="bg-color-2 font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg w-full"
          @click="purchaseTicket"
        />
      </footer>
    </section>
  </main>
</template>

<script>
import Header from "../components/Header.vue";
import mastercardImg from "../assets/img/mastercard.svg";
import checkImg from "../assets/img/check.svg";
import noCheckImg from "../assets/img/noCheck.svg";
import Button from "../components/Button.vue";

function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default {
  name: "Order",
  components: {
    Header,
    Button,
  },
  data() {
    return {
      movie: {},
      mastercardImg,
      checkImg,
      noCheckImg,
      check: false,
      timeLeft: 15 * 60,
      decodedToken: {},
      userCard: null,
      errorMsg: null,
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
      this.sessionData.seats.forEach((seat) => {
        const row = seat.charAt(0).toUpperCase();
        if (row >= "A" && row <= "C") {
          counts.normal++;
        } else if (row >= "D" && row <= "F") {
          counts.premium++;
        }
      });
      return counts;
    },
    formattedTimeLeft() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
  },
  mounted() {
    this.getOrderInfo();
    this.startCountDown();
    const token = this.getCookie("token");
    if (token) {
      this.decodeToken(token);
    }
    this.getUserCard();
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
    decodeToken(token) {
      try {
        const decoded = decodeJWT(token);
        console.log("Decoded Token:", decoded);
        this.decodedToken = decoded;
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    },
    showCookieInfo() {
      const token = this.getCookie("token");
      if (token) {
        console.log("Token:", token);
      } else {
        console.log("No token found");
      }
    },
    async getOrderInfo() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        } else {
          this.decodeToken(token);
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
          console.log("movie", data);
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
    toogleCheck() {
      this.check = !this.check;
    },
    startCountDown() {
      this.countDownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countDownInterval);
          this.$router.push(`/seats/${this.$route.params.movieId}`);
          alert("Time is up! Please select your seats again.");
        }
      }, 1000);
    },
    async getUserCard() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        } else {
          this.decodeToken(token);
        }
        const response = await fetch(
          `http://localhost:5000/users/v1/${this.decodedToken.id}`,
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
          console.log("user", data);
          if (data.card_id) {
            this.userCard = data.card_id;
          } else {
            this.userCard = null;
          }
          console.log("userCard", this.userCard);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async purchaseTicket() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        } else {
          this.decodeToken(token);
        }
        const response = await fetch(
          `http://localhost:5000/tickets/purchase/v1`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: this.decodedToken.id,
              show_id: this.showID,
              date_movement: new Date().toISOString(),
              seats: this.sessionData.seats,
              card_id: this.userCard,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("movement", data);
        } else {
          const errorData = await response.json();
          console.error("Failed to purchase ticket", errorData.message);
          this.errorMsg = errorData.message;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.inter {
  font-family: "Inter", sans-serif;
}

.poppins {
  font-family: "Poppins", sans-serif;
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

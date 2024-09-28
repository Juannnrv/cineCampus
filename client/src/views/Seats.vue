<template>
  <section
    class="w-screen h-screen flex flex-col items-center overflow-y-scroll bg-color-1"
  >
    <Header :headerText="'Choose Seat'" @arrow-clicked="goToDetail" />
    <div class="mb-8 w-[365px]">
      <div class="flex flex-col">
        <div
          v-for="row in rows"
          :key="row"
          :class="['flex items-center', row === 'B' ? 'mb-14' : '']"
        >
          <div class="w-6 text-gray-400 font-bold">{{ row }}</div>
          <div class="flex flex-1 justify-center">
            <div
              v-for="seatNumber in seatsPerRow(row)"
              :key="`${row}${seatNumber}`"
              :data-id="`${row}${seatNumber}`"
              @click="handleSeatClick(`${row}${seatNumber}`)"
              :class="seatClasses(`${row}${seatNumber}`)"
              class="w-[31px] h-[31px] m-1 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              {{ isSelected(`${row}${seatNumber}`) ? seatNumber : "" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-8 mb-6">
      <div class="flex gap-2.5">
        <div class="bg-color-5 rounded-full w-3 h-3 mt-1"></div>
        <p class="poppinsSmall">Available</p>
      </div>
      <div class="flex gap-2.5">
        <div class="bg-color-6 rounded-full w-3 h-3 mt-1"></div>
        <p class="poppinsSmall">Reserved</p>
      </div>
      <div class="flex gap-2.5">
        <div class="bg-color-2 rounded-full w-3 h-3 mt-1"></div>
        <p class="poppinsSmall">Selected</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div
        v-for="(day, index) in dates"
        :key="index"
        @click="handleDayClick(day)"
        :class="dayClasses(day)"
        class="w-14 h-[78px] rounded-xl flex p-3 flex-col items-center gap-1 cursor-pointer"
      >
        <p :class="dayTextClasses(day)">{{ getDayName(day) }}</p>
        <p :class="dayNumberClasses(day)">{{ day }}</p>
      </div>
    </div>
    <div class="flex gap-4 mt-6 mb-12">
      <div
        v-for="(timeSlot, index) in time"
        :key="index"
        @click="handleTimeClick(timeSlot)"
        :class="timeClasses(timeSlot)"
        class="w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5 cursor-pointer"
      >
        <p :class="timeNumberClasses(timeSlot)">{{ timeSlot }}</p>
        <p :class="timeTextClasses(timeSlot)">$ 5.25 3D</p>
      </div>
    </div>
    <div class="w-[333px] flex gap-12 mb-5">
      <div>
        <p class="text-lg text-color-3 inter">Price</p>
        <p class="text-lg text-color-3 inter font-semibold">$24,99</p>
      </div>
      <Button
        :text="'Buy Ticket'"
        buttonClass="w-[221px] text-base inter font-semibold text-color-3 bg-color-2"
      ></Button>
    </div>
  </section>
</template>

<script>
import Header from "../components/Header.vue";
import Button from "../components/Button.vue";

export default {
  name: "Seats",
  components: {
    Header,
    Button,
  },
  data() {
    return {
      rows: ["A", "B", "C", "D", "E", "F"],
      availableSeats: [],
      selectedSeats: [],
      dates: [],
      time: [],
      selectedDay: null,
      selectedTime: null,
    };
  },
  created() {
    this.fetchSeats();
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    goToDetail() {
      this.$router.push(`/detail/${this.$route.params.id}`);
    },
    seatsPerRow(row) {
      return row === "A" ? 5 : row === "B" ? 7 : 9;
    },
    async fetchSeats() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        }
        const response = await fetch(
          `http://localhost:5000/shows/seats/v1/${this.$route.params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        data.forEach((item) => {
          const date = new Date(item.date);
          this.dates.push(date.getUTCDate());
          this.time.push(
            `${date.getUTCHours()}:${date
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}`
          );
        });
        this.availableSeats = data[0].available_seats;
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    },
    isSeatAvailable(seatId) {
      const seat = this.availableSeats.find((s) => s.seat === seatId);
      return seat ? seat.availability : false;
    },
    isSelected(seatId) {
      return this.selectedSeats.includes(seatId);
    },
    handleSeatClick(seatId) {
      if (this.isSeatAvailable(seatId)) {
        if (this.isSelected(seatId)) {
          this.selectedSeats = this.selectedSeats.filter(
            (seat) => seat !== seatId
          );
        } else {
          this.selectedSeats.push(seatId);
        }
      } else {
        console.log(`Seat ${seatId} is unavailable`);
      }
    },
    seatClasses(seatId) {
      if (this.isSelected(seatId)) return "bg-color-2 text-white";
      return this.isSeatAvailable(seatId)
        ? "bg-color-4 text-gray-300"
        : "bg-color-6 text-gray-700";
    },
    handleDayClick(day) {
      this.selectedDay = this.selectedDay === day ? null : day;
    },
    handleTimeClick(timeSlot) {
      this.selectedTime = this.selectedTime === timeSlot ? null : timeSlot;
    },
    dayClasses(day) {
      return this.selectedDay === day
        ? "bg-color-2 text-white border-6 w-[54px] h-[78px]"
        : "bg-color-3 text-color-1 w-14 h-[78px]";
    },
    dayTextClasses(day) {
      return this.selectedDay === day
        ? "inter text-sm text-color-3 font-semibold"
        : "interDay";
    },
    dayNumberClasses(day) {
      return this.selectedDay === day
        ? "poppins text-2xl font-bold text-color-3"
        : "poppins text-2xl font-bold";
    },
    timeClasses(timeSlot) {
      return this.selectedTime === timeSlot
        ? "bg-color-2 w-[84px] h-[62px] rounded-md border-6"
        : "bg-color-3 w-[84px] h-[62px] rounded-md";
    },
    timeNumberClasses(timeSlot) {
      return this.selectedTime === timeSlot
        ? "interHour"
        : "inter text-xl text-color-1 font-bold";
    },
    timeTextClasses(timeSlot) {
      return this.selectedTime === timeSlot
        ? "inter text-sm text-color-3 font-500"
        : "interDay";
    },
    getDayName(day) {
      const date = new Date();
      date.setDate(day);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    },
    async goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.inter {
  font-family: "Inter", sans-serif;
}

.poppins {
  font-family: "Poppins", sans-serif;
}

.poppinsSmall {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

.interDay {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #969696;
}

.interHour {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}
</style>

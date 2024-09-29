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
    <div class="flex gap-4 mb-6">
      <div
        v-for="(day, index) in parsedDates"
        :key="index"
        @click="handleDayClick(day)"
        :class="dayClasses(day)"
        class="w-14 h-[78px] flex p-3 flex-col items-center gap-1 cursor-pointer"
      >
        <p :class="dayTextClasses(day)">{{ getDayName(day) }}</p>
        <p :class="dayNumberClasses(day)">{{ day.getDate() }}</p>
      </div>
    </div>
    <div class="flex gap-4 mb-12">
      <div class="flex gap-4">
        <div
          v-for="(timeSlot, index) in filteredTimes"
          :key="index"
          @click="handleTimeClick(timeSlot)"
          :class="timeClasses(timeSlot)"
          class="w-[84px] h-[62px] flex flex-col items-center p-1.5 cursor-pointer"
        >
          <p :class="timeNumberClasses(timeSlot)">{{ timeSlot.time }}</p>
          <p :class="timeTextClasses(timeSlot)">
            $ {{ timeSlot.theater.price }} {{ timeSlot.theater.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="w-[333px] flex gap-12 mb-5">
      <div>
        <p class="text-lg text-color-3 inter">Price</p>
        <p class="text-lg text-color-3 inter font-semibold">
          ${{ totalPrice.toFixed(2) }}
        </p>
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
import { parseISO } from "date-fns";

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
      shows: [],
      selectedDay: null,
      selectedTime: null,
      theaterPrice: 0,
    };
  },
  computed: {
    parsedDates() {
      return this.dates.map((date) => parseISO(date));
    },
    filteredTimes() {
      if (!this.selectedDay) return [];
      const selectedDateString = this.selectedDay.toISOString().split("T")[0];
      return this.shows.filter((show) => show.date === selectedDateString);
    },
    totalPrice() {
      const seatPrice = this.selectedSeats.reduce((total, seatId) => {
        const seat = this.availableSeats.find((s) => s.seat === seatId);
        return total + (seat ? seat.price : 0);
      }, 0);
      return this.theaterPrice + seatPrice;
    },
  },
  mounted() {
    this.fetchFirstAvailableShow();
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
    async fetchFirstAvailableShow() {
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

        if (!response.ok) {
          throw new Error(`Error fetching seats: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          const firstShow = data[0];
          if (firstShow.date && firstShow.time && firstShow.availableSeats) {
            this.selectedDay = parseISO(firstShow.date);
            this.selectedTime = firstShow.time;
            this.availableSeats = firstShow.availableSeats;
            this.dates = [...new Set(data.map((show) => show.date))];
            this.shows = data;
            this.updateTheaterPrice();
          } else {
            console.error("Invalid data structure:", firstShow);
          }
        } else {
          console.warn("No shows available");
        }
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    },
    async fetchSeats() {
      try {
        const token = this.getCookie("token");
        if (!token) {
          console.error("No token found");
          this.goToLogin();
          return;
        }

        const selectedDate = this.selectedDay;
        const selectedTime = this.selectedTime;

        if (!selectedDate || !selectedTime) {
          console.error("Date or time not selected");
          return;
        }

        const date = selectedDate.toISOString().split("T")[0];
        const [hour, minute] = selectedTime.split(":");

        const response = await fetch(
          `http://localhost:5000/shows/seats/v1/${this.$route.params.id}?date=${date}&hour=${hour}&minute=${minute}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching seats: ${response.statusText}`);
        }

        const data = await response.json();
        this.availableSeats = data[0].availableSeats;
        this.updateTheaterPrice();
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    },
    async handleDayClick(day) {
      this.selectedDay = day;
      const selectedDateString = day.toISOString().split("T")[0];
      const availableTimes = this.shows.filter(
        (show) => show.date === selectedDateString
      );

      if (availableTimes.length > 0) {
        this.selectedTime = availableTimes[0].time;
        await this.updateSeatsAndPrice();
      } else {
        this.selectedTime = null;
        this.availableSeats = [];
        this.selectedSeats = [];
        this.theaterPrice = 0;
      }
    },
    async handleTimeClick(timeSlot) {
      this.selectedTime =
        this.selectedTime === timeSlot.time ? null : timeSlot.time;
      await this.updateSeatsAndPrice();
    },
    async updateSeatsAndPrice() {
      await this.fetchSeats();
      this.selectedSeats = [];
      this.updateTheaterPrice();
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

        console.log("Asientos seleccionados:", this.selectedSeats);
        console.log("Precio total:", this.totalPrice);
      }
    },
    dayClasses(day) {
      return {
        "bg-color-2 text-white rounded-md w-[54px] h-[78px]":
          this.selectedDay &&
          this.selectedDay.toDateString() === day.toDateString(),
        "bg-color-3 text-color-1 rounded-xl w-14 h-[78px]":
          !this.selectedDay ||
          this.selectedDay.toDateString() !== day.toDateString(),
      };
    },
    dayTextClasses(day) {
      return {
        "inter text-sm text-color-3 font-semibold":
          this.selectedDay &&
          this.selectedDay.toDateString() === day.toDateString(),
        interDay:
          !this.selectedDay ||
          this.selectedDay.toDateString() !== day.toDateString(),
      };
    },
    dayNumberClasses(day) {
      return {
        "poppins text-2xl font-bold text-color-3":
          this.selectedDay &&
          this.selectedDay.toDateString() === day.toDateString(),
        "poppins text-2xl font-bold":
          !this.selectedDay ||
          this.selectedDay.toDateString() !== day.toDateString(),
      };
    },
    timeClasses(timeSlot) {
      return {
        "bg-color-2 w-[84px] h-[62px] rounded-md":
          this.selectedTime === timeSlot.time,
        "bg-color-3 w-[84px] h-[62px] rounded-xl":
          this.selectedTime !== timeSlot.time,
      };
    },
    timeNumberClasses(timeSlot) {
      return {
        interHour: this.selectedTime === timeSlot.time,
        "inter text-xl text-color-1 font-bold":
          this.selectedTime !== timeSlot.time,
      };
    },
    timeTextClasses(timeSlot) {
      return {
        "inter text-sm text-color-3 font-500":
          this.selectedTime === timeSlot.time,
        interDay: this.selectedTime !== timeSlot.time,
      };
    },
    seatClasses(seatId) {
      return {
        "bg-color-2": this.isSelected(seatId),
        "bg-color-5": this.isSeatAvailable(seatId) && !this.isSelected(seatId),
        "bg-color-6": !this.isSeatAvailable(seatId),
      };
    },
    getDayName(day) {
      return day.toLocaleString("en-US", { weekday: "short" });
    },
    async goToLogin() {
      this.$router.push("/login");
    },
    updateTheaterPrice() {
      const selectedShow = this.shows.find(
        (show) =>
          show.date === this.selectedDay.toISOString().split("T")[0] &&
          show.time === this.selectedTime
      );

      this.theaterPrice = selectedShow ? selectedShow.theater.price : 0;
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

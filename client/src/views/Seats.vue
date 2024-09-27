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
        <p :class="['poppinsDay', { 'text-white font-bold': selectedDay === day }]">{{ getDayName(day) }}</p>
        <p :class="['poppins text-2xl font-bold', { 'text-white': selectedDay === day }]">{{ day }}</p>
      </div>
    </div>
    <div class="flex gap-4 mt-6 mb-12">
      <div
        v-for="(timeSlot, index) in time"
        :key="index"
        class="bg-color-3 w-[84px] h-[62px] rounded-md flex flex-col items-center p-1.5"
      >
        <p class="poppins text-color-1 text-xl font-bold">{{ timeSlot }}</p>
        <p class="poppinsDay">$ 5.25 3D</p>
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
      selectedSeat: null,
      dates: [],
      time: [],
      selectedDay: null,
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
    // Define the number of seats per row
    seatsPerRow(row) {
      if (row === "A") {
        return 5;
      } else if (row === "B") {
        return 7;
      } else {
        return 9;
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
        console.log("Fetched seats data:", data);
        data.forEach((item, index) => {
          console.log("Seats", item.available_seats);
          console.log("Date", item.date);
          const date = new Date(item.date);
          const day = date.getUTCDate();
          const time =
            date.getUTCHours() +
            ":" +
            date.getUTCMinutes().toString().padStart(2, "0");
          console.log(`Day ${index}:`, day);
          console.log(`Time ${index}:`, time);
          this.dates.push(day); 
          this.time.push(time); 
        });

        this.availableSeats = data[0].available_seats;
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    },
    // Determine if a seat is available
    isSeatAvailable(seatId) {
      const seat = this.availableSeats.find((s) => s.seat === seatId);
      return seat ? seat.availability : false;
    },
    // Determine if a seat is selected
    isSelected(seatId) {
      return this.selectedSeat === seatId;
    },
    // Handle seat click
    handleSeatClick(seatId) {
      try {
        if (this.isSeatAvailable(seatId)) {
          if (this.isSelected(seatId)) {
            this.selectedSeat = null;
            console.log(`Seat unselected: ${seatId}`);
            return;
          } else {
            this.selectedSeat = seatId;
            console.log(`Seat selected: ${seatId}`);
          }
        } else {
          console.log(`Seat ${seatId} is unavailable`);
        }
      } catch (error) {
        console.error("Error handling seat click:", error);
      }
    },
    seatClasses(seatId) {
      const isAvailable = this.isSeatAvailable(seatId);
      const isSelected = this.isSelected(seatId);

      if (isSelected) {
        return "bg-color-2 text-white";
      }
      if (isAvailable) {
        return "bg-color-4 text-gray-300";
      }
      return "bg-color-6 text-gray-700";
    },
    async goToLogin() {
      this.$router.push("/login");
    },
    // Handle day click
    handleDayClick(day) {
      this.selectedDay = this.selectedDay === day ? null : day;
    },
    // Determine CSS classes for day
    dayClasses(day) {
      return {
        'bg-color-2 text-white border-6 w-[54px] h-[78px]': this.selectedDay === day,
        'bg-color-3 text-color-1 w-14 h-[78px]': this.selectedDay !== day,
      };
    },
    // Get day name from date
    getDayName(day) {
      const date = new Date();
      date.setUTCDate(day);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
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

.poppinsDay {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #969696;
}

.poppinsHour {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}
</style>
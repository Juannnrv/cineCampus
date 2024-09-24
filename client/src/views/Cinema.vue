<template>
  <section
    class="h-screen w-screen flex flex-col justify-center items-center bg-color-1"
  >
    <nav class="mx-8 mt-14 mb-5">
      <div class="flex gap-7">
        <div class="flex gap-3 mb-4">
          <div class="relative">
            <img
              class="w-12 h-12 rounded-full"
              src="../assets/img/gengar.png"
              alt=""
            />
            <span
              class="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"
            ></span>
          </div>
          <div class="">
            <p class="font-inter font-regular text-sm text-color-3">Hi, Gengar!</p>
            <p class="font-inter font-semi-bold text-base text-color-3">
              Let’s watch movie together!
            </p>
          </div>
        </div>
        <img class="w-10 mt-[-19px]" :src="notificationImg" />
      </div>
      <div class="bg-color-4 border-2 border-color-3 rounded-xl py-4 px-5 ">
        <div class="flex gap-3">
          <img class="" :src="browseImg" />
          <input
            class="w-full bg-color-4 focus:outline-none my-input text-sm"
            type="text"
            placeholder="Search movie, cinema, genre..."
          />
        </div>
      </div>
    </nav>
    <main class="w-80">
      <div class="flex justify-between mb-8">
        <p class="text-lg text-color-3 font-semi-bold">Now playing</p>
        <p class="text-sm text-color-2 font-semi-bold mt-1">See all</p>
      </div>
    </main>
  </section>
</template>

<script>
import notificationImg from "../assets/img/notification.svg";
import browseImg from "../assets/img/search.svg";

export default {
  name: "Cinema",
  data() {
    return {
      notificationImg,
      browseImg,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

.my-input {
  font-family: "Montserrat", sans-serif;
}
</style>

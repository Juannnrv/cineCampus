<template>
  <section
    class="h-screen w-screen flex flex-col justify-center items-center bg-color-1"
  >
    <nav class="mx-8 mt-14 flex gap-3">
      <div class="flex gap-3">
        <div class="relative">
          <img
            class="w-10 h-10 rounded-full"
            src="../assets/img/gengar.png"
            alt=""
          />
          <span
            class="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"
          ></span>
        </div>
        <div class="">
          <p class="font-inter font-regular text-color-3">Hi, Gengar</p>
          <p class="font-inter font-bold text-color-3">
            Let’s watch movie together!
          </p>
        </div>
      </div>
      <img class="w-10 border-2 rounded-md border-color-4" :src="notificationImg" />
    </nav>
  </section>
</template>

<script>
import notificationImg from "../assets/img/notification.svg";

export default {
  name: "Cinema",
  data() {
    return {
      notificationImg
    };
  },
};
</script>

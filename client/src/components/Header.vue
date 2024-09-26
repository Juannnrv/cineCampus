<template>
    <header class="flex flex-col items-center flex-grow overflow-y-auto">
      <div class="flex gap-16 mx-8 my-5">
        <img :src="arrowImg" class="w-6 h-6" />
        <p class="parrafo">{{ headerText }}</p>
        <img :src="menuImg" class="w-6 h-6" />
      </div>
    </header>
  </template>
  
  <script>
  import arrowImg from "../assets/img/arrow.svg";
  import menuImg from "../assets/img/menu.svg";
  
  export default {
    name: "Header",
    props: {
      headerText: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        arrowImg,
        menuImg,
      };
    },
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
  
  .parrafo {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #ffffff;
  }
  </style>
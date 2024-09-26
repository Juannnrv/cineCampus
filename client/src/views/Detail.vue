<template>
  <section class="h-screen w-screen flex flex-col bg-color-1">
    <Header :headerText="'Cinema Selection'" />
  </section>
</template>

<script>
import Header from "../components/Header.vue";

export default {
  name: "Detail",
  components: {
    Header,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
</style>
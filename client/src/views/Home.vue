<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center bg-color-1"
  >
    <img class="w-64 h-auto mb-16" src="../assets/img/popcorn.png" />
    <h1 class="text-4xl font-poppins font-bold text-color-3 mb-5">
      Cine Campus
    </h1>
    <p
      class="text-lg font-inter font-regular text-color-3 w-80 text-center mb-16"
    >
      Discover a world of movies, always ready for you.
    </p>
    <Button text="Sign In" @click="goToLogin" />
    <Button
      text="Create account"
      buttonClass="bg-slate-50 text-slate-950 border px-28 py-4"
      @click="goToCreateAccount"
    />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Button from "../components/Button.vue";

export default {
  name: "Home",
  setup() {
    const router = useRouter();

    const goToLogin = () => {
      router.push("/login");
    };

    const goToCreateAccount = () => {
      router.push("/createAccount");
    };

    return {
      goToLogin,
      goToCreateAccount,
    };
  },
  components: {
    Button,
  },
};
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center bg-gray-50"
  >
    <img class="max-w-full h-auto mb-16" src="../assets/img/bigStar.svg" />
    <h1 class="text-4xl font-poppins font-bold text-gray-800 mb-3.5">
      Explore the app
    </h1>
    <p
      class="text-lg font-inter font-regular text-slate-950 w-80 text-center mb-16"
    >
      Now your finances are in one place and always under control
    </p>
    <Button
      text="Sign In"
      @click="goToLogin"
    />
    <Button
      text="Create account"
      buttonClass="bg-slate-50 text-slate-950 border border-slate-950 px-28 py-4"
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
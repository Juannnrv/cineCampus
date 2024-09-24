<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center bg-color-1 ">
    <img class="flex mb-10 ml-72 " :src="smallStarImg" alt="Small Star" />
    <h1 class="font-poppins font-bold mb-10 text-3xl mr-60 text-color-3">Log in</h1>
    <form @submit.prevent="logIn">
      <div class="relative mb-4 w-80 text-sm">
        <label for="email" class="font-inter font-bold text-color-3">Email address</label>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1"
          type="email"
          id="email"
          placeholder="helloworld@gmail.com"
          v-model="formData.email"
          required
          aria-invalid="false"
        />
        <img
          class="absolute right-3 transform -translate-y-7"
          :src="formData.email ? agreeImg : disagreeImg"
          alt="Email validation"
        />
      </div>
      <div class="relative mb-3.5 w-80 text-sm">
        <label for="password" class="font-inter font-bold text-color-3">Password</label>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1"
          :type="passwordVisible ? 'text' : 'password'"
          v-model="formData.password"
          id="password"
          placeholder="Your password"
          required
          aria-invalid="false"
        />
        <img
          class="absolute right-3 transform -translate-y-7 cursor-pointer"
          :src="passwordVisible ? ableImg : occultImg"
          @click="togglePasswordVisibility"
          alt="Toggle password visibility"
        />
      </div>
      <div class="flex flex-row my-6 gap-5">
        <div v-if="errorMessage" class="error-message text-red-600 font-semibold">
          {{ errorMessage }}
        </div>
        <div>
          <p class="text-sm text-color-3">Forgot password?</p>
        </div>
      </div>
      <Button
        text="Log in"
        buttonClass="bg-color-2 font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg mb-9"
      />
    </form>
    <div class="flex flex-row mb-5 gap-x-2.5">
      <img :src="Line" alt="Line" />
      <p class="text-sm text-color-3">Or Login with</p>
      <img :src="Line" alt="Line" />
    </div>
    <div class="flex flex-row mb-24 gap-x-4">
      <button class="border bg-color-3 rounded-lg px-11 py-4 w-28 bg-color1">
        <img class="w-6" :src="facebook" alt="Login with Facebook" />
      </button>
      <button class="border bg-color-3 rounded-lg px-11 py-4 w-28 bg-color1">
        <img class="w-6" :src="google" alt="Login with Google" />
      </button>
      <button class="border bg-color-3 rounded-lg px-11 py-4 w-28 bg-color1">
        <img class="w-6" :src="apple" alt="Login with Apple" />
      </button>
    </div>
    <div class="flex flex-row gap-x-2">
      <p class="font-inter font-regular text-sm text-color-3">Don’t have an account?</p>
      <a
        class="font-inter font-semibold  text-color-3 border-b-2 border-color-3 text-sm"
        href="#"
        @click.prevent="goToCreateAccount"
      >Sign up</a>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import agreeImg from "../assets/img/agree.svg";
import disagreeImg from "../assets/img/disagree.svg";
import smallStarImg from "../assets/img/smallStar.svg";
import ableImg from "../assets/img/able.svg";
import occultImg from "../assets/img/occult.svg";
import Line from "../assets/img/Line.svg";
import facebook from "../assets/img/facebook.svg";
import google from "../assets/img/google.svg";
import apple from "../assets/img/apple.svg";
import Button from "../components/Button.vue"; 
export default {
  name: "Login",
  components: {
    Button, 
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      passwordVisible: false,
      errorMessage: "",
      agreeImg,
      disagreeImg,
      smallStarImg,
      ableImg,
      occultImg,
      Line,
      facebook,
      google,
      apple,
    };
  },
  methods: {
    async logIn() {
      this.errorMessage = "";
      try {
        const response = await fetch("http://localhost:5000/login/v1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.formData),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to log in");
        }

        if (data.error) {
          console.error("API error:", data.error);
          this.errorMessage = data.error;
        } else {
          console.log(data);
          this.goToCine();
        }
      } catch (error) {
        console.error("There was an error logging in:", error);
        this.errorMessage = error.message;
      }
    },
    goToCreateAccount() {
      this.$router.push("/createAccount");
    },
    goToCine() {
      this.$router.push("/Cine");
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style>
</style>

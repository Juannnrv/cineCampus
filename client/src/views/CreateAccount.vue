<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center bg-color-1"
  >
    <img class="flex mb-8 ml-72" :src="smallStarImg" />
    <h1 class="font-poppins font-bold mb-10 text-3xl text-color-3 mr-32">Create account</h1>
    <form @submit.prevent="createAccount">
      <p class="font-inter font-bold text-color-3 mr-64 mb-1.5 text-sm">Username</p>
      <input
        class="border border-slate-0 rounded-lg mb-6 px-4 py-2 w-80 bg-color1"
        type="text"
        v-model="formData.name"
        id="name"
        placeholder="Your username"
        required
      />
      <p class="font-inter font-bold text-color-3 mr-64 mb-1.5 text-sm">Email</p>
      <input
        class="border border-slate-0 rounded-lg mb-6 px-4 py-2 w-80 bg-color1"
        type="email"
        v-model="formData.email"
        id="email"
        placeholder="Your email"
        required
      />
      <div class="relative mb-6 w-80">
        <p class="font-inter font-bold text-color-3 mb-1.5 text-sm">Password</p>
        <input
          class="border border-slate-0 rounded-lg px-4 py-2 w-80 bg-color1"
          :type="passwordVisible ? 'text' : 'password'"
          v-model="formData.password"
          id="password"
          placeholder="Your password"
          required
        />
        <img
          class="absolute right-3 transform -translate-y-7"
          :src="passwordVisible ? ableImg : occultImg"
          @click="togglePasswordVisibility"
        />
      </div>
      <div
        v-if="errorMessage"
        class="error-message text-red-600 font-semibold my-6"
      >
        {{ errorMessage }}
      </div>
      <div class="flex flex-row gap-x-3 mb-10 ml-2">
        <img :src="agree ? agreeImg : disagreeImg" @click="toggleAgreement" />
        <p class="font-inter text-color-3  text-sm">
          I accept the terms and privacy policy
        </p>
      </div>
      <Button
      text="Log In"
      buttonClass="mb-16 bg-color-2 font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg"
    />
    </form>
    <div class="flex flex-row gap-x-2">
      <p class="font-inter font-regular text-color-3 text-sm">Already have an account?</p>
      <a
        class="font-inter font-semibold text-color-3 border-b-2 border-color-3"
        href="#"
        @click="goToLogin"
        >Sign in</a
      >
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
import Button from "../components/Button.vue";

export default {
  name: "CreateAccount",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
      agree: false,
      passwordVisible: false,
      errorMessage: null,
      router: null,
      agreeImg,
      disagreeImg,
      smallStarImg,
      ableImg,
      occultImg,
    };
  },
  components: {
    Button
  },
  created() {
    this.router = useRouter();
  },
  methods: {
    async createAccount() {
      try {
        const response = await fetch(`http://localhost:5000/users/v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        if (data.error) {
          console.error("API error:", data.error);
        } else {
          console.log("Account created successfully!");
          this.goToLogin();
        }
      } catch (error) {
        console.error("There was an error creating the account:", error);
        this.errorMessage = error.message;
      }
    },
    goToLogin() {
      this.router.push("/login");
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleAgreement() {
      this.agree = !this.agree;
    },
  },
};
</script>
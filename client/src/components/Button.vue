<template>
  <button
    :class="['font-inter font-semibold rounded-lg', buttonClass]"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      required: true
    },
    buttonClass: {
      type: String,
      default: 'bg-slate-950 font-inter font-semibold text-slate-50 px-36 py-4 rounded-lg mb-3.5' 
    }
  }
};
</script>

<style scoped>
</style>

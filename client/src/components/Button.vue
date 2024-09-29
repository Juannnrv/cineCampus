<template>
  <button
    :class="['font-inter font-semibold rounded-lg', buttonClass]"
    @click="$emit('click')"
    :disabled="disabled"
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
      default: 'bg-color-2 font-inter font-semibold text-color-3 px-36 py-4 rounded-lg mb-3.5' 
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit("click", event);
      }
    },
  },
};
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

<template>
  <div
    class="inline-flex min-h-[25px] cursor-pointer items-center"
    :class="{ 'opacity-50': !noFade, 'opacity-100': noFade }"
    @click="handleCopy"
  >
    <p
      :style="{ minWidth: small ? '3.5rem' : '5.5rem' }"
      :class="{ 'w-full': fullWidth }"
    >
      {{ copiedText || formatValue }}
    </p>
    <component :is="icon" class="ml-1"/>
  </div>
</template>

<script>
// import {mapActions} from 'vuex';
// import {FiCopy, IoIosCheckmarkCircle} from 'vue-icons';
// import {trim} from '@/utils/trim';

export default {
  name: 'HashText',
  props: {
    value: {
      type: String,
    },
    noFade: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copiedText: '',
      icon: '',
    };
  },
  computed: {
    formatValue() {
      return this.copiedText
    },
  },
  methods: {
    handleCopy() {
      this.copiedText = 'Copied!';
    },
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>

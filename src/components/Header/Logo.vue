<template>
  <div class="flex">
    <img :src="logoSrc" alt="Babylon" class="h-[40px] w-[159px]" />
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import darkLogo from '@/assets/logo-black.svg';
  import lightLogo from '@/assets/logo-white.svg';

  export default {
  name: 'Logo',
  setup() {
  const mounted = ref(false);
  const logoSrc = ref('');

  onMounted(() => {
  mounted.value = true;
});

  // Watch for changes in the theme and update logoSrc
  const updateLogo = () => {
  const theme = window.localStorage.getItem('theme'); // Assuming theme is stored in localStorage
  logoSrc.value = theme === 'light' ? darkLogo : lightLogo;
};

  // Update logo on component mounted and when theme changes
  onMounted(() => {
  updateLogo();
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateLogo);
});

  return {
  mounted,
  logoSrc,
};
},
};
</script>

<style scoped>
  /* Add any required styles here */
</style>

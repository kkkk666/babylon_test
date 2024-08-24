<template>
  <div class="flex items-center justify-center gap-4">
    <p>{{ text || 'Please wait...' }}</p>
    <span class="loading loading-spinner loading-xs text-primary"></span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSmall',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>

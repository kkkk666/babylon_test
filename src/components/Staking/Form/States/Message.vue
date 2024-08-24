<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-content p-4 dark:border-neutral-content/20">
    <div class="rounded-full bg-base-200 p-4">
      <img :src="icon" :alt="title" width="32" height="32" />
    </div>
    <h3 class="font-bold">{{ title }}</h3>
    <div class="flex flex-col items-center justify-center">
      <p
        v-for="message in messages"
      :key="message"
      class="text-center text-sm font-light dark:text-neutral-content"
      >
      {{ message }}
    </p>
  </div>
</div>
</template>

<script>
  export default {
  name: 'Message',
  props: {
  title: {
  type: String,
  required: true
},
  messages: {
  type: Array,
  required: true
},
  icon: {
  type: String, // or Object, depending on how the icon is passed
  required: true
}
}
};
</script>

<style scoped>
  /* Add any additional scoped styles here */
</style>

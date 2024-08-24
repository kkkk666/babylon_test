<template>
  <div
    class="card cursor-pointer border bg-base-300 p-4 dark:border-0"
  @click="toggle"
  >
  <div class="flex items-center justify-between">
    <h4 class="font-bold">{{ title }}</h4>
    <button class="btn btn-square btn-sm border border-neutral-content bg-transparent">
      <fa-icon :icon="isOpen ? 'minus' : 'plus'" />
    </button>
  </div>
  <transition name="fade">
    <p v-if="isOpen" class="mt-4" v-html="content"></p>
  </transition>
</div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  library.add(faPlus, faMinus)

  export default {
  name: "SectionItem",
  components: {
  'fa-icon': FontAwesomeIcon,
},
  props: {
  title: {
  type: String,
  required: true,
},
  content: {
  type: String,
  required: true,
},
},
  data() {
  return {
  isOpen: false,
};
},
  methods: {
  toggle() {
  this.isOpen = !this.isOpen;
},
},
};
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>

<template>
  <button
  @click="toggleTheme"
  class="flex gap-1 rounded-full bg-base-100 p-2 outline-none"
  >
  <div :class="iconStyles(lightSelected)">
  <FiSun size="16" />
</div>
<div :class="iconStyles(!lightSelected)">
  <FiMoon size="16" />
  </div>
</button>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import FiMoon from "vue-icons/fi/FiMoon.vue";
  import FiSun from "vue-icons/fi/FiSun.vue";

  export default {
  components: {
  FiMoon,
  FiSun,
},
  data() {
  return {
  mounted: false,
  lightSelected: this.$store.state.theme === "light",
};
},
  computed: {
  ...mapGetters(["resolvedTheme"]),
  lightSelected() {
  return this.resolvedTheme === "light";
}
},
  methods: {
  ...mapActions(["setTheme"]),
  toggleTheme() {
  this.setTheme(this.lightSelected ? "dark" : "light");
},
  iconStyles(active) {
  return `rounded-full p-1 transition duration-300 ease-in-out ${
  active ? (this.lightSelected ? "bg-white" : "bg-primary") : "bg-transparent"
}`;
}
},
  mounted() {
  this.mounted = true;
}
};
</script>

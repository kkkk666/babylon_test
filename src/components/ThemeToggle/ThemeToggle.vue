<template>
  <el-button-group class="flex gap-1 rounded-full bg-base-100 p-2 outline-none">
    <el-button circle icon="el-icon-sunny" @click="toggleTheme"></el-button>
    <el-button circle icon="el-icon-moon" @click="toggleTheme"></el-button>
  </el-button-group>
</template>

<script>
import {mapActions} from "vuex";

export default {
  components: {},
  data() {
    return {
      mounted: false,
      resolvedTheme: "light"
    };
  },
  computed: {
    lightSelected() {
      return this.resolvedTheme === "light";
    }
  },
  methods: {
    ...mapActions(["setTheme"]),
    toggleTheme() {
      // this.setTheme(this.lightSelected ? "dark" : "light");
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

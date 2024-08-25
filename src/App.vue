<template>
  <div id="app">
    <AppProviders>
      <router-view/>
    </AppProviders>
  </div>
</template>

<script>
import AppProviders from './components/AppProviders/AppProviders.vue';

export default {
  name: 'App',
  components: {
    AppProviders
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: rgb(236, 236, 236) url("@/assets/bg-pattern.svg") left top/auto repeat;
}
</style>

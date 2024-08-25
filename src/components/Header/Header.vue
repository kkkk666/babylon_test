<template>
  <nav>
    <div class="bg-base-300 shadow-sm">
      <div class="container mx-auto flex w-full items-center justify-between gap-4 p-4">
        <Logo/>
        <div class="flex flex-1"></div>
        <ConnectSmall
          :onConnect="onConnect"
          :address="address"
          :btcWalletBalanceSat="btcWalletBalanceSat"
          :onDisconnect="onDisconnect"
        />
        <ThemeToggle/>
      </div>
    </div>

  </nav>
</template>

<script>
import Logo from './Logo.vue';
import ConnectSmall from '../Connect/ConnectSmall.vue';
import ThemeToggle from '../ThemeToggle/ThemeToggle.vue';

export default {
  name: 'Header-small',
  components: {
    Logo,
    ConnectSmall,
    ThemeToggle,
  },
  props: {
    onConnect: {
      type: Function,
    },
    address: {
      type: String,
    },
    btcWalletBalanceSat: {
      type: Number,
      default: null,
    },
    onDisconnect: {
      type: Function,
    },
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>

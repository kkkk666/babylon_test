<template>
  <nav>
    <div class="bg-base-300 shadow-sm">
      <div class="container mx-auto flex-col">
        <div class="w-full flex items-center justify-between gap-4 p-6 pb-4 md:pb-6">
          <Logo />
          <div class="flex flex-1">
            <div class="hidden flex-1 xl:flex">
              <TestingInfo />
            </div>
          </div>
          <ConnectSmall
          :onConnect="onConnect"
          :address="address"
          :btcWalletBalanceSat="btcWalletBalanceSat"
          :onDisconnect="onDisconnect"
          />
          <ThemeToggle />
        </div>
        <div
          class="container mx-auto flex w-full items-center gap-4 md:hidden md:p-0"
        :class="{ 'justify-end p-6 pt-0': address }"
        >
        <ConnectedSmall
        :address="address"
        :btcWalletBalanceSat="btcWalletBalanceSat"
        :onDisconnect="onDisconnect"
        />
      </div>
    </div>
  </div>
  <div class="container mx-auto flex w-full items-center p-6 pb-0 xl:hidden">
    <TestingInfo />
  </div>
</nav>
</template>

<script>
  import Logo from './Logo.vue';
  import ConnectSmall from '../Connect/ConnectSmall.vue';
  import ConnectedSmall from '../Connect/ConnectedSmall.vue';
  import TestingInfo from '../TestingInfo/TestingInfo.vue';
  import ThemeToggle from '../ThemeToggle/ThemeToggle.vue';

  export default {
  name: 'Header',
  components: {
  Logo,
  ConnectSmall,
  ConnectedSmall,
  TestingInfo,
  ThemeToggle,
},
  props: {
  onConnect: {
  type: Function,
  required: true,
},
  address: {
  type: String,
  required: true,
},
  btcWalletBalanceSat: {
  type: Number,
  default: null,
},
  onDisconnect: {
  type: Function,
  required: true,
},
},
};
</script>

<style scoped>
  /* Add any required styles here */
</style>

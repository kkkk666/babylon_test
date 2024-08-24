<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12">
      <div class="rounded-full bg-base-200 p-4">
        <img :src="walletIcon" alt="Wallet" width="32" height="32" />
      </div>
      <h3 class="font-bold">Connect wallet</h3>
      <p class="text-center text-sm font-light dark:text-neutral-content">
        Please connect wallet to start staking
      </p>
    </div>
    <button class="btn-primary btn" @click="onConnect">
    <img :src="connectIcon" alt="Connect wallet" />
    Connect wallet
  </button>
</div>
</template>

<script>
  export default {
  props: {
  onConnect: {
  type: Function,
  required: true
}
},
  data() {
  return {
  connectIcon: require('./connect-icon.svg'),
  walletIcon: require('./wallet-icon.svg')
};
}
};
</script>

<style scoped>
  /* 添加组件的样式 */
</style>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12">
      <div class="rounded-full bg-base-200 p-4">
        <img :src="walletIcon" alt="Wallet" width="32" height="32"/>
      </div>
      <h3 class="font-bold">Connect wallet</h3>
      <p class="text-center text-sm font-light dark:text-neutral-content">
        Please connect wallet to start staking
      </p>
    </div>
    <div class="w-full flex justify-center items-center">
      <el-button type="warning" class="w-8/12 flex  justify-center items-center text-xs py-2" @click="onConnect">
        <span class="flex  justify-center items-center">
          <img :src="connectIcon" alt="Connect wallet" class="mr-2 "/>
          <span>Connect wallet</span>
        </span>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      connectIcon: require('./connect-icon.svg'),
      walletIcon: require('./wallet-icon.svg')
    };
  },
  methods: {
    onConnect() {

    }
  },
};
</script>

<style scoped>
/* 添加组件的样式 */
</style>

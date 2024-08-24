<template>
  <div
    class="absolute left-2"
  :class="isWalletConnected ? 'top-40 md:top-24 lg:top-32' : 'top-24 md:top-24 lg:top-32'"
  >
  <template v-if="isTestnet">
    <img :src="testnetIcon" alt="Testnet" class="w-[10rem]" />
    <p class="absolute left-4 top-[4rem] text-sm dark:text-neutral-content">
      Testnet
    </p>
  </template>
</div>
</template>

<script>
  import testnetIcon from './testnet-icon.png';
  import { network } from '@/config/network.config';
  import { Network } from '@/utils/wallet/wallet_provider';

  export default {
  name: 'NetworkBadge',
  props: {
  isWalletConnected: {
  type: Boolean,
  required: true
}
},
  computed: {
  isTestnet() {
  return [Network.SIGNET, Network.TESTNET].includes(network);
}
},
  data() {
  return {
  testnetIcon
};
}
};
</script>

<style scoped>
  /* Add scoped styles here if needed */
</style>

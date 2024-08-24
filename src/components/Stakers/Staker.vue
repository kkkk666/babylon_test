<template>
  <div class="card border bg-base-300 p-4 text-sm dark:border-0 dark:bg-base-200">
    <div class="mb-2 block lg:hidden">
      <Hash :value="pkHex" address small noFade />
    </div>
    <div class="grid grid-cols-2 grid-rows-1 gap-2 lg:grid-cols-3">
      <div class="hidden lg:block">
        <Hash :value="pkHex" address small noFade />
      </div>
      <div>
        <p class="text-xs lg:hidden dark:text-neutral-content">
          Delegations
        </p>
        <p>{{ delegations || 0 }}</p>
      </div>
      <div>
        <p class="text-xs lg:hidden dark:text-neutral-content">Stake</p>
        <p>
          {{ activeTVLSat
            ? `${maxDecimals(satoshiToBtc(activeTVLSat), 8)} ${coinName}`
            : 0 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { getNetworkConfig } from '@/config/network.config';
  import { satoshiToBtc } from '@/utils/btcConversions';
  import { maxDecimals } from '@/utils/maxDecimals';
  import Hash from '../Hash/Hash.vue'; // Adjust the path as necessary

  export default {
  name: 'Staker',
  components: {
  Hash
},
  props: {
  pkHex: {
  type: String,
  required: true
},
  delegations: {
  type: Number,
  required: true
},
  activeTVLSat: {
  type: Number,
  required: true
}
},
  computed: {
  coinName() {
  return getNetworkConfig().coinName;
}
}
};
</script>

<style scoped>
  /* Add scoped styles here if needed */
</style>

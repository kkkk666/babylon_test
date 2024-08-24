<template>
  <div
  :class="[
  generalStyles,
  { 'fp-selected': selected, 'opacity-50 pointer-events-none': !finalityProviderHasData }
  ]"
  @click="handleClick"
  >
  <div class="grid grid-cols-stakingFinalityProvidersMobile grid-rows-2 items-center gap-2 lg:grid-cols-stakingFinalityProvidersDesktop lg:grid-rows-1">
    <div>
      <div v-if="finalityProviderHasData" class="flex items-center gap-1 justify-start">
        <img :src="blue" alt="verified" />
        <p>{{ moniker }}</p>
        <a
          v-if="website"
        :href="website"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary btn btn-outline btn-xs ml-2 p-0 h-6 w-6"
        >
        <FiGlobe />
      </a>
    </div>
    <div v-else class="flex items-center gap-1 justify-start">
          <span
            class="cursor-pointer text-xs text-error"
            v-tooltip="'This finality provider did not provide any information.'"
          >
            <AiOutlineInfoCircle size="16" />
          </span>
      <span>No data provided</span>
    </div>
  </div>
  <div class="flex justify-end lg:justify-start">
    <Hash :value="pkHex" address small noFade />
  </div>
  <div class="flex items-center gap-1">
    <p class="hidden sm:flex lg:hidden">Delegation:</p>
    <p>
      {{ maxDecimals(satoshiToBtc(stakeSat), 8) }} {{ coinName }}
    </p>
    <span
      class="inline-flex cursor-pointer text-xs sm:hidden"
      v-tooltip="'Total delegation'"
    >
          <AiOutlineInfoCircle />
        </span>
  </div>
  <div class="flex items-center justify-end gap-1 lg:justify-start">
    <p class="hidden sm:flex lg:hidden">Commission:</p>
    {{ finalityProviderHasData ? maxDecimals(Number(commission) * 100, 2) + '%' : '-' }}
    <span
      class="inline-flex cursor-pointer text-xs sm:hidden"
      v-tooltip="'Total delegation'"
    >
          <AiOutlineInfoCircle />
        </span>
  </div>
</div>
</div>
</template>

<script>
  import Hash from '../Hash/Hash.vue'; // Adjust path as necessary
  import { getNetworkConfig } from '@/config/network.config';
  import { satoshiToBtc } from '@/utils/btcConversions';
  import { maxDecimals } from '@/utils/maxDecimals';
  import blue from '@/assets/blue-check.svg';
  import FiGlobe from 'vue-feather-icons/dist/icons/globe.vue';
  import AiOutlineInfoCircle from 'vue-feather-icons/dist/icons/info.vue';

  export default {
  name: 'FinalityProvider',
  components: {
  Hash,
  FiGlobe,
  AiOutlineInfoCircle
},
  props: {
  moniker: String,
  pkHex: String,
  stakeSat: Number,
  commission: String,
  onClick: Function,
  selected: Boolean,
  website: String
},
  computed: {
  generalStyles() {
  return "card relative cursor-pointer border bg-base-300 p-4 text-sm transition-shadow hover:shadow-md dark:border-transparent dark:bg-base-200";
},
  finalityProviderHasData() {
  return this.moniker && this.pkHex && this.commission;
},
  coinName() {
  return getNetworkConfig().coinName;
}
},
  methods: {
  handleClick() {
  if (this.finalityProviderHasData) {
  this.onClick();
}
},
  maxDecimals(value, decimals) {
  return maxDecimals(value, decimals);
},
  satoshiToBtc(value) {
  return satoshiToBtc(value);
}
}
};
</script>

<style scoped>
  /* Add scoped styles here if needed */
</style>

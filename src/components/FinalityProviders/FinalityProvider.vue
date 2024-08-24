<template>
  <div class="lg:grid-cols-finalityProviders card grid grid-cols-2 gap-2 border bg-base-300 p-4 text-sm dark:border-0 dark:bg-base-200">
    <div class="flex gap-2">
      <fa-icon :icon="['fas', 'bitcoin']" size="lg" class="mt-1 text-primary" />
      <div class="flex flex-col">
        <div>
          <div v-if="moniker" class="flex items-center gap-1">
            <p>{{ moniker }}</p>
            <img :src="blue" alt="verified" />
          </div>
          <div v-else>
            {{ generateFpNoInfoTooltip('-', 'Finality Provider has not provided additional information') }}
          </div>
        </div>
        <Hash :value="pkHex" :address="true" :small="true" />
      </div>
    </div>
    <div>
      <p>{{ delegations }}</p>
      <div class="flex gap-1 lg:hidden">
        <p v-if="stakeSat">
          {{ maxDecimals(satoshiToBtc(stakeSat), 8) }} {{ coinName }}
        </p>
        <p v-if="stakeSat" class="dark:text-neutral-content">{{ percentage }}</p>
        <p v-else>0</p>
      </div>
    </div>
    <div class="hidden gap-1 lg:flex">
      <p v-if="stakeSat">
        {{ maxDecimals(satoshiToBtc(stakeSat), 8) }} {{ coinName }}
      </p>
      <p v-if="stakeSat" class="dark:text-neutral-content">{{ percentage }}</p>
      <p v-else>0</p>
    </div>
  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
  import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
  import { getNetworkConfig } from "@/config/network.config";
  import blue from "@/assets/blue-check.svg";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import Hash from "@/components/Hash/Hash.vue"; // Assuming the Hash component is in this path

  library.add(faBitcoin, faInfoCircle);

  export default {
  name: 'FinalityProvider',
  components: {
  'fa-icon': FontAwesomeIcon,
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
  stakeSat: {
  type: Number,
  required: true
},
  moniker: {
  type: String,
  default: null
},
  totalActiveTVLSat: {
  type: Number,
  default: null
}
},
  data() {
  return {
  blue,
  coinName: getNetworkConfig().coinName
};
},
  computed: {
  percentage() {
  return this.totalActiveTVLSat
  ? `${Math.round((this.stakeSat / this.totalActiveTVLSat) * 100)}%`
  : '-';
}
},
  methods: {
  generateFpNoInfoTooltip(defaultValue, tooltip) {
  return (
  <div class="flex items-center gap-2">
  <p>{{ defaultValue }}</p>
<span
  class="cursor-pointer text-xs"
  data-tooltip-id="tooltip-missing"
  data-tooltip-content="{{ tooltip }}"
  data-tooltip-place="top"
>
            <fa-icon :icon="['fas', 'info-circle']" />
          </span>
</div>
);
}
}
};
</script>

<style scoped>
  /* Add any required styles here */
</style>

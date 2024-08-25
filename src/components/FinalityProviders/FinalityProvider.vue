<template>
  <div class="card  flex cursor-pointer border bg-base-300 p-4 text-sm transition-shadow hover:shadow-md dark:border-transparent dark:bg-base-200">
    <div class="flex flex-1 gap-2">
      <div class="flex flex-col">
        <div>
          <div v-if="moniker" class="flex items-center gap-1">
            <p>{{ moniker }}</p>
            <img :src="blue" alt="verified"/>
          </div>
          <div v-else>
            <!--            {{ generateFpNoInfoTooltip('-', 'Finality Provider has not provided additional information') }}-->
          </div>
        </div>
        <Hash :value="pkHex" :address="true" :small="true"/>
      </div>
    </div>
    <div class="flex flex-1 gap-2">
      <p>{{ delegations }}</p>
      <div class="flex gap-1 lg:hidden">
        <p v-if="stakeSat">
          {{ stakeSat }} {{ coinName }}
        </p>
        <p v-if="stakeSat" class="dark:text-neutral-content">{{ percentage }}</p>
        <p v-else>0</p>
      </div>
    </div>
    <div class="hidden flex flex-1 gap-1 lg:flex">
      <p v-if="stakeSat">
        {{ stakeSat }} {{ coinName }}
      </p>
      <p v-if="stakeSat" class="dark:text-neutral-content">{{ percentage }}</p>
      <p v-else>0</p>
    </div>
  </div>
</template>

<script>

import {getNetworkConfig} from "@/config/network.config";
import blue from "@/assets/blue-check.svg";
import Hash from "@/components/Hash/Hash.vue"; // Assuming the Hash component is in this path


export default {
  name: 'FinalityProvider',
  components: {
    Hash
  },
  props: {
    pkHex: {
      type: String,
    },
    delegations: {
      type: Number,
    },
    stakeSat: {
      type: Number,
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
    generateFpNoInfoTooltip(defaultValue) {
      return (
        <div class="flex items-center gap-2">
          <p>{{ defaultValue }}</p>
          <span
            class="cursor-pointer text-xs"
            data-tooltip-id="tooltip-missing"
            data-tooltip-content="{{ tooltip }}"
            data-tooltip-place="top"
          >
          </span>
        </div>
      );
    }
  }
};
</script>

<style lang="css" scoped>
.card {
  position: relative;
  border-radius: var(--rounded-box, 1rem);
  background-color: rgb(255, 255, 255);
}
</style>

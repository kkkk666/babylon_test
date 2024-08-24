<template>
  <div class="my-2 text-sm">
    <div v-if="customModeReady">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col items-center">
          <p>
            Selected fee rate: <strong>{{ selectedFeeRate || defaultFeeRate }} sat/vB</strong>
          </p>
          <p>
            Transaction fee amount: <strong>{{ satoshiToBtc(stakingFeeSat) }} {{ coinName }}</strong>
          </p>
        </div>
        <div>
          <input
            type="range"
            :min="minFeeRate"
            :max="maxFeeRate"
            v-model="currentFeeRate"
            class="range range-xs my-2 opacity-60"
            :class="{'range-error': showLowFeesWarning, 'range-primary': !showLowFeesWarning}"
            @change="handleSliderChange"
          />
          <div class="w-full flex justify-between text-xs px-0 items-center">
            <span class="opacity-50">{{ minFeeRate }} sat/vB</span>
            <p v-if="showLowFeesWarning" class="text-center text-error">
              Fees are low, inclusion is not guaranteed
            </p>
            <span class="opacity-50">{{ maxFeeRate }} sat/vB</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col justify-center gap-1 items-center">
        <div class="min-h-8 flex justify-center flex-col items-center">
          <p v-if="mempoolFeeRates">
            Recommended fee rate: <strong>{{ defaultFeeRate }} sats/vB</strong>
          </p>
          <LoadingSmall v-else text="Loading recommended fee rate..."/>
          <p v-if="stakingFeeSat">
            Transaction fee amount: <strong>{{ satoshiToBtc(stakingFeeSat) }} {{ coinName }}</strong>
          </p>
          <LoadingSmall v-else text="Loading transaction fee amount..."/>
        </div>
        <button
          class="btn btn-sm btn-link no-underline"
          @click="setCustomMode(true)"
          :disabled="!mempoolFeeRates || !stakingFeeSat"
        >
          Use Custom
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {getNetworkConfig} from "@/config/network.config";
import {satoshiToBtc} from "@/utils/btcConversions";
import {getFeeRateFromMempool} from "@/utils/getFeeRateFromMempool";
import LoadingSmall from "../../Loading/Loading.vue";

export default {
  props: {
    stakingFeeSat: {
      type: Number,
      required: true,
    },
    selectedFeeRate: {
      type: Number,
      required: true,
    },
    onSelectedFeeRateChange: {
      type: Function,
      required: true,
    },
    reset: {
      type: Boolean,
      required: true,
    },
    mempoolFeeRates: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      customMode: false,
      coinName: getNetworkConfig().coinName,
    };
  },
  computed: {
    customModeReady() {
      return this.customMode && this.mempoolFeeRates && this.stakingFeeSat;
    },
    showLowFeesWarning() {
      return this.selectedFeeRate && this.mempoolFeeRates && this.selectedFeeRate < this.defaultFeeRate;
    },
    currentFeeRate: {
      get() {
        return this.selectedFeeRate || this.defaultFeeRate;
      },
      set(value) {
        this.onSelectedFeeRateChange(value);
      }
    },
    ...getFeeRateFromMempool(this.mempoolFeeRates)
  },
  watch: {
    reset() {
      this.customMode = false;
    },
  },
  methods: {
    handleSliderChange(e) {
      const value = parseInt(e.target.value);
      if (this.mempoolFeeRates && value >= 0 && value >= this.minFeeRate && value <= this.maxFeeRate) {
        this.onSelectedFeeRateChange(value);
      }
    },
    setCustomMode(value) {
      this.customMode = value;
    }
  },
  components: {
    LoadingSmall,
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>

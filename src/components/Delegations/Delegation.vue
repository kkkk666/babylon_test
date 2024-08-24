<template>
  <div
  :class="[
  'card relative border bg-base-300 p-4 text-sm dark:bg-base-200',
  { 'border-primary': isOverflow, 'dark:border-0': !isOverflow }
  ]"
  >
  <div
    v-if="isOverflow"
    class="absolute -top-1 right-1/2 flex translate-x-1/2 items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-white lg:right-2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
  >
    <IoIosWarning size="16" />
    <p>overflow</p>
  </div>

  <div class="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2 lg:grid-flow-row lg:grid-cols-5 lg:grid-rows-1">
    <p>{{ maxDecimals(satoshiToBtc(stakingValueSat), 8) }} {{ coinName }}</p>
    <p>{{ durationTillNow(startTimestamp, currentTime) }}</p>

    <div class="hidden justify-center lg:flex">
      <a
      :href="`${mempoolApiUrl}/tx/${stakingTxHash}`"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary hover:underline"
      >
      {{ trim(stakingTxHash) }}
    </a>
  </div>

  <div class="relative flex justify-end lg:left-[8px] lg:justify-center">
    <div class="flex items-center gap-1">
      <p>{{ renderState() }}</p>
      <span
        class="cursor-pointer text-xs"
        v-tooltip="renderStateTooltip()"
      >
            <AiOutlineInfoCircle />
          </span>
    </div>
  </div>

  <div v-html="generateActionButton()"></div>
</div>
</div>
</template>

<script>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import AiOutlineInfoCircle from "vue-icons/ai/AiOutlineInfoCircle";
  import IoIosWarning from "vue-icons/io/IoIosWarning";
  import { DelegationState } from "@/types/delegations";
  import { getNetworkConfig } from "@/config/network.config";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { durationTillNow } from "@/utils/formatTime";
  import { getState, getStateTooltip } from "@/utils/getState";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { trim } from "@/utils/trim";

  export default {
  name: "Delegation",
  components: {
  AiOutlineInfoCircle,
  IoIosWarning,
},
  props: {
  finalityProviderMoniker: String,
  stakingTx: Object,
  stakingValueSat: Number,
  stakingTxHash: String,
  state: String,
  onUnbond: Function,
  onWithdraw: Function,
  intermediateState: String,
  isOverflow: Boolean,
  globalParamsVersion: Object,
},
  data() {
  return {
  currentTime: Date.now(),
};
},
  computed: {
  coinName() {
  return getNetworkConfig().coinName;
},
  mempoolApiUrl() {
  return getNetworkConfig().mempoolApiUrl;
},
  startTimestamp() {
  return this.stakingTx.startTimestamp;
},
  isActive() {
  return (
  this.intermediateState === DelegationState.ACTIVE ||
  this.state === DelegationState.ACTIVE
  );
},
},
  methods: {
  updateTime() {
  this.currentTime = Date.now();
},
  generateActionButton() {
  if (this.state === DelegationState.ACTIVE) {
  return `
          <div class="flex justify-end lg:justify-start">
            <button
              class="btn btn-outline btn-xs inline-flex text-sm font-normal text-primary"
              @click="() => onUnbond(stakingTxHash)"
              :disabled="intermediateState === DelegationState.INTERMEDIATE_UNBONDING"
            >
              Unbond
            </button>
          </div>`;
} else if (this.state === DelegationState.UNBONDED) {
  return `
          <div class="flex justify-end lg:justify-start">
            <button
              class="btn btn-outline btn-xs inline-flex text-sm font-normal text-primary"
              @click="() => onWithdraw(stakingTxHash)"
              :disabled="intermediateState === DelegationState.INTERMEDIATE_WITHDRAWAL"
            >
              Withdraw
            </button>
          </div>`;
} else {
  return null;
}
},
  renderState() {
  if (this.isOverflow && this.isActive) {
  return getState(DelegationState.OVERFLOW);
} else {
  return getState(this.intermediateState || this.state);
}
},
  renderStateTooltip() {
  if (this.isOverflow && this.isActive) {
  return getStateTooltip(DelegationState.OVERFLOW, this.globalParamsVersion);
} else {
  return getStateTooltip(this.intermediateState || this.state, this.globalParamsVersion);
}
},
},
  mounted() {
  this.updateTime();
  this.timerId = setInterval(this.updateTime, 60000);
},
  beforeUnmount() {
  clearInterval(this.timerId);
},
};
</script>

<style scoped>
  /* 你的样式代码 */
</style>

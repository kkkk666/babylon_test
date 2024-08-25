<template>
  <general-modal :open="open" :small="false" @close="handleClose">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-bold">Preview</h3>
      <button class="btn btn-circle btn-ghost btn-sm" @click="handleClose">
      </button>
    </div>
    <div class="flex flex-col gap-4 text-sm">
      <div class="flex flex-col gap-4 md:flex-row">
        <div :class="cardStyles + ' flex-1'">
          <p class="text-xs dark:text-neutral-content">Finality Provider</p>
          <p>{{ finalityProvider || '-' }}</p>
        </div>
        <div :class="cardStyles + ' flex-1'">
          <p class="text-xs dark:text-neutral-content">Stake Amount</p>
          <p>{{ formatAmount(stakingAmountSat) }} {{ coinName }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <div :class="cardStyles + ' flex-1'">
          <p class="text-xs dark:text-neutral-content">Fee rate</p>
          <p>{{ feeRate }} sat/vB</p>
        </div>
        <div :class="cardStyles + ' flex-1'">
          <p class="text-xs dark:text-neutral-content">Transaction fee</p>
          <p>{{ formatAmount(stakingFeeSat) }} {{ coinName }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <div :class="cardStyles + ' basis-1/5'">
          <p class="text-xs dark:text-neutral-content">Term</p>
          <p>{{ formatBlocksToTime(stakingTimeBlocks) }}</p>
        </div>
        <div :class="cardStyles + ' basis-4/5'">
          <p class="text-xs dark:text-neutral-content">On-demand unbonding</p>
          <p>
            Enabled ({{ formatBlocksToTime(unbondingTimeBlocks) }} unbonding time)
          </p>
        </div>
      </div>
      <h4 class="text-center text-base">Attention!</h4>
      <p class="dark:text-neutral-content">
        1. Your stake may "overflow" the staking TVL cap and need to be unbonded and withdrawn, which will cost you extra transaction fees. So please stake wisely.
      </p>
      <p class="dark:text-neutral-content">
        2. No third party possesses your staked {{ coinName }}. You are the only one who can unbond and withdraw your stake.
      </p>
      <p class="dark:text-neutral-content">
        3. Your stake will initially have the status of "Pending" until it receives {{ confirmationDepth }} Bitcoin confirmations. "Pending" stake is only accessible through the
        device it was created.
      </p>
      <div class="flex gap-4">
        <button class="btn btn-outline flex-1" @click="handleClose">
          Cancel
        </button>
        <button class="btn-primary btn flex-1" @click="onSign">
          Stake
        </button>
      </div>
    </div>
  </general-modal>
</template>

<script>
import GeneralModal from './GeneralModal.vue';
import {getNetworkConfig} from '@/config/network.config';
import {blocksToDisplayTime} from '@/utils/blocksToDisplayTime';
import {satoshiToBtc} from '@/utils/btcConversions';
import {maxDecimals} from '@/utils/maxDecimals';

export default {
  name: 'PreviewModal',
  components: {
    GeneralModal,
  },
  props: {
    open: {
      type: Boolean,
      required: true
    },
    finalityProvider: {
      type: String,
      default: undefined
    },
    stakingAmountSat: {
      type: Number,
      required: true
    },
    stakingTimeBlocks: {
      type: Number,
      required: true
    },
    unbondingTimeBlocks: {
      type: Number,
      required: true
    },
    onSign: {
      type: Function,
      required: true
    },
    stakingFeeSat: {
      type: Number,
      required: true
    },
    feeRate: {
      type: Number,
      required: true
    },
    confirmationDepth: {
      type: Number,
      required: true
    }
  },
  computed: {
    cardStyles() {
      return 'card border bg-base-300 p-4 text-sm dark:border-0 dark:bg-base-200';
    },
    coinName() {
      return getNetworkConfig().coinName;
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', false);
    },
    formatAmount(amountSat) {
      return `${maxDecimals(satoshiToBtc(amountSat), 8)}`;
    },
    formatBlocksToTime(blocks) {
      return blocksToDisplayTime(blocks);
    }
  }
};
</script>

<style scoped>
.card {
  overflow: auto;
}
</style>

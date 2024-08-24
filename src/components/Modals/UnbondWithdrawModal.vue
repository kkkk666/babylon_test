<template>
  <general-modal :open="open" :small="true" @close="handleClose">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="font-bold">{{ title }}</h3>
    <button class="btn btn-circle btn-ghost btn-sm" @click="handleClose">
    <IoMdClose size="24" />
  </button>
</div>
<div class="flex flex-col gap-4">
  <p class="text-left dark:text-neutral-content">{{ content }}</p>
  <div class="flex gap-4">
    <button class="btn btn-outline flex-1" @click="handleClose">
    Cancel
  </button>
  <button class="btn-primary btn flex-1" @click="handleProceed">
  Proceed
</button>
</div>
</div>
</general-modal>
</template>

<script>
  import GeneralModal from './GeneralModal.vue';
  import { IoMdClose } from 'react-icons/io';
  import { getNetworkConfig } from '@/config/network.config';
  import { blocksToDisplayTime } from '@/utils/blocksToDisplayTime';
  import { satoshiToBtc } from '@/utils/btcConversions';
  import { maxDecimals } from '@/utils/maxDecimals';

  export const MODE_UNBOND = 'unbond';
  export const MODE_WITHDRAW = 'withdraw';

  export default {
  name: 'UnbondWithdrawModal',
  components: {
  GeneralModal,
  IoMdClose
},
  props: {
  unbondingTimeBlocks: {
  type: Number,
  required: true
},
  unbondingFeeSat: {
  type: Number,
  required: true
},
  open: {
  type: Boolean,
  required: true
},
  onClose: {
  type: Function,
  required: true
},
  onProceed: {
  type: Function,
  required: true
},
  mode: {
  type: String,
  required: true,
  validator(value) {
  return [MODE_UNBOND, MODE_WITHDRAW].includes(value);
}
}
},
  computed: {
{ coinName, networkName } = getNetworkConfig(),
  unbondTitle() {
  return 'Unbond';
},
  withdrawTitle() {
  return 'Withdraw';
},
  unbondContent() {
  return `
        You are about to unbond your stake before its expiration. <br />A
        transaction fee of <strong>${maxDecimals(satoshiToBtc(this.unbondingFeeSat), 8) || 0} ${this.coinName}</strong>
        will be deduced from your stake by the ${this.networkName} network. <br />
        The expected unbonding time will be about <strong>${blocksToDisplayTime(this.unbondingTimeBlocks)}</strong>. <br />
        After unbonded, you will need to use this dashboard to withdraw your stake for it to appear in your wallet.
      `;
},
  withdrawContent() {
  return `
        You are about to withdraw your stake. <br />A transaction fee will be
        deduced from your stake by the ${this.networkName} network
      `;
},
  title() {
  return this.mode === MODE_UNBOND ? this.unbondTitle : this.withdrawTitle;
},
  content() {
  return this.mode === MODE_UNBOND ? this.unbondContent : this.withdrawContent;
}
},
  methods: {
  handleClose() {
  this.$emit('close', false);
},
  handleProceed() {
  this.$emit('close', false);
  this.onProceed();
}
}
};
</script>

<style scoped>
  .card {
  overflow: auto;
}
</style>

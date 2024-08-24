<template>
  <label class="form-control w-full flex-1">
    <div class="label pt-0">
      <span class="label-text-alt text-base">Amount</span>
      <span class="label-text-alt opacity-50">
        min/max: {{ minStakeAmount }}/{{ maxStakeAmount }} {{ coinName }}
      </span>
    </div>
    <input
      type="text"
      class="no-focus input input-bordered w-full"
    :class="{ 'input-error': error }"
    v-model="value"
    @change="handleChange"
    @blur="handleBlur"
    :placeholder="coinName"
    />
    <div v-if="error" class="my-2 min-h-[20px]">
      <p class="text-center text-sm text-error">{{ error }}</p>
    </div>
  </label>
</template>

<script>
  import { btcToSatoshi, satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { validateDecimalPoints } from "./validation/validation";
  import { getNetworkConfig } from "@/config/network.config";

  export default {
  props: {
  minStakingAmountSat: {
  type: Number,
  required: true,
},
  maxStakingAmountSat: {
  type: Number,
  required: true,
},
  btcWalletBalanceSat: {
  type: Number,
},
  onStakingAmountSatChange: {
  type: Function,
  required: true,
},
  reset: {
  type: Boolean,
  required: true,
},
},
  data() {
  return {
  value: "",
  error: "",
  touched: false,
  coinName: getNetworkConfig().coinName,
};
},
  watch: {
  reset() {
  this.value = "";
  this.error = "";
  this.touched = false;
},
},
  computed: {
  minStakeAmount() {
  return maxDecimals(satoshiToBtc(this.minStakingAmountSat), 8);
},
  maxStakeAmount() {
  return maxDecimals(satoshiToBtc(this.maxStakingAmountSat), 8);
},
},
  methods: {
  handleChange() {
  if (this.touched && this.value === "") {
  this.error = "You should input staking amount";
} else {
  this.error = "";
}
},
  handleBlur() {
  if (!this.btcWalletBalanceSat) return;

  this.touched = true;

  if (this.value === "") {
  this.onStakingAmountSatChange(0);
  this.error = "You should input staking amount";
  return;
}

  const numValue = parseFloat(this.value);
  const satoshis = btcToSatoshi(numValue);

  const validations = [
{
  valid: !isNaN(Number(this.value)),
  message: "Staking amount must be a valid number.",
},
{
  valid: numValue !== 0,
  message: "Staking amount must be greater than 0.",
},
{
  valid: satoshis >= this.minStakingAmountSat,
  message: `Staking amount must be at least ${satoshiToBtc(this.minStakingAmountSat)} ${this.coinName}.`,
},
{
  valid: satoshis <= this.maxStakingAmountSat,
  message: `Staking amount must be no more than ${satoshiToBtc(this.maxStakingAmountSat)} ${this.coinName}.`,
},
{
  valid: satoshis <= this.btcWalletBalanceSat,
  message: `Staking amount must be no more than ${satoshiToBtc(this.btcWalletBalanceSat)} wallet balance.`,
},
{
  valid: validateDecimalPoints(this.value),
  message: "Staking amount must have no more than 8 decimal points.",
},
  ];

  const firstInvalid = validations.find((validation) => !validation.valid);

  if (firstInvalid) {
  this.onStakingAmountSatChange(0);
  this.error = firstInvalid.message;
} else {
  this.error = "";
  this.onStakingAmountSatChange(satoshis);
  this.value = maxDecimals(satoshiToBtc(satoshis), 8).toString();
}
},
},
};
</script>

<style scoped>
  /* 添加样式 */
</style>

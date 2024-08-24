<template>
  <div v-if="isFixed" class="card mb-2 bg-base-200 p-4">
    <p>
      You can unbond and withdraw your stake anytime with an unbonding time of {{ blocksToDisplayTime(unbondingTimeBlocks) }}.
    </p>
    <p>
      There is also a build-in maximum staking period of {{ blocksToDisplayTime(minStakingTimeBlocks) }}.
    </p>
    <p>
      If the stake is not unbonded before the end of this period, it will automatically become withdrawable by you anytime afterwards.
    </p>
    <p>
      The above times are approximates based on average {{ coinName }} block time.
    </p>
  </div>
  <label v-else class="form-control w-full flex-1">
    <div class="label">
      <span class="label-text-alt text-base">Term</span>
      <span class="label-text-alt">
        min term is {{ minStakingTimeBlocks }} blocks
      </span>
    </div>
    <input
      type="string"
      class="no-focus input input-bordered w-full"
    :class="{'input-error': error}"
    v-model="value"
    @change="handleChange"
    @blur="handleBlur"
    placeholder="Blocks"
    />
    <div class="mb-2 mt-4 min-h-[20px]">
      <p class="text-center text-sm text-error">{{ error }}</p>
    </div>
  </label>
</template>

<script>
  import { getNetworkConfig } from "@/config/network.config";
  import { blocksToDisplayTime } from "@/utils/blocksToDisplayTime";
  import { validateNoDecimalPoints } from "./validation/validation";

  export default {
  props: {
  minStakingTimeBlocks: {
  type: Number,
  required: true,
},
  maxStakingTimeBlocks: {
  type: Number,
  required: true,
},
  unbondingTimeBlocks: {
  type: Number,
  required: true,
},
  onStakingTimeBlocksChange: {
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
  isFixed() {
  return this.minStakingTimeBlocks === this.maxStakingTimeBlocks;
},
},
  methods: {
  handleChange(e) {
  const newValue = e.target.value;
  this.value = newValue;

  if (this.touched && newValue === "") {
  this.error = "You should input staking term";
} else {
  this.error = "";
}
},
  handleBlur() {
  this.touched = true;

  if (this.value === "") {
  this.onStakingTimeBlocksChange(0);
  this.error = "You should input staking term";
  return;
}

  const numValue = Number(this.value);

  const validations = [
{
  valid: !isNaN(numValue),
  message: "Staking term must be a valid number.",
},
{
  valid: numValue !== 0,
  message: "Staking term must be greater than 0.",
},
{
  valid: validateNoDecimalPoints(this.value),
  message: "Staking term must not have decimal points.",
},
{
  valid: numValue >= this.minStakingTimeBlocks,
  message: `Staking term must be at least ${this.minStakingTimeBlocks} blocks.`,
},
{
  valid: numValue <= this.maxStakingTimeBlocks,
  message: `Staking term must be no more than ${this.maxStakingTimeBlocks} blocks.`,
},
  ];

  const firstInvalid = validations.find((validation) => !validation.valid);

  if (firstInvalid) {
  this.onStakingTimeBlocksChange(0);
  this.error = firstInvalid.message;
} else {
  this.error = "";
  this.onStakingTimeBlocksChange(numValue);
}
},
  blocksToDisplayTime(blocks) {
  return blocksToDisplayTime(blocks);
},
},
};
</script>

<style scoped>
  /* 添加样式 */
</style>

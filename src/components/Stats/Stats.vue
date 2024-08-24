<template>
  <div class="card flex flex-col gap-4 bg-base-300 p-1 shadow-sm lg:flex-row lg:justify-between">
    <div
      v-for="(section, index) in sections"
    :key="index"
    class="card flex justify-between bg-base-400 p-4 text-sm md:flex-row"
    >
    <div
      v-for="(subSection, subIndex) in section"
    :key="subSection.title"
    class="flex items-center gap-2 md:flex-1 md:flex-col lg:flex-initial lg:flex-row flex-wrap justify-center"
    >
    <div class="flex items-center gap-2">
      <img :src="subSection.icon" :alt="subSection.title" />
      <div class="flex items-center gap-1">
        <p class="dark:text-neutral-content">{{ subSection.title }}</p>
        <span
          v-if="subSection.tooltip"
          class="cursor-pointer text-xs"
        :data-tooltip-id="`tooltip-${subSection.title}`"
        :data-tooltip-content="subSection.tooltip"
        data-tooltip-place="top"
        >
        <AiOutlineInfoCircle />
      </span>
      <Tooltip :id="`tooltip-${subSection.title}`" />
    </div>
  </div>
  <div>
    <p class="flex-1 text-right">
      <span v-if="isLoading" class="loading loading-spinner text-primary" />
      <strong v-else>{{ subSection.value }}</strong>
    </p>
  </div>
  <div v-if="subIndex !== section.length - 1" class="divider mx-0 my-2 md:divider-horizontal" />
</div>
</div>
</div>
</template>

<script>
  import { mapState } from "vuex";
  import Image from "@/components/Image.vue";
  import AiOutlineInfoCircle from "vue-icons/ai/AiOutlineInfoCircle.vue";
  import Tooltip from "vue-directive-tooltip";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { getCurrentGlobalParamsVersion } from "@/utils/globalParams";
  import stakingTvlCap from "./icons/staking-tvl-cap.svg";
  import confirmedTvl from "./icons/confirmed-tvl.svg";
  import delegations from "./icons/delegations.svg";
  import pendingStake from "./icons/pending-stake.svg";
  import stakers from "./icons/stakers.svg";

  export default {
  components: {
  Image,
  AiOutlineInfoCircle,
  Tooltip,
},
  data() {
  return {
  stakingStats: {
  activeTVLSat: 0,
  totalTVLSat: 0,
  activeDelegations: 0,
  totalDelegations: 0,
  totalStakers: 0,
  unconfirmedTVLSat: 0,
},
  stakingCapText: {
  title: "Staking TVL Cap",
  value: "-",
},
  isLoading: true,
};
},
  computed: {
  ...mapState({
  stakingStatsProvider: (state) => state.stakingStatsProvider,
  btcHeight: (state) => state.btcHeight,
  globalParams: (state) => state.globalParams,
}),
  sections() {
  const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

  return [
  [
{
  title: this.stakingCapText.title,
  value: this.stakingCapText.value,
  icon: stakingTvlCap,
},
{
  title: "Confirmed TVL",
  value: this.stakingStats.activeTVLSat
  ? `${maxDecimals(satoshiToBtc(this.stakingStats.activeTVLSat), 8)} ${this.coinName}`
  : 0,
  icon: confirmedTvl,
},
{
  title: "Pending Stake",
  value: this.stakingStats.unconfirmedTVLSat
  ? `${maxDecimals(satoshiToBtc(this.stakingStats.unconfirmedTVLSat - this.stakingStats.activeTVLSat), 8)} ${this.coinName}`
  : 0,
  icon: pendingStake,
  tooltip:
  this.stakingStats &&
  this.stakingStats.unconfirmedTVLSat - this.stakingStats.activeTVLSat < 0
  ? "Pending TVL can be negative when there are unbonding requests"
  : undefined,
},
  ],
  [
{
  title: "Delegations",
  value: this.stakingStats.activeDelegations
  ? formatter.format(this.stakingStats.activeDelegations)
  : 0,
  icon: delegations,
  tooltip: "Total number of stake delegations",
},
{
  title: "Stakers",
  value: this.stakingStats.totalStakers
  ? formatter.format(this.stakingStats.totalStakers)
  : 0,
  icon: stakers,
},
  ],
  ];
},
  coinName() {
  return this.$store.getters["networkConfig/coinName"];
},
},
  watch: {
  stakingStatsProvider: "loadStakingStats",
  globalParams: "updateStakingCapText",
  btcHeight: "updateStakingCapText",
},
  methods: {
  loadStakingStats() {
  if (this.stakingStatsProvider.data) {
  this.stakingStats = this.stakingStatsProvider.data;
}
  this.isLoading = this.stakingStatsProvider.isLoading || this.globalParams.isLoading;
},
  updateStakingCapText() {
  if (!this.btcHeight || !this.globalParams.data) {
  return;
}
  const paramsWithCtx = getCurrentGlobalParamsVersion(this.btcHeight + 1, this.globalParams.data);
  if (!paramsWithCtx) {
  return;
}
  const cap = this.buildStakingCapSection(this.coinName, this.btcHeight, paramsWithCtx);
  if (cap) this.stakingCapText = cap;
},
  buildStakingCapSection(coinName, btcHeight, paramsCtx) {
  const { currentVersion, nextVersion, isApprochingNextVersion } = paramsCtx;
  if (!currentVersion) {
  return;
}
  if (isApprochingNextVersion && nextVersion) {
  return this.buildNextCapText(coinName, btcHeight, nextVersion);
}
  const { stakingCapHeight, stakingCapSat, confirmationDepth } = currentVersion;
  if (stakingCapHeight) {
  const numOfBlockLeft = stakingCapHeight + confirmationDepth - btcHeight - 1;
  return {
  title: "Staking Window",
  value:
  numOfBlockLeft > 0
  ? `closes in ${numOfBlockLeft} ${numOfBlockLeft === 1 ? "block" : "blocks"}`
  : "closed",
};
} else if (stakingCapSat) {
  return {
  title: "Staking TVL Cap",
  value: `${maxDecimals(satoshiToBtc(stakingCapSat), 8)} ${coinName}`,
};
}
},
  buildNextCapText(coinName, btcHeight, nextVersion) {
  const { stakingCapHeight, stakingCapSat, activationHeight } = nextVersion;
  if (stakingCapHeight) {
  const remainingBlocks = activationHeight - btcHeight - 1;
  return {
  title: "Staking Window",
  value: `opens in ${remainingBlocks} ${remainingBlocks === 1 ? "block" : "blocks"}`,
};
} else if (stakingCapSat) {
  return {
  title: "Next Staking TVL Cap",
  value: `${maxDecimals(satoshiToBtc(stakingCapSat), 8)} ${coinName}`,
};
}
},
},
  mounted() {
  this.loadStakingStats();
  this.updateStakingCapText();
},
};
</script>

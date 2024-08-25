<template>
  <div class="card flex flex-col gap-4 bg-base-300 p-1 shadow-sm lg:flex-row lg:justify-between">
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="card flex justify-between bg-base-400 p-4 text-sm md:flex-row"
    >
      <div
        v-for="(subSection) in section"
        :key="subSection.title"
        class="flex items-center gap-2 md:flex-1 md:flex-col lg:flex-initial lg:flex-row flex-wrap justify-center"
      >
        <div class="flex items-center gap-2">
          <img :src="subSection.icon" :alt="subSection.title"/>
          <div class="flex items-center gap-1">
            <p class="dark:text-neutral-content">{{ subSection.title }}</p>
          </div>
        </div>
        <div>
          <p class="flex-1 text-right">
            <span v-if="isLoading" class="loading loading-spinner text-primary"/>
            <strong v-else>{{ subSection.value }}</strong>
          </p>
        </div>
        <div class="divider mx-0 my-2 md:divider-horizontal interval"/>
      </div>
    </div>
  </div>
</template>

<script>
import {satoshiToBtc} from "@/utils/btcConversions";
import {maxDecimals} from "@/utils/maxDecimals";
import stakingTvlCap from "./icons/staking-tvl-cap.svg";
import confirmedTvl from "./icons/confirmed-tvl.svg";
import delegations from "./icons/delegations.svg";
import pendingStake from "./icons/pending-stake.svg";
import stakers from "./icons/stakers.svg";

export default {
  name: "AppStats",
  components: {},
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
      isLoading: false,
    };
  },
  computed: {
    sections() {
      return [
        [
          {
            title: this.stakingCapText.title,
            value: `1000 ${this.coinName}`,
            icon: stakingTvlCap,
          },
          {
            title: "Confirmed TVL",
            value: `1000 ${this.coinName}`,
            icon: confirmedTvl,
          },
          {
            title: "Pending Stake",
            value: `0 ${this.coinName}`,
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
            value: '20.61K',
            icon: delegations,
            tooltip: "Total number of stake delegations",
          },
          {
            title: "Stakers",
            value: '12.73k',
            icon: stakers,
          },
        ],
      ];
    },
    coinName() {
      return 'BTC';
    },
  },
  watch: {},
  methods: {
    loadStakingStats() {

    },
    updateStakingCapText() {

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

<style lang="css" scoped>
.card {
  position: relative;
  border-radius: var(--rounded-box, 1rem);
  background-color: rgb(255, 255, 255);
}

.interval {
  ::before {
    content: "|";
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--tw--content);
    margin-bottom: 2px;
  }

  ::after {
    content: "|";
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--tw--content);
    margin-top: 2px;
  }
}
</style>

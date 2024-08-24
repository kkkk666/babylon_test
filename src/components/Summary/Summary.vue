<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between xl:gap-4">
    <h3 class="mb-4 font-bold xl:mb-0">Your staking summary</h3>
    <div class="flex flex-1 justify-between gap-2">
      <div class="flex flex-col gap-1 text-sm xl:flex-1 xl:flex-row xl:items-center xl:justify-center xl:gap-2 xl:text-base">
        <p class="dark:text-neutral-content">Total staked</p>
        <div class="flex items-center gap-1">
          <FaBitcoin class="text-primary" :size="16" />
          <p class="whitespace-nowrap font-semibold">
            {{ totalStakedSat ? maxDecimals(satoshiToBtc(totalStakedSat), 8) : 0 }} {{ coinName }}
          </p>
        </div>
      </div>
      <div class="divider divider-horizontal xl:m-0" />
      <div class="flex flex-col gap-1 text-sm xl:flex-1 xl:flex-row xl:items-center xl:justify-center xl:gap-2 xl:text-base">
        <p class="dark:text-neutral-content">Balance</p>
        <div class="flex items-center gap-1">
          <FaBitcoin class="text-primary" :size="16" />
          <p v-if="typeof btcWalletBalanceSat === 'number'" class="whitespace-nowrap font-semibold">
            {{ maxDecimals(satoshiToBtc(btcWalletBalanceSat), 8) }} {{ coinName }}
          </p>
          <LoadingSmall v-else text="Loading..." />
        </div>
        <p class="hidden xl:flex xl:text-sm 2xl:ml-2">{{ trim(address) }}</p>
      </div>
    </div>
    <div :class="['divider m-0 xl:divider-horizontal xl:m-0', onMainnet && 'xl:hidden']" />
    <div class="flex justify-between gap-2 text-sm">
      <p class="xl:hidden">{{ trim(address) }}</p>
      <a
        v-if="!onMainnet"
        href="https://discord.com/invite/babylonglobal"
        target="_blank"
        rel="noopener noreferrer"
        class="font-light text-primary hover:underline"
      >
        Get Test Tokens
      </a>
    </div>
  </div>
</template>

<script>
  import FaBitcoin from "vue-icons/fa/FaBitcoin.vue";
  import { getNetworkConfig } from "@/config/network.config";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { trim } from "@/utils/trim";
  import { Network } from "@/utils/wallet/wallet_provider";
  import LoadingSmall from "@/components/Loading/LoadingSmall.vue";

  export default {
  components: {
  FaBitcoin,
  LoadingSmall,
},
  props: {
  address: {
  type: String,
  required: true,
},
  totalStakedSat: {
  type: Number,
  required: true,
},
  btcWalletBalanceSat: {
  type: Number,
  default: null,
},
},
  computed: {
  coinName() {
  return getNetworkConfig().coinName;
},
  onMainnet() {
  return getNetworkConfig().network === Network.MAINNET;
},
},
  methods: {
  satoshiToBtc,
  maxDecimals,
  trim,
},
};
</script>

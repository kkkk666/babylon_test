<template>
  <div class="container flex flex-col gap-6">
    <Stats></Stats>
    <Staking :finalityProviders="finalityProviders"></Staking>
  </div>
</template>

<script>
import Stats from "../Stats/Stats.vue";
import Staking from "../Staking/Staking.vue";
import {getDelegations} from "@/api/getDelegations";
import {getFinalityProviders} from "@/api/getFinalityProviders";
import {getGlobalParams} from "@/api/getGlobalParams";
import {getCurrentGlobalParamsVersion} from "@/utils/globalParams";
import {filterOrdinals} from "@/utils/utxo/index";

export default {
  name: 'AppPage',
  components: {
    Stats,
    Staking
  },
  data() {
    return {
      btcWallet: null,
      btcWalletNetwork: null,
      publicKeyNoCoord: "",
      address: "",
      delegationsLocalStorageKey: "",
      connectModalOpen: false,
      delegationsLocalStorage: [],
      finalityProvidersKV: {},
      totalStakedSat: 0,
      btcWalletBalanceSat: 0,
      paramWithContext: null,
      availableUTXOs: [],
      finalityProviders: [],
      delegations: [],
    };
  },
  computed: {},
  methods: {

    handleDisconnectBTC() {
      this.btcWallet = null;
      this.btcWalletNetwork = null;
      this.publicKeyNoCoord = "";
      this.address = "";
    },
    async fetchGlobalParams() {
      if (this.btcWallet) {
        const [height, versions] = await Promise.all([
          this.btcWallet.getBTCTipHeight(),
          getGlobalParams(),
        ]);
        this.paramWithContext = {
          currentHeight: height,
          nextBlockParams: getCurrentGlobalParamsVersion(height + 1, versions),
        };
      }
    },
    async fetchFinalityProviders(pageParam) {
      const response = await getFinalityProviders(pageParam);
      const flattenedData = response.finalityProviders;

      this.finalityProviders = flattenedData;
    },
    async fetchDelegations(pageParam) {
      const response = await getDelegations(pageParam, this.publicKeyNoCoord);
      const flattenedData = response.pages.reduce((acc, page) => {
        acc.delegations.push(...page.delegations);
        acc.pagination = page.pagination;
        return acc;
      }, { delegations: [], pagination: { next_key: "" } });
      this.delegations = flattenedData;
    },
    async fetchAvailableUTXOs() {
      if (this.btcWallet && this.address) {
        const mempoolUTXOs = await this.btcWallet.getUtxos(this.address);
        const filteredUTXOs = await filterOrdinals(
          mempoolUTXOs,
          this.address,
          this.btcWallet.getInscriptions,
        );
        this.availableUTXOs = filteredUTXOs;
      }
    },
    async handleConnectModal() {
      this.connectModalOpen = true;
    },
    updateDelegationsLocalStorage() {

    },
    setDelegationsLocalStorage(delegations) {
      this.delegationsLocalStorage = delegations;
    },
  },
  watch: {
    btcWallet() {

    },
    delegations() {
      this.updateDelegationsLocalStorage();
    },
    address() {
      this.fetchAvailableUTXOs();
      this.fetchDelegations("");
    },
    publicKeyNoCoord() {
    },
  },
  async created() {
    await this.fetchGlobalParams();
    await this.fetchFinalityProviders("");
    await this.fetchAvailableUTXOs();
  },
};
</script>

<style lang="css" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

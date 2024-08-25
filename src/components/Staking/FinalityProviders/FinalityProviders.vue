<template>
  <div>
    <!-- If there are no finality providers, show loading -->
    <LoadingView v-if="!finalityProviders || finalityProviders.length === 0"/>

    <p v-else>
      Select a finality provider or
      <a
        :href="createFinalityProviderLink"
        target="_blank"
        rel="noopener noreferrer"
        class="sublink text-primary hover:underline"
      >
        create your own
      </a>
      .
    </p>

    <div v-if="finalityProviders.length > 0" class="hidden gap-2 px-3 lg:grid lg:grid-cols-stakingFinalityProvidersDesktop">
      <p>Finality Provider</p>
      <p>BTC PK</p>
      <p>Total Delegation</p>
      <p>Commission</p>
    </div>

    <div id="finality-providers" class="no-scrollbar max-h-[21rem] overflow-y-auto">
      <!--      <InfiniteScroll-->
      <!--        class="flex flex-col gap-4"-->
      <!--        :data-length="finalityProviders.length"-->
      <!--        :next="fetchMoreData"-->
      <!--        :has-more="queryMeta.hasMore"-->
      <!--        :loader="queryMeta.isFetchingMore ? <LoadingTableList /> : null"-->
      <!--        scrollable-target="finality-providers"-->
      <!--      >-->
      <FinalityProvider
        v-for="fp in finalityProviders"
        :key="fp.btcPk"
        :moniker="fp.description?.moniker"
        :website="fp.description?.website"
        :pkHex="fp.btcPk"
        :stakeSat="fp.activeTVLSat"
        :commission="fp.commission"
        :selected="selectedFinalityProvider?.btcPk === fp.btcPk"
        @click="handleFinalityProviderChange(fp.btcPk)"
      />
      <!--      </InfiniteScroll>-->
    </div>
  </div>
</template>

<script>
// import InfiniteScroll from 'vue-infinite-scroll'; // Adjust if necessary
import LoadingView from '@/components/Loading/LoadingView.vue'; // Adjust path as necessary
import FinalityProvider from './FinalityProvider.vue'; // Adjust path as necessary
import {getNetworkConfig} from '@/config/network.config';
import {Network} from '@/utils/wallet/wallet_provider';

export default {
  name: 'FinalityProviders',
  components: {
    // InfiniteScroll,
    LoadingView,
    FinalityProvider
  },
  props: {
    finalityProviders: Array,
    selectedFinalityProvider: Object,
    onFinalityProviderChange: Function,
    queryMeta: Object
  },
  computed: {
    createFinalityProviderLink() {
      const network = getNetworkConfig().network;
      return `https://github.com/babylonchain/networks/tree/main/${network === Network.MAINNET ? 'bbn-1' : 'bbn-test-4'}/finality-providers`;
    }
  },
  methods: {
    handleFinalityProviderChange(btcPk) {
      this.onFinalityProviderChange(btcPk);
    },
    fetchMoreData() {
      // This method should be implemented to fetch more data
      this.queryMeta.next();
    }
  }
};
</script>

<style scoped>
/* Add scoped styles here if needed */
</style>

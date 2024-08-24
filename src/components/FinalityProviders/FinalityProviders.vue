<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm lg:flex-1">
    <h3 class="mb-4 font-bold">Finality Providers</h3>
    <div class="lg:grid-cols-finalityProviders hidden gap-2 px-4 text-sm lg:grid">
      <p>Finality Provider</p>
      <div class="flex items-center gap-1">
        <p>Delegations</p>
        <span
          class="cursor-pointer text-xs"
          v-tooltip="{ id: 'tooltip-delegations', content: 'Total number of stake delegations', place: 'top' }"
        >
          <fa-icon :icon="['fas', 'info-circle']" />
        </span>
      </div>
      <div class="flex items-center gap-1">
        <p>Stake</p>
        <span
          class="cursor-pointer text-xs"
          v-tooltip="{ id: 'tooltip-stake', content: 'Stake information', place: 'top' }"
        >
          <fa-icon :icon="['fas', 'info-circle']" />
        </span>
      </div>
    </div>
    <div
      id="finality-providers"
      class="no-scrollbar max-h-[21rem] overflow-y-auto"
    >
      <InfiniteLoading
      :on-infinite="onInfinite"
      :identifier="data.length"
      spinner="default"
      direction="bottom"
      >
      <div v-if="data.length" class="flex flex-col gap-4">
        <FinalityProvider
          v-for="finalityProvider in data"
        :key="finalityProvider.btcPk"
        :moniker="finalityProvider?.description?.moniker"
        :pkHex="finalityProvider.btcPk"
        :delegations="finalityProvider.activeDelegations"
        :stakeSat="finalityProvider.activeTVLSat"
        :totalActiveTVLSat="totalActiveTVLSat"
        />
      </div>
      <LoadingView v-else />
    </InfiniteLoading>
  </div>
</div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
  import InfiniteLoading from 'vue-infinite-loading';
  import FinalityProvider from './FinalityProvider.vue';
  import { LoadingView, LoadingTableList } from '@/components/Loading/Loading.vue';

  library.add(faInfoCircle);

  export default {
  name: 'FinalityProviders',
  components: {
  FinalityProvider,
  FontAwesomeIcon,
  InfiniteLoading,
  LoadingView,
  LoadingTableList,
},
  props: {
  data: {
  type: Array,
  required: true,
},
  totalActiveTVLSat: {
  type: Number,
  default: null,
},
  queryMeta: {
  type: Object,
  required: true,
},
},
  methods: {
  onInfinite($state) {
  if (this.queryMeta.hasMore) {
  this.queryMeta.next().then(() => {
  $state.loaded();
});
} else {
  $state.complete();
}
},
},
};
</script>

<style scoped>
  /* Add any required styles here */
</style>

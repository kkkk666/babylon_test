<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm lg:flex-1">
    <h3 class="mb-4 font-bold">Finality Providers</h3>
    <div class="flex flex-col gap-3 lg:flex-row">
      <div class="flex flex-1 items-center gap-1">
        <p>Finality Provider</p>
        <span
          class="cursor-pointer text-xs"
        >
        </span>
      </div>
      <div class="flex flex-1 items-center gap-1">
        <p>Delegations</p>
        <span
          class="cursor-pointer text-xs"
        >
        </span>
      </div>
      <div class="flex flex-1 items-center gap-1">
        <p>Stake</p>
        <span
          class="cursor-pointer text-xs"
        >
        </span>
      </div>
    </div>
    <div
      id="finality-providers"
      class="no-scrollbar max-h-[21rem] overflow-y-auto"
    >
      <div v-if="data.length" class="flex flex-col gap-4">
        <template v-for="finalityProvider in data">
          <FinalityProvider
            :key="finalityProvider.btcPk"
            :moniker="finalityProvider?.description?.moniker"
            :pkHex="finalityProvider.btcPk"
            :delegations="finalityProvider.activeDelegations"
            :stakeSat="finalityProvider.activeTVLSat"
            :totalActiveTVLSat="totalActiveTVLSat"
          />
        </template>
      </div>
      <LoadingView v-else/>
    </div>
  </div>
</template>

<script>
import FinalityProvider from './FinalityProvider.vue';
import LoadingView from '@/components/Loading/LoadingView.vue';


export default {
  name: 'FinalityProviders',
  components: {
    FinalityProvider,
    LoadingView,
  },
  props: {
    data: {
      type: Array,
    },
    totalActiveTVLSat: {
      type: Number,
      default: null,
    },
    queryMeta: {
      type: Object,
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
  mounted() {
    console.log(this.data);
  },
};
</script>

<style lang="css" scoped>
#finality-providers {
  max-height: 21rem;
}
</style>

<template>
  <div>
    <!-- Conditional rendering based on the active tab -->
    <div v-if="connected" class="tabs tabs-bordered lg:hidden">
      <a
        v-for="(tab, index) in tabs"
      :key="index"
      :class="{'tab-active': activeTab === index, 'tab': true}"
      @click="setActiveTab(index)"
      >
      {{ tab }}
    </a>
  </div>

  <div class="flex flex-col gap-6 lg:flex-row">
    <div v-if="getActiveTabContent(0)" class="block lg:flex lg:flex-1">
      <Stakers />
    </div>
    <div v-if="getActiveTabContent(1)" class="block lg:flex lg:flex-1">
      <FinalityProviders
      :data="finalityProviders"
      :totalActiveTVLSat="totalActiveTVLSat"
      :queryMeta="queryMeta"
      />
    </div>
  </div>
</div>
</template>

<script>
  import Stakers from '../Stakers/Stakers.vue'; // Adjust path as necessary
  import FinalityProviders from '../FinalityProviders/FinalityProviders.vue'; // Adjust path as necessary

  export default {
  name: 'StakersFinalityProviders',
  components: {
  Stakers,
  FinalityProviders
},
  props: {
  finalityProviders: Array,
  totalActiveTVLSat: Number,
  connected: Boolean,
  queryMeta: Object
},
  data() {
  return {
  activeTab: 0,
  tabs: ["Top Stakers", "Finality Providers"]
};
},
  methods: {
  setActiveTab(index) {
  this.activeTab = index;
},
  getActiveTabContent(index) {
  if (!this.connected) {
  return true;
}
  return this.activeTab === index;
}
}
};
</script>

<style scoped>
  /* Add scoped styles here if needed */
</style>

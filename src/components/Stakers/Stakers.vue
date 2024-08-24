<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm lg:flex-1">
    <h3 class="mb-4 font-bold">Top Stakers</h3>
    <div v-if="stakersData" class="hidden grid-cols-3 gap-2 px-4 text-sm lg:grid">
      <p>Staker</p>
      <div class="flex items-center gap-1">
        <p>Delegations</p>
        <span
          class="cursor-pointer text-xs"
          v-tooltip="'Total number of stake delegations'"
        >
          <AiOutlineInfoCircle />
        </span>
      </div>
      <div class="flex items-center gap-1">
        <p>Stake</p>
        <span
          class="cursor-pointer text-xs"
          v-tooltip="'Stake information'"
        >
          <AiOutlineInfoCircle />
        </span>
      </div>
    </div>
    <div class="no-scrollbar flex max-h-[21rem] flex-col gap-4 overflow-y-auto">
      <Staker
        v-for="staker in stakersData"
      :key="staker.staker_pk_hex"
      :pkHex="staker.staker_pk_hex"
      :delegations="staker.active_delegations"
      :activeTVLSat="staker.active_tvl"
      />
      <LoadingView v-if="!stakersData" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { getStakers } from '@/api/getStakers.ts';
  import Staker from './Staker.vue'; // Adjust path as necessary
  import LoadingView from '@/components/Loading/Loading.vue'; // Adjust path as necessary

  export default {
  name: 'Stakers',
  components: {
  Staker,
  LoadingView,
  AiOutlineInfoCircle: () => import('vue-icons/ai/AiOutlineInfoCircle.vue') // Import dynamically if using Vue icons
},
  data() {
  return {
  stakersData: null,
  error: null
};
},
  methods: {
  async fetchStakers() {
  try {
  const { data } = await getStakers();
  this.stakersData = data.stakers;
} catch (err) {
  this.error = err;
  this.showError({
  error: {
  message: err.message,
  errorState: 'SERVER_ERROR',
  errorTime: new Date()
},
  retryAction: this.fetchStakers
});
}
},
  ...mapActions(['showError'])
},
  mounted() {
  this.fetchStakers();
  this.$interval(() => this.fetchStakers(), 60000); // Fetch data every minute
},
  computed: {
  isErrorOpen() {
  return this.$store.state.isErrorOpen; // Assuming you're using Vuex for error state management
}
}
};
</script>

<style scoped>
  /* Add scoped styles here if needed */
</style>

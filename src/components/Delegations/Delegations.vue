<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm lg:flex-1">
    <h3 class="mb-4 font-bold">Staking history</h3>
    <div v-if="combinedDelegationsData.length === 0" class="rounded-2xl border border-neutral-content p-4 text-center dark:border-neutral-content/20">
      <p>No history found</p>
    </div>
    <div v-else>
      <div class="hidden grid-cols-5 gap-2 px-4 lg:grid">
        <p>Amount</p>
        <p>Inception</p>
        <p class="text-center">Transaction hash</p>
        <p class="text-center">Status</p>
        <p>Action</p>
      </div>
      <div id="staking-history" class="no-scrollbar max-h-[21rem] overflow-y-auto">
        <infinite-loading @infinite="infiniteHandler">
        <delegation
          v-for="delegation in combinedDelegationsData"
        :key="delegation.stakingTxHashHex + delegation.stakingTx.startHeight"
        :finality-provider-moniker="finalityProvidersKV[delegation.finalityProviderPkHex]"
        :staking-tx="delegation.stakingTx"
        :staking-value-sat="delegation.stakingValueSat"
        :staking-tx-hash="delegation.stakingTxHashHex"
        :state="delegation.state"
        :on-unbond="() => handleModal(delegation.stakingTxHashHex, 'unbond')"
        :on-withdraw="() => handleModal(delegation.stakingTxHashHex, 'withdraw')"
        :intermediate-state="getIntermediateState(delegation.stakingTxHashHex)"
        :is-overflow="delegation.isOverflow"
        :global-params-version="globalParamsVersion"
        />
      </infinite-loading>
    </div>
  </div>

  <unbond-withdraw-modal
    v-if="modalMode && txID"
  :unbonding-time-blocks="globalParamsVersion.unbondingTime"
  :unbonding-fee-sat="globalParamsVersion.unbondingFeeSat"
  :open="modalOpen"
  @close="setModalOpen(false)"
  @proceed="modalMode === 'unbond' ? handleUnbond(txID) : handleWithdraw(txID)"
  :mode="modalMode"
  />
</div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';
  import { mapActions, mapState } from 'vuex';
  import Delegation from './Delegation.vue';
  import UnbondWithdrawModal from '../Modals/UnbondWithdrawModal.vue';
  import { signUnbondingTx, signWithdrawalTx } from '@/utils/delegations';
  import { getIntermediateDelegationsLocalStorageKey, toLocalStorageIntermediateDelegation } from '@/utils/local_storage';

  export default {
  components: {
  Delegation,
  InfiniteLoading,
  UnbondWithdrawModal,
},
  props: {
  finalityProvidersKV: {
  type: Object,
  required: true,
},
  delegationsAPI: {
  type: Array,
  required: true,
},
  delegationsLocalStorage: {
  type: Array,
  required: true,
},
  globalParamsVersion: {
  type: Object,
  required: true,
},
  publicKeyNoCoord: {
  type: String,
  required: true,
},
  btcWalletNetwork: {
  type: Object,
  required: true,
},
  address: {
  type: String,
  required: true,
},
  signPsbtTx: {
  type: Function,
  required: true,
},
  pushTx: {
  type: Function,
  required: true,
},
  queryMeta: {
  type: Object,
  required: true,
},
  getNetworkFees: {
  type: Function,
  required: true,
},
},
  data() {
  return {
  modalOpen: false,
  txID: '',
  modalMode: null,
};
},
  computed: {
  ...mapState({
  combinedDelegationsData(state) {
  return [...this.delegationsLocalStorage, ...this.delegationsAPI];
},
}),
},
  methods: {
  ...mapActions(['showError']),
  infiniteHandler($state) {
  if (this.queryMeta.hasMore) {
  this.queryMeta.next().then(() => {
  $state.loaded();
});
} else {
  $state.complete();
}
},
  setModalOpen(open) {
  this.modalOpen = open;
},
  handleModal(txID, mode) {
  this.modalOpen = true;
  this.txID = txID;
  this.modalMode = mode;
},
  getIntermediateState(stakingTxHashHex) {
  const intermediateDelegation = this.intermediateDelegationsLocalStorage.find(
  (item) => item.stakingTxHashHex === stakingTxHashHex
  );
  return intermediateDelegation ? intermediateDelegation.state : null;
},
  async handleUnbond(id) {
  try {
  const { delegation } = await signUnbondingTx(
  id,
  this.delegationsAPI,
  this.publicKeyNoCoord,
  this.btcWalletNetwork,
  this.signPsbtTx
  );
  this.updateLocalStorage(delegation, 'INTERMEDIATE_UNBONDING');
} catch (error) {
  this.showError({
  error: {
  message: error.message,
  errorState: 'UNBONDING',
  errorTime: new Date(),
},
  retryAction: () => this.handleModal(id, 'unbond'),
});
} finally {
  this.setModalOpen(false);
  this.txID = '';
  this.modalMode = null;
}
},
  async handleWithdraw(id) {
  try {
  const { delegation } = await signWithdrawalTx(
  id,
  this.delegationsAPI,
  this.publicKeyNoCoord,
  this.btcWalletNetwork,
  this.signPsbtTx,
  this.address,
  this.getNetworkFees,
  this.pushTx
  );
  this.updateLocalStorage(delegation, 'INTERMEDIATE_WITHDRAWAL');
} catch (error) {
  this.showError({
  error: {
  message: error.message,
  errorState: 'WITHDRAW',
  errorTime: new Date(),
},
  retryAction: () => this.handleModal(id, 'withdraw'),
});
} finally {
  this.setModalOpen(false);
  this.txID = '';
  this.modalMode = null;
}
},
  updateLocalStorage(delegation, newState) {
  const updatedDelegation = toLocalStorageIntermediateDelegation(
  delegation.stakingTxHashHex,
  this.publicKeyNoCoord,
  delegation.finalityProviderPkHex,
  delegation.stakingValueSat,
  delegation.stakingTx.txHex,
  delegation.stakingTx.timelock,
  newState
  );
  this.intermediateDelegationsLocalStorage = [
  updatedDelegation,
  ...this.intermediateDelegationsLocalStorage,
  ];
},
},
  created() {
  this.intermediateDelegationsLocalStorageKey = getIntermediateDelegationsLocalStorageKey(
  this.publicKeyNoCoord
  );

  this.intermediateDelegationsLocalStorage = this.intermediateDelegationsLocalStorage.filter(
  (intermediateDelegation) => {
  const matchingDelegation = this.delegationsAPI.find(
  (delegation) =>
  delegation?.stakingTxHashHex ===
  intermediateDelegation?.stakingTxHashHex
  );

  if (!matchingDelegation) {
  return true;
}

  if (intermediateDelegation.state === 'INTERMEDIATE_UNBONDING') {
  return !(
  matchingDelegation.state === 'UNBONDING_REQUESTED' ||
  matchingDelegation.state === 'UNBONDING' ||
  matchingDelegation.state === 'UNBONDED'
  );
}

  if (intermediateDelegation.state === 'INTERMEDIATE_WITHDRAWAL') {
  return matchingDelegation.state !== 'WITHDRAWN';
}

  return true;
}
  );
},
};
</script>

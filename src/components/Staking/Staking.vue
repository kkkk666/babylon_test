<template>
  <div class="card flex flex-col gap-2 bg-base-300 p-4 shadow-sm lg:flex-1 staking-container">
    <h3 class="card-title">Staking</h3>
    <div v-if="!isWalletConnected" class="flex flex-row">
      <div class="flex flex-1 flex-col gap-4 lg:basis-3/5 xl:basis-2/3">
        <FinalityProviders :data="finalityProviders"></FinalityProviders>
      </div>
      <div class="flex flex-1 flex-col gap-4 lg:basis-2/5 xl:basis-1/3">
        <WalletNotConnected/>
      </div>
    </div>
    <div v-else-if="isLoading">
      <LoadingView/>
    </div>
    <div v-else-if="isBlockHeightUnderActivation">
      <Message
        :title="'Staking has not yet started'"
        :messages="[
      `Staking will be activated once ${coinName} block height passes ${
      firstActivationHeight ? firstActivationHeight - 1 : '-'
    }. The current ${coinName} block height is ${btcHeight || '-'}.`
      ]"
        :icon="stakingNotStarted"
      />
    </div>
    <div v-else-if="isUpgrading">
      <Message
        :title="'Staking parameters upgrading'"
        :messages="['The staking parameters are getting upgraded, staking will be re-enabled soon.']"
        :icon="stakingUpgrading"
      />
    </div>
    <div v-else-if="overflow.overTheCapRange">
      <Message
        :title="overflow.isHeightCap ? 'Staking window closed' : 'Staking cap reached'"
        :messages="[
      overflow.isHeightCap
      ? 'Staking is temporarily disabled due to the staking window being closed. Please check your staking history to see if any of your stake is tagged overflow. Overflow stake should be unbonded and withdrawn.'
      : 'Staking is temporarily disabled due to the staking cap getting reached. Please check your staking history to see if any of your stake is tagged overflow. Overflow stake should be unbonded and withdrawn.'
      ]"
        :icon="stakingCapReached"
      />
    </div>
    <div v-else>
      <p>Set up staking terms</p>
      <div class="flex flex-1 flex-col">
        <StakingTime
          :minStakingTimeBlocks="stakingParams.minStakingTimeBlocks"
          :maxStakingTimeBlocks="stakingParams.maxStakingTimeBlocks"
          :unbondingTimeBlocks="stakingParams.unbondingTime"
          @stakingTimeBlocksChange="handleStakingTimeBlocksChange"
          :reset="resetFormInputs"
        />
        <StakingAmount
          :minStakingAmountSat="stakingParams.minStakingAmountSat"
          :maxStakingAmountSat="stakingParams.maxStakingAmountSat"
          :btcWalletBalanceSat="btcWalletBalanceSat"
          @stakingAmountSatChange="handleStakingAmountSatChange"
          :reset="resetFormInputs"
        />
        <StakingFee
          v-if="signReady"
          :mempoolFeeRates="mempoolFeeRates"
          :stakingFeeSat="stakingFeeSat"
          :selectedFeeRate="selectedFeeRate"
          :reset="resetFormInputs"
        />
        <p v-if="overflow.approchingCapRange" class="text-center text-sm text-error">
          {{ overflow.isHeightCap ? 'Staking window is closing. Your stake may overflow!' : 'Staking cap is filling up. Your stake may overflow!' }}
        </p>
        <span class="cursor-pointer text-xs">
        <button
          class="btn-primary btn mt-2 w-full"
        >
        Preview
      </button>
    </span>
        <!--        <PreviewModal-->
        <!--          v-if="previewReady"-->
        <!--          :open="previewModalOpen"-->
        <!--          @close="handlePreviewModalClose"-->
        <!--          @sign="handleSign"-->
        <!--          :finalityProvider="finalityProvider?.description.moniker"-->
        <!--          :stakingAmountSat="stakingAmountSat"-->
        <!--          :stakingTimeBlocks="stakingTimeBlocksWithFixed"-->
        <!--          :stakingFeeSat="stakingFeeSat"-->
        <!--          :confirmationDepth="stakingParams.confirmationDepth"-->
        <!--          :feeRate="feeRate"-->
        <!--          :unbondingTimeBlocks="stakingParams.unbondingTime"-->
        <!--        />-->
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed} from 'vue';
import FinalityProviders from "@/components/FinalityProviders/FinalityProviders";
import WalletNotConnected from './Form/States/WalletNotConnected.vue';
import LoadingView from '@/components/Loading/LoadingView.vue';
import Message from './Form/States/Message.vue';
import StakingAmount from './Form/StakingAmount.vue';
import StakingFee from './Form/StakingFee.vue';
import StakingTime from './Form/StakingTime.vue';
import stakingCapReached from './Form/States/staking-cap-reached.svg';
import stakingNotStarted from './Form/States/staking-not-started.svg';
import stakingUpgrading from './Form/States/staking-upgrading.svg';

export default {
  name: 'AppStaking',
  components: {
    WalletNotConnected,
    LoadingView,
    Message,
    StakingAmount,
    StakingFee,
    StakingTime,
    FinalityProviders
  },
  props: {
    btcHeight: Number,
    finalityProviders: Array,
    isWalletConnected: Boolean,
    isLoading: Boolean,
    onConnect: Function,
    finalityProvidersFetchNext: Function,
    finalityProvidersHasNext: Boolean,
    finalityProvidersIsFetchingMore: Boolean,
    btcWallet: Object,
    btcWalletBalanceSat: Number,
    btcWalletNetwork: Object,
    address: String,
    publicKeyNoCoord: String,
    setDelegationsLocalStorage: Function,
    availableUTXOs: Array,
  },
  setup(props) {
    const stakingAmountSat = ref(0);
    const stakingTimeBlocks = ref(0);
    const finalityProvider = ref();
    const selectedFeeRate = ref(0);
    const previewModalOpen = ref(false);
    const resetFormInputs = ref(false);
    const feedbackModal = ref({ type: null, isOpen: false });
    const successFeedbackModalOpened = ref(false);
    const cancelFeedbackModalOpened = ref(false);
    const mempoolFeeRates = ref(0);
    const signReady = ref(false);
    const stakingFeeSat = ref(0);
    const stakingTimeBlocksWithFixed = ref(0);
    const paramWithCtx = ref();
    const overflow = ref({
      isHeightCap: false,
      overTheCapRange: false,
      approchingCapRange: false,
    });

    const stakingParams = computed(() => paramWithCtx.value?.currentVersion);
    const firstActivationHeight = computed(() => paramWithCtx.value?.firstActivationHeight);
    const isUpgrading = computed(() => paramWithCtx.value?.isApprochingNextVersion);
    const isBlockHeightUnderActivation = computed(() => {
      return !stakingParams.value || (props.btcHeight && firstActivationHeight.value && props.btcHeight + 1 < firstActivationHeight.value);
    });
    const feeRate = computed(() => selectedFeeRate.value || '0');

    const handleStakingAmountSatChange = (inputAmountSat) => {
      stakingAmountSat.value = inputAmountSat;
    };

    const handleStakingTimeBlocksChange = (inputTimeBlocks) => {
      stakingTimeBlocks.value = inputTimeBlocks;
    };

    const handlePreviewModalClose = (isOpen) => {
      previewModalOpen.value = isOpen;
    };

    const handleSign = async () => {
      try {
        // Handle sign logic
      } catch (error) {
        // Handle error
      }
    };

    return {
      stakingAmountSat,
      stakingTimeBlocks,
      finalityProvider,
      selectedFeeRate,
      previewModalOpen,
      resetFormInputs,
      feedbackModal,
      successFeedbackModalOpened,
      cancelFeedbackModalOpened,
      paramWithCtx,
      overflow,
      stakingParams,
      firstActivationHeight,
      isUpgrading,
      isBlockHeightUnderActivation,
      feeRate,
      handleStakingAmountSatChange,
      handleStakingTimeBlocksChange,
      handlePreviewModalClose,
      handleSign,
      stakingCapReached,
      stakingNotStarted,
      stakingUpgrading,
      mempoolFeeRates,
      signReady,
      stakingFeeSat,
      stakingTimeBlocksWithFixed,
    };
  },
};
</script>
<style lang="css" scoped>
.staking-container {
  background: #ffffff;
}

.card {
  position: relative;
  border-radius: var(--rounded-box, 1rem);
  background-color: rgb(255, 255, 255);
}
</style>

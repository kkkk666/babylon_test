<template>
  <main
    :class="[
  'relative h-full min-h-svh w-full',
  network === 'MAINNET' ? 'main-app-mainnet' : 'main-app-testnet',
  ]"
  >
    <NetworkBadge :isWalletConnected="!!btcWallet"/>
    <Header
      :onConnect="handleConnectModal"
      :onDisconnect="handleDisconnectBTC"
      :address="address"
      :btcWalletBalanceSat="btcWalletBalanceSat"
    />
    <div class="container mx-auto flex justify-center p-6">
      <div class="container flex flex-col gap-6">
        <Stats/>
        <Summary
          v-if="address"
          :address="address"
          :totalStakedSat="totalStakedSat"
          :btcWalletBalanceSat="btcWalletBalanceSat"
        />
        <Staking
          :btcHeight="paramWithContext?.currentHeight"
          :finalityProviders="finalityProviders?.finalityProviders"
          :isWalletConnected="!!btcWallet"
          :onConnect="handleConnectModal"
          :finalityProvidersFetchNext="fetchNextFinalityProvidersPage"
          :finalityProvidersHasNext="hasNextFinalityProvidersPage"
          :finalityProvidersIsFetchingMore="isFetchingNextFinalityProvidersPage"
          :isLoading="isLoadingCurrentParams"
          :btcWallet="btcWallet"
          :btcWalletBalanceSat="btcWalletBalanceSat"
          :btcWalletNetwork="btcWalletNetwork"
          :address="address"
          :publicKeyNoCoord="publicKeyNoCoord"
          :setDelegationsLocalStorage="setDelegationsLocalStorage"
          :availableUTXOs="availableUTXOs"
        />
        <Delegations
          v-if="btcWallet && delegations && paramWithContext?.nextBlockParams.currentVersion && btcWalletNetwork && finalityProvidersKV"
          :finalityProvidersKV="finalityProvidersKV"
          :delegationsAPI="delegations.delegations"
          :delegationsLocalStorage="delegationsLocalStorage"
          :globalParamsVersion="paramWithContext.nextBlockParams.currentVersion"
          :publicKeyNoCoord="publicKeyNoCoord"
          :btcWalletNetwork="btcWalletNetwork"
          :address="address"
          :signPsbtTx="signPsbtTransaction(btcWallet)"
          :pushTx="btcWallet.pushTx"
          :queryMeta="{
      next: fetchNextDelegationsPage,
      hasMore: hasNextDelegationsPage,
      isFetchingMore: isFetchingNextDelegationsPage,
    }"
          :getNetworkFees="btcWallet.getNetworkFees"
        />
        <!-- At this point of time is not used -->
        <!--
        <StakersFinalityProviders
          :finalityProviders="finalityProvidersData"
          :totalActiveTVLSat="stakingStats?.activeTVL"
          :connected="!!btcWallet"
        />
        -->
      </div>
    </div>
    <FAQ/>
    <Footer/>
    <ConnectModal
      :open="connectModalOpen"
      :onClose="() => (connectModalOpen = false)"
      :onConnect="handleConnectBTC"
      :connectDisabled="!!address"
    />
    <ErrorModal
      :open="isErrorOpen"
      :errorMessage="error.message"
      :errorState="error.errorState"
      :errorTime="error.errorTime"
      :onClose="hideError"
      :onRetry="retryErrorAction"
    />
    <TermsModal :open="isTermsOpen" :onClose="closeTerms"/>
  </main>
</template>

<script>
import {networks} from "bitcoinjs-lib";
import {initBTCCurve} from "btc-staking-ts";
import {mapState, mapActions} from "vuex";
import {useLocalStorage} from "vueuse";

import {network} from "@/config/network.config";
import {getCurrentGlobalParamsVersion} from "@/utils/globalParams";
import {calculateDelegationsDiff} from "@/utils/local_storage/calculateDelegationsDiff";
import {getDelegationsLocalStorageKey} from "@/utils/local_storage/getDelegationsLocalStorageKey";
import {filterOrdinals} from "@/utils/utxo";
import {WalletError, WalletErrorType} from "@/utils/wallet/errors";
import {
  getPublicKeyNoCoord,
  isSupportedAddressType,
  toNetwork,
} from "@/utils/wallet/index";
import {Network, WalletProvider} from "@/utils/wallet/wallet_provider";

import {
  getDelegations,
  getFinalityProviders,
  getGlobalParams,
} from "./api";
import {UTXO_KEY} from "./common/constants";
import {signPsbtTransaction} from "./common/utils/psbt";
import {
  Delegations,
  FAQ,
  Footer,
  Header,
  ConnectModal,
  ErrorModal,
  TermsModal,
  NetworkBadge,
  Staking,
  Stats,
  Summary,
} from "./components";
import {useError} from "./context/Error/ErrorContext";
import {useTerms} from "./context/Terms/TermsContext";

export default {
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
    };
  },
  computed: {
    ...mapState({
      error: state => state.error,
      isErrorOpen: state => state.isErrorOpen,
      isTermsOpen: state => state.isTermsOpen,
      globalParamsVersionError: state => state.globalParamsVersionError,
      hasGlobalParamsVersionError: state => state.hasGlobalParamsVersionError,
      finalityProviders: state => state.finalityProviders,
      hasFinalityProvidersError: state => state.hasFinalityProvidersError,
      delegations: state => state.delegations,
      hasDelegationsError: state => state.hasDelegationsError,
      availableUTXOsError: state => state.availableUTXOsError,
      hasAvailableUTXOsError: state => state.hasAvailableUTXOsError,
      isLoadingCurrentParams: state => state.isLoadingCurrentParams,
      isFetchingNextFinalityProvidersPage: state => state.isFetchingNextFinalityProvidersPage,
      isFetchingNextDelegationsPage: state => state.isFetchingNextDelegationsPage,
      hasNextFinalityProvidersPage: state => state.hasNextFinalityProvidersPage,
      hasNextDelegationsPage: state => state.hasNextDelegationsPage,
      isRefetchFinalityProvidersError: state => state.isRefetchFinalityProvidersError,
    }),
  },
  methods: {
    ...mapActions({
      showError: "showError",
      hideError: "hideError",
      closeTerms: "closeTerms",
      refetchFinalityProvidersData: "refetchFinalityProvidersData",
      refetchDelegationData: "refetchDelegationData",
      refetchGlobalParamsVersion: "refetchGlobalParamsVersion",
      refetchAvailableUTXOs: "refetchAvailableUTXOs",
    }),
    async handleConnectBTC(walletProvider) {
      this.connectModalOpen = false;
      try {
        await walletProvider.connectWallet();
        const address = await walletProvider.getAddress();
        const supported = isSupportedAddressType(address);
        if (!supported) {
          throw new Error(
            "Invalid address type. Please use a Native SegWit or Taproot",
          );
        }

        const publicKeyNoCoord = getPublicKeyNoCoord(
          await walletProvider.getPublicKeyHex(),
        );
        this.btcWallet = walletProvider;
        this.btcWalletNetwork = toNetwork(await walletProvider.getNetwork());
        this.address = address;
        this.publicKeyNoCoord = publicKeyNoCoord.toString("hex");
      } catch (error) {
        if (
          error instanceof WalletError &&
          error.getType() === WalletErrorType.ConnectionCancelled
        ) {
          return;
        }
        let errorMessage;
        switch (true) {
          case /Incorrect address prefix for (Testnet \/ Signet|Mainnet)/.test(
            error.message,
          ):
            errorMessage =
              "Unsupported address type detected. Please use a Native SegWit or Taproot address.";
            break;
          default:
            errorMessage = error.message;
            break;
        }
        this.showError({
          error: {
            message: errorMessage,
            errorState: ErrorState.WALLET,
            errorTime: new Date(),
          },
          retryAction: () => this.handleConnectBTC(walletProvider),
        });
      }
    },
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
      const flattenedData = response.pages.reduce((acc, page) => {
        acc.finalityProviders.push(...page.finalityProviders);
        acc.pagination = page.pagination;
        return acc;
      }, { finalityProviders: [], pagination: { next_key: "" } });
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
      if (this.delegations && this.delegations.delegations) {
        calculateDelegationsDiff(this.delegations.delegations, this.delegationsLocalStorage)
          .then(({ areDelegationsDifferent, delegations }) => {
            if (areDelegationsDifferent) {
              this.setDelegationsLocalStorage(delegations);
            }
          });
      }
    },
  },
  watch: {
    btcWallet() {
      if (this.btcWallet) {
        let once = false;
        this.btcWallet.on("accountChanged", () => {
          if (!once) {
            this.handleConnectBTC(this.btcWallet);
          }
        });
        this.$once("hook:beforeDestroy", () => {
          once = true;
        });
      }
    },
    delegations() {
      this.updateDelegationsLocalStorage();
    },
    address() {
      this.fetchAvailableUTXOs();
      this.fetchDelegations("");
    },
    publicKeyNoCoord() {
      this.delegationsLocalStorageKey = getDelegationsLocalStorageKey(this.publicKeyNoCoord);
      const [delegationsLocalStorage] = useLocalStorage(this.delegationsLocalStorageKey, []);
      this.delegationsLocalStorage = delegationsLocalStorage;
    },
  },
  async created() {
    initBTCCurve();
    await this.fetchGlobalParams();
    await this.fetchFinalityProviders("");
    await this.fetchAvailableUTXOs();
  },
};
</script>

<style scoped>
/* Your styles here */
</style>

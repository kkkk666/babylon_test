<template>
  <GeneralModal :open="open" @close="onClose">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-bold">Connect wallet</h3>
      <button
        class="btn btn-circle btn-ghost btn-sm"
        @click="onClose(false)"
      >
        <IoMdClose size="24"/>
      </button>
    </div>
    <div class="flex flex-col justify-center gap-4">
      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-2 rounded-xl bg-base-100 p-4">
          <input
            type="checkbox"
            class="checkbox-primary checkbox"
            v-model="termsAccepted"
          />
          <span class="label-text">
            I certify that I have read and accept the updated
            <button
              @click="openTerms"
              class="transition-colors hover:text-primary cursor-pointer btn btn-link no-underline text-base-content px-0 h-auto min-h-0"
            >
              Terms of Use
            </button>
      .
    </span>
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-2 rounded-xl bg-base-100 p-4">
          <input
            type="checkbox"
            class="checkbox-primary checkbox"
            v-model="noInscription"
          />
          <span class="label-text">
            I certify that there are no Bitcoin inscriptions tokens in my wallet.
          </span>
        </label>
      </div>
      <div class="my-4 flex flex-col gap-4">
        <h3 class="text-center font-semibold">Choose wallet</h3>
        <div class="grid max-h-[20rem] grid-cols-1 gap-4 overflow-y-auto">
          <div v-for="wallet in walletList" :key="wallet.name">
            <template v-if="wallet.name === browserInjectedWalletName">
              <button
                v-if="isInjectable"
                class="flex cursor-pointer items-center gap-2 rounded-xl border-2 bg-base-100 p-2 transition-all hover:text-primary"
                :class="{ 'border-primary': selectedWallet === browserInjectedWalletName, 'border-base-100': selectedWallet !== browserInjectedWalletName }"
                @click="setSelectedWallet(browserInjectedWalletName)"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-full border bg-white p-2 text-black">
                  <img v-if="injectedWalletProviderIcon" :src="injectedWalletProviderIcon" :alt="injectedWalletProviderName" width="26" height="26"/>
                  <FaWallet size="26" v-else/>
                </div>
                <p>{{ injectedWalletProviderName }}</p>
              </button>
            </template>
            <template v-else>
              <a
                v-if="walletAvailable(wallet)"
                class="relative flex cursor-pointer items-center gap-2 rounded-xl border-2 bg-base-100 p-2 transition-all hover:text-primary"
                :class="{ 'border-primary': selectedWallet === wallet.name, 'border-base-100': selectedWallet !== wallet.name, 'opacity-50': !walletAvailable(wallet) }"
                @click="setSelectedWallet(wallet.name)"
                :href="walletAvailable(wallet) ? undefined : wallet.linkToDocs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="flex flex-1 items-center gap-2">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border bg-white p-2">
                    <img :src="wallet.icon" :alt="wallet.name" width="26" height="26"/>
                  </div>
                  <p>{{ wallet.name }}</p>
                  <template v-if="wallet.isQRWallet">
                    <span
                      class="cursor-pointer text-xs"
                      :data-tooltip-id="wallet.name"
                      data-tooltip-content="QR codes used for connection/signing"
                      data-tooltip-place="top"
                    >
        <AiOutlineInfoCircle/>
      </span>
                    <Tooltip :id="wallet.name"/>
                  </template>
                </div>
              </a>
            </template>
          </div>
        </div>
      </div>
      <button
        class="btn-primary btn h-[2.5rem] min-h-[2.5rem] rounded-lg px-2 text-white"
        @click="handleConnect"
        :disabled="connectDisabled || !termsAccepted || !selectedWallet || !noInscription"
      >
        Connect to {{ networkName }} network
      </button>
    </div>
  </GeneralModal>
</template>

<script>
import GeneralModal from '../GeneralModal.vue'; // Adjust path if needed
import {IoMdClose} from 'vue-icons/io';
import {FaWallet} from 'vue-icons/fa';
import {AiOutlineInfoCircle} from 'vue-icons/ai';
import {PiWalletBold} from 'vue-icons/pi';
import Tooltip from 'vue-tooltip'; // Adjust import if needed
import Terms from './data/terms.vue'; // Adjust path if needed

export default {
  name: 'ConnectModal',
  components: {
    GeneralModal,
    IoMdClose,
    FaWallet,
    AiOutlineInfoCircle,
    Tooltip,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    connectDisabled: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      termsAccepted: false,
      noInscription: false,
      selectedWallet: '',
      mounted: false,
      injectedWalletProviderName: 'Browser',
      injectedWalletProviderIcon: '',
    };
  },
  computed: {
    isInjectable() {
      return !!window['btcwallet'];
    },
    networkName() {
      // Add logic to fetch network name, adjust as needed
      return 'NetworkName'; // Replace with actual logic to fetch network name
    },
    walletList() {
      // Add logic to fetch wallet list, adjust as needed
      return []; // Replace with actual wallet list
    },
    browserInjectedWalletName() {
      return 'btcwallet'; // Adjust as needed
    },
  },
  methods: {
    async fetchWalletProviderDetails() {
      if (window['btcwallet']) {
        const name = window['btcwallet'].getWalletProviderName && (await window['btcwallet'].getWalletProviderName());
        const icon = window['btcwallet'].getWalletProviderIcon && (await window['btcwallet'].getWalletProviderIcon());
        if (name) this.injectedWalletProviderName = `${name} (Browser)`;
        if (icon) this.injectedWalletProviderIcon = icon;
      }
    },
    setSelectedWallet(wallet) {
      this.selectedWallet = wallet;
    },
    async handleConnect() {
      if (this.selectedWallet) {
        let walletInstance;

        if (this.selectedWallet === this.browserInjectedWalletName) {
          if (!this.isInjectable) {
            throw new Error('Browser selected without an injectable interface');
          }
          walletInstance = window[this.browserInjectedWalletName];
        } else {
          const walletProvider = this.walletList.find(w => w.name === this.selectedWallet)?.wallet;
          if (!walletProvider) {
            throw new Error('Wallet provider not found');
          }
          walletInstance = new walletProvider();
        }

        this.$emit('connect', walletInstance);
      }
    },
    walletAvailable(wallet) {
      return wallet.isQRWallet || !!window[wallet.provider];
    },
    openTerms() {
      this.$emit('open-terms');
    },
  },
  mounted() {
    this.mounted = true;
    this.fetchWalletProviderDetails();
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

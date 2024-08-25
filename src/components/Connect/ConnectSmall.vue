<template>
  <div>
    <div v-if="address" ref="menuRef" class="relative mr-[-10px] text-sm hidden md:flex">
      <button class="flex cursor-pointer outline-none items-stretch" @click="toggleMenu">
        <div class="flex items-center rounded-lg border border-base-200/75 p-2 pr-4">
          <div class="flex items-center gap-1">
            <!--            <FaBitcoin class="text-primary"/>-->
            <p v-if="btcWalletBalanceSat !== undefined">
              <strong>{{ maxDecimals(satoshiToBtc(btcWalletBalanceSat), 8) }} {{ coinName }}</strong>
            </p>
            <LoadingSmall v-else text="Loading..."/>
          </div>
        </div>
        <div class="relative right-[10px] flex items-center rounded-lg border border-primary bg-[#fdf2ec] p-2 dark:border-white dark:bg-base-200">
          {{ address }}
        </div>
      </button>
      <div v-if="showMenu"
           class="absolute right-[10px] top-0 z-10 mt-[4.5rem] flex flex-col gap-4 rounded-lg bg-base-300 p-4 shadow-lg"
           :style="{ width: 'calc(100% - 8px)' }"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold dark:text-neutral-content">Settings</h3>
          <button class="btn btn-circle btn-ghost btn-sm" @click="toggleMenu">
            <IoMdClose size="24"/>
          </button>
        </div>
        <div class="flex flex-col">
          <Hash :value="address" :address="true" :noFade="true" :fullWidth="true"/>
        </div>
        <button class="btn btn-outline btn-sm" @click="disconnect">
          Disconnect
        </button>
      </div>
    </div>
    <el-button v-else
               type="warning"
               class=""
               @click="disconnect"
               :disabled="!!address"
    >
      <span class="hidden md:flex">Connect to {{ networkName }} network</span>
    </el-button>
  </div>
</template>

<script>
import {getNetworkConfig} from "@/config/network.config";
import Hash from "../Hash/Hash.vue";
import LoadingSmall from "../Loading/LoadingSmall";

export default {
  name: "ConnectSmall",
  components: { Hash, LoadingSmall },
  props: {
    onConnect: {
      type: Function,
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    btcWalletBalanceSat: {
      type: Number,
      default: undefined,
    },
    onDisconnect: {
      type: Function,
    },
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    coinName() {
      return getNetworkConfig().coinName;
    },
    networkName() {
      return getNetworkConfig().networkName;
    },
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    disconnect() {
      this.showMenu = false;
    },
  },
  mounted() {

  },
};
</script>

<style scoped>
/* 你的样式代码 */
</style>

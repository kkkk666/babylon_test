<template>
  <div>
    <div v-if="address" ref="menuRef" class="relative mr-[-10px] text-sm hidden md:flex">
      <button class="flex cursor-pointer outline-none items-stretch" @click="toggleMenu">
      <div class="flex items-center rounded-lg border border-base-200/75 p-2 pr-4">
        <div class="flex items-center gap-1">
          <FaBitcoin class="text-primary" />
          <p v-if="btcWalletBalanceSat !== undefined">
            <strong>{{ maxDecimals(satoshiToBtc(btcWalletBalanceSat), 8) }} {{ coinName }}</strong>
          </p>
          <LoadingSmall v-else text="Loading..." />
        </div>
      </div>
      <div class="relative right-[10px] flex items-center rounded-lg border border-primary bg-[#fdf2ec] p-2 dark:border-white dark:bg-base-200">
        {{ trim(address) }}
      </div>
    </button>
    <div v-if="showMenu"
         class="absolute right-[10px] top-0 z-10 mt-[4.5rem] flex flex-col gap-4 rounded-lg bg-base-300 p-4 shadow-lg"
    :style="{ width: 'calc(100% - 8px)' }"
    >
    <div class="flex items-center justify-between">
      <h3 class="font-bold dark:text-neutral-content">Settings</h3>
      <button class="btn btn-circle btn-ghost btn-sm" @click="toggleMenu">
      <IoMdClose size="24" />
    </button>
  </div>
  <div class="flex flex-col">
    <Hash :value="address" :address="true" :noFade="true" :fullWidth="true" />
  </div>
  <button class="btn btn-outline btn-sm" @click="disconnect">
  Disconnect
</button>
</div>
</div>
<button v-else
        class="btn-primary btn h-[2.5rem] min-h-[2.5rem] rounded-full px-2 text-white md:rounded-lg"
      @click="onConnect"
:disabled="!!address"
  >
  <PiWalletBold size="20" class="flex md:hidden" />
  <span class="hidden md:flex">Connect to {{ networkName }} network</span>
</button>
</div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import FaBitcoin from "vue-icons/fa/FaBitcoin";
  import IoMdClose from "vue-icons/io/IoMdClose";
  import PiWalletBold from "vue-icons/pi/PiWalletBold";
  import { useOnClickOutside } from "vue-use-click-outside"; // 假设使用一个类似的库
  import { getNetworkConfig } from "@/config/network.config";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { trim } from "@/utils/trim";
  import Hash from "../Hash/Hash.vue";
  import LoadingSmall from "../Loading/Loading";

  export default {
  name: "ConnectSmall",
  components: { FaBitcoin, IoMdClose, PiWalletBold, Hash, LoadingSmall },
  props: {
  onConnect: {
  type: Function,
  required: true,
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
  required: true,
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
  this.onDisconnect();
},
},
  mounted() {
  const handleClickOutside = () => {
  this.showMenu = false;
};
  useOnClickOutside(this.$refs.menuRef, handleClickOutside);
},
};
</script>

<style scoped>
  /* 你的样式代码 */
</style>

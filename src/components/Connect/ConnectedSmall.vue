<template>
  <div v-if="address" ref="menuRef" class="relative flex text-sm">
    <button
      class="flex cursor-pointer outline-none items-stretch w-full justify-between"
    @click="toggleMenu"
    >
    <div class="flex items-center rounded-lg border border-base-200/75 p-2 pr-4 w-full">
      <div class="flex items-center gap-1 w-full justify-center">
        <FaBitcoin class="text-primary" />
        <p v-if="btcWalletBalanceSat !== undefined">
          <strong>
            {{ maxDecimals(satoshiToBtc(btcWalletBalanceSat), 8) }} {{ coinName }}
          </strong>
        </p>
        <LoadingSmall v-else text="Loading..." />
      </div>
    </div>
    <div class="relative flex items-center rounded-lg border border-primary bg-[#fdf2ec] p-2 dark:border-white dark:bg-base-200">
      {{ trim(address) }}
    </div>
  </button>
  <div v-if="showMenu" class="absolute top-0 z-10 mt-[4.5rem] flex flex-col gap-4 rounded-lg bg-base-300 p-4 shadow-lg w-full">
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
</template>

<script>
  import { ref, onMounted } from "vue";
  import FaBitcoin from "vue-icons/fa/FaBitcoin";
  import IoMdClose from "vue-icons/io/IoMdClose";
  import { useOnClickOutside } from "vue-use-click-outside"; // 假设使用一个类似的库
  import { getNetworkConfig } from "@/config/network.config";
  import { satoshiToBtc } from "@/utils/btcConversions";
  import { maxDecimals } from "@/utils/maxDecimals";
  import { trim } from "@/utils/trim";
  import Hash from "../Hash/Hash.vue";
  import LoadingSmall from "../Loading/LoadingSmall";

  export default {
  name: "ConnectedSmall",
  components: { FaBitcoin, IoMdClose, Hash, LoadingSmall },
  props: {
  address: {
  type: String,
  required: true,
},
  btcWalletBalanceSat: {
  type: Number,
  default: undefined,
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
},
  methods: {
  toggleMenu() {
  this.showMenu = !this.showMenu;
},
  disconnect() {
  this.showMenu = false;
  this.$emit("disconnect");
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

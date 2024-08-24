<template>
  <div v-if="shouldDisplayTestingMsg()" class="flex w-full justify-center">
    <div class="card flex w-full flex-col items-center gap-1 bg-base-200 p-3 text-sm lg:w-auto lg:flex-row lg:text-xs">
      <div class="flex items-center gap-1 lg:gap-2">
        <RiErrorWarningLine :size="20" />
        <p class="whitespace-nowrap text-center">
          <strong>This is a testing Dapp.</strong>
        </p>
      </div>
      <p class="text-center lg:text-left">
        The app may contain bugs. Use it after conducting your own research
        and making an informed decision. Tokens are for testing only and do
        not carry any monetary value.
      </p>
    </div>
  </div>
</template>

<script>
  import RiErrorWarningLine from "vue-icons/ri/RiErrorWarningLine.vue";
  import { shouldDisplayTestingMsg } from "@/config";

  export default {
  components: {
  RiErrorWarningLine,
},
  methods: {
  shouldDisplayTestingMsg,
},
};
</script>

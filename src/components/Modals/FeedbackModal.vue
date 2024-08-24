<template>
  <GeneralModal :open="open" @close="onClose">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="font-bold">{{ title }}</h3>
    <button
      class="btn btn-circle btn-ghost btn-sm"
    @click="onClose"
    >
    <IoMdClose size="24" />
  </button>
</div>
<SuccessContent v-if="type === 'success'" :networkName="networkName" />
  <CancelContent v-if="type === 'cancel'" :networkName="networkName" />
  </GeneralModal>
</template>

<script>
  import GeneralModal from '../GeneralModal.vue'; // Adjust path if needed
  import SuccessContent from './SuccessContent.vue'; // Adjust path if needed
  import CancelContent from './CancelContent.vue'; // Adjust path if needed
  import IoMdClose from 'vue-icons/io'; // Adjust import if needed
  import { getNetworkConfig } from '@/config/network.config'; // Adjust import if needed

  export default {
  name: 'FeedbackModal',
  components: {
  GeneralModal,
  SuccessContent,
  CancelContent,
  IoMdClose
},
  props: {
  open: {
  type: Boolean,
  required: true
},
  onClose: {
  type: Function,
  required: true
},
  type: {
  type: String,
  required: true,
  validator: value => ['success', 'cancel', null].includes(value)
}
},
  computed: {
  networkName() {
  return getNetworkConfig().networkName;
},
  title() {
  return this.type === 'success' ? 'Congratulations!' : 'We Value Your Feedback';
}
}
};
</script>

<style scoped>
  /* Add any additional styles if needed */
</style>

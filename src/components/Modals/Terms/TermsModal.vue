<template>
  <GeneralModal :open="open" @close="onClose">
  <div class="mb-4 flex items-center justify-between">
    <h4 class="font-bold">Terms of Use</h4>
    <button
      class="btn btn-circle btn-ghost btn-sm"
    @click="onClose(false)"
    >
    <IoMdClose size="24" />
  </button>
</div>
<Terms />
</GeneralModal>
</template>

<script>
  import GeneralModal from '../GeneralModal.vue'; // Adjust path if needed
  import { IoMdClose } from 'vue-icons/io';
  import Terms from './data/terms.vue'; // Adjust path if needed

  export default {
  name: 'TermsModal',
  components: {
  GeneralModal,
  IoMdClose,
  Terms,
},
  props: {
  open: {
  type: Boolean,
  required: true,
},
},
  methods: {
  onClose(value) {
  this.$emit('close', value);
},
},
};
</script>

<style scoped>
  /* Add any additional styles if needed */
</style>

<template>
  <GeneralModal :open="open" @close="onClose">
  <div class="mb- flex items-center justify-end">
    <button
      class="btn btn-circle btn-ghost btn-sm"
    @click="onClose"
    >
    <IoMdClose size="24" />
  </button>
</div>
<div class="flex flex-col justify-center gap-4">
  <h3 class="text-center font-bold text-error">{{ getErrorTitle() }}</h3>
  <div class="flex flex-col gap-3">
    <p class="text-center">{{ getErrorMessage() }}</p>
    <p class="text-center text-xs opacity-50">{{ formattedErrorTime }}</p>
  </div>
  <div class="mt-4 flex justify-around gap-4">
    <button
      class="btn btn-outline flex-1 rounded-lg px-2"
    @click="onClose"
    >
    Cancel
  </button>
  <button
    v-if="onRetry"
    class="btn-primary btn flex-1 rounded-lg px-2 text-white"
  @click="handleRetry"
  >
  Try Again
</button>
</div>
</div>
</GeneralModal>
</template>

<script>
  import GeneralModal from '../GeneralModal.vue'; // Adjust path if needed
  import { IoMdClose } from 'vue-icons/io'; // Adjust import if needed
  import { format } from 'date-fns'; // Adjust import if needed
  import { useError } from '@/context/Error/ErrorContext'; // Adjust import if needed
  import { ErrorState } from '@/types/errors'; // Adjust import if needed

  export default {
  name: 'ErrorModal',
  components: {
  GeneralModal,
  IoMdClose
},
  props: {
  open: {
  type: Boolean,
  required: true
},
  errorMessage: {
  type: String,
  required: true
},
  errorState: {
  type: String, // Adjust type if needed based on ErrorState enum
  default: ''
},
  errorTime: {
  type: Date,
  required: true
},
  onRetry: {
  type: Function,
  default: null
}
},
  data() {
  return {
  error: this.$store.state.error, // Adjust based on your state management
  retryErrorAction: this.$store.state.retryErrorAction // Adjust based on your state management
};
},
  computed: {
  formattedErrorTime() {
  return format(this.errorTime, "dd MMMM yyyy 'at' HH:mm:ss");
}
},
  methods: {
  handleRetry() {
  const retryErrorParam = {
  error: {
  message: this.error.message,
  errorState: this.error.errorState,
  errorTime: new Date()
},
  retryAction: this.retryErrorAction
};

  this.onClose();

  setTimeout(() => {
  if (retryErrorParam.retryAction) {
  retryErrorParam.retryAction();
}
}, 300);
},
  getErrorTitle() {
  switch (this.errorState) {
  case ErrorState.SERVER_ERROR:
  return 'Server Error';
  case ErrorState.WALLET:
  return 'Network Error';
  case ErrorState.WITHDRAW:
  return 'Withdraw Error';
  case ErrorState.STAKING:
  return 'Stake Error';
  case ErrorState.UNBONDING:
  return 'Unbonding Error';
  default:
  return 'Unknown Error';
}
},
  getErrorMessage() {
  switch (this.errorState) {
  case ErrorState.SERVER_ERROR:
  return `Error fetching data due to: ${this.errorMessage}`;
  case ErrorState.UNBONDING:
  return `Your request to unbound failed due to: ${this.errorMessage}`;
  case ErrorState.WITHDRAW:
  return `Failed to withdraw due to: ${this.errorMessage}`;
  case ErrorState.STAKING:
  return `Failed to stake due to: ${this.errorMessage}`;
  case ErrorState.WALLET:
  return `Failed to switch network due to: ${this.errorMessage}`;
  default:
  return this.errorMessage;
}
}
}
};
</script>

<style scoped>
  /* Add any additional styles if needed */
</style>

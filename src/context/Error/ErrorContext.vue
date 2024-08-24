<template>
  <ErrorContext.Provider :value="contextValue">
    <slot/>
  </ErrorContext.Provider>
</template>

<script>
import {ref, computed, provide, defineComponent} from 'vue';
import {ErrorType} from '@/types/errors';

export default defineComponent({
  name: 'ErrorProvider',
  props: {
    children: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isErrorOpen = ref(false);
    const error = ref({
      message: '',
      errorTime: new Date(),
      errorState: undefined,
    });
    const retryErrorAction = ref(undefined);

    const showError = ({ error: errorParam, retryAction }) => {
      error.value = errorParam;
      isErrorOpen.value = true;
      retryErrorAction.value = retryAction;
    };

    const hideError = () => {
      isErrorOpen.value = false;
      setTimeout(() => {
        error.value = {
          message: '',
          errorTime: new Date(),
          errorState: undefined,
        };
        retryErrorAction.value = undefined;
      }, 300);
    };

    const contextValue = computed(() => ({
      isErrorOpen: isErrorOpen.value,
      error: error.value,
      showError,
      hideError,
      retryErrorAction: retryErrorAction.value,
    }));

    provide('errorContext', contextValue);

    return {
      contextValue,
    };
  },
});
</script>

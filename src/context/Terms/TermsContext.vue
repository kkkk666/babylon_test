<template>
  <TermsContext.Provider :value="termsContext">
    <slot/>
  </TermsContext.Provider>
</template>

<script>
import {ref, provide, defineComponent} from 'vue';

export default defineComponent({
  name: 'TermsProvider',
  setup() {
    const isTermsOpen = ref(false);

    const openTerms = () => {
      isTermsOpen.value = true;
    };

    const closeTerms = () => {
      isTermsOpen.value = false;
    };

    const termsContext = {
      isTermsOpen,
      openTerms,
      closeTerms,
    };

    provide('termsContext', termsContext);

    return {
      termsContext,
    };
  },
});
</script>

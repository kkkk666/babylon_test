<template>
  <BtcHeightContext.Provider :value="btcHeight">
    <slot/>
  </BtcHeightContext.Provider>
</template>

<script>
import {ref, provide, defineComponent, onMounted} from 'vue';
import {getTipHeight} from '@/utils/mempool_api';

export default defineComponent({
  name: 'BtcHeightProvider',
  setup() {
    const btcHeight = ref(undefined);
    getTipHeight().then().then((height) => {
      btcHeight.value = height;
    });

    onMounted(() => {
      // btcHeight.value = data.value;
    });

    provide('btcHeight', btcHeight);

    return {
      btcHeight,
    };
  },
});
</script>

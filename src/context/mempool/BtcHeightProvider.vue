<template>
  <BtcHeightContext.Provider :value="btcHeight">
    <slot/>
  </BtcHeightContext.Provider>
</template>

<script>
import {ref, provide, defineComponent, onMounted} from 'vue';
import {getTipHeight} from '@/utils/mempool_api.ts';

export default defineComponent({
  name: 'BtcHeightProvider',
  setup() {
    const btcHeight = ref(undefined);

    // const { data } = useQuery({
    //   queryKey: ['BTC_HEIGHT_MEMPOOL_API'],
    //   queryFn: async () => getTipHeight(),
    //   refetchInterval: 60000, // 1 minute
    // });

    onMounted(() => {
      btcHeight.value = data.value;
    });

    provide('btcHeight', btcHeight);

    return {
      btcHeight,
    };
  },
});
</script>

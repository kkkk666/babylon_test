<template>
  <ThemeProvider :defaultTheme="defaultTheme" attribute="data-theme">
    <QueryClientProvider :client="queryClient">
      <ErrorProvider>
        <GlobalParamsProvider>
          <BtcHeightProvider>
            <StakingStatsProvider>
              <slot/>
            </StakingStatsProvider>
          </BtcHeightProvider>
        </GlobalParamsProvider>
      </ErrorProvider>
    </QueryClientProvider>
  </ThemeProvider>
</template>

<script>
// Import your Vue plugins or components here
import ThemeProvider from '@/ThemeProvider.vue';
import QueryClientProvider from '@/QueryClientProvider.vue';
import GlobalParamsProvider from '@/context/api/GlobalParamsProvider';
import StakingStatsProvider from '@/context/api/StakingStatsProvider';
import BtcHeightProvider from '@/context/mempool/BtcHeightProvider';

export default {
  name: 'Providers',
  components: {
    ThemeProvider,
    QueryClientProvider,
    GlobalParamsProvider,
    StakingStatsProvider,
    BtcHeightProvider,
  },
  data() {
    return {
      defaultTheme: 'dark',
      initialIsOpen: false,
    };
  },
};
</script>

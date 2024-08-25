<template>
  <StakingStatsContext.Provider :value="contextValue">
    <slot/>
  </StakingStatsContext.Provider>
</template>

<script>
import {mapActions} from 'vuex';
import {getStats} from '@/api/getStats';
import {ErrorState} from '@/types/errors';

export default {
  name: 'StakingStatsProvider',
  data() {
    return {
      isLoading: true,
      data: undefined,
    };
  },
  computed: {
    contextValue() {
      return {
        data: this.data,
        isLoading: this.isLoading,
      };
    },
  },
  async mounted() {
    await this.fetchStats();
  },
  watch: {
    isError(newValue) {
      if (newValue && this.error) {
        this.showError({
          error: {
            message: this.error.message,
            errorState: ErrorState.SERVER_ERROR,
            errorTime: new Date(),
          },
          retryAction: this.fetchStats,
        });
      }
    },
  },
  methods: {
    ...mapActions(['showError']),
    async fetchStats() {
      try {
        this.isLoading = true;
        const response = await getStats();
        this.data = response;
      } catch (error) {
        this.error = error;
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div></div>
  <!--  <GlobalParamsContext.Provider :value="contextValue">-->
  <!--  <slot />-->
  <!--</GlobalParamsContext.Provider>-->
</template>

<script>
// import { createNamespacedHelpers } from 'vuex';
// import { mapState, mapActions } from 'vuex';
import {getGlobalParams} from '@/api/getGlobalParams';

export default {
  name: 'GlobalParamsProvider',
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
    await this.fetchGlobalParams();
  },
  methods: {
    async fetchGlobalParams() {
      try {
        this.isLoading = true;
        const response = await getGlobalParams();
        this.data = response;
      } catch (error) {
        console.error('Failed to fetch global params', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

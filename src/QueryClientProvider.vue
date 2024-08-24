<template>
  <div>
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'QueryClientProvider',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  render() {
  }
};
</script>

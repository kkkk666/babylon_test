<template>
  <div :class="themeClass">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'ThemeProvider',
  props: {
    defaultTheme: {
      type: String,
      default: 'dark'
    },
    attribute: {
      type: String,
      default: 'data-theme'
    }
  },
  computed: {
    themeClass() {
      return this.$attrs.attribute === 'data-theme' ? this.defaultTheme : '';
    }
  }
};
</script>

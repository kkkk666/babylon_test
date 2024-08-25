<template>
  <modal
    v-model="open"
    @close="handleClose"
    :class="modalClasses"
    :adaptive="true"
    :scrollable="false"
    :height="'85vh'"
  >
    <div :class="contentClasses">
      <slot></slot>
    </div>
  </modal>
</template>

<script>

export default {
  name: 'GeneralModal',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    modalClasses() {
      return `flex items-end justify-center md:items-center m-0 w-full max-w-none rounded-t-2xl bg-base-300 shadow-lg md:w-auto md:rounded-b-2xl max-h-[85svh] min-w-[20rem] md:min-w-[30rem] ${this.getSize()}`;
    },
    contentClasses() {
      return `modal-content ${this.small ? 'md:max-w-[25rem]' : 'md:max-w-[45rem] lg:max-w-[55rem]'}`;
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', false);
    },
    getSize() {
      return this.small ? 'md:max-w-[25rem]' : 'md:max-w-[45rem] lg:max-w-[55rem]';
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  },
  beforeDestroy() {
    document.body.classList.remove('modal-open');
  }
};
</script>

<style scoped>
.modal-content {
  overflow: auto;
}
</style>

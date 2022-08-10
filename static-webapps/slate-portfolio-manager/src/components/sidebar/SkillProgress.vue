<template>
  <b-progress
    max="1"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '',
    },
  },

  mounted() {
    const bar = this.$el.querySelector('.progress-bar');
    bar.style.backgroundColor = `#${this.color}`;
  },
};
</script>

<style lang="scss" scoped>
  .progress {
    box-shadow: inset 0 2px 2px rgba(black, .1);
  }

  .progress,
  .progress::v-deep .progress-bar {
    border-radius: .25rem;
    position: relative;

    // create an "inset" border
    &::before {
      border: 1px solid rgba(black, .2);
      border-radius: .25rem;
      bottom: 0;
      content: '';
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>

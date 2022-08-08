<template>
  <figure :class="`stat-figure`">
    <figcaption class="stat-figure__label">
      <slot name="label">
        <span class="text-black-50">{{ label }}</span>
      </slot>
    </figcaption>
    <div class="stat-figure__stat">
      <slot><span class="text-black-50">&mdash;</span></slot>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
  .stat-figure {
    line-height: 1.25;
    margin-bottom: 0;

    &__label {
      font-size: .6875em;
      line-height: 1;
      text-transform: uppercase;
    }

    &__stat {
      font-size: 1.125em;
    }
  }
</style>

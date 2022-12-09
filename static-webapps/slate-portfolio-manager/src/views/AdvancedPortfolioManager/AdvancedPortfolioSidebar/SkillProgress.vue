<template>
  <b-progress
    max="1"
    v-bind="$attrs"
  />
</template>

<style lang="scss" scoped>
  .progress {
    box-shadow: inset 0 2px 2px rgba(black, .1);
  }

  .progress::v-deep .progress-bar {
    background-color: var(--cbl-level-color);
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

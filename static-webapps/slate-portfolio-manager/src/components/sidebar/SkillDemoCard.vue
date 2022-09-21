<template>
  <div class="align-items-baseline bg-white d-flex rounded shadow-sm skill-demo">
    <div class="skill-demo__rating py-1 bg-cbl-level">
      {{ demo.DemonstratedLevel }}
    </div>
    <div class="skill-demo__title">
      {{ demo.Context }}
    </div>
    <div class="skill-demo__controls">
      <b-button variant="unstyled">
        <font-awesome-icon
          icon="chevron-circle-up"
          class="text-success"
        />
      </b-button>

      <b-button variant="unstyled">
        <font-awesome-icon
          icon="chevron-circle-down"
          class="text-danger"
        />
      </b-button>

      <div class="skill-demo__grabber" />

      <b-button variant="unstyled">
        <font-awesome-icon
          icon="info-circle"
          class="text-info"
        />
      </b-button>
    </div>
    <div class="skill-demo__date text-black-50 mr-2">
      {{ demo.date }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    demo: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
  .skill-demo {
    gap: .5rem;

    &.-ineffective {
      opacity: 0.5;
      box-shadow: none !important;
    }

    &__rating {
      border-bottom-left-radius: .25rem;
      border-top-left-radius: .25rem;
      color: white;
      text-align: center;
      text-shadow: 0 1px 0 black;
      width: 1.75rem;
    }

    &__title {
      flex: 1 1 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__controls {
      display: none;
      flex: 1 1 0;
      gap: .5rem;
    }

    &__grabber {
      background-color: #eee;
      flex: 1 1 0;
    }

    &__date {
      font-size: .75em;
    }

    &:hover {
      .skill-demo__title {
        display: none;
      }

      .skill-demo__controls {
        display: flex;
      }
    }
  }
</style>

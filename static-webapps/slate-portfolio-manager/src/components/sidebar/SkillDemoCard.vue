<template>
  <div class="align-items-baseline bg-white d-flex rounded shadow-sm skill-demo">
    <div
      ref="rating"
      class="skill-demo__rating py-1"
    >
      {{ rating }}
    </div>
    <div
      ref="title"
      class="skill-demo__title"
    >
      {{ taskTitle }}
    </div>
    <div
      ref="controls"
      class="skill-demo__controls"
    >
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
    <div
      ref="date"
      class="skill-demo__date text-black-50 mr-2"
    >
      {{ shortDate }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: String,
      default: '\u2014', // em dash
    },

    taskTitle: {
      type: String,
      default: '', // em dash
    },

    date: {
      type: String,
      default: null, // em dash
    },

    levelColor: {
      type: String,
      default: '999999',
    },
  },

  computed: {
    shortDate() {
      const date = new Date(this.date);
      if (date) {
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }

      return '\u2014';
    },
  },

  mounted() {
    this.$refs.rating.style.backgroundColor = `#${this.levelColor}`;
  },
};
</script>

<style lang="scss" scoped>
  .skill-demo {
    gap: .5rem;

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

<template>
  <div>
    <router-view />
    <ui-root />
  </div>
</template>

<script>
import UiRoot from '@/components/UiRoot.vue';

export default {
  components: { UiRoot },
};
</script>

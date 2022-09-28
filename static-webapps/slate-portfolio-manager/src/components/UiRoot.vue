<template>
  <div>
    <div v-if="alert">
      <div class="modal-backdrop fade show" />
      <div
        class="modal"
        style="display: block;"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              {{ alert.body }}
            </div>
            <div class="modal-footer">
              <button
                v-for="action, i in alert.actions"
                :key="i"
                type="button"
                :class="action.class || 'btn btn-primary'"
                @click="action.click"
              >
                {{ action.text }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import useUi from '@/store/useUi';

export default {
  computed: {
    ...mapStores(useUi),
    alert() {
      return this.uiStore.$state.alert;
    },
  },
};
</script>

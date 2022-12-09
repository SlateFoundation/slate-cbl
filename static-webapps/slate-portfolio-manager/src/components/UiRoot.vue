<template>
  <div>
    <v-dialog
      v-if="alert"
      v-model="showAlert"
    >
      <div class="d-flex justify-center">
        <v-card width="400">
          <v-card-text>
            {{ alert.body }}
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              v-for="action, i in alert.actions"
              :key="i"
              type="button"
              variant="flat"
              :color="action.color"
              @click="action.click"
            >
              {{ action.text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import useUi from '@/store/useUi';

export default {
  computed: {
    ...mapStores(useUi),
    showAlert: {
      get() {
        return !!this.uiStore.$state.alert;
      },
      set(value) {
        if (!value) {
          this.uiStore.alert(null);
        }
      },
    },
    alert() {
      return this.uiStore.$state.alert;
    },
  },
};
</script>

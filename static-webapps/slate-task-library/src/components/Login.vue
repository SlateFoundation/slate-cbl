<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogVisible"
      persistent
      width="500"
      transition="scale-transition"
    >
      <v-card v-show="isUnauthorized">
        <v-card-item>
          <v-card-title class="text-h6"
            ><v-icon icon="mdi-alert-circle" color="red-darken-4"></v-icon
            ><span class="ml-3">Login Required</span>
          </v-card-title>
          <v-card-text class="mt-3">
            You've either logged out or your session has expired. Please login
            and try again.</v-card-text
          >
        </v-card-item>

        <v-card-actions class="mb-2 mr-3">
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            variant="elevated"
            rounded
            @click="send({ type: 'open.login' })"
          >
            Login
          </v-btn>

          <!-- Cancel form button -->
          <v-btn
            color="primary"
            variant="elevated"
            rounded
            @click="send({ type: 'cancel.dialog' })"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-expand-transition>
        <v-card v-show="isLoggingIn">
          <v-card-item>
            <v-card-title class="text-h6"
              ><v-icon icon="mdi-login"></v-icon><span class="ml-3">Login</span>
            </v-card-title>
            <v-card-text class="mt-4">
              <v-form ref="loginform">
                <v-text-field
                  v-model="fields.Username"
                  label="Username"
                  :rules="usernameRules"
                ></v-text-field>
                <v-text-field
                  v-model="fields.Password"
                  label="Password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card-item>

          <v-card-actions class="mb-2 mr-3">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'open.login' })"
            >
              Login
            </v-btn>

            <!-- Cancel form button -->
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'cancel.dialog' })"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-dialog>
  </v-row>
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
  setup() {
    const { state, send } = useDataTableMachine();

    return {
      state,
      send,
    };
  },
  data() {
    return {
      fields: {
        Username: "",
        Password: "",
      },

      // Validation rules
      usernameRules: [(v) => Boolean(v) || "Username is required"],
      passwordRules: [(v) => Boolean(v) || "Password is required"],

      // dummy model for the dialog - visibility is controlled by v-if on component
      dialogVisible: true,
    };
  },
  computed: {
    isUnauthorized() {
      return this.state.matches("Unauthorized");
    },
    isLoggingIn() {
      return this.state.matches("Login");
    },
  },
};
</script>

<!-- 
  Login
    - A dialog that displays two views:
      * A message informing the user that they are not authenticated.
      * a login form
    - This dialog is diplayed whent the DataTableMachine is in the "Unauthenticated" state
    - The message view is displayed when the LoginFormMachine is in the "Message" state
    - The login form view is displayed when the LoginFormMachine is in the "Ready" state
-->
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogVisible"
      persistent
      width="500"
      transition="scale-transition"
    >
      <!-- Unauthenticated message card -->
      <v-card v-show="isUnauthenticated">
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

          <!-- Switch to Login form button -->
          <v-btn
            color="primary"
            variant="elevated"
            rounded
            @click="send({ type: 'form.open' })"
          >
            Login
          </v-btn>

          <!-- Cancel button -->
          <v-btn
            color="primary"
            variant="elevated"
            rounded
            @click="send({ type: 'form.cancel' })"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Login form card  -->
      <v-expand-transition>
        <v-card v-show="isLoggingIn">
          <v-card-item>
            <v-card-title class="text-h6"
              ><v-icon icon="mdi-login"></v-icon><span class="ml-3">Login</span>
            </v-card-title>
            <v-card-text class="mt-4 mb-0 pb-0">
              <v-form ref="loginform">
                <v-text-field
                  v-model="fields.Username"
                  label="Username *"
                  id="username"
                  :rules="usernameRules"
                ></v-text-field>
                <v-text-field
                  v-model="fields.Password"
                  label="Password"
                  type="password"
                  autocomplete="current-password"
                  id="current-password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-form>
              <small>* You can also log in with your email address.</small>
            </v-card-text>
          </v-card-item>

          <v-card-actions class="mb-2 mr-3">
            <v-spacer></v-spacer>

            <!-- Submit form button -->
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="submitForm"
            >
              Login
            </v-btn>

            <!-- Cancel button -->
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'form.cancel' })"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-dialog>
  </v-row>
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";
import { ref, toRaw } from "vue";

export default {
  setup() {
    const { state, send } = useDataTableMachine(),
      loginform = ref(null);

    return {
      loginform,
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
    isUnauthenticated() {
      return this.loginMachine.state.matches("Message");
    },
    isLoggingIn() {
      return this.loginMachine.state.matches("Ready");
    },
    loginMachine() {
      return this.state.children.loginform;
    },
  },
  methods: {
    submitForm() {
      this.loginform.validate().then((result) => {
        if (result.valid) {
          this.send({
            type: "form.submit",
            fields: toRaw(this.fields),
          });
        }
      });
    },
  },
};
</script>

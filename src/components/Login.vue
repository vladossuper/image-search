<template>
  <StartPage>
    <template #start-page>
      <v-card>
          <v-snackbar color="cyan darken-2" v-model='showMessage' v-if="status && status == 200">
            Welcome!
          </v-snackbar>
          <v-snackbar color="error" v-model='showMessage' v-if="status && status !== 200">
            Wrong email or password! Try again!
          </v-snackbar>
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <h3 class="text-left ml-2"><span class="title white--text">Image Search</span></h3>
          </v-img>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @keyup.native.enter="login"      
            >
              <v-text-field 
                label="Email" 
                name="username" 
                v-model="email"
                autocomplete="" 
                type="text"
                prepend-inner-icon="mdi-account"
                :rules="emailRules"
                required
                validate-on-blur
              ></v-text-field>
              <v-text-field
                id="passwordLogin"
                label="Password"
                name="password"
                type="password"
                prepend-inner-icon="mdi-lock"
                autocomplete="current-password"
                v-model="password"
                :rules="passwordRules"
                required
                validate-on-blur
              ></v-text-field>
            </v-form>
            
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="login" color="primary">
              Login
              <v-icon dark left color="primary">mdi-arrow-right-bold-outline</v-icon>
            </v-btn>
          </v-card-actions>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{name: 'register'}">
            <v-btn text >Register</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </template>
  </StartPage>
</template>

<script>
import axios from 'axios';
import StartPage from '../views/StartPage';
export default {
    components: {
      StartPage
    },
    data: () => ({
        valid: false,
        email: '',
        password: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
            v => !!v || 'Password is required',
        ]
    }),
    computed: {
      status() {
        return this.$store.getters['profile/status'];
      },
      showMessage() {
        return this.$store.getters['profile/show'];
      }
    },
    methods: {
      login() {
        this.$store.dispatch('profile/login', { email: this.email, password: this.password });
      }
    }
}
</script>
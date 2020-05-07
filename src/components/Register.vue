<template>
  <StartPage>
    <template #start-page>
      <v-card>
        <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        ></v-img>
        <v-card-title>Register</v-card-title>
        <v-card-text>
        <v-list style="max-height: 500px" class="overflow-y-auto">            
          <v-form 
            lazy-validation
            ref="form" 
            v-model="valid"
            @keyup.native.enter="register"
          >
            <v-text-field
                  v-model="name" 
                  label="Name" 
                  :rules="nameRules"
                  type="text"
                  validate-on-blur
            ></v-text-field>
            <v-text-field
                v-model="surname" 
                label="Surname" 
                :rules="surnameRules"
                type="text"
                validate-on-blur>
            </v-text-field>
            <v-text-field
                  v-model="email" 
                  label="Email" 
                  name="email"
                  :rules="emailRules"
                  type="text"
                  validate-on-blur
              ></v-text-field>
              <v-text-field
                  v-model="password" 
                  label="Password" 
                  :rules="passwordRules"
                  type="password"
                  validate-on-blur
                ></v-text-field>
                </v-form>
            </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="register">
            Register
            <v-icon color="primary" left>mdi-arrow-right-bold-outline</v-icon>
          </v-btn>
        </v-card-actions>    
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <router-link :to="{name: 'login'}">
            <v-btn text >Login</v-btn>
          </router-link>
        </v-card-actions>
        <v-snackbar v-model="showMessage" color="cyan darken-2" v-if="status && status == 200">
            Nice! You are register!
        </v-snackbar>
        <v-snackbar v-model="showMessage" color="error" v-if="status && status !== 200">
            Oops! Check your data, please! This account was register!
        </v-snackbar>
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
        name: '',
        surname: '',
        password: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        surnameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
            v => !!v || 'Password is required',
        ]
    }),
    computed:{
      status() {
        return this.$store.getters['profile/status'];
      },
      showMessage() {
        return this.$store.getters['profile/show'];
      }
    },
    methods: {
      register() { 
        this.$store.dispatch('profile/register', { name: this.name, surname: this.surname, email: this.email, password: this.password });
      }
    }
}
</script>
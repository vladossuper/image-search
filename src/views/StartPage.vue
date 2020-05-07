
<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
              <transition name="fade">
                  <slot name="start-page"></slot>
              </transition>
              </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
  .v-content {
    background: url('https://i.pinimg.com/originals/1e/4d/75/1e4d7595512c0b55f3b006bde2da5859.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
      opacity: 0
  }
</style>
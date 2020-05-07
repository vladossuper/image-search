<template>
    <v-container fluid>
        <v-row>
            <v-col lg="2">
                <p class="white--text font-weight-bold">Image Search</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col lg="1">
                <router-link to="/home">
                    <v-btn text  color="white"> 
                        Home
                    </v-btn>
                </router-link>
            </v-col>
            <v-col lg="1">
                <router-link to="/selected">
                    <v-btn text  color="white"> 
                        Selected
                    </v-btn>
                </router-link>
            </v-col>
            <v-col lg="1">
                <router-link to="/history">
                    <v-btn text  color="white"> 
                        History
                    </v-btn>
                </router-link>
            </v-col>
            <v-spacer></v-spacer>
            <v-col lg="1">
                <v-btn text @click="logout" color="white"> 
                    Logout
                    <v-icon rigth>mdi-logout</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$store.dispatch('profile/logout');
        },
    }
}
</script>
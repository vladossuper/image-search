<template>
    <v-app>
        <v-app-bar app color="primary">
            <Header />
        </v-app-bar>

        <v-content class="pt-2">
            <v-container>
                <slot name="content"></slot>
            </v-container>
        </v-content>
        <v-footer app>
        </v-footer>
    </v-app>
</template>

<script>
import Header from '../components/Header';
import axios from 'axios';
export default {
    components: {
        Header
    },
    mounted() {
        axios({ url: 'http://localhost:5000/user', headers: { token: localStorage.getItem('token') } })
        .then(res => {
            const { id } = res.data.user;
            this.$store.commit('profile/SET_ID', id)
            console.log(res);
        });
        this.$store.dispatch('images/filters');
    }
}
</script>
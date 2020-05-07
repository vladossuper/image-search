<template>
    <Main>
        <template #content>
            <SelectedImages />
            <v-snackbar color="error" v-model="show" v-if="error">Folder with this name already exist!</v-snackbar>
        </template>
    </Main>
</template>

<script>
import Main from '../views/Main';
import SelectedImages from './SelectedImages';
export default {
    components: {
        Main,
        SelectedImages
    },
    computed: {
        error() {
            return this.$store.getters['images/error'];
        },
        show: {
            get() {
                return this.$store.getters['images/showSnackbar'];
            },
            set(value) {    
                this.$store.commit('images/SET_SHOW_SNACKBAR', value);
            }
        }
    }
}
</script>
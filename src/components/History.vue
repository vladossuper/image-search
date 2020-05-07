<template>
    <Main>
        <template #content>
            <v-card flat v-for="(history, key) in histories" :key="key">
                <div v-if="history.length > 0">
                   <v-card-title>HISTORY</v-card-title>
                    <v-card outlined class="d-flex">
                         <v-img
                            v-for="(item, key) in history"
                            :key="`item-${ key }`"
                            :src="item.url"
                            :lazy-src="item.url"
                            max-height="570" 
                            max-width="570" 
                        >
                            <template v-slot:placeholder>
                                <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-card>
                </div>
                <div v-else>
                    <v-card outlined flat height="200">
                        <p class="text-center">This history is empty(</p>
                    </v-card>
                </div>
            </v-card>
        </template>
    </Main>
</template>

<script>
import Main from '../views/Main';
export default {
    components: {
        Main
    },
    computed: {
        histories() {
            return this.$store.getters['images/history'];
        }
    },
    mounted() {
        this.$store.dispatch('images/histories');
    }
}
</script>
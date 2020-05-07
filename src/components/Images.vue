<template>
    <v-container>
        <div class="d-flex">
            <v-btn text color="primary" @click="setAll">Select All</v-btn>
            <v-btn text color="primary" @click="unselectAll">Unselect All</v-btn>
        </div>
        <v-row>
            <v-col v-for="(image, key) in images" :key="key" lg="4">
                <v-card @click="selectImage(image)" flat outlined hover :class="image.selected ? 'selected' : ''">
                    <v-img
                        :class="image.selected ? 'selected' : ''" 
                        max-height="570" 
                        max-width="570" 
                        :src="image.url" 
                        lazy-src="https://photogora.ru/img/product/big/6194/14811227410.jpg" 
                        aspect-ratio="1"
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        images: Array
    },
    methods: {
        setAll() {
            this.$store.commit('images/SET_ALL');
        },
        unselectAll() {
            this.$store.commit('images/UNSELECT_ALL');
        },
        selectImage(image) {
            this.$store.commit('images/SELECT_IMAGE', image);
        }
    }
}
</script>

<style src="./style.css" scoped></style>
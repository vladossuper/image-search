<template>
    <v-container>
        <div class="d-flex">
            <Download v-if="downloading.length > 0" />
        </div>
        <v-row>
            <v-col lg="3" v-for="(download, key) in downloading" :key="key" @click="openModal(download)">
                <v-card flat outlined hover>
                   <v-img
                        max-height="570" 
                        max-width="570" 
                        :src="download.url" 
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
        <ImageModal :showModal.sync="showModal" :url="image ? image.url : null" :name="image ? image.snippet : ''" />
    </v-container>
</template>

<script>
import Download from './Download';
import ImageModal from './ImageModal';
export default {
    components: {
        Download,
        ImageModal
    },
    data: () => ({
        image: null,
        showModal: false
    }),
    computed: {
        downloading() {
            return this.$store.getters['images/download'];
        },
    },
    methods: {
        openModal(image) {
            this.showModal = true;
            this.image = image
        }
    }
}
</script>
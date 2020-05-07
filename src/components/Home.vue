<template>
    <Main>
        <template #content>
            <v-form 
                lazy-validation
                ref="form" 
                v-model="valid"
            >
                <v-text-field :rules="searchRules" v-model="search" label="Search image" filled solo-inverted flat rounded>
                    <template slot="append">
                        <v-icon @click="imagesearch">mdi-magnify</v-icon>
                    </template>
                </v-text-field>
            </v-form>
            <v-container v-if="search" fluid class="pt-0 pb-0">
                <v-row class="pt-0 pb-0">
                    <v-col lg="3" class="pt-0 pb-0">
                        <v-select
                            :clearable="true"
                            class="pt-0 pb-0" 
                            :items="sizes"
                            label="Sizes"
                            item-text="title"
                            v-model="size"
                            
                        ></v-select>
                    </v-col>
                    <v-col lg="3" class="pt-0 pb-0">
                        <v-select
                            class="pt-0 pb-0"
                            :clearable="true"
                            :items="colorType"
                            label="Color types"
                            item-text="title"
                            v-model="colorTypes"
                        ></v-select>
                    </v-col>
                    <v-col lg="3" class="pt-0 pb-0">
                        <v-select
                            class="pt-0 pb-0"
                            :clearable="true"
                            :items="type"
                            label="Image types"
                            item-text="title"
                            v-model="types"
                        ></v-select>
                    </v-col>
                    <v-col lg="3" class="pt-0 pb-0">
                        <v-select
                            class="pt-0 pb-0"
                            :clearable="true"
                            :items="dominantColor"
                            label="Dominant colors"
                            item-text="title"
                            v-model="dominantColors"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-container>

            <Images v-if="images" :images="images" />
            <Pagination v-if="images" :total="total" :search="search" />
        </template>
    </Main>
</template>

<script>
import Main from '../views/Main';
import axios from 'axios';
import { FETCH } from '../store/action-types';
import { SET_IMAGES } from '../store/mutation-types';
import Images from './Images';
import Pagination from './Pagination';
export default {
    data: () => ({
        valid: false,
        searchRules: [
            v => !!v || 'Search field is empty!'
        ],
        url: 'http://localhost:5000',
    }),
    components: {
        Main,
        Images,
        Pagination
    },
    computed: {
        total() {
            return this.$store.getters['images/total'];
        },
        images() {
            return this.$store.getters['images/images'];
        },
        sizes() {
            return this.$store.getters['images/sizes']
        },
        colorType() {
            return this.$store.getters['images/colorType']
        },
        dominantColor() {
            return this.$store.getters['images/dominantColor'];
        },
        type() {
            return this.$store.getters['images/type']
        },
        size: {
            get() {
                return this.$store.getters['images/pageFilter']('sizes');
            },
            set(item) {
                this.setSize(item);
            }
        },
        colorTypes: {
            get() {
                return this.$store.getters['images/pageFilter']('colorTypes');
            },
            set(item) {
                this.setColorType(item);
            }
        },
        types: {
            get() {
                return this.$store.getters['images/pageFilter']('types');
            },
            set(item) {
                this.setType(item);
            }
        },
        dominantColors: {
            get() {
                return this.$store.getters['images/pageFilter']('dominantColor');
            },
            set(item) {
                this.setDominantColor(item);
            }
        },
        search: {
            get() {
                return this.$store.getters['images/search'];
            },
            set(search) {
                this.$store.commit('images/SET_SEARCH', search)
            }
        }
    },
    methods: {
        imagesearch() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch(`images/${ FETCH }`);
            }
        },
        refresh() {
            if (this.search) {
                this.$store.commit(`images/${ SET_IMAGES }`, null)
                this.$store.dispatch(`images/${ FETCH }`, { search: this.search });
            }
        },
        setSize(value) {
            this.$store.commit('images/SET_PAGE_FILTER', { sizes: value });
            this.refresh();
        },
        setColorType(value) {
            this.$store.commit('images/SET_PAGE_FILTER', { colorType: value });
            this.refresh();
        },
        setDominantColor(value) {
            this.$store.commit('images/SET_PAGE_FILTER', { dominantColor: value });
            this.refresh();
        },
        setType(value) {
            this.$store.commit('images/SET_PAGE_FILTER', { type: value });
            this.refresh();
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login');
        }
    }
}
</script>
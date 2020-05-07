<template>
    <v-pagination
        v-model="page"
        class="my-4"
        :total-visible="20"
        :length="length"
    ></v-pagination>
</template>

<script>
import { SET_PAGE, SET_IMAGES } from '../store/mutation-types';
import { FETCH } from '../store/action-types';
export default {
    props: {
        search: String
    },
    methods: {
        refresh() {
            this.$store.commit(`images/${ SET_IMAGES }`, null);
            this.$store.dispatch(`images/${ FETCH }`, { search: this.search });
        }
    },
    computed: {
        total() {
           return this.$store.getters['images/total'];         
        },
        length() {
            let total = this.total.toString();
            // console.log(typeof(total));
            if (total.length > 6) {
                total = total.substr(0, 4);
            }
            console.log(total);
            return Math.ceil(+total / 9);
        },
        page: {
            get() {
                return this.$store.getters['images/page'];
            },
            set(page) {
                this.$store.commit(`images/${ SET_PAGE }`, page);
                this.refresh();
            }
        }
    }
}
</script>
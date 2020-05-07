<template>
    <v-dialog v-model="show" :width="+width" scrollable >
        <v-card :height="+height">
            <slot name="header"></slot>
            <v-card-text flat>
                <slot name="main-content"></slot>
            </v-card-text>
            <slot name="card-action"></slot>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        width: String,
        height: String,
    },
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    }
}
</script>
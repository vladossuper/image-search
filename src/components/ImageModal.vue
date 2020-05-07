<template>
    <ModalWindow v-model="show">
        <template #header>
            <v-toolbar color="primary" dark flat max-height="65">
                <v-card-title>Image Crop</v-card-title>
                <v-spacer></v-spacer>
                <v-btn text @click="$emit('update:showModal', value)">
                    <v-icon >mdi-close</v-icon>
                </v-btn>
                
            </v-toolbar>
        </template>
        <template #main-content>
            <Cropper ref="cropper" :canvas="false" class="upload-example-cropper" :src="url" @change="change" />
            <v-btn text color="primary" v-if="coordinates" @click="showName = true">
                Download file with coordinate
            </v-btn>
            <ModalWindow v-model="showName" width="500" height="250">
                <template #header>
                    <v-toolbar color="primary" dark flat max-height="65">
                            <v-card-title>File name</v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn text @click="showName = false">
                                <v-icon >mdi-close</v-icon>
                            </v-btn>
                         </v-toolbar>
                    </template>
                    <template #main-content>
                        <v-form lazy-validation ref="form" v-model="valid">
                            <v-text-field
                                label="Write filename"
                                v-model="filename"
                                :rules="[ v => !!v || 'Field is required!' ]"
                            ></v-text-field>
                        </v-form>
                    </template>
                    <template #card-action>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="success" @click="downloadFile">Save</v-btn>
                        </v-card-actions>
                    </template>
                   
            </ModalWindow>
        </template>
    </ModalWindow>
</template>

<script>
import ModalWindow from '../views/ModalWindow';
import { Cropper } from "vue-advanced-cropper";
export default {
    components: {
        ModalWindow,
        Cropper
    },
    props: {
        showModal: Boolean,
        url: String,
        name:String
    },
    data: () => ({
        coordinates: null,
        image: null,
        showName: false,
        filename: null,
        valid: false
    }),
    computed: {
        show: {
            get() {
                return this.showModal;
            },
            set(value) {
                this.$emit('update:showModal', value)
            }
        }
    },
    methods: {
        change({ coordinates}) {
            this.coordinates = coordinates;
        },
        downloadFile() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('images/downloadFile', { coordinates: this.coordinates, name: this.filename });
                this.showName = false;
            }
            
        }
    }
}
</script>
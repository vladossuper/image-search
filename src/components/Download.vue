<template>
    <div>
        <v-btn text color="primary" @click="createFolder">Download</v-btn>
        <ModalWindow v-model="show" height="220" width="500">
            <template #header>
                <v-toolbar color="primary" dark flat max-height="65">
                    <v-card-title>Folder Name</v-card-title>
                </v-toolbar>
            </template>
            <template #main-content>
                <v-form lazy-validation ref="form" v-model="valid">
                    <v-text-field
                        :rules="downloadRules"
                        label="Write folder name"
                        v-model="folder"
                    ></v-text-field>
                </v-form>
            </template>
            <template #card-action>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" depressed @click="show = false">Close</v-btn>
                    <v-btn color="success" depressed @click="download">
                        Save
                        <v-progress-circular
                            v-if="showSpinner &&downloadArchiveStatus !== 200"
                            size="10"
                            indeterminate
                            color="primary"
                        ></v-progress-circular>
                    </v-btn>
                </v-card-actions>
            </template>
        </ModalWindow>
    </div>
</template>

<script>
import ModalWindow from '../views/ModalWindow';
export default {
    components: {
        ModalWindow
    },
    data: () => ({
        folder: null,
        show: false,
        valid: false,
        showSpinner: false,
        downloadRules: [
            v => !!v || 'Folder name is require!' 
        ]
    }),
    computed: {
        downloadArchiveStatus() {
            const status = this.$store.getters['images/downloadArchiveStatus'];
            if (status === 200) {
                this.show = false;
                this.showSpinner = false;
                this.folder = null;
            }
            return status
        }
    },
    methods: {
        createFolder() {
            this.show = true;
            this.$store.commit('images/SET_DOWNLOAD_ARCHIVE_STATUS', null);
        },
        download() {
            if (this.$refs.form.validate()) {
                this.showSpinner = true;
                this.$store.dispatch('images/download', { folder: this.folder })
            }
        }
    }
}
</script>
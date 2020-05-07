import axios from 'axios';
import { FETCH } from '../action-types';
import { SET_IMAGES, SET_TOTAL, SET_PAGE } from '../mutation-types';

const URL = 'http://localhost:5000';

export default {
    namespaced: true,
    state: {
        images: null,
        total: null,
        page: 1,
        search: null,
        filters: {
            sizes: null,
            colorTypes: null,
            dominantColor: null,
            type: null
        },
        pageFilters: {
            sizes: null,
            colorTypes: null,
            dominantColor: null,
            type: null
        },
        downloading: [],
        error: false,
        showSnackbar: false,
        history: null,
        downloadArchiveStatus: null
    },
    getters: {
        images: state => state.images,
        total: state => state.total,
        page: state => state.page,
        sizes: state => state.filters.sizes,
        colorType: state => state.filters.colorTypes,
        dominantColor: state => state.filters.dominantColor,
        type: state => state.filters.type,
        pageFilter: state => name => state.pageFilters[name],
        download: state => state.downloading,
        search: state => state.search,
        error: state => state.error,
        showSnackbar: state => state.showSnackbar,
        history: state => state.history,
        downloadArchiveStatus: state => state.downloadArchiveStatus
    },
    mutations: {
        [SET_IMAGES](state, images) {
            if (state.downloading && images) { 
                state.downloading.map(download => {
                    const includes = images.find(item => item.url === download.url);
                    if (includes) {
                        includes.selected = true;
                    }
                })
            }
            state.images = images;
        },
        [SET_TOTAL](state, total) {
            state.total = total;
        },
        [SET_PAGE](state, page) {
            state.page = page;
        },
        'SET_SEARCH'(state, search) {
            state.search = search;
        },
        'SET_SIZES'(state, sizes) {
            state.filters.sizes = sizes;
        },
        'SET_TYPE'(state, type) {
            state.filters.type = type;
        },
        'SET_COLOR_TYPE'(state, colorTypes) {
            state.filters.colorTypes = colorTypes;
        },
        'SET_DOMINANT_COLOR'(state, dominantColor) {
            state.filters.dominantColor = dominantColor;
        },
        'SET_PAGE_FILTER'(state, filter) {
            Object.keys(filter).map(filterName => {
                state.pageFilters[filterName] = filter[filterName];
            })
        },
        'SET_ALL'(state) {
            state.images.map(image => {
                image.selected = true;
                state.downloading.push(image);
            })
        },
        'UNSELECT_ALL'(state) {
            state.images.map(image => {
                image.selected = false;
                state.downloading.splice(0, state.downloading.length-1);
            })
        },
        'SELECT_IMAGE'(state, image) {
            const downloadingImage = state.downloading.find(item => item.url == image.url);
            if (downloadingImage) {
                const index = state.downloading.indexOf(downloadingImage);
                if (downloadingImage.selected) {
                    state.downloading.splice(index, 1);
                }
            } else {
                state.downloading.push(image);
            }

            const selectedImage = state.images.find(item => item.url == image.url);
            if (selectedImage.selected) {
                selectedImage.selected = false;
            } else {
                selectedImage.selected = true;
            }
        },
        'SET_ERROR'(state, error) {
            state.error = error;
        },
        'SET_SHOW_SNACKBAR'(state, show) {
            state.showSnackbar = show;
        },
        'SET_HISTORY'(state, history) {
            state.history = history;
        },
        'SET_DOWNLOAD_ARCHIVE_STATUS'(state, status) {
            state.downloadArchiveStatus = status;
        }
    },
    actions: {
        async [FETCH]({ commit, state }) {
            try {
                const response = await axios({ url: `${ URL }/imagesearch`, data: { search: state.search, num: 9, page: state.page, size: state.pageFilters.sizes, colorType: state.pageFilters.colorType, type: state.pageFilters.type, dominantColor: state.pageFilters.dominantColor }, method: 'POST' });
                const { items, total } = response.data;
                items.map(item => item.selected = false);
                commit(SET_IMAGES, items);
                commit(SET_TOTAL, total);
            } catch(err) {
                console.error(err);
            }
        },
        async filters({ commit }) {
            try {
                const response = await axios({ url: `${ URL }/filters`, method: 'POST' });
                const { imgColorTypes, imgDominantColor, imgSizes, imgType } = response.data;
                commit('SET_SIZES', imgSizes);
                commit('SET_TYPE', imgType);
                commit('SET_COLOR_TYPE', imgColorTypes);
                commit('SET_DOMINANT_COLOR', imgDominantColor);
            } catch(err) {
                console.error(err);
            }
        },
        async download({ commit, state, dispatch }, { folder }) {
            try {
                const response = await axios({ url: `${ URL }/download`, data: { folder, downloadImages: state.downloading }, method: 'POST' });
                if (response.status === 200) {
                    dispatch('sethistory');
                    console.log(folder);
                    axios({ url: `${ URL }/downloadarchive`, data: { folder },  method: 'POST', responseType: 'blob' })
                    .then(response => {
                        commit('SET_DOWNLOAD_ARCHIVE_STATUS', response.status);
                         const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                         const fileLink = document.createElement('a');
                         fileLink.href = fileURL;
                         fileLink.setAttribute('download', `${ folder }.zip`);
                         document.body.appendChild(fileLink);
                         fileLink.click();
                    });

                }
            } catch(err) {
                commit('SET_ERROR', true);
                commit('SET_SHOW_SNACKBAR', true);
                console.error(err);
            }
            
        },
        async sethistory({ rootGetters, state }) {
            await axios({ url: `${ URL }/sethistory`, data: { id: rootGetters['profile/id'], history: state.downloading }, method: 'POST' });
        },
        async histories({ rootGetters, commit }) {
            try {
                const response = await axios({ url: `${ URL }/histories`, data: { id: rootGetters['profile/id'] }, method: 'POST' });
                const { history } = response.data;
                commit('SET_HISTORY', history);
            } catch(err) {
                console.log(err);
            }  
        },
        async downloadFile({}, { coordinates, name }) {
            try {
                const response = await axios({ url: `${ URL }/setfiledata`, data: { coordinates, name }, method: 'POST' });
                if (response.status === 200) {
                    axios({ url: `${ URL }/downloadfile`, data: { name },  method: 'POST', responseType: 'blob' })
                    .then(response => {
                         const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                         const fileLink = document.createElement('a');
                         fileLink.href = fileURL;
                         fileLink.setAttribute('download', `${ name }.txt`);
                         document.body.appendChild(fileLink);
                         fileLink.click();
                    });
                }
            } catch(err) {
                console.error(err);
            }
        }
    }
}
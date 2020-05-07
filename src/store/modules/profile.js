import axios from 'axios';
import router from '../../router';

export default {
    namespaced: true,
    state: {
        status: null,
        showMessage: false,
        id: null
    },
    getters: {
        status: state => state.status,
        show: state => state.showMessage,
        id: state => state.id
    },
    mutations: {
        'SET_STATUS'(state, status) {
            state.status = status;
        },
        'SET_SHOW_MESSAGE'(state, show) {
            state.showMessage = show;
        },
        'SET_ID'(state, id) {
            state.id = id;
        }
    },
    actions: {
        async login({ commit }, { email, password }) {
            try {
                const response = await axios({ url: 'http://localhost:5000/login', data: { email, password }, method: 'POST' });
                const { token } = response.data;
                const { status } = response;
                localStorage.setItem('token', token);
                commit('SET_STATUS', status);
                if (status === 200) {
                    commit('SET_SHOW_MESSAGE', true);
                    setTimeout(() => {
                        commit('SET_SHOW_MESSAGE', false);
                        commit('SET_STATUS', null);
                        router.push({ path: '/home' });
                    }, 3000)
                }
            } catch(err) {
                commit('SET_STATUS', err.response.status);
                commit('SET_SHOW_MESSAGE', true);
                setTimeout(() => {
                    commit('SET_SHOW_MESSAGE', false);
                    commit('SET_STATUS', null);
                }, 3000)
                console.error(err);
            }
        },
        async register({ commit }, { name, surname, email, password }) {
            try {
                const response = await axios({ url: 'http://localhost:5000/register', method: 'POST', data: { name, surname, email, password } });
                const { status } = response;
                commit('SET_STATUS', status);
                if (status === 200) {
                    commit('SET_SHOW_MESSAGE', true);
                    setTimeout(() => {
                        commit('SET_SHOW_MESSAGE', false);
                        commit('SET_STATUS', null);
                        router.push({ path: '/login' });
                    }, 3000)
                }
            } catch(err) {
                commit('SET_STATUS', err.response.status);
                commit('SET_SHOW_MESSAGE', true);
                setTimeout(() => {
                    commit('SET_SHOW_MESSAGE', false);
                    commit('SET_STATUS', null);
                }, 3000)
                console.error(err);
            }
        },
        logout() {
            localStorage.clear();
            router.push({ path: '/login' });
        }
    }
}
import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },

  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups.push(payload);
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    }
  },

  actions: {
    loadMeetups({ commit }) {
      commit('setLoading', true);

      // Get data from firestore
      firebase
        .firestore()
        .collection('meetups')
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let meetups = doc.data();
            meetups.creatorId = doc.creatorId;
            commit('setLoadedMeetups', meetups);
            commit('setLoading', false);
          });
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    createMeetup({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      };

      // save to firestore
      firebase
        .firestore()
        .collection('meetups')
        .add(meetup)
        .then(data => {
          const key = data.key;
          commit('createMeetup', {
            ...meetup,
            id: key
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    signUserUp({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false);
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          };
          commit('setUser', newUser);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },

    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false);
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          };
          commit('setUser', newUser);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },

    autoSignIn({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [] });
    },

    logout({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
    },

    clearError({ commit }) {
      commit('clearError');
    }
  },

  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups;
    },
    featuredMeetups(state) {
      return state.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupTitle => {
        return state.loadedMeetups.find(meetup => {
          return meetup.title === meetupTitle;
        });
      };
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
});

<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" absolute temporary>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="userIsAuthenticated" @click="onLogout">
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card color="grey lighten-4" flat height="auto" tile>
      <v-toolbar dense>
        <v-app-bar-nav-icon
          @click.stop="sideNav = !sideNav"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor: pointer"
            >DevMeetup</router-link
          >
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            text
            v-for="item in menuItems"
            :key="item.title"
            :to="item.link"
            style="margin-left: 30px"
            >{{ item.title }}</v-btn
          >

          <v-btn text v-if="userIsAuthenticated" flat @click="onLogout">
            Logout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sideNav: null
    };
  },

  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'face', title: 'Sign up', link: '/signup' },
        { icon: 'lock_open', title: 'Sign in', link: '/signin' }
      ];
      if (this.userIsAuthenticated) {
        menuItems = [
          {
            icon: 'supervisor_account',
            title: 'View Meetups',
            link: '/meetups'
          },
          { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
          { icon: 'person', title: 'Profile', link: '/profile' }
        ];
      }
      return menuItems;
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },

  methods: {
    onLogout() {
      this.$store.dispatch('logout');
    }
  }
};
</script>

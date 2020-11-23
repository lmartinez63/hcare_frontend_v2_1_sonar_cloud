<template>
  <v-card>
    <v-content>
      <v-alert
        :value="alertVar.display"
        :type="alertVar.type"
        transition="scale-transition"
        dismissible
      >
        {{ alertVar.message }}
      </v-alert>
      <div id="core-view">
        <v-fade-transition mode="out-in">
          <!-- To reload same component
          <router-view />
          -->
          <router-view :key="$route.path" />
        </v-fade-transition>
      </div>
      <core-footer v-if="$route.name !== 'Maps'" />
    </v-content>
    <!-- Not neccesary at moment
    <v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          fab
          dark
        >
          <v-icon>mdi-dots-vertical</v-icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="green"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="red"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  -->
  </v-card>
</template>

<script>
export default {
  data: () => ({
    /*  Not neccesary at moment
    direction: 'top',

    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'slide-y-reverse-transition'
*/
  }),
  metaInfo () {
    return {
      title: 'HCARE Medical Software'
    }
  },
  computed: {
    alertVar () {
      return this.$store.state.alert
    },
    user () {
      return this.$store.state.authentication.user
    }
  },
  mounted () {
    console.log('View - Create - begin')
    console.log('View - Create - end')
  },
  methods: {
    getLabelValue: function (label) {
      var lValue = ''
      if (label) {
        var language = this.$store.state.authentication.user.userProfile.language
        switch (language) {
          case 'ES_ES':
            lValue = label.labelValueEsEs
            break
          default:
            break
        }
      }
      return lValue
    },
    computedDateFormattedMomentjs (date) {
      // TODO this property should come from a userProfile locale
      this.$moment.locale('es')
      return date ? this.$moment(date).format('LLLL') : ''
    }
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>

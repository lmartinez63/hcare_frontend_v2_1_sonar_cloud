<template>
  <v-app>
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="fullPage"
    />

    <core-filter v-if="user" />

    <core-toolbar v-if="user" />

    <core-drawer v-if="user" />
    <core-view />
    <v-dialog
      v-model="appErrorDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Error detectado
        </v-card-title>

        <v-card-text>
          Hubo un error en la applicacion por favor contacte al administrador
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="backPage()"
          >
            Regresar a la Pagina anterior
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style lang="scss">
@import '@/styles/index.scss';
@import '@/styles/hcare.scss';
@import '~vue-loading-overlay/dist/vue-loading.css';
/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
<script>
import Loading from 'vue-loading-overlay'
// Import stylesheet
// import '~vue-loading-overlay/dist/vue-loading.css'
// import 'vue-flash-message/dist/vue-flash-message.min.css'
// import 'vuetify/dist/vuetify.min.css'

export default {
  components: {
    Loading
  },
  data () {
    return {
      fullPage: true
    }
  },
  computed: {
    appErrorDialog () {
      return this.$store.state.alert.type === 'error'
    },
    user () {
      return this.$store.state.authentication.user
    },
    properties () {
      return this.$store.state.general.properties
    },
    isLoading () {
      return this.$store.state.general.loading
    }
    /* show() {
      return this.$store.state.authentication.loading;
    }, */
  },
  watch: {
    $route (to, from) {
      // clear alert on location change
      this.$store.dispatch('alert/clear')
    },
    isLoading (val) {
      console.log('Loading changed ' + val)
    }
  },
  created () {
    console.log('App - Create - begin')

    if (this.user) {
      this.$store.dispatch('general/loadProperties')
      this.$store.dispatch('general/getLabels')
      this.$store.dispatch('general/getMedicalAreas')
      this.$store.dispatch('general/getCIE10Codes')
      this.$store.dispatch('general/getMedicaments')
      this.$store.dispatch('general/getExamBundleList')
      this.$store.dispatch('general/getAuxiliarExams')
      this.$store.dispatch('general/getAllergies')
      this.$store.dispatch('general/getSurgeryTypes')
      this.$store.dispatch('general/getDoctors')
      this.$store.dispatch('general/getNurses')
      this.$store.dispatch('general/getRoles')
      this.$store.dispatch('general/getPages')
      this.$store.dispatch('general/getSections')
      this.$store.dispatch('general/getFieldDefinitions')
      this.$store.dispatch('general/getLabels')
    }
    console.log('App - Create - end')
  },
  methods: {
    computedDateFormattedMomentjs (date) {
      // TODO this property should come from a userProfile locale
      this.$moment.locale('es')
      return date ? this.$moment(date).format('LL') : ''
    },
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
    backPage: function () {
      this.$router.go(-1)
    },
    logout: function () {
      this.submitted = true
      const { dispatch } = this.$store
      dispatch('authentication/logout')
    },
    downloadAttachment: function (attachment) {
      const dataContent = {
        'attachment': attachment
      }
      const {
        dispatch
      } = this.$store
      dispatch('general/downloadAttachment', {
        vm: this,
        dataContent: dataContent
        // returnRoute: returnRoute,
      })
    },
    onCancel () {
      console.log('User cancelled the loader.')
    }
  }
}
</script>

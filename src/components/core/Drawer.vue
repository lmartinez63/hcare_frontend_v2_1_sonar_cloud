<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="image"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >
            <v-img
              :src="logo"
              height="34"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            HCARE
          </v-list-tile-title>
        </v-list-tile>
        <v-divider />
        <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="purple"
          />
        </v-list-tile>
        <template
          v-for="(link) in links"
        >
          <v-list-tile
            v-if="!link.links"
            :to="link.to"
            :active-class="color"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title
              v-text="link.text"
            />
          </v-list-tile>
          <v-list-group
            v-else
            value="false"
            :prepend-icon="link.icon"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title
                  v-text="link.text"
                />
              </v-list-tile>
            </template>
            <v-list-tile
              v-for="(subLink, si) in link.links"
              :key="si"
              :to="subLink.to"
              :active-class="color"
              avatar
              class="v-list-item"
            >
              <v-list-tile-action>
                <v-icon>{{ subLink.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title
                v-text="subLink.text"
              />
            </v-list-tile>
          </v-list-group>
        </template>

        <!--
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
      -->
        <!--
        <v-list-tile
          disabled
          active-class="primary"
          class="v-list-item v-list__tile--buy"
          to="/upgrade"
        >
          <v-list-tile-action>
            <v-icon>mdi-package-up</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="font-weight-light">
            Upgrade To PRO
          </v-list-tile-title>
        </v-list-tile>
        -->
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    logo: 'static/img/vuetifylogo.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      /*
      {
        to: '/user-profile',
        icon: 'mdi-account',
        text: 'Informacion del Usuario'
      },
            {
        to: '/table-list',
        icon: 'mdi-clipboard-outline',
        text: 'Table List'
      },
*/
      {
        icon: 'mdi-clipboard-outline',
        text: 'Usuarios',
        links: [
          {
            to: '/browse/allUserProfiles',
            icon: 'mdi-clipboard-outline',
            text: 'Listado de Usuarios'
          }
        ]
      },
      {
        icon: 'mdi-clipboard-outline',
        text: 'Pacientes',
        links: [
          {
            to: '/browse/allPatients',
            icon: 'mdi-clipboard-outline',
            text: 'Listado de Pacientes'
          }
        ]
      },
      {
        icon: 'mdi-clipboard-outline',
        text: 'Citas Medicas',
        links: [
          {
            to: '/browse/medicalAppointmentsToday',
            icon: 'mdi-clipboard-outline',
            text: 'Listado de  Citas de Hoy'
          },
          {
            to: '/browse/allMedAppHeaderView',
            icon: 'mdi-clipboard-outline',
            text: 'Lista de Citas Medicas'
          }
        ]
      },
      {
        icon: 'mdi-clipboard-outline',
        text: 'Operaciones',
        links: [
          {
            to: '/browse/medicalSurgeriesToConfirm',
            icon: 'mdi-clipboard-outline',
            text: 'Pendiente de Confirmacion'
          },
          {
            to: '/browse/medicalSurgeriesScheduled',
            icon: 'mdi-clipboard-outline',
            text: 'Programadas'
          },
          {
            to: '/browse/medicalSurgeriesInProgress',
            icon: 'mdi-clipboard-outline',
            text: 'En Progreso'
          },
          {
            to: '/browse/allMedicalSurgeries',
            icon: 'mdi-clipboard-outline',
            text: 'Todas las Operaciones'
          }
        ]
      },
      {
        icon: 'mdi-clipboard-outline',
        text: 'Gestion del Sistema',
        links: [
          {
            to: '/browse/allPages',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Paginas'
          },
          {
            to: '/browse/allRolePageSectionFieldPage',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Roles'
          },
          {
            to: '/browse/allProperties',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Propiedades'
          },
          {
            to: '/browse/allLabels',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Etiquetas'
          },
          {
            to: '/browse/allDataTables',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Tablas de Datos'
          },
          {
            to: '/browse/allSurgeryAreas',
            icon: 'mdi-clipboard-outline',
            text: 'Administracion de Areas de Cirugia'
          }
        ]
      }

      /*
            {
        to: '/typography',
        icon: 'mdi-format-font',
        text: 'Typography'
      },
      {
        to: '/icons',
        icon: 'mdi-chart-bubble',
        text: 'Icons'
      },
      {
        to: '/maps',
        icon: 'mdi-map-marker',
        text: 'Maps'
      },
      {
        to: '/notifications',
        icon: 'mdi-bell',
        text: 'Notifications'
      }
*/
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>

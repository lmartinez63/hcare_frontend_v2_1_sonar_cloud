<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        md12
      >
        <v-card v-if="data && metadata">
          <v-card-title>
            {{ metadata.dataTableName }}
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="columnHeaders"
            :items="data"
            :search="search"
            class="elevation-1"
          >
            <template
              slot="items"
              slot-scope="myprops"
            >
              <td
                v-for="header in columnHeaders"
                :key="header.dataColumnCode"
              >
                <div v-if="header.value !== 'optionsButtons'">
                  {{ header.type === 'date' ? localDateTimeFromIso(myprops.item[header.value]) : myprops.item[header.value] }}
                </div>
                <div v-else>
                  <div
                    v-for="rowButton in metadata.dataRowButtons"
                    :key="rowButton.dataRowButtonCode"
                  >
                    <v-icon
                      small
                      @click="eventItem(myprops.item, rowButton)"
                    >
                      {{ rowButton.icon }}
                    </v-icon>
                  </div>
                </div>
              </td>
            </template>
            <!--
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">
              {{ props.item.calories }}
            </td>
            <td class="text-xs-right">
              {{ props.item.fat }}
            </td>
            <td class="text-xs-right">
              {{ props.item.carbs }}
            </td>
            <td class="text-xs-right">
              {{ props.item.protein }}
            </td>
            <td class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(props.item)"
              >
                mdi-delete
              </v-icon>
            </td>
          </template>
        -->
            <template v-slot:no-data>
              <v-alert
                :value="true"
                color="error"
                icon="mdi-alert-circle"
              >
                Lo sentimos, no hay nada que mostrar aquí.
              </v-alert>
            </template>
          </v-data-table>
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
                color="darken-2"
                dark
                fab
              >
                <v-icon>mdi-dots-vertical</v-icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <v-btn
              v-for="pageButton in pageButtons"
              v-if="pageButton.visible"
              :key="pageButton.buttonCode"
              fab
              dark
              small
              color="green"
              @click="executeAction(pageButton)"
            >
              <v-icon>{{ pageButton.icon }}</v-icon>
            </v-btn>
          </v-speed-dial>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    search: '',
    dialog: false,
    editedIndex: -1,
    fab: false,
    fling: false,
    hover: false,
    direction: 'top',
    tabs: null,
    top: false,
    right: false,
    bottom: true,
    left: true,
    transition: 'slide-y-reverse-transition',
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    data () {
      return this.$store.state.browse.data
    },
    metadata () {
      return this.$store.state.browse.metadata
    },
    columnHeaders () {
      return this.$store.state.browse.metadata.columnHeaders
    },
    pageButtons () {
      return this.$store.state.browse.metadata.pageButtons
    },
    datetimeFormat () {
      return this.$store.state.general.properties.items.CONFIGURATION.dateformat[0].value + ' ' + this.$store.state.general.properties.items.CONFIGURATION.timeformat[0].value
    }

  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    console.log('created-' + 'BrowseComponent')
  },
  mounted: function () {
    console.log('mounted-' + 'BrowseComponent')
    const dataContent = {
      'browseName': this.$route.params.browseName,
      'browseParameters': this.$route.query
    }
    const {
      requestPage
    } = this
    const {
      dispatch
    } = this.$store

    dispatch('browse/getBrowseData', {
      requestPage: requestPage,
      processName: '',
      dataContent: dataContent,
      vueInstance: this
    })
  },

  methods: {
    localDateTimeFromIso (isoDatetime) {
      // return this.$moment.utc(isoDatetime).local().format(this.datetimeFormat)
      this.$moment.locale('es')
      if (isoDatetime !== null) { return this.$moment.utc(isoDatetime).local().format('LLLL') }
      return ''
    },
    executeAction: function (button) {
      let selfVue = this
      switch (button.buttonType) {
        case 1:
          var routeObject = {}
          var jsonString = button.eventDefinition
          var eventArray = button.eventDefinition.match(/\${{(.*?)}}/g)
          if (eventArray != null) {
            for (var i = 0, len = eventArray.length; i < len; i++) {
              var dataRouteVariable = eventArray[i]
              jsonString = jsonString.replace(dataRouteVariable, eval(dataRouteVariable.match(/\$\{\{([^)]+)\}\}/)[1]))
            }
          }
          routeObject = JSON.parse(jsonString)
          this.$router.push(routeObject)
          break
        case 2:
          // TOREMOVE
          eval(button.eventDefinition)
          break
      }
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    eventItem (rowData, button) {
      // alert(JSON.stringify(item))
      switch (button.dataRowButtonCode) {
        case 'open':
          var routeObject = {}
          var jsonString = button.dataRowButtonEvent
          button.dataRowButtonEvent.match(/\${{(.*?)}}/g).forEach(function (dataRouteVariable) {
            jsonString = jsonString.replace(dataRouteVariable, rowData[dataRouteVariable.match(/\$\{\{([^)]+)\}\}/)[1]])
          })
          routeObject = JSON.parse(jsonString)
          // routeObject = JSON.parse('{"name":"' + this.detailComponent + '","params":{"' + this.entityIdName + '":"' + id + '"}}')
          this.$router.push(routeObject)
          break
        case 'save':
          eval(button.dataRowButtonEvent)
          break
        default:
          break
      }
      /*
      to: '/dataview/RetrievePatientInfo/patientInfo?patientId=1250',
      var routeObject = {};
      var jsonString = dataRoute;
      dataRoute.match(/\${{(.*?)}}/g).forEach(function(dataRouteVariable) {
        jsonString = jsonString.replace(dataRouteVariable,rowData[dataRouteVariable.match( /\$\{\{([^)]+)\}\}/)[1]]);
      });
      routeObject = JSON.parse(jsonString);
      //routeObject = JSON.parse('{"name":"' + this.detailComponent + '","params":{"' + this.entityIdName + '":"' + id + '"}}')
      this.$router.push(routeObject);
      */
    },
    saveObjectItemState: function (sParameters, rowData) {
      var jParameters = JSON.parse(sParameters)
      console.log('Browse - method - saveObjectItemState - begin')
      var attributeArray = jParameters.sAttributeArray.split(',')
      var dataContent = {}
      for (var i = 0; i < attributeArray.length; i++) {
        Object.defineProperty(dataContent, attributeArray[i], { value: rowData[attributeArray[i]], writable: true, enumerable: true, configurable: true })
      }
      const {
        requestPage
      } = this
      const {
        dispatch
      } = this.$store
      // this.$v.$touch()
      /* if (this.$v.$invalid) {
        dispatch('alert/warning', 'Por favor complete los campos requeridos')
      } else {
      */
      dispatch('data/saveEntity', {
        vm: this,
        requestPage: requestPage,
        processName: jParameters.processName,
        dataContent: dataContent,
        additionalActions: jParameters.additionalActions,
        returnRoute: jParameters.returnRoute
      })
      // }
      console.log('Browse - method - saveObjectItemState - end')
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

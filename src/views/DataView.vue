<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      v-if="page && dataMap"
      justify-center
      wrap
    >
      <v-flex xs12>
        <material-card
          :title="page.titleDefinition"
          :co-title="page.coTitleDefinition"
          :text="page.headerText"
          :text1="page.headerText1"
          :text2="page.headerText2"
          :text3="page.headerText3"
          :text4="page.headerText4"
          :text5="page.headerText5"
          :text6="page.headerText6"
          :text7="page.headerText7"
          :text8="page.headerText8"
          :text9="page.headerText9"
        >
          <v-layout
            v-if="page.sectionList.length > 0"
            align-center
          >
            <v-stepper
              v-if="page.pageMode === 'step' "
              vertical
              non-linear
              style="width:100%;"
            >
              <div
                v-for="section in orderedSections"
                v-if="getFieldCount(section.fieldDefinitionList) > 0"
                :key="section.sectionCode"
              >
                <v-stepper-step
                  :step="section.visualizationOrder"
                  :complete="evaluateExp(section.stepCompleteRuleExp)"
                  :editable="evaluateExp(section.stepRuleExp)"
                >
                  {{ $parent.$parent.$parent.getLabelValue(section.label) }}
                <!--<small>Summarize if needed</small>-->
                </v-stepper-step>
                <v-stepper-content :step="section.visualizationOrder">
                  <div v-if="section.sectionType === 1">
                    <v-form ref="dataForm">
                      <v-container py-6>
                        <v-alert
                          :value="dataAlert.display"
                          :type="dataAlert.type"
                          transition="scale-transition"
                          dismissible
                        >
                          {{ dataAlert.message }}
                        </v-alert>
                        <v-layout
                          v-if="section.sectionType === 1"
                          wrap
                          row
                        >
                          <v-flex
                            v-for="fieldDefinition in orderedFields(section.fieldDefinitionList)"
                            v-if="fieldDefinition.visible"
                            :key="fieldDefinition.fieldDefinitionCode"
                            :xs12="( fieldDefinition.fieldType === 12 || fieldDefinition.fieldType === 8 || fieldDefinition.fieldType === 10 || fieldDefinition.fieldType === 11 || fieldDefinition.fieldType === 0 ) ? true : false"
                            :class="['order-xs'+orderCalculated(fieldDefinition.newOrderNumber,section.fieldDefinitionList.length), fieldDefinition.xsSize ? 'xs' +fieldDefinition.xsSize : 'xs6']"
                          >
                            <v-subheader
                              v-if="fieldDefinition.fieldType === 0"
                              inset
                            >
                              {{ $parent.$parent.$parent.getLabelValue(fieldDefinition.label) }}
                            </v-subheader>
                            <v-divider
                              v-if="fieldDefinition.fieldType === 0"
                              inset
                            />
                            <v-text-field
                              v-if="fieldDefinition.fieldType === 1"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              :label="$parent.$parent.$parent.getLabelValue(fieldDefinition.label)"
                              :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                              :disabled="!fieldDefinition.editable"
                              :suffix="fieldDefinition.suffix"
                              :prefix="fieldDefinition.prefix"
                              :type="fieldDefinition.customFeatures ? JSON.parse(fieldDefinition.customFeatures).type : ''"
                              :mask="fieldDefinition.mask"
                              :append-outer-icon="fieldDefinition.outterButton ? JSON.parse(fieldDefinition.outterButton).icon : ''"
                              :prepend-icon="fieldDefinition.prependButton ? JSON.parse(fieldDefinition.prependButton).icon : ''"
                              @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                              @click:append-outer="fieldDefinition.outterButton ? executeAction(JSON.parse(fieldDefinition.outterButton).button) :''"
                              @click:prepend="fieldDefinition.prependButton ? executeAction(JSON.parse(fieldDefinition.prependButton).button) :''"
                            />
                            <v-autocomplete
                              v-if="fieldDefinition.fieldType === 2"
                              ref="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                              :items="arrayItems(fieldDefinition.selectSource)"
                              :label="fieldDefinition.label.labelValueEsEs"
                              placeholder="Seleccione..."
                              :return-object="getReturnObject(fieldDefinition.selectSource)"
                              :item-text="getItemText(fieldDefinition.selectSource)"
                              :item-value="getItemValue(fieldDefinition.selectSource)"
                              :multiple="getMultiple(fieldDefinition.selectSource)"
                              :chips="getMultiple(fieldDefinition.selectSource)"
                              :readonly="!fieldDefinition.editable"
                              @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                            >
                              <!-- Is this neccesary -->
                              <!-- {{ fieldDefinition.outterButton }} -->
                              <template
                                v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                                v-slot:append-outer
                              >
                                <v-slide-x-reverse-transition mode="out-in">
                                  <v-icon
                                    :key="fieldDefinition.id"
                                    :color="JSON.parse(fieldDefinition.outterButton).color"
                                    @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                    v-text="JSON.parse(fieldDefinition.outterButton).icon"
                                  />
                                </v-slide-x-reverse-transition>
                              </template>
                            </v-autocomplete>
                            <v-switch
                              v-if="fieldDefinition.fieldType === 3"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              :label="fieldDefinition.label.labelValueEsEs"
                            />
                            <v-dialog
                              v-if="fieldDefinition.fieldType === 4"
                              :ref="page.id +'_'+ section.id +'_'+ fieldDefinition.id"
                              v-model="fieldDefinition.modal"
                              :return-value.sync="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              persistent
                              lazy
                              full-width
                              :disabled="!fieldDefinition.editable"
                              width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                  :value="computedDateFormattedMomentjs(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode])"
                                  :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                                  :label="fieldDefinition.label.labelValueEsEs"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="on"
                                />
                              </template>
                              <v-date-picker
                                v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                scrollable
                                locale="es"
                                :readonly="!fieldDefinition.editable"
                              >
                                <v-spacer />
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="fieldDefinition.modal = false"
                                >
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="$refs[page.id +'_'+ section.id +'_'+ fieldDefinition.id][0].save(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]); executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-dialog>
                            <v-datetime-picker
                              v-if="fieldDefinition.fieldType === 5"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              locale="es-es"
                              :label="fieldDefinition.label.labelValueEsEs"
                              :disabled="!fieldDefinition.editable"
                              :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                            >
                              <template v-slot:dateIcon>
                                <v-icon>
                                  mdi-calendar
                                </v-icon>
                              </template>
                              <template v-slot:timeIcon>
                                <v-icon>
                                  mdi-clock-outline
                                </v-icon>
                              </template>
                            </v-datetime-picker>
                            <v-dialog
                              v-if="fieldDefinition.fieldType === 6"
                              ref="dialogTime"
                              v-model="fieldDefinition.modal"
                              :return-value.sync="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              persistent
                              full-width
                              width="290px"
                            >
                              <template v-slot:activator="{ onTime }">
                                <v-text-field
                                  v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                  :value="computedDateFormattedMomentjs(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode])"
                                  :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                                  :label="fieldDefinition.label.labelValueEsEs"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="onTime"
                                />
                              </template>
                              <v-time-picker
                                v-if="fieldDefinition.modal"
                                v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                full-width
                                locale="es"
                                :readonly="!fieldDefinition.editable"
                                @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                              >
                                <v-spacer />
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="fieldDefinition.modal = false"
                                >
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  flat
                                  color="primary"
                                  @click="$refs.dialogTime[0].save(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode])"
                                >
                                  OK
                                </v-btn>
                              </v-time-picker>
                            </v-dialog>
                            <v-combobox
                              v-if="fieldDefinition.fieldType === 7"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              :items="arrayItems(fieldDefinition.selectSource)"
                              :label="fieldDefinition.label.labelValueEsEs"
                            >
                              <template
                                v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                                v-slot:append-outer
                              >
                                <v-slide-x-reverse-transition mode="out-in">
                                  <v-icon
                                    :key="fieldDefinition.id"
                                    :color="JSON.parse(fieldDefinition.outterButton).color"
                                    @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                    v-text="JSON.parse(fieldDefinition.outterButton).icon"
                                  />
                                </v-slide-x-reverse-transition>
                              </template>
                            </v-combobox>
                            <v-textarea
                              v-if="fieldDefinition.fieldType === 8"
                              v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              box
                              full-width
                              :label="fieldDefinition.label.labelValueEsEs"
                              auto-grow
                              :maxlength="getMaxFieldSize(fieldDefinition.fieldSize)"
                            />
                            <div v-if="fieldDefinition.fieldType === 10">
                              <v-toolbar color="primary">
                                <!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
                                <v-toolbar-title>
                                  {{ $parent.$parent.$parent.getLabelValue(fieldDefinition.label) }}
                                </v-toolbar-title>
                                <v-spacer />
                                <v-btn
                                  v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                                  icon
                                >
                                  <v-icon
                                    :key="fieldDefinition.id"
                                    :color="JSON.parse(fieldDefinition.outterButton).color"
                                    @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                    v-text="JSON.parse(fieldDefinition.outterButton).icon"
                                  />
                                </v-btn>
                              </v-toolbar>
                              <v-list
                                two-line
                              >
                                <template v-for="(dataElement,dataElementIndex) in getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]">
                                  <v-list-tile
                                    :key="dataElement.id"
                                    avatar
                                    ripple
                                    @click="executeAction(JSON.parse(fieldDefinition.selectSource).button,dataElement)"
                                  >
                                    <v-list-tile-content>
                                      <v-list-tile-title>
                                        {{ getObjectData(dataElement,JSON.parse(fieldDefinition.selectSource).title) }}
                                      </v-list-tile-title>
                                      <v-list-tile-sub-title class="text--primary">
                                        {{ dataElement[JSON.parse(fieldDefinition.selectSource).headline] }}
                                      </v-list-tile-sub-title>
                                      <v-list-tile-sub-title>{{ dataElement[JSON.parse(fieldDefinition.selectSource).subtitle] }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                      <v-list-tile-action-text>{{ dataElement[JSON.parse(fieldDefinition.selectSource).action] }}</v-list-tile-action-text>
                                    </v-list-tile-action>
                                  </v-list-tile>
                                  <v-divider
                                    v-if="dataElementIndex + 1 < getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode].length"
                                    :key="dataElementIndex"
                                  />
                                </template>
                              </v-list>
                            </div>
                            <v-toolbar
                              v-if="fieldDefinition.fieldType === 11"
                            >
                              <v-toolbar-side-icon
                                v-if="fieldDefinition.prependButton && fieldDefinition.prependButton !== null && fieldDefinition.prependButton !== '' "
                                @click="executeAction(JSON.parse(fieldDefinition.prependButton).button)"
                              >
                                <v-icon
                                  :color="JSON.parse(fieldDefinition.prependButton).color"
                                  v-text="JSON.parse(fieldDefinition.prependButton).icon"
                                />
                              </v-toolbar-side-icon>
                              <v-toolbar-title>{{ $parent.$parent.$parent.getLabelValue(fieldDefinition.label) }}</v-toolbar-title>
                              <v-spacer />
                              <template v-for="outterButton in JSON.parse(fieldDefinition.outterButton)">
                                <v-btn
                                  v-if="outterButton && outterButton !== null && outterButton !== '' && evaluateVisibility(outterButton.button)"
                                  icon
                                >
                                  <v-icon
                                    :color="outterButton.color"
                                    @click="executeAction(outterButton.button)"
                                    v-text="outterButton.icon"
                                  />
                                </v-btn>
                              </template>
                            </v-toolbar>
                            <v-card
                              v-if="fieldDefinition.fieldType === 12"
                              width="100%"
                            >
                              <v-layout>
                                <v-flex>
                                  <v-card-text>
                                    <v-treeview
                                      v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                      :items="arrayItems(fieldDefinition.selectSource)"
                                      :item-text="getItemText(fieldDefinition.selectSource)"
                                      :return-object="getReturnObject(fieldDefinition.selectSource)"
                                      activatable
                                      active-class="grey lighten-4 indigo--text"
                                      selected-color="indigo"
                                      open-on-click
                                      selectable
                                      expand-icon="mdi-chevron-down"
                                      on-icon="mdi-checkbox-blank"
                                      off-icon="mdi-checkbox-blank-outline"
                                      indeterminate-icon="mdi-checkbox-intermediate"
                                    />
                                  </v-card-text>
                                </v-flex>
                                <v-divider vertical />
                                <v-flex
                                  xs12
                                  md6
                                >
                                  <v-card-text>
                                    <div
                                      v-if="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode].length === 0"
                                      key="title"
                                      class="title font-weight-light grey--text pa-3 text-xs-center"
                                    >
                                      Selecciones alguna de las opciones
                                    </div>

                                    <v-scroll-x-transition
                                      group
                                      hide-on-leave
                                    >
                                      <v-chip
                                        v-for="(selection, s) in getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                                        :key="s"
                                        color="grey"
                                        dark
                                        small
                                      >
                                        <v-icon
                                          left
                                          small
                                        >
                                          mdi-beer
                                        </v-icon>
                                        {{ selection.description }}
                                      </v-chip>
                                    </v-scroll-x-transition>
                                  </v-card-text>
                                </v-flex>
                              </v-layout>
                            </v-card>
                            <v-data-table
                              v-if="fieldDefinition.fieldType === 15"
                              :headers="getDataTableHeadersFromFielDefinition(fieldDefinition.selectSource)"
                              :items="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              class="elevation-1"
                            >
                              <template
                                slot="items"
                                slot-scope="datatableprops"
                              >
                                <td
                                  v-for="header in getDataTableHeadersFromFielDefinition(fieldDefinition.selectSource)"
                                  :key="header.id"
                                >
                                  <div v-if="header.value !== 'optionsButtons'">
                                    {{ header.type === 'date' ? localDateTimeFromIso(datatableprops.item[header.value]) : getObjectData(datatableprops.item, header.value) }}
                                  </div>
                                  <div v-else>
                                    <div
                                      v-for="rowButton in getDataTableButtonsFromFielDefinition(fieldDefinition.selectSource)"
                                      :key="rowButton.dataRowButtonCode"
                                    >
                                      <v-icon
                                        small
                                        @click="eventItem(datatableprops.item, rowButton)"
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
                              <template v-slot:footer>
                                <v-btn
                                  v-for="outterButton in JSON.parse(fieldDefinition.outterButton)"
                                  :key="outterButton.buttonCode"
                                  fab
                                  dark
                                  small
                                  color="green"
                                  @click="executeAction(outterButton.button)"
                                >
                                  <v-icon>{{ outterButton.icon }}</v-icon>
                                </v-btn>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-form>
                  </div>
                  <div v-if="section.sectionType === 3">
                    <v-card
                      color="grey lighten-1"
                      class="mb-5"
                    >
                      <v-flex
                        v-for="fieldDefinition in orderedFields(section.fieldDefinitionList)"
                        v-if="fieldDefinition.visible"
                        :key="fieldDefinition.fieldDefinitionCode"
                      >
                        <!-- TODO This should be removed and moved to section 1-->
                        <div v-if="fieldDefinition.fieldType === 10">
                          <v-toolbar color="primary">
                            <!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
                            <v-toolbar-title>
                              {{ $parent.$parent.$parent.getLabelValue(fieldDefinition.label) }}
                            </v-toolbar-title>
                            <v-spacer />
                            <v-btn
                              v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                              icon
                            >
                              <v-icon
                                :key="fieldDefinition.id"
                                :color="JSON.parse(fieldDefinition.outterButton).color"
                                @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                v-text="JSON.parse(fieldDefinition.outterButton).icon"
                              />
                            </v-btn>
                          </v-toolbar>
                          <v-list
                            two-line
                          >
                            <template v-for="(dataElement,dataElementIndex) in getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]">
                              <v-list-tile
                                :key="dataElement.id"
                                avatar
                                ripple
                                @click="executeAction(JSON.parse(fieldDefinition.selectSource).button,dataElement)"
                              >
                                <v-list-tile-content>
                                  <v-list-tile-title>{{ dataElement[JSON.parse(fieldDefinition.selectSource).title] }}</v-list-tile-title>
                                  <v-list-tile-sub-title class="text--primary">
                                    {{ dataElement[JSON.parse(fieldDefinition.selectSource).headline] }}
                                  </v-list-tile-sub-title>
                                  <v-list-tile-sub-title>{{ dataElement[JSON.parse(fieldDefinition.selectSource).subtitle] }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                  <v-list-tile-action-text>{{ dataElement[JSON.parse(fieldDefinition.selectSource).action] }}</v-list-tile-action-text>
                                </v-list-tile-action>
                              </v-list-tile>
                              <v-divider
                                v-if="dataElementIndex + 1 < getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode].length"
                                :key="dataElementIndex"
                              />
                            </template>
                          </v-list>
                        </div>
                      </v-flex>
                    </v-card>
                  </div>
                  <v-btn
                    v-for="sectionButton in section.sectionButtons"
                    v-if="sectionButton.visible"
                    :key="sectionButton.buttonCode"
                    dark
                    small
                    :fab="sectionButton.fab"
                    :round="sectionButton.round"
                    color="green"
                    @click="executeAction(sectionButton)"
                  >
                    <v-icon>{{ sectionButton.icon }}</v-icon>
                    {{ sectionButton.round ? ' '+$parent.$parent.$parent.getLabelValue(sectionButton.label) : '' }}
                  </v-btn>
                </v-stepper-content>
              </div>
            </v-stepper>
            <v-tabs
              v-if="page.pageMode === 'tab' "
              v-model="tab"
              grow
              style="width:100%;"
            >
              <v-tab
                v-for="section in orderedSections"
                v-if="getFieldCount(section.fieldDefinitionList) > 0"
                :key="section.sectionCode"
              >
                {{ $parent.$parent.$parent.getLabelValue(section.label) }}
              </v-tab>
              <v-tab-item
                v-for="section in orderedSections"
                v-if="getFieldCount(section.fieldDefinitionList) > 0"
                :key="section.sectionCode"
              >
                <v-form ref="dataForm">
                  <v-container py-6>
                    <v-alert
                      :value="dataAlert.display"
                      :type="dataAlert.type"
                      transition="scale-transition"
                      dismissible
                    >
                      {{ dataAlert.message }}
                    </v-alert>
                    <v-layout
                      v-if="section.sectionType === 1"
                      wrap
                      row
                    >
                      <v-flex
                        v-for="fieldDefinition in orderedFields(section.fieldDefinitionList)"
                        v-if="fieldDefinition.visible"
                        :key="fieldDefinition.fieldDefinitionCode"
                        :xs12="(fieldDefinition.fieldType === 8 || fieldDefinition.fieldType === 9) ? true : false"
                        :class="['order-xs'+orderCalculated(fieldDefinition.orderNumber,section.fieldDefinitionList.length), fieldDefinition.xsSize ? 'xs' +fieldDefinition.xsSize : 'xs6']"
                      >
                        <v-text-field
                          v-if="fieldDefinition.fieldType === 1"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          :label="$parent.$parent.$parent.getLabelValue(fieldDefinition.label)"
                          :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                          :disabled="!fieldDefinition.editable"
                          :type="fieldDefinition.customFeatures ? JSON.parse(fieldDefinition.customFeatures).type : ''"
                          :suffix="fieldDefinition.suffix"
                          :prefix="fieldDefinition.prefix"
                          :mask="fieldDefinition.mask"
                          @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                        />
                        <v-autocomplete
                          v-if="fieldDefinition.fieldType === 2"
                          ref="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                          :items="arrayItems(fieldDefinition.selectSource)"
                          :label="fieldDefinition.label.labelValueEsEs"
                          placeholder="Seleccione..."
                          :return-object="getReturnObject(fieldDefinition.selectSource)"
                          :item-text="getItemText(fieldDefinition.selectSource)"
                          :item-value="getItemValue(fieldDefinition.selectSource)"
                          :multiple="getMultiple(fieldDefinition.selectSource)"
                          :chips="getMultiple(fieldDefinition.selectSource)"
                          :readonly="!fieldDefinition.editable"
                          @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                        >
                          {{ fieldDefinition.outterButton }}
                          <template
                            v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                            v-slot:append-outer
                          >
                            <v-slide-x-reverse-transition mode="out-in">
                              <v-icon
                                :key="fieldDefinition.id"
                                :color="JSON.parse(fieldDefinition.outterButton).color"
                                @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                v-text="JSON.parse(fieldDefinition.outterButton).icon"
                              />
                            </v-slide-x-reverse-transition>
                          </template>
                        </v-autocomplete>
                        <v-switch
                          v-if="fieldDefinition.fieldType === 3"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          :label="fieldDefinition.label.labelValueEsEs"
                        />
                        <v-dialog
                          v-if="fieldDefinition.fieldType === 4"
                          ref="dialog"
                          v-model="fieldDefinition.modal"
                          :return-value.sync="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          persistent
                          lazy
                          full-width
                          :disabled="!fieldDefinition.editable"
                          width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                              :value="computedDateFormattedMomentjs(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode])"
                              :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                              :label="fieldDefinition.label.labelValueEsEs"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-on="on"
                            />
                          </template>
                          <v-date-picker
                            v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                            scrollable
                            locale="es"
                            :readonly="!fieldDefinition.editable"
                            @change="executeFieldChangeEvent(fieldDefinition.onChangeEvent)"
                          >
                            <v-spacer />
                            <v-btn
                              flat
                              color="primary"
                              @click="fieldDefinition.modal = false"
                            >
                              Cancelar
                            </v-btn>
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.dialog[0].save(getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode])"
                            >
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                        <v-datetime-picker
                          v-if="fieldDefinition.fieldType === 5"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          locale="es-es"
                          :label="fieldDefinition.label.labelValueEsEs"
                          :disabled="!fieldDefinition.editable"
                          :rules="[() => fieldDefinition.required === true && ( !! getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                        >
                          <template v-slot:dateIcon>
                            <v-icon>
                              mdi-calendar
                            </v-icon>
                          </template>
                          <template v-slot:timeIcon>
                            <v-icon>
                              mdi-clock-outline
                            </v-icon>
                          </template>
                        </v-datetime-picker>
                        <v-combobox
                          v-if="fieldDefinition.fieldType === 7"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          :items="arrayItems(fieldDefinition.selectSource)"
                          :label="fieldDefinition.label.labelValueEsEs"
                        >
                          <template
                            v-if="fieldDefinition.outterButton && fieldDefinition.outterButton !== null && fieldDefinition.outterButton !== '' "
                            v-slot:append-outer
                          >
                            <v-slide-x-reverse-transition mode="out-in">
                              <v-icon
                                :key="fieldDefinition.id"
                                :color="JSON.parse(fieldDefinition.outterButton).color"
                                @click="executeAction(JSON.parse(fieldDefinition.outterButton).button)"
                                v-text="JSON.parse(fieldDefinition.outterButton).icon"
                              />
                            </v-slide-x-reverse-transition>
                          </template>
                        </v-combobox>
                        <v-textarea
                          v-if="fieldDefinition.fieldType === 8"
                          v-model="getDataMapAttribute(dataMap,section.entity)[fieldDefinition.fieldDefinitionCode]"
                          box
                          full-width
                          :label="fieldDefinition.label.labelValueEsEs"
                          auto-grow
                          :maxlength="getMaxFieldSize(fieldDefinition.fieldSize)"
                        />
                        <!-- Old to remove
                        <full-calendar
                          v-if="fieldDefinition.fieldType === 9"
                          :ref="page.id +'_'+ section.id +'_'+ fieldDefinition.id"
                          :config="config"
                          :timezone="timeZone"
                          :event-sources="getComputedDataMapAttribute('dataMap',[section.entity,fieldDefinition.fieldDefinitionCode])"
                          @event-selected="executeCalendarAction($event, fieldDefinition.onClickEvent)"
                          @event-receive="eventReceive"
                          @event-created="executeCalendarAction($event, fieldDefinition.onChangeEvent)"
                        />
                        -->
                        <v-sheet
                          v-if="fieldDefinition.fieldType === 9"
                          height="100%"
                        >
                          <!-- now is normally calculated by itself, but to keep the calendar in this date range to view events -->
                          <v-calendar
                            ref="calendar"
                            :now="today"
                            :value="today"
                            color="primary"
                            type="week"
                          >
                            <!-- the events at the top (all-day) -->
                            <template
                              slot="dayHeader"
                              slot-scope="{ date }"
                            >
                              <template v-for="event in eventsMap(getComputedDataMapAttribute('dataMap',[section.entity,fieldDefinition.fieldDefinitionCode]))[date]">
                                <!-- <template v-for="event in eventsMap[date]"> -->
                                <!-- all day events don't have time -->
                                <div
                                  v-if="!event.time"
                                  :key="event.title"
                                  class="my-event"
                                  @click="open(event)"
                                  v-html="event.title"
                                />
                              </template>
                            </template>
                            <!-- the events at the bottom (timed) -->
                            <template
                              slot="dayBody"
                              slot-scope="{ date, timeToY, minutesToPixels }"
                            >
                              <template v-for="event in eventsMap(getComputedDataMapAttribute('dataMap',[section.entity,fieldDefinition.fieldDefinitionCode]))[date]">
                                <!-- <template v-for="event in eventsMap[date]"> -->
                                <!-- timed events -->
                                <div
                                  v-if="event.time"
                                  :key="event.title"
                                  :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                                  class="my-event with-time"
                                  @click="open(event)"
                                  v-html="event.title"
                                />
                              </template>
                            </template>
                          </v-calendar>
                          <v-speed-dial
                            v-if="fieldDefinition.onChangeEvent !== null"
                            v-model="calendarFab"
                            bottom
                            left
                            direction="top"
                            transition="slide-y-reverse-transition"
                          >
                            <template v-slot:activator>
                              <v-btn
                                v-model="calendarFab"
                                color="darken-2"
                                dark
                                fab
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
                              @click="executeAction(JSON.parse(fieldDefinition.onChangeEvent))"
                            >
                              <v-icon>{{ JSON.parse(fieldDefinition.onChangeEvent).icon }}</v-icon>
                            </v-btn>
                          </v-speed-dial>
                        </v-sheet>
                      </v-flex>
                    </v-layout>
                    <v-layout
                      v-if="section.sectionType === 2 "
                      wrap
                    >
                      <v-card width="100%">
                        <v-sheet
                          class="pa-3 lighten-2"
                          dark
                        >
                          <v-text-field
                            v-model="search"
                            label="Search Company Directory"
                            dark
                            flat
                            solo-inverted
                            hide-details
                            clearable
                            clear-icon="mdi-close-circle-outline"
                          />
                          <v-checkbox
                            v-model="caseSensitive"
                            dark
                            hide-details
                            label="Case sensitive search"
                          />
                        </v-sheet>
                        <v-layout>
                          <v-flex>
                            <v-card-text>
                              <v-treeview
                                v-if="dataMap[page.entity].files"
                                :active.sync="active"
                                :items="treeviewItems"
                                :search="search"
                                :filter="filter"
                                :open.sync="open"
                                activatable
                                item-key="name"
                                open-on-click
                                return-object
                              >
                                <template v-slot:prepend="{ item, open }">
                                  <v-icon v-if="!item.fileType">
                                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                                  </v-icon>
                                  <v-icon v-else>
                                    {{ files[item.fileType] }}
                                  </v-icon>
                                </template>
                              </v-treeview>
                            </v-card-text>
                          </v-flex>
                          <v-divider vertical />
                          <v-flex
                            xs12
                            md6
                          >
                            <v-card>
                              <v-card-text v-if="!selected">
                                <div
                                  class="title font-weight-light grey--text pa-3 text-xs-center"
                                  style="align-self: center;"
                                >
                                  Seleccione una imagen
                                </div>
                              </v-card-text>
                              <v-img
                                v-else
                                :key="selected.id"
                                :src="getImgSrc(selected)"
                                class="grey darken-4"
                              />
                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-tab-item>
            </v-tabs>
          </v-layout>
          <v-speed-dial
            v-model="fab"
            :top="optionButtonTop"
            :bottom="optionButtonBottom"
            :right="optionButtonRight"
            :left="optionButtonLeft"
            :direction="optionButtonDirection"
            :open-on-hover="optionButtonHover"
            :transition="optionButtonTransition"
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
              v-for="pageButton in page.pageButtons"
              v-if="pageButton.visible"
              :key="pageButton.buttonCode"
              dark
              small
              :fab="pageButton.fab"
              :round="pageButton.round"
              color="green"
              @mouseenter="$event.preventDefault(); pageButton.fab = !pageButton.fab; pageButton.round = !pageButton.round ; "
              @click="executeAction(pageButton)"
            >
              <v-icon>{{ pageButton.icon }}</v-icon>
              {{ pageButton.round ? ' '+$parent.$parent.$parent.getLabelValue(pageButton.label) : '' }}
            </v-btn>
          </v-speed-dial>
        </material-card>
      </v-flex>
      <!-- Popup Dialog -->
      <v-dialog
        v-if="createDataViewDialog && dialogPage && dialogDataMap"
        v-model="dataViewDialog"
        persistent
        :max-width="dialogPage.size?dialogPage.size:'600px'"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogPage.label.labelValueEsEs }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="dialogDataForm">
              <v-container
                v-for="dialogSection in dialogPage.sectionList"
                v-if="getFieldCount(dialogSection.fieldDefinitionList) > 0"
                :key="dialogSection.sectionCode"
                grid-list-md
              >
                <v-layout wrap>
                  <v-flex
                    v-for="dialogFieldDefinition in orderedFields(dialogSection.fieldDefinitionList)"
                    v-if="dialogFieldDefinition.visible"
                    :key="dialogFieldDefinition.fieldDefinitionCode"
                    :xs12="dialogFieldDefinition.fieldType === 12 || dialogFieldDefinition.fieldType === 8 ? true : false"
                    :class="['order-xs'+orderCalculated(dialogFieldDefinition.orderNumber,dialogSection.fieldDefinitionList.length), dialogFieldDefinition.xsSize ? 'xs' +dialogFieldDefinition.xsSize : 'xs6']"
                  >
                    <v-text-field
                      v-if="dialogFieldDefinition.fieldType === 1"
                      v-model="getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode]"
                      :label="dialogFieldDefinition.label.labelValueEsEs"
                      :rules="[() => dialogFieldDefinition.required === true && ( !! getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                      :disabled="!dialogFieldDefinition.editable"
                      :suffix="dialogFieldDefinition.suffix"
                      :prefix="dialogFieldDefinition.prefix"
                      :mask="dialogFieldDefinition.mask"
                      @change="executeFieldChangeEvent(dialogFieldDefinition.onChangeEvent)"
                    />
                    <v-autocomplete
                      v-if="dialogFieldDefinition.fieldType === 2"
                      ref="getDataMapAttribute(dialogDataMap,section.entity)[dialogFieldDefinition.fieldDefinitionCode]"
                      v-model="getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode]"
                      :rules="[() => dialogFieldDefinition.required === true && ( !! getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                      :items="arrayItems(dialogFieldDefinition.selectSource)"
                      :label="dialogFieldDefinition.label.labelValueEsEs"
                      placeholder="Seleccione..."
                      :return-object="getReturnObject(dialogFieldDefinition.selectSource)"
                      :item-text="getItemText(dialogFieldDefinition.selectSource)"
                      :item-value="getItemValue(dialogFieldDefinition.selectSource)"
                      :multiple="getMultiple(dialogFieldDefinition.selectSource)"
                      :chips="getMultiple(dialogFieldDefinition.selectSource)"
                      :readonly="!dialogFieldDefinition.editable"
                    >
                      {{ dialogFieldDefinition.outterButton }}
                      <template
                        v-if="dialogFieldDefinition.outterButton && dialogFieldDefinition.outterButton !== null && dialogFieldDefinition.outterButton !== '' "
                        v-slot:append-outer
                      >
                        <v-slide-x-reverse-transition mode="out-in">
                          <v-icon
                            :key="dialogFieldDefinition.id"
                            :color="JSON.parse(dialogFieldDefinition.outterButton).color"
                            @click="executeAction(JSON.parse(dialogFieldDefinition.outterButton).button)"
                            v-text="JSON.parse(dialogFieldDefinition.outterButton).icon"
                          />
                        </v-slide-x-reverse-transition>
                      </template>
                    </v-autocomplete>
                    <v-datetime-picker
                      v-if="dialogFieldDefinition.fieldType === 5"
                      v-model="getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode]"
                      locale="es-es"
                      :label="dialogFieldDefinition.label.labelValueEsEs"
                      :disabled="!dialogFieldDefinition.editable"
                      :rules="[() => dialogFieldDefinition.required === true && ( !! getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode] || 'Este campo es requerido' )]"
                    >
                      <template v-slot:dateIcon>
                        <v-icon>
                          mdi-calendar
                        </v-icon>
                      </template>
                      <template v-slot:timeIcon>
                        <v-icon>
                          mdi-clock-outline
                        </v-icon>
                      </template>
                    </v-datetime-picker>
                    <v-textarea
                      v-if="dialogFieldDefinition.fieldType === 8"
                      v-model="getDataMapAttribute(dialogDataMap,dialogSection.entity)[dialogFieldDefinition.fieldDefinitionCode]"
                      box
                      full-width
                      :label="dialogFieldDefinition.label.labelValueEsEs"
                      auto-grow
                      :maxlength="getMaxFieldSize(dialogFieldDefinition.fieldSize)"
                    />
                    <!-- No longer required
                    <full-calendar
                      v-if="dialogFieldDefinition.fieldType === 9"
                      :ref="dialogPage.id +'_'+ dialogSection.id +'_'+ dialogFieldDefinition.id"
                      :config="config"
                      :timezone="timeZone"
                      :event-sources="getComputedDataMapAttribute('dialogDataMap',[dialogSection.entity,dialogFieldDefinition.fieldDefinitionCode],dialogPage.id +'_'+ dialogSection.id +'_'+ dialogFieldDefinition.id)"
                      @event-selected="executeCalendarAction($event, dialogFieldDefinition.onClickEvent)"
                      @event-receive="eventReceive"
                      @event-created="eventCreated"
                    />
                    -->
                    <v-card
                      v-if="dialogFieldDefinition.fieldType === 12"
                      width="100%"
                    >
                      <v-layout>
                        <v-flex>
                          <v-card-text>
                            <v-treeview
                              v-model="dialogDataMap.tempAuxiliarExamList"
                              :items="arrayItems(dialogFieldDefinition.selectSource)"
                              :item-text="getItemText(dialogFieldDefinition.selectSource)"
                              :return-object="getReturnObject(dialogFieldDefinition.selectSource)"
                              activatable
                              active-class="grey lighten-4 indigo--text"
                              selected-color="indigo"
                              open-on-click
                              selectable
                              expand-icon="mdi-chevron-down"
                              on-icon="mdi-checkbox-blank"
                              off-icon="mdi-checkbox-blank-outline"
                              indeterminate-icon="mdi-checkbox-intermediate"
                            />
                          </v-card-text>
                        </v-flex>
                        <v-divider vertical />
                        <v-flex
                          xs12
                          md6
                        >
                          <v-card-text>
                            <div
                              v-if="dialogDataMap.tempAuxiliarExamList.length === 0"
                              key="title"
                              class="title font-weight-light grey--text pa-3 text-xs-center"
                            >
                              Selecciones alguna de las opciones
                            </div>

                            <v-scroll-x-transition
                              group
                              hide-on-leave
                            >
                              <v-chip
                                v-for="(selection, s) in dialogDataMap.tempAuxiliarExamList"
                                :key="s"
                                color="grey"
                                dark
                                small
                              >
                                <v-icon
                                  left
                                  small
                                >
                                  mdi-beer
                                </v-icon>
                                {{ selection.description }}
                              </v-chip>
                            </v-scroll-x-transition>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-speed-dial
              v-model="dialogFab"
              :top="dialogOptionButtonTop"
              :bottom="dialogOptionButtonBottom"
              :right="dialogOptionButtonRight"
              :left="dialogOptionButtonLeft"
              :direction="dialogOptionButtonDirection"
              :open-on-hover="dialogOptionButtonHover"
              :transition="dialogOptionButtonTransition"
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
                v-for="dialogPageButton in dialogPage.pageButtons"
                v-if="dialogPageButton.visible"
                :key="dialogPageButton.buttonCode"
                fab
                dark
                small
                color="green"
                @click="executeAction(dialogPageButton)"
              >
                <v-icon>{{ dialogPageButton.icon }}</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Upload Attachment -->
      <v-dialog
        v-if="createUploadFileDialog"
        v-model="uploadFileDialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Subir Documento</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="fileTitle"
                    label="Titulo del Documento"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                >
                  <v-autocomplete
                    :items="['Historial Medico', 'Informacion del Paciente']"
                    label="Categoria"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                >
                  <input
                    id="file"
                    ref="file"
                    type="file"
                    @change="handleFileUpload()"
                  >
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              flat
              @click="uploadFileDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click="submitFile"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>

import _ from 'lodash'
import $ from 'jquery'
/* For ToatUI Calendar
import 'tui-calendar/dist/tui-calendar.css'
import { Calendar } from '@toast-ui/vue-calendar'
*/
// For FullCalendarIO
// import { FullCalendar } from 'vue-full-calendar'
// import 'fullcalendar/dist/fullcalendar.min.css'
import moment from 'moment'
// import 'fullcalendar/dist/locale/es'

let installed = false

export default {
  name: 'DataView',
  /*
  components: {
    FullCalendar
  },
  */
  data () {
    return {
      modal: false,
      dateElements: 0,
      tab: null,
      optionButtonDirection: 'bottom',
      fab: false,
      rowDataSelected: {},
      calendarFab: false,
      optionButtonHover: false,
      optionButtonTop: true,
      optionButtonRight: true,
      optionButtonBottom: false,
      optionButtonLeft: false,
      optionButtonTransition: 'slide-y-reverse-transition',
      dialogFab: false,
      dialogOptionButtonHover: false,
      dialogOptionButtonTop: false,
      dialogOptionButtonRight: false,
      dialogOptionButtonBottom: true,
      dialogOptionButtonLeft: true,
      dialogOptionButtonDirection: 'right',
      dialogOptionButtonTransition: 'slide-y-reverse-transition',
      requestPage: '',
      createUploadFileDialog: false,
      uploadFileDialog: true,
      createDataViewDialog: false,
      dataViewDialog: false,
      fileTitle: '',
      file: '',
      attachment: {
        entityCode: 0,
        entityId: 0,
        entity: '',
        returnEntiyId: ''
      },
      active: [],
      // Testing
      // window: 0,
      open: [1, 2],
      search: null,
      caseSensitive: false,
      // Testing 2
      date: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      tree: [],
      //      required: value => !!value || 'Campo es requerido.',
      rules: {
        required: value => !!value || 'Campo es requerido.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail invalido.'
        }
      },
      // For Testing V-calendar
      /* 'YYYY-MM-DD'

      events: [{
        title: 'Weekly Meeting',
        date: '2019-01-07',
        time: '09:00',
        duration: 45
      },
      {
        title: 'Mash Potatoes',
        date: '2019-01-08',
        time: '12:30',
        duration: 180
      }
      ],
      */
      calendarEvent: new Date(),
      timeZone: 'local',
      config: {
        defaultView: 'agendaWeek',
        locale: 'es',
        timezone: 'local',
        header: false,
        eventRender: function (event, element) {
          console.log(event)
        }
      }
    }
  },
  computed: {
    /*
    eventSources () {
      return this.$store.state.data.dataMap.eventGroupList
    }, */
    eventSources: function () {
      var vm = this
      return function (sEventSource) {
        return this.$store.state.data.dialogDataMap[sEventSource]
      }
    },
    eventsMap: function () {
      var vm = this
      const map = {}
      return function (events) {
        events.forEach(e => {
          var momentDate = vm.$moment(e.start);
          (map[e.date] = map[e.date] || []).push(Object.assign({}, { date: momentDate.local().format('YYYY-MM-DD'), title: e.title, time: momentDate.local().format('HH:mm:ss'), duration: e.duration }))
        })
        return map
      }
    },
    /*
    eventsMap () {
      const map = {}
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
      return map
    }, */
    getComputedDataMapAttribute: function () {
      var vm = this
      return function (dataMap, aAttributeArray, calendarRef) {
        /* if(vm.$refs[calendarRef]){
          vm.$refs[calendarRef][0].$emit('reload-events')
        } */
        var attributeValue = ''
        var dataSource = vm[dataMap]
        for (var ai = 0; ai < aAttributeArray.length; ai++) {
          if (aAttributeArray[ai] && aAttributeArray[ai] !== null) {
            var attributeArray = aAttributeArray[ai].split('.')
            if (attributeArray.length > 0) {
              var finalAttribute = dataSource[attributeArray[0]]
              for (var i = 1; i < attributeArray.length; i++) {
                finalAttribute = finalAttribute[attributeArray[i]]
              }
            }
            dataSource = finalAttribute
            attributeValue = finalAttribute
          }
        }
        return attributeValue
      }
    },
    dataAlert () {
      return this.$store.state.data.dataAlert
    },
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
    propertyItems () {
      return this.$store.state.general.properties.items.GENERAL
    },
    dataMap () {
      return this.$store.state.data.dataMap
    },
    page () {
      return this.$store.state.data.metadata.page
    },
    dialogDataMap () {
      return this.$store.state.data.dialogDataMap
    },
    dialogPage () {
      return this.$store.state.data.dialogMetadata.page
    },
    treeviewItems () {
      return this.dataMap[this.page.entity].files
    },
    orderedSections: function () {
      return _.orderBy(this.page.sectionList, 'visualizationOrder')
    },
    selected () {
      if (!this.active.length) return undefined
      return this.active[0]
    }
  },
  created: function () {
    console.log('DataPage - created - begin')
    const { processName } = this.$route.params
    const { requestPage } = this.$route.params
    this.requestPage = requestPage
    const queryParams = this.$route.query
    const { dispatch } = this.$store
    dispatch('data/getData', {
      vm: this,
      requestPage: requestPage,
      processName: processName,
      dataContent: JSON.parse(JSON.stringify(queryParams))
    })
    console.log('DataPage - created - end')
  },
  mounted: function () {
    console.log('DataPage - mounted - begin')
    // this.$refs.calendar[0].fireMethod('option', 'timezone', 'local')
    console.log('DataPage - mounted - end')
  },
  methods: {
    assingPopupDataToDatamap (dialogDataMapAttribute, dataMapAttribute, sParameters) {
      var dataMapEntity = _.get(this.dataMap, dataMapAttribute)
      var dialogDataMapEntity = _.get(this.dialogDataMap, dialogDataMapAttribute)
      // remove header objects
      dialogDataMapEntity = dialogDataMapEntity.filter(function( obj ) {
		return !obj.children;
		});
      Object.assign(dataMapEntity, dialogDataMapEntity)
      this.saveObjectState(sParameters)
    },
    getObjectData (jsonObject, stringAttribute) {
      return _.get(jsonObject, stringAttribute)
    },
    evaluateVisibility (button) {
      if (button.visibility && button.visibility !== '') {
        return eval(button.visibility)
      }
      return true
    },
    base64ToArrayBuffer (base64) {
      var binaryString = window.atob(base64)
      var binaryLen = binaryString.length
      var bytes = new Uint8Array(binaryLen)
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i)
        bytes[i] = ascii
      }
      return bytes
    },
    downloadFile (attachment) {
      console.log('downloadFile')
      if (attachment.contentType === 'application/pdf') {
        // var bytes = new Uint8Array(attachment.content); // pass your byte response to this constructor
        var bytes = this.base64ToArrayBuffer(attachment.content)
        var blob = new Blob([bytes], { type: 'application/pdf' })// change resultByte to bytes
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = attachment.internalFileName
        link.click()
      }
    },
    closeCurrentDialog () {
      this.dataViewDialog = false
    },
    eventReceive (event, jsEvent, view) {
      console.log('eventReceive')
    },
    executeCalendarAction (event, button) {
      this.$store.state.data.dataMap.event = {}
      this.$store.state.data.dataMap.event.id = null
      this.$store.state.data.dataMap.event.start = event.start.local().toDate().toISOString()
      this.$store.state.data.dataMap.event.end = event.end.local().toDate().toISOString()
      this.$store.state.data.dataMap.event.surgeryAreaId = event.surgeryAreaId
      this.executeAction(JSON.parse(button))
      // this.saveObjectState('{\"sAttributeArray\":\"event\",\"processName\":\"SaveEvent\"}')
    },
    computedDateFormattedMomentjs (date) {
      // TODO this property should come from a userProfile locale
      this.$moment.locale('es')
      return date ? this.$moment(date).format('LL') : ''
    },
    openDataDialogEntity (dialogProcessName, dialogRequestPage, dialogParams, postActions) {
      let selfVue = this
      const { dispatch } = this.$store
      var dialogParamsString = dialogParams
      var dialogParamsArray = dialogParams.match(/\${{(.*?)}}/g)
      if (dialogParamsArray !== null) {
        for (var d2 = 0, dlen2 = dialogParamsArray.length; d2 < dlen2; d2++) {
          dialogParamsString = dialogParamsString.replace(dialogParamsArray[d2], eval(dialogParamsArray[d2].match(/\$\{\{([^)]+)\}\}/)[1]))
        }
      }
      dispatch('data/getDialogData', {
        vm: this,
        requestPage: dialogRequestPage,
        processName: dialogProcessName,
        dataContent: JSON.parse(dialogParamsString)
      })
      this.createDataViewDialog = true
      this.dataViewDialog = true
    },
    evaluateExp (expression) {
      try {
        return eval(expression)
      } catch (err) {
        console.log(err.message)
        return false
      }
    },
    closeDataDialogEntity (additionalActions) {
      this.createDataViewDialog = false
      this.dataViewDialog = false
      this.$store.state.data.dialogDataMap = {}
      this.$store.state.data.dialogMetadata = {}
      if (additionalActions) {
        for (var aA = 0; aA < additionalActions.length; aA++) {
          var additionalAction = additionalActions[aA]
          eval(additionalAction)
        }
      }
    },
    getMaxFieldSize (fieldSize) {
      return !fieldSize || fieldSize === null ? 255 : fieldSize
    },
    getFieldCount: function (fieldList) {
      var count = 0
      fieldList.forEach(function (field) {
        count += field.visible ? 1 : 0
      })
      return count
    },
    orderedFields: function (fieldList) {
      var reorderedList = _.orderBy(fieldList, 'orderNumber')
      for (var ro = 0; ro < fieldList.size; ro++) {
        reorderedList[ro].newOrderNumber = ro
      }
      return reorderedList
    },
    orderCalculated: function (orderNumber, size) {
      return Math.round(orderNumber / Math.ceil(size / 12))
    },
    getReturnObject (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.returnObject && selectSourceJSON.returnObject !== '') {
          return selectSourceJSON.returnObject
        }
      }
      return false
    },
    getDataTableHeadersFromFielDefinition (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.dataTableHeaders) {
          return selectSourceJSON.dataTableHeaders
        }
        return []
      }
      return []
    },
    getDataTableButtonsFromFielDefinition (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.dataTableButtons) {
          return selectSourceJSON.dataTableButtons
        }
        return []
      }
      return []
    },
    getItemText (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.itemText && selectSourceJSON.itemText !== '') {
          return selectSourceJSON.itemText
        }
        return 'text'
      }
      return 'text'
    },
    getItemValue (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.itemValue && selectSourceJSON.itemValue !== '') {
          return selectSourceJSON.itemValue
        }
        return 'value'
      }
      return 'value'
    },
    getMultiple (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        if (selectSourceJSON.multiple && selectSourceJSON.multiple === true) {
          return selectSourceJSON.multiple
        }
        return false
      }
      return false
    },
    arrayItems (selectSource) {
      if (selectSource && selectSource !== null) {
        var selectSourceJSON = JSON.parse(selectSource)
        var source = selectSourceJSON.source
        var finalSelectSource = this.$store.state
        var selectSourceArray = selectSourceJSON.source.split('.')
        for (var i = 0; i < selectSourceArray.length; i++) {
          finalSelectSource = finalSelectSource[selectSourceArray[i]]
        }
        return finalSelectSource
      }
      return []
    },
    getImgSrc: function (imageObj) {
      return 'data:' + imageObj.contentType + ';base64,' + imageObj.src
    },
    currentEntity: function (currPage, currSection) {
      return (currSection && currSection.entity && currSection.entity !== '') ? currSection.entity : currPage.entity
    },
    getDataMapAttribute: function (dataMap, attribute) {
      if (attribute && attribute !== null) {
        var attributeArray = attribute.split('.')
        if (attributeArray.length > 0) {
          var finalAttribute = dataMap[attributeArray[0]]
          for (var i = 1; i < attributeArray.length; i++) {
            finalAttribute = finalAttribute[attributeArray[i]]
          }
        }
        return finalAttribute
      }
      return ''
    },
    getValueFromVariable: function (variable) {
      var variableArray = variable.match(/\${{(.*?)}}/g)

      if (variableArray == null || variableArray.length < 1) {
        return variable
      }
      var returnString = variable
      for (var i1 = 0, len1 = variableArray.length; i1 < len1; i1++) {
        var dataVariable = variableArray[i1]
        returnString = returnString.replace(dataVariable, eval(dataVariable.match(/\$\{\{([^)]+)\}\}/)[1]))
      }
      return returnString
    },
    submitFile () {
      // Initialize the form data
      let formData = new FormData()
      // Add the form data we need to submit
      formData.append('file', this.file)
      formData.append('fileTitle', this.fileTitle)
      formData.append('entity', this.getValueFromVariable(this.attachment.entity))
      formData.append('entityId', this.getValueFromVariable(this.attachment.entityId))
      formData.append('entityCode', this.getValueFromVariable(this.attachment.entityCode))
      if (this.attachment.fieldToMatchEntiyId && this.attachment.fieldToMatchEntiyId !== '') {
        formData.append('fieldToMatchEntiyId', this.getValueFromVariable(this.attachment.fieldToMatchEntiyId))
      }
      const {
        dispatch
      } = this.$store
      // this.$v.$touch()
      /* if (this.$v.$invalid) {
        dispatch('alert/warning', 'Por favor complete los campos requeridos')
      } else {
      */
      dispatch('data/uploadFile', {
        vm: this,
        formData: formData
      }).then(function (response) {
        console.log('sucessUpload')
        console.log(response)
      })
        .catch(function (response) {
        // handle error
          console.log('errorUpload')
          console.log(response)
        })
      this.uploadFileDialog = false
    },
    // Handles a change on the file upload
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    },
    executeFieldChangeEvent (changeEvent) {
      console.log('executeFieldChangeEvent: ' + changeEvent)
      if (this.$store.state.data.dataAlert.display) {
        this.$store.state.data.dataAlert = {}
      }
      if (this.$store.state.alert.display) {
        this.$store.dispatch('alert/clear')
      }
      switch (changeEvent) {
        case 'getPatientInfo':
          this.getPatientInfo()
          break
        default:
          eval(changeEvent)
          break
      }
    },
    // TODO this methods should be dinamic
    getPatientInfo: function () {
      console.log('DataView - method - getPatientInfo - begin')
      const dataContent = {
        'documentNumber': this.dataMap.medicalAppointment.patient.documentNumber
      }
      const {
        requestPage
      } = this
      const {
        dispatch
      } = this.$store
      dispatch('data/getPatientInfoByDocumentNumberOnMedAppointment', {
        requestPage: requestPage,
        processName: 'GetPatientByDocumentNumber',
        dataContent: dataContent
      })
      console.log('DataView - method - getPatientInfo - end')
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
        	this.rowDataSelected = rowData
          eval(button.dataRowButtonEvent)
          	this.rowDataSelected = {}
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
    executeAction: function (button, elementSource) {
      let selfVue = this
      switch (button.buttonType) {
        case 1:
          var routeObject = {}
          var jsonString = button.eventDefinition
          var eventArray = button.eventDefinition.match(/\${{(.*?)}}/g)
          if (eventArray !== null) {
            for (var i2 = 0, len2 = eventArray.length; i2 < len2; i2++) {
              jsonString = jsonString.replace(eventArray[i2], eval(eventArray[i2].match(/\$\{\{([^)]+)\}\}/)[1]))
            }
          }
          routeObject = JSON.parse(jsonString)
          this.$router.push(routeObject)
          break
        case 2:
          // TOREMOVE
          eval(button.eventDefinition)
          break
        case 3:
          // TOREMOVE
          var jsonString3 = button.eventDefinition
          var eventArray3 = button.eventDefinition.match(/\${{(.*?)}}/g)
          if (eventArray3 !== null) {
            for (var it3 = 0, lent3 = eventArray3.length; it3 < lent3; it3++) {
              jsonString3 = jsonString3.replace(eventArray3[it3], eval(eventArray3[it3].match(/\$\{\{([^)]+)\}\}/)[1]))
            }
          }
          var be = JSON.parse(jsonString3)

          // var be = JSON.parse(button.eventDefinition)
          for (var i3 = 0, len3 = be.uObjects.length; i3 < len3; i3++) {
            var uObject = be.uObjects[i3]
            if (!this.dataMap[uObject.sourceObject]) {
              this.dataMap[uObject.sourceObject] = {}
            }
            Object.assign(this.dataMap[uObject.sourceObject], uObject.updatedObject)
          }
          eval(be.action)
      }
    },
    goBackBrowse: function () {
      this.$router.push({
        name: 'BrowseComponent'
      })
    },
    /*
    validateDocumentNumber: function () {
      axios.post(url, this.patient)
        .then(response => {
          selfVue.patient = response.data
          selfVue.$parent.sucessMessage()
          // this.patient.birthday = this.frontEndDateFormat(this.patient.birthday)
          setTimeout(() => {
            this.$router.push({
              name: 'BrowseComponent',
              params: {
                browseType: 'allPatients',
                entityId: 'null'
              }
            })
          }, 1000)
        })
        .catch(error => {
          // this.patient.birthday = this.frontEndDateFormat(this.patient.birthday)
          console.log(error)
        })
    },
    */
    saveDialogObjectState: function (sParameters, sAttributeArray, processName, additionalActions) {
      var djParameters = JSON.parse(sParameters)
      console.log('DataView - method - saveDialogObjectState - begin')
      var dialogAttributeArray = djParameters.sAttributeArray.split(',')
      var dialogDataContent = {}
      for (var di = 0; di < dialogAttributeArray.length; di++) {
        Object.defineProperty(dialogDataContent, dialogAttributeArray[di], { value: this.dialogDataMap[dialogAttributeArray[di]], writable: true, enumerable: true, configurable: true })
        Object.keys(dialogDataContent[dialogAttributeArray[di]]).forEach(function (dKey, dIndex) {
          // key: the name of the object key
          // index: the ordinal position of the key within the object
          if (dialogDataContent[dialogAttributeArray[di]][dKey] instanceof Date) {
            console.log(dKey)
          }
        })
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
      // TODO change to use json properties
      // if(dataContent.medicalAppointment && dataContent.medicalAppointment.allergies){
      //  dataContent.medicalAppointment.allergies = dataContent.medicalAppointment.allergies.toString()
      // }
      var dialogValidated = true
      if (Array.isArray(this.$refs.dialogDataForm)) {
        this.$refs.dialogDataForm.forEach(function (dialogElementForm) {
          if (!dialogElementForm.validate()) {
            dialogValidated = false
          }
        })
      } else {
        if (!this.$refs.dialogDataForm.validate()) {
          dialogValidated = false
        }
      }

      if (dialogValidated) {
        dispatch('data/saveDialogEntity', {
          vm: this,
          requestPage: requestPage,
          processName: djParameters.processName,
          dataContent: dialogDataContent,
          additionalActions: djParameters.additionalActions,
          returnRoute: djParameters.returnRoute
        }).then(() => {
          console.log('MedicalAppointmentPage - method - saveDialogObjectState - closing popup dialog')
          this.closeDataDialogEntity()
        })
      } else {
        dispatch('alert/warning', 'Por favor complete los campos requeridos')
      }
      console.log('MedicalAppointmentPage - method - saveDialogObjectState - end')
    },
    saveObjectState: function (sParameters, sAttributeArray, processName, additionalActions) {
      var jParameters = JSON.parse(sParameters)
      console.log('DataView - method - saveObjectState - begin')
      var attributeArray = jParameters.sAttributeArray.split(',')
      var dataContent = {}
      for (var i = 0; i < attributeArray.length; i++) {
        Object.defineProperty(dataContent, attributeArray[i], { value: this.dataMap[attributeArray[i]], writable: true, enumerable: true, configurable: true })
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
      // TODO change to use json properties
      // if(dataContent.medicalAppointment && dataContent.medicalAppointment.allergies){
      //  dataContent.medicalAppointment.allergies = dataContent.medicalAppointment.allergies.toString()
      // }
      var validated = true
      this.$refs.dataForm.forEach(function (elementForm) {
        if (!elementForm.validate()) {
          validated = false
        }
      })
      if (validated) {
        dispatch('data/saveEntity', {
          vm: this,
          requestPage: requestPage,
          processName: jParameters.processName,
          dataContent: dataContent,
          additionalActions: jParameters.additionalActions,
          returnRoute: jParameters.returnRoute
        })
      } else {
        dispatch('alert/warning', 'Por favor complete los campos requeridos')
      }

      // }
      console.log('DataView - method - saveObjectState - end')
    },
    getData: function (sParameters, sAttributeArray, processName, additionalActions) {
      var jParameters = JSON.parse(sParameters)
      console.log('DataView - method - getData - begin')
      var attributeArray = jParameters.sAttributeArray.split(',')
      var dataContent = {}
      for (var i = 0; i < attributeArray.length; i++) {
        Object.defineProperty(dataContent, attributeArray[i], { value: this.dataMap[attributeArray[i]], writable: true, enumerable: true, configurable: true })
      }
      const {
        requestPage
      } = this
      const {
        dispatch
      } = this.$store
      dispatch('data/getData', {
        vm: this,
        requestPage: requestPage,
        processName: jParameters.processName,
        dataContent: dataContent,
        additionalActions: jParameters.additionalActions,
        returnRoute: jParameters.returnRoute
      })
      // }
      console.log('DataView - method - getData - end')
    },
    viewMedicalHistory: function (historyCode) {
      this.$router.push({
        name: 'MedicalHistoryComponent',
        params: {
          historyCode: historyCode
        }
      })
    },
    viewMedicalAppointmentHistory: function (documentNumber) {
      this.$router.push({
        name: 'BrowsePage',
        params: {
          browseName: 'medicalAppointmentsByPatient',
          entityId: documentNumber
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
    left: 4px;
    margin-right: 8px;
    position: relative;

    &.with-time {
        position: absolute;
        right: 4px;
        margin-right: 0px;
    }
  }
</style>

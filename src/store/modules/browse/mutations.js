import moment from 'moment'

export default {
  pendingRequest (state) {
    console.log('browse - mutations - pendingRequest')
    // state.loading = true;
  },
  failureDetected (state, error) {
    console.log('browse - mutations - failureDetected - ' + error)
    state.error = error
  },
  getBrowseDataSuccess (state, content, vueInstance) {
    console.log('browse - mutations  - getBrowseDataSuccess')
    state.data = content.dataBrowse.data
    state.metadata = content.metaDataBrowse

    var columnHeaders = []

    state.metadata.dataColumns.forEach(function (columnDefinition) {
      var columnHeaderText = columnDefinition.dataColumnName
      var columnHeaderValue = columnDefinition.dataColumnCode
      var columnHeaderType = columnDefinition.columnType
      var columnHeaderAlign = 'left'
      var columnHeaderSortable = true
      var columnHeaderClass = null
      var columnHeaderWidth = null
      var jsonObject = {
        text: columnHeaderText,
        type: columnHeaderType,
        value: columnHeaderValue,
        align: columnHeaderAlign,
        sortable: columnHeaderSortable,
        class: columnHeaderClass,
        width: columnHeaderWidth
      }
      if (columnDefinition.frontEndVisibility === 'true') { columnHeaders.push(jsonObject) }
    })
    state.metadata.columnHeaders = columnHeaders
  }
}

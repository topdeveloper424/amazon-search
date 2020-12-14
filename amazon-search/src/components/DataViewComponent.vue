<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>

      <b-col sm="4" md="4" class="my-1">
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" offset-md="2" class="my-1">
        <b-pagination
          v-model="tableData.page"
          :total-rows="tableData.docs.length"
          :per-page="tableData.limit"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table v-if="tableData != null"
      show-empty
      small
      stacked="md"
      :items="tableData.docs"
      :fields="fields"
      :current-page="tableData.page"
      :per-page="tableData.limit"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>
      <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>
<style>
td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 1px;
}
</style>
<script>
import { mapGetters } from 'vuex'

  export default {
    name:'Dataview',
    data() {
      return {
        tableData:null,
        fields: [
          { key: 'searchTerm', label: 'Search Term', sortable: true, sortDirection: 'desc' },
          { key: 'rank', label: 'Rank', sortable: true, class: 'text-center' },
          { key: 'asin1', label: 'ASIN #1', sortable: true, sortDirection: 'desc' },
          { key: 'title1', label: 'Title', sortable: true, class: 'text-center' },
          { key: 'share1', label: 'Share', sortable: true, class: 'text-center' },
          { key: 'conv1', label: 'Conv', sortable: true, class: 'text-center' },
          { key: 'asin2', label: 'ASIN #2', sortable: true, sortDirection: 'desc' },
          { key: 'title2', label: 'Title', sortable: true, class: 'text-center' },
          { key: 'share2', label: 'Share', sortable: true, class: 'text-center' },
          { key: 'conv2', label: 'Conv', sortable: true, class: 'text-center' },
          { key: 'asin3', label: 'ASIN #3', sortable: true, sortDirection: 'desc' },
          { key: 'title3', label: 'Title', sortable: true, class: 'text-center' },
          { key: 'share3', label: 'Share', sortable: true, class: 'text-center' },
          { key: 'conv3', label: 'Conv', sortable: true, class: 'text-center' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },
    mounted()  {
      this.getTableData()
    },
    methods: {
      getTableData :async function(){
        let result= await this.$store.getters.getPageData
        this.tableData = result.data
      },
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      }
    }
  }
</script>
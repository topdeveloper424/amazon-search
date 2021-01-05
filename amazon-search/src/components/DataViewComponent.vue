<template>
	<div>
    <vuetable-pagination ref="pagination"
      :css="css.pagination"
      @vuetable-pagination:change-page="onChangePage"
    ></vuetable-pagination>

  <vuetable ref="vuetable"
    :api-url="serverURL+'data/getData?searchTerm='+searchParams.searchTerm+'&contextDate='+searchParams.contextDate+'&targets='+JSON.stringify(searchParams.targets) +'&trends='+JSON.stringify(searchParams.trends)+'&filters='+JSON.stringify(searchParams.filters)"
    :fields="fields"
    :sort-order="sortOrder"
    :css="css.table"
    pagination-path="pagination"
    :per-page="10"
    @vuetable:pagination-data="onPaginationData"
    @vuetable:loading="onLoading"        
    @vuetable:loaded="onLoaded"
  >

    </vuetable>

	</div>
</template>
<style lang="scss">
  .vuetable-body .vuetable-td-title1, .vuetable-body .vuetable-td-title2, .vuetable-body .vuetable-td-title3{
     max-width: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;    
  }
</style>

<script>
import { mapState } from 'vuex'
import Vuetable from "vuetable-2";
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import axios from "axios";
import _ from "lodash";
import {Conf} from './../../config'

export default {
  name:'DataView',
  components: {
    Vuetable,
    VuetablePagination
  },
  computed:{
    status:'',
    ...mapState([
        'searchParams',
    ])

  },
  data() {
    return {
      serverURL:Conf.serverURL,
      fields: [
          { name: 'searchTerm', title: 'Search Term',sortField:'searchTerm', titleClass: 'center aligned' ,width: '15%'},
          { name: 'rank', title: 'Rank', sortField:'Rank', titleClass: 'center aligned',width: '3%'},
          { name: 'asin1', title: 'ASIN #1', sortField:'asin1', titleClass: 'center aligned',width: '5%'},
          { name: 'title1', title: 'Title', sortField:'title1', titleClass: 'center aligned'},
          { name: 'share1', title: 'Share', sortField:'share1', titleClass: 'center aligned',width: '5%'},
          { name: 'conv1', title: 'Conv', sortField:'conv1', titleClass: 'center aligned',width: '5%'},
          { name: 'asin2', title: 'ASIN #2', sortField:'asin2', titleClass: 'center aligned',width: '5%'},
          { name: 'title2', title: 'Title', sortField:'title2', titleClass: 'center aligned'},
          { name: 'share2', title: 'Share', sortField:'share2', titleClass: 'center aligned',width: '5%'},
          { name: 'conv2', title: 'Conv', sortField:'conv2', titleClass: 'center aligned',width: '5%'},
          { name: 'asin3', title: 'ASIN #3', sortField:'asin3', titleClass: 'center aligned',width: '5%'},
          { name: 'title3', title: 'Title', sortField:'title3', titleClass: 'center aligned'},
          { name: 'share3', title: 'Share', sortField:'share3', titleClass: 'center aligned',width: '5%'},
          { name: 'conv3', title: 'Conv', sortField:'conv3', titleClass: 'center aligned',width: '5%'},
          '__slot:actions'
        ],
    sortOrder: [
      { field: 'created_at', direction: 'asc'}
    ],
    css: {
      table: {
        tableClass: 'table table-striped table-bordered table-hovered',
        loadingClass: 'loading',
        ascendingIcon: 'glyphicon glyphicon-chevron-up',
        descendingIcon: 'glyphicon glyphicon-chevron-down',
        handleIcon: 'glyphicon glyphicon-menu-hamburger',
      },
      pagination: {
        infoClass: 'pull-left',
        wrapperClass: 'vuetable-pagination pull-right',
        activeClass: 'btn-primary',
        disabledClass: 'disabled',
        pageClass: 'btn btn-border',
        linkClass: 'btn btn-border',
        icons: {
          first: '',
          prev: '',
          next: '',
          last: '',
        },
      }
    }        
    };
  },
 methods: {
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    editRow(rowData){
      alert("You clicked edit on"+ JSON.stringify(rowData))
    },
    deleteRow(rowData){
      alert("You clicked delete on"+ JSON.stringify(rowData))
    },
    onLoading() {
      console.log('loading... show your spinner here')
    },
    onLoaded() {
      console.log('loaded! .. hide your spinner here')
    }
  }
};
</script>

<style>
.vuetable-pagination{
  float: right;
}
.vuetable {
  font-size: 12px;
}
.orange.glyphicon {
  color: orange;
}

th.sortable {
  color: #ec971f;
}

</style>

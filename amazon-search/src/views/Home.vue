<template>
  <div class="home mt-3">
    <h1>Amazon search</h1>
    <b-row class="mt-4">
      <b-col cols="7">
        <b-row>
          <b-col cols="3" class="text-right">
              <label class="mt-1 mb-sm-0" for="inline-form-input-name">Date Context:</label>
          </b-col>
          <b-col cols="8" class="text-left">
              <b-form-datepicker id="example-datepicker" size="sm" v-model="value" class="mb-2"></b-form-datepicker>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col cols="9" class="text-right">
            <b-input-group class="mb-2" size="sm">
              <b-input-group-prepend is-text >
                <b-icon icon="search" ></b-icon>
              </b-input-group-prepend>
              <b-form-input type="search" placeholder="Search terms"></b-form-input>
            </b-input-group>
          </b-col>
          <b-col cols="3" class="text-left">
              <b-button variant="danger" size="sm" id="searchBtn">Search</b-button>
          </b-col>
        </b-row>

        <save-search-component />

      </b-col>
      <b-col>
        <upload-file-component />
      </b-col>
    </b-row>    
    <b-row class="mt-3">
      <b-col>
        <data-view-component />
      </b-col>
      
    </b-row>

  </div>
</template>
<style lang="scss">
</style>

<script>
import {mapActions} from 'vuex'
import DataViewComponent from '../components/DataViewComponent.vue'
import SaveSearchComponent from '../components/SaveSearchComponent.vue'
import UploadFileComponent from '../components/UploadFileComponent.vue'

export default {
  components: { DataViewComponent, SaveSearchComponent,UploadFileComponent },
  name: 'Home',
  data() {
    return {

    }
  },
  methods: {}
}
</script>

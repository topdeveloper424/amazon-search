<template>
    <div class="save-search">
        <b-row class="mt-3">
          <b-col class="text-right">
              <b-button class="ml-3" variant="primary" size="sm" id="searchBtn">Save Search</b-button>
          </b-col>

        </b-row>

        <b-row>
          <b-col>
            <div class="accordion" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-1 variant="info" size="sm" class="text-left">Targets</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text class="text-left">
                      <b-form-checkbox size="sm"
                            id="checkbox-1"
                            v-model="status"
                            name="checkbox-1"
                            value="accepted"
                            unchecked-value="not_accepted"
                          >
                        Search Terms
                      </b-form-checkbox>                      
                    </b-card-text>
                    <b-card-text class="text-left">
                      <b-form-checkbox size="sm"
                            id="checkbox-2"
                            v-model="status"
                            name="checkbox-2"
                            value="accepted"
                            unchecked-value="not_accepted"
                          >
                        All Titles
                      </b-form-checkbox>                      
                    </b-card-text>
                    <b-card-text class="text-left">
                      <b-form-checkbox size="sm"
                            id="checkbox-2"
                            v-model="status"
                            name="checkbox-2"
                            value="accepted"
                            unchecked-value="not_accepted"
                          >
                        #1 Title
                      </b-form-checkbox>                      
                    </b-card-text>
                    <b-card-text class="text-left">
                      <b-form-checkbox size="sm"
                            id="checkbox-2"
                            v-model="status"
                            name="checkbox-2"
                            value="accepted"
                            unchecked-value="not_accepted"
                          >
                        #ASINs
                      </b-form-checkbox>                      
                    </b-card-text>

                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-2 variant="info" size="sm" class="text-left">Filters</b-button>
                </b-card-header>
                <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text class="text-left">
                      <b-row>
                        <b-col cols="2">
                          <b-form-checkbox size="sm"
                                id="checkbox-4"
                                v-model="status"
                                name="checkbox-4"
                                value="accepted"
                                unchecked-value="not_accepted"
                              >
                            Rank
                          </b-form-checkbox>
                        </b-col>
                        <b-col cols="1">
                          > 
                        </b-col>
                        <b-col cols="2">
                          <b-form-input id="input-small" size="sm" ></b-form-input>
                        </b-col>
                        <b-col cols="1">
                          <
                        </b-col>
                        <b-col cols="2">
                          <b-form-input id="input-small" size="sm" ></b-form-input>
                        </b-col>
                      </b-row>


                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

            </div>

          </b-col>
          
        </b-row>

    </div>
    
</template>

<style lang="scss">
</style>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'SaveSearch',
  data() {
    return {

    }
  },
  methods: {}
}
</script>

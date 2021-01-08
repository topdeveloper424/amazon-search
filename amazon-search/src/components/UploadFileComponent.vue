<template>
  
    <div class="upload-file">
        <p>Data Current to: {{searchParams.contextDate}}</p>
        <p v-if="missingDates.length > 0">Historical Dates missing: <span class="badge badge-secondary mr-2" v-for="missingDate in missingDates" v-bind:key="missingDate.id">{{missingDate}}</span></p>

        <p v-if="lastHistories.length > 0">Last Upload: <span class="badge badge-primary"> {{lastHistories[lastHistories.length - 1]}}</span></p>
        <b-row>
          <b-col>
            <input id="fileUpload" type="file" accept=".xlsx, .xls, .csv" @change="uploadFile" hidden>
            <b-button size="sm" @click="chooseFiles()"><b-icon class="mr-1" icon="cloud-upload" aria-hidden="true" :disabled="value!=0"></b-icon>Upload CSV</b-button>
          </b-col>
        </b-row>
        
        <b-row class="mt-4" v-if="status != ''">
          <b-col cols="3">{{status}}</b-col>
          <b-col cols="6">
            <b-progress :value="value" :max="max" show-progress animated></b-progress>
          </b-col>
          <b-col cols="3"> <b-link :disabled="!cancelSource" @click="cancelUpload">Cancel</b-link></b-col>
        </b-row>
    </div>
</template>

<style lang="scss">
</style>

<script>
import axios from "axios";
import {Conf} from './../../config'
import { mapState } from 'vuex'

export default {
  name: 'UploadFile',
  data() {
    return {
      value: 0,
      max: 100,
      cancelSource: null,
      status:'',

    }
  },
  computed: {
    ...mapState([
        'lastHistories',
        'missingDates',
        'searchParams'
    ])
  },
  // display latest history
  mounted() {
    this.$store.dispatch('storeHistory')
  },  
  methods: {
    chooseFiles: function() {
      this.status = "ready to upload"
      document.getElementById("fileUpload").click()
    },    
    cancelUpload :function(){
      if (this.cancelSource) {
          this.cancelSource.cancel('Start new search, stop active search');
          console.log('cancel request done');
      }      

    },
    onUploadProgress: function(event) {
    const percentCompleted = Math.round((event.loaded * 100) / event.total);
    this.value = percentCompleted;
    console.log('onUploadProgress', percentCompleted);
    },
    uploadFile: function(event){
      this.status = "uploading..."
      this.value = 0
      this.cancelSource = axios.CancelToken.source();
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
      .post(Conf.serverURL+"data/uploadFile", formData, {
          headers: {
                  'Content-Type': 'multipart/form-data'
              },
          onUploadProgress:this.onUploadProgress,
          cancelToken: this.cancelSource.token
        })
      .then(res => {
          console.log(res);
          this.status = "finished"
          setTimeout(() => {
            this.status = "ready to upload"; 
            this.value = 0;
            let date = new Date();
            let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate() +" "+date.getHours() + ":"+date.getMinutes() + ":"+date.getSeconds()
 
            this.$store.dispatch('insertHistory', dateStr)
            }, 2000);
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
}
</script>
<template>
  
    <div class="upload-file">
        <p>Data Current to: November, 22 2020</p>
        <p>Historical Dates missing: Sept 1-7 2020, Sept 15-23 2020, Oct 1-7 2020</p>
        <p>Last Upload: November, 25 2020 3:23PM PST</p>
        <b-row>
          <b-col>
            <input id="fileUpload" type="file" accept=".xlsx, .xls, .csv" @change="uploadFile" hidden>
            <b-button size="sm" @click="chooseFiles()">Upload CSV</b-button>
          </b-col>
        </b-row>
        
        <b-row class="mt-4">
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

export default {
  name: 'UploadFile',
  data() {
    return {
      value: 0,
      max: 100,
      status:"",
      cancelSource: null,

    }
  },
  methods: {
    chooseFiles: function() {
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
      this.cancelSource = axios.CancelToken.source();
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
      .post("http://localhost:8081/api/uploadFile", formData, {
          headers: {
                  'Content-Type': 'multipart/form-data'
              },
          onUploadProgress:this.onUploadProgress,
          cancelToken: this.cancelSource.token
        })
      .then(res => {
          console.log(res);
          this.status = "uploaded"
        })
        .catch(err => {
          console.log(err);
        });


    },
  }
}
</script>
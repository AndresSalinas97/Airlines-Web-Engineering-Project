const vm = new Vue({
    el: '#app',
    data: {
      results:[],
    },
    mounted() {
      axios.get("http://localhost:8080"+window.location.pathname)
      .then(response => {this.results = response.data.data;
	  })
      .catch(error =>{
        console.log(error.response)
      })
      axios.get("https://airports-api.s3-us-west-2.amazonaws.com/iata/"+window.location.pathname.substring(10).toLowerCase()+".json")
		.then(response => {
			this.results.googlemaps = 'http://google.com/maps?q=' + response.data.latitude + ',' + response.data.longitude;
         this.results.timezone = 'UTC' + response.data.utc_offset;
			this.$forceUpdate();
		})
		.catch(error =>{
		console.log(error.response);
		})
   }

});

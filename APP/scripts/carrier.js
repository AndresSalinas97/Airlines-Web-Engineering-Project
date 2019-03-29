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
   }
});

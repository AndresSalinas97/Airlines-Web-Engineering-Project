const vm = new Vue({
    el: '#app',
    data: {
      results:'',
      airport:"ATL",
      airport2:"BOS",
      carrier:"AA"
    },
    mounted() {
       methods.filter();
    },
    methods: {
		"filter":function(event){
			  axios.get("http://localhost:8080/airports/"+ this.airport + "/delaystats?airport="+ this.airport2 +"&carrier=" + this.carrier)
			  .then(response => {
				  this.results = response.data.data
			  })
			  .catch(error =>{
				console.log(error.response)
			  })
		  }
  });
  

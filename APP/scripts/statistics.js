//localhost:8080/rankings/carriers?month=2015-6&based-on=flightsDelayed&per_page=10
const vm = new Vue({
    el: '#app',
    data: {
      results:[],
    },
    mounted() {
      axios.get("http://localhost:8080/rankings/carriers?month=2015-6&based-on=flightsDelayed"+ window.location.search)
      .then(response => {
          this.results = response.data.data
    })
      .catch(error =>{
        console.log(error.response)
      })
    }
  });
  

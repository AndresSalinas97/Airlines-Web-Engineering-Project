const vm = new Vue({
    el: '#app',
    data: {
      results:[],
    },
    mounted() {
      axios.get("http://localhost:8080/airports?page=1&per_page=10")
      .then(response => {this.results = response.data.data})
      .catch(error =>{
        console.log(error.response)
      })
    }
  });
  
//localhost:8080/airports?page=1&per_page=10
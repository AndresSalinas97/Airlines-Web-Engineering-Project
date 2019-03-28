const vm = new Vue({
    el: '#app',
    data: {
      results:[],
    },
    mounted() {
      axios.get("http://localhost:8080/carriers"+window.location.search)
      .then(response => {this.results = response.data.data})
      .catch(error =>{
        console.log(error.response)
      })
    }
  });
  

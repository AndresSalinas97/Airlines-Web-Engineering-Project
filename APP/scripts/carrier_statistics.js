const vm = new Vue({
    el: '#app',
    data: {
      results:'',
      month:'',
      airport:'',
      comment: "add a comment"
    },
    mounted() {
		var str = window.location.pathname.split("/");
      axios.get("http://localhost:8080/"+str[1]+"/"+str[2]+"/statistics/"+str[3]+window.location.search)
      .then(response => {this.results = response.data.data;
	  })
      .catch(error =>{
        console.log(error.response)
      })
    
   },
   methods:{
	   "addorupdate":function(event){
		   axios.get("http://localhost:8080/"+str[1]+"/"+str[2]+"/statistics/"+str[3]+"?month="+this.month+"&airport="+this.airport)
		   .then(response => {if(response.data.data.length == 1){
				   axios.patch("http://localhost:8080/"+str[1]+"/"+str[2]+"/statistics/"+str[3]+"?month="+this.month+"&airport="+this.airport,
				   data, {headers:{"Content-Type":"application/json"}}).then(response=>{location.reload()})
			   }else{
				   axios.post("http://localhost:8080/"+str[1]+"/"+str[2]+"/statistics/"+str[3]+"?month="+this.month+"&airport="+this.airport,
				   data, {headers:{"Content-Type":"application/json"}}).then(response=>{location.reload()})
			   })
		   }
	   }
   }
	   
});

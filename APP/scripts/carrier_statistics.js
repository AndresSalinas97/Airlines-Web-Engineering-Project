const vm = new Vue({
    el: '#app',
    data: {
      results:'',
      ratings:[],
      score: 3,
      author: "",
      comment: "add a comment"
    },
    mounted() {
      axios.get("http://localhost:8080"+window.location.pathname)
      .then(response => {this.results = response.data.data;
	  })
      .catch(error =>{
        console.log(error.response)
      })
      axios.get("http://localhost:8080"+window.location.pathname.substring(0,12)+"/user-ratings")
      .then(response => {this.ratings = response.data.data;
      console.log(this.ratings);

	  })
      .catch(error =>{
        console.log(error.response)
      })
    
   },
   methods:{
	   postcomment: function(event){
		   axios.post("http://localhost:8080"+window.location.pathname.substring(0,12)+"/user-ratings",
		   {author:this.author, comment:this.comment, score:this.score}, {headers:{"Content-Type":"application/json"}});
		   location.reload();
	   }
   }
	   
});

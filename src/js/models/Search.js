import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query
	}

	async getResults() {
		try {

			let res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			console.log(res);
			this.result = res.data.recipes;
		} catch(error) {
			console.log('in the error handler');
			console.log(error);
			alert('Something went worng!!!')
		}
		
	}	
	// getResults('pizza');
}
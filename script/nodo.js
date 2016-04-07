function Nodo(){
	var	proceso;
	var	tiempo;
	var rafaga;
	var ll;
	var es;
	var	sig;
	var recurso;
	var estado;
	var color = randomColor();

	function randomColor() { //function name
			var color = '#'; // hexadecimal starting symbol
			var letters = ['5D576B','8884FF','D7BCE8']; //Set your colors here
			color += letters[Math.floor(Math.random() * letters.length)];
			return color;
	};
} 
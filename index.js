const express = require('express');
const path = require('path');
var request = require('request');
const cheerio = require('cheerio');
const PORT = process.env.PORT || 5000;
express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/proxyPrice/:asin', function(req, res) {
	var url = 'https://www.amazon.com/gp/aw/s/ref=is_box_?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&k='+req.params.asin;	
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);		
			var price = $('font  b').text();
			if (price == null) {
				price = $('font  b').text(); 
			}
			var price = price.split("$");
			price.shift();			
			console.log(price);
			//if (price.length > 1) {
				var  resultado = price[0].replace(/(US\$|\s*|,)/g, '');
				var  resultado = price[0].replace(/(-|\s*|,)/g, '');

				console.log("precio " + resultado);

				resultado = resultado.replace(/\$/g, '');
				resultado = Math.ceil(resultado);
				res.json({precio: resultado, disponible: true});
			// }else{
			// 	res.json({precio: resultado, disponible: true});
			// 	//res.json({precio: null, disponible: false});
			// }
		}else{
			console.log("ERROR AL PROCESRAR EL ITEM "+ req.params.asin);
		}
	})
})
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

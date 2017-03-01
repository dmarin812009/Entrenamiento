var https = require('https')
	, querystring = require('querystring')
	, jwt = require('jsonwebtoken')
	;

module.exports = {
	reset: function (req, res) {

		var post_data = querystring.stringify({
			'grant_type' : 'refresh_token',
			'client_id': '<client_id>',
			'client_secret': '<client_secret>',
			'refresh_token' : req.user.oauthConnections.refreshToken
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);

		  			req.user.oauthConnections = {
		                accessToken: parsed.accessToken,
		                refreshToken: parsed.refreshToken,
		                params: {
		                	'issued_on': parsed.issued_on,
		                	'expires_in': parsed.expires_in,
		                	'token_type': parsed.token_type
		                }
		            };

		            var token = jwt.sign(profile, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '12h' // expires in 2 hours
		            });

		            var user = {
		                displayName : req.user.displayName,
		                email: req.user.emails[0].value,
		                token: token
		            };
		  			
			        res.status(200).json(user);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error getting the information, please try again!!"
	        });
		});

	}
	, getToken: function (req, res) {

		var post_data = querystring.stringify({
			'code' : req.body.code,
			'grant_type': 'authorization_code',
			'client_id': 'app_23191556_1487572054382',
			'client_secret': '633412f6f7fc33322ccbe73f2a847d109ebfe26e886f7d1b5a7f187b8fedb7abd5494a563e58f2d92256931d94120aa4a9249098f16b3f84742ee220706a100cf631c8ef8683fb610e4ffec6adb93021c5ee1fbe78b65cae01c8e53bfce8fc28df15d8257a051f2116861aefe96060e2bad00589610359b0a5b698664745e3',
			'callback_uri' : 'https://connect2017socialapp.mybluemix.net/#/auth/ibm-connections-cloud/callback'
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			
		  			var partido = body.split("&");

		  			req.oauthConnections = {
		                accessToken: partido[0].split("=")[1],
		                refreshToken: partido[1].split("=")[1],
		                params: {
		                	'issued_on': partido[2].split("=")[1],
		                	'expires_in': partido[3].split("=")[1],
		                	'token_type': partido[4].split("=")[1]
		                }
		            };
		            //
		            var token = jwt.sign(req.oauthConnections, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '2h' // expires in 2 hours
		            });

			        res.status(200).json(token);
			        return;
		  		} else {
		  			console.error('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error getting the content, please try again!"
	        });
		});

	}
}
var amqp = require('amqp')
, util = require('util');

var requestHandler = require('./service/requestHandler');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on queue");
	//queue1 	
	cnn.queue('queue1', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue1");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//queue2
	cnn.queue('queue2', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue2");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//queue3
	cnn.queue('rider', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on rider queue");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('driver', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on driver queue");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//queue4
	cnn.queue('queue4', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("got a request on queue4");
			util.log("Message: "+JSON.stringify(message));
			requestHandler.handleRequest(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
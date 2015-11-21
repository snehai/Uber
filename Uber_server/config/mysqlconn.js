var mysql = require('mysql');

var pool = mysql.createPool({
	    connectionLimit : 100,
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'uber',
	    port	 : 3306
});


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,connection){
	 if(err){
		 connection.release(); 
		 return;
	 }
	
	connection.query(sqlQuery, function(err, rows) {
		if(err){
			console.log("ERROR: " + err.message);
			connection.release();
			throw err;
		}
		else 
		{	// return err or result
			connection.release();
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
});
}	

exports.fetchData=fetchData;
const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cons = require('consolidate'),
      dust = require('dustjs-helpers'),
      pg = require('pg'),
    //   cors = require('cors'),
      app = express();

      var config = {
        user: 'admin', //env var: PGUSER
        database: 'recipebookdb', //env var: PGDATABASE
        password: '123456', //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
      };
// app.use(cors());

const pool = new pg.Pool(config);

//DB connection string
// const connect = "postgres://admin:padhrhahunbe@localhost/recipebookdb";

//Assign dust engine to .dust files
app.engine('dust', cons.dust);

//set .dust as default extension
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    pool.connect(function(err, client, done){
        if(err) return console.log('error fetching recipes', err);

        client.query('SELECT * FROM recipes', function(err, result){

            if(err) return console.log('error running query', err);
            res.render('index', {recipes:result.rows});
            done();

        })
    })
})

app.listen(3000, function(){
    console.log('Server started on port 3000');
})
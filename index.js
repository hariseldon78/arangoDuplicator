'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;

module.context.use(router);

// // Basic Hello world route
// router.get('/hello-world', function (req,res){
//     res.send('Hello world!');
// })
//     .response(['text/plain'],  'A generic greeting')
//     .summary('Generic greeting')
//     .description('prints a generic greeting');

// router.get('/hello/:name',function (req,res) {
//     res.send(`hello ${req.pathParams.name}`);
// })
//     .pathParam('name', joi.string().required(), 'name to greet')
//     .response(['text/plain'], 'a personalized greeting')
//     .summary('personalized greeting')
//     .description('prints a personalized greeting');

router.post('/duplicate/collection/:from_name/:to_name',(req,res)=>{
    try{
        const from=db._collection(req.pathParams.from_name);
        const to=db._create(req.pathParams.to_name);
        let count=0;
        const docs=from.all();
        while(docs.hasNext()){
            const d=docs.next();
            to.insert({...d,_id:undefined});
            count++;
        };
        res.send(`${count} elements copied`);
   } catch(e){
        res.send(e.message);
    }
})
    .pathParam('from_name', 'collection to copy from')
    .pathParam('to_name', 'collection to create and copy into')
    .summary('duplicate collection')
    .description('duplicate collection');

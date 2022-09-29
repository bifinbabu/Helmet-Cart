var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.getAllProducts().then((products) =>{
    console.log(products);
    res.render('admin/view-products', {admin:true, products})

  })
  
});

router.get('/add-product', function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product', (req,res) =>{
  

  productHelpers.addProduct(req.body,(insertedId) =>{

    let image = req.files.Image
    const imageName = insertedId
    
    console.log(insertedId);

    image.mv('./public/product-images/'+imageName+'.jpg',(err,done) =>{
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
    
  })
})

module.exports = router;

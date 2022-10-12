var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/view-products', { admin: true, products })

  })

});

router.get('/add-product', function (req, res) {
  res.render('admin/add-product')
})
router.post('/add-product', (req, res) => {


  productHelpers.addProduct(req.body, (insertedId) => {

    let image = req.files.Image
    const imageName = insertedId

    image.mv('./public/product-images/' + imageName + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })

})
router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { product })
})
router.post('/edit-product/:id', (req, res) => {

  var imageName = req.params.id

  if (imageName !="") {  //this if-else is included to fix the issue of clicking submit without image upload
    productHelpers.updateProduct(req.params.id, req.body).then(() => {
      res.redirect('/admin/')   
    })   
    let image = req.files.Image
    var imageName = req.params.id
    image.mv('./public/product-images/' + imageName + '.jpg')

  }else {
    productHelpers.updateProduct(req.params.id, req.body).then(() => {
      res.redirect('/admin/')
    })

  }  
})

module.exports = router;

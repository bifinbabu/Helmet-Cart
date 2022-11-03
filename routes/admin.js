var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')
var adminHelpers = require('../helpers/admin-helpers');


const verifyAdmin = (req, res, next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

router.get('/login', (req,res)=>{
  let admin = req.session.admin
  let adminLoginErr = req.session.adminloginErr
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    res.render('admin/login',{adminLoginErr, admin:true})
    req.session.adminLoggedIn = false
  }
})

router.post('/login', (req, res)=>{
  adminHelpers.adminDoLogin(req.body).then((response)=>{
    console.log(req.body);
    console.log(response);
    if(response == true){
      req.session.adminLoggedIn = true;
      res.redirect('/admin')
    }else if (response == false){
      req.session.adminloginErr = "Username or password is incorrect"
      res.redirect('/admin/login')
    }
  }).catch((response)=>{
      console.log(response);
  })
})

router.get('/logout',(req,res) =>{
  req.session.admin = null
  req.session.adminLoggedIn = false
  res.redirect('/')
})

/* GET users listing. */
router.get('/', function (req, res, next) {

  if(req.session.adminLoggedIn){
    productHelpers.getAllProducts().then((products) => {
      res.render('admin/view-products', {admin: true, products});
    })
  }else{
    res.redirect('/admin/login')
  }

});

//Add product for admin 
router.get('/add-product', verifyAdmin, function (req, res) {
  res.render('admin/add-product', { admin: true })
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

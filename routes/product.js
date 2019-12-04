const _ = require('lodash');
const mongoose = require('mongoose');
const { Product , validate,validateProductimgUrl,validateUpadetProductSpefication,validateUpadetProductData,validateProductForUpdate,validateProductEnabled} = require('../models/product');
const  {User} =  require('../models/user'); 
const { Category} =  require('../models/category');
const { SubCategory} =  require('../models/subcategory');
const { Brand} =  require('../models/brand');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
     //1) check brand exist or not
    const brand = await Brand.findOne({ _id : req.body.brandId }).select('id name');
    if(!brand) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'BrandId is not valid.' });
   //1) check category exist or not
    const category = await Category.findOne({ _id : req.body.categoryId }).select('id name');
    if(!category) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'CategoryId is not valid.' });
  //1) check subcategory exist or not
    const subcategory = await SubCategory.findOne({ _id : req.body.subcategoryId }).select('id name');
    if(!subcategory) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'subcategoryId is not valid.' });
  //2) Check this category is exist under brand.
     let product = await Product.findOne({ subcategoryId : subcategory.id, name : req.body.name }).select('name');
     if(product) return res.status(409).send({ statusCode : 409, error : 'Conflict' , message : 'product already exits in this Category.'});

    product = new Product(_.pick(req.body, [ 'name', 'imgUrl', 'description','colors','price','specifications','dealerPrice','quantity']));
    //product.specifications = req.body.specifications;
    product.subcategoryId = subcategory.id;
    product.subcategoryName = subcategory.name;
    product.categoryId=category.id,
    product.categoryName=category.name,
    product.brandId=brand.id,
    product.brandName=brand.name
    product.createdBy = req.user._id;
    product = await product.save();
    return res.status(200).send({ statusCode : 200,message : 'SubCategory Successfuly added.', data : product });
});
router.post('/setImageProduct', auth, async (req, res) => {
  const { error } = validateProductimgUrl(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  const productId =req.body.productId;
  //const imgurl =req.body.imgUrl;
   if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid productId.'}); 
  let product = await Product.findOne({ _id : productId });
  if(!product) return res.status(404).send({ statusCode : 404, error : 'Bad Request' , message : 'product not found' });;
  if(product.imgUrl || product.imgUrl.length > 0){
    product.imgUrl.push(req.body.imgUrl);
  }else{
    // create new array of string 
    var array = [String];
     product.imgUrl = array
  }
  product = await product.save();
  return res.status(200).send({ statusCode : 200,message : 'ImageUrl Successfuly added.' });
});


router.get('/getAllProducts', auth, async (req, res) => {
  let product = await Product.find().sort('name');
  if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Products not found.' }); //Not Found
  return res.status(200).send(product);

});
//get products By categoryId
router.get('/getSubCategoriesAndProductsByCategoryId', auth, async (req, res) => {
    const categoryId=req.query.categoryId;
    if(!categoryId || categoryId.length == 0)return res.status(400).send({ statusCode : 400, error : 'Bad request' , message : 'please provide categoryId.' });
    const subCategory = await SubCategory.find({categoryId:categoryId}).select(['_id','name','imgUrl']).sort('name').skip(10*(0)).limit(10);
    if(!subCategory || subCategory.length == 0) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'subCategory not found.' }); 
    let productdData=[];
   // data = subCategory;
    for(var i = 0; i<subCategory.length;i++){
        var object = {};
        const products = await Product.find({subcategoryId:subCategory[i]._id}).select(['_id','name','imgUrl','description','isCustomizable','colors','price','quantity','specifications']).sort('name').skip(10*(0)).limit(100);
        object.subCategory = subCategory[i];
        object.products = products;
        productdData.push(object);        
    }
    return res.status(200).send({ statusCode : 200,message : 'SubCategory Successfuly added.', 'productData' : productdData });

});
 
 //get products by productId
 router.get('/getProductsByProductId', auth, async (req, res) => {
  let product =  await Product.findOne({ _id : req.query.productId }).select(['_id','name','imgUrl','subcategoryName','isCustomizable','colors','price','quantity','specifications']).sort('name');
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Products not found.' }); //Not Found
  return res.status(200).send(product);

});
router.patch('/updateProductEntireSpecificationsById', auth, async (req, res) => {
     const { error } = validateUpadetProductSpefication(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let product = await Product.findOne({_id:req.body.productId});
    if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Product not found please provide brandId.' });
    if(req.body.specifications && req.body.specifications.length > 0 ) product.specifications = req.body.specifications;
    product.updatedBy = req.user._id;
    product = await product.save();
    return res.status(200).send(product);
});
router.patch('/updateProductKeyAndValueById', auth, async (req, res) => {
    const { error } = validateUpadetProductData(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
    let product = await Product.findOne({'specifications.data._id':req.body.keyId});
     if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Product not found please provide productId.'});
    var found = false;
    if(product.specifications.length > 0){
        for(var i = 0; i < product.specifications.length; i++){
            for(var j  =0 ; j< product.specifications[i].data.length;j++){
                if( product.specifications[i].data[j]._id.toString() == req.body.keyId ){
                found = true;
              if(req.body.key && req.body.key.length > 0 )product.specifications[i].data[j].key = req.body.key;
              if(req.body.value && req.body.value.length > 0)product.specifications[i].data[j].value = req.body.value;
              product.updatedBy = req.user._id;
               break;
            } 

            }
        }
    }
    if(!found) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'invalid product id.' }); 
    product=await product.save();
    return res.status(200).json({statusCode: 200, statusMessage: "product Successfully Updated!",data:product});

});
router.patch('/updateProductByProductId', auth, async (req, res) => {
  const { error } = validateProductForUpdate(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let product = await Product.findOne({_id:req.body.productId});
   if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Product not found please provide productId.'});
  
          
      if(req.body.colors) product.colors= req.body.colors;
      if(req.body.name && req.body.name.length > 0 )product.name = req.body.name;
      if(req.body.description && req.body.description.length > 0 )product.description = req.body.description;
      if(req.body.imgUrl && req.body.imgUrl.length > 0 )product.imgUrl= req.body.imgUrl;
      if(req.body.price)product.price = req.body.price;
      if(req.body.dealerPrice)product.dealerPrice = req.body.dealerPrice;
      if(req.body.quantity)product.quantity = req.body.quantity;
      if(req.body.isCustomizable)product.isCustomizable = req.body.isCustomizable;
      if(req.body.subcategoryId)product.subcategoryId = req.body.subcategoryId;
      if(req.body.categoryId)product.categoryId = req.body.categoryId;
      if(req.body.brandId)product.brandId = req.body.brandId;
       product=await product.save();
       return res.status(200).json({statusCode: 200, statusMessage: "product Successfully Updated!",data:product});

});

router.patch('/enabledProductById', auth, async (req, res) => {
  const { error } = validateProductEnabled(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let product = await Product.findOne({_id:req.body.productId});
  if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'User not found please provide ProductId.' });
  product.enabled=req.body.enabled;
  product.updatedBy = req.user._id;
  product = await product.save();
  return res.status(200).send(product);
});
router.delete('/deleteProductByProductId', auth, async (req, res) => {
  productId = req.query.productId;
  if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid ProductId.'});
  let product =  await Product.findByIdAndDelete({ _id :productId });
  if(!product) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Product not found.' }); //Not Found
  return res.status(200).send({statusCode : 200,message : 'Product Successfuly delete.' });

});


module.exports = router;
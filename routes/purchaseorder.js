const _ = require('lodash');
const { Product } = require('../models/product');
const {UserAddress} = require('../models/useraddress');
const {  PurchaseOrder, validate} = require('../models/purchaseorder');
const { validateSeatCover } = require('../models/seatcover');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    const userAddress = await UserAddress.findOne({ _id : req.body.deliveryAddress }).select('id name dealerId dealerName pincode buildingName area city state landmark');
    if(!userAddress) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'userAddress is not valid.' }); 

    let purchaseOrder = new PurchaseOrder();
    purchaseOrder.dealer = req.user; 
    purchaseOrder.dealer.password = 'xxxxxxxxxxx';
    purchaseOrder.deliveryAddress=userAddress;
    purchaseOrder.productColorCombinationId=req.body.productColorCombinationId  ;
    purchaseOrder.createdBy = req.user._id;

    const products = req.body.products;
    let finalProducts = [];

    for(var i = 0; i < products.length; i++ ){
        let productObject = {};
        const product = await Product.findOne({ _id : products[i].productId});

        if(!product)  return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : ' product id ' + products[i].productId + ' is not valid.' }); 
        // check iscustomizable if yes then check category  chekc data 
        productObject.product = product;
        productObject.quantity = products[i].quantity;
        productObject.majorColor = products[i].majorColor;
        productObject.minorColor = products[i].minorColor;
        if(product.isCustomizable){
            // check data for seatcover
            const { error } = validateSeatCover(products[i].data); 
            if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });  
            productObject.data = products[i].data;
        }
        finalProducts.push(productObject);
    }

    purchaseOrder.products = finalProducts;

 purchaseOrder = await purchaseOrder.save(); 
 const product = await Product.findOne({ _id : purchaseOrder.products.productId}).select('quantity');
// if(!product) return res.status(404).send({ statusCode : 409, error : 'Not Found.' , message : 'Product not found.' });
  purchaseOrder.products.product.quantity -= purchaseOrder.products[i].quantity;
    return res.status(200).send({ statusCode : 200,message : 'oredr placed Successfuly .', data : purchaseOrder});
});

router.get('/getPurchaseOrderById', auth, async (req, res) => {
  let purchaseOrder =  await PurchaseOrder.findOne({ purchaseOrderId : req.query.id });
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'PurchaseOrder not found.' }); //Not Found
  return res.status(200).send(purchaseOrder);

});
module.exports = router;
const _ = require('lodash');
const mongoose = require('mongoose');
const { Product } = require('../models/product');
const {UserAddress} = require('../models/useraddress');
const {  PurchaseOrder, validate,validatePurchaseOrderforUpdateStatus} = require('../models/purchaseorder');
const { validateSeatCover } = require('../models/seatcover');
const {User} = require('../models/user')
const auth = require('../middleware/auth');
const status = require('../constants/constantsorderstatus');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });

    const userAddress = await UserAddress.findOne({ _id : req.body.deliveryAddress }).select('id name dealerId dealerName pincode buildingName area city state landmark');
    if(!userAddress) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'userAddress is not valid.' }); 
    const user = await User.findOne({ _id : req.body.userId });
    if(!user) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'userId is not valid.' }); 

    let purchaseOrder = new PurchaseOrder();
    purchaseOrder.dealer = req.user; 
    purchaseOrder.dealer.password = 'xxxxxxxxxxx';
    purchaseOrder.deliveryAddress=userAddress;
    purchaseOrder.userId = user
   
    purchaseOrder.productColorCombinationId=req.body.productColorCombinationId;
    purchaseOrder.createdBy = req.user._id;

    const products = req.body.products;
    let finalProducts = [];

    for(var i = 0; i < products.length; i++ ){
        let productObject = {};
        let product = await Product.findOne({ _id : products[i].productId});

        if(!product)  return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : ' product id ' + products[i].productId + ' is not valid.' }); 
        // check iscustomizable if yes then check category  chekc data 
        let orderNumber = await PurchaseOrder.find().sort('-orderId').limit(1);
        if(!orderNumber || orderNumber.length == 0) {
          purchaseOrder.orderId = 1;
        }else {
          purchaseOrder.orderId = orderNumber[0].orderId + 1;
        }   
        productObject.product = product;
        //productObject.status =status.ORDER_STATUS_PENDING;
        productObject.quantity = products[i].quantity;
        productObject.majorColor = products[i].majorColor;
        productObject.minorColor = products[i].minorColor;
        productObject.orderId = purchaseOrder.orderId;
       
        if(product.isCustomizable){
            // check data for seatcover
            const  { error } = validateSeatCover(products[i].data); 
            if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });  
            productObject.data = products[i].data;
        }
        finalProducts.push(productObject);

    }

    purchaseOrder.products = finalProducts;
    purchaseOrder.status = status.ORDER_STATUS_PENDING;

 purchaseOrder = await purchaseOrder.save(); 


  //product = await Product.findOne({ _id : purchaseOrder.products.productId}).select('quantity');
// if(!product) return res.status(404).send({ statusCode : 409, error : 'Not Found.' , message : 'Product not found.' });
  //purchaseOrder.products.product.quantity -= purchaseOrder.products[i].quantity;
    return res.status(200).send({ statusCode : 200,message : 'oredr placed Successfuly .', data : purchaseOrder});
});

router.get('/getPurchaseOrderById', auth, async (req, res) => {
  let purchaseOrder =  await PurchaseOrder.findOne({ purchaseOrderId : req.query.id }).populate('products.product');
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'PurchaseOrder not found.' }); //Not Found
  return res.status(200).send(purchaseOrder);

});
router.get('/getPurchaseOrderByUserId', auth, async (req, res) => {
  let purchaseOrder =  await PurchaseOrder.find({ userId : req.query.userId }).populate('products.product')
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'PurchaseOrder not found.' }); //Not Found
  return res.status(200).send(purchaseOrder);
});

router.get('/getAllPurchaseOrder', auth, async (req, res) => {
  let purchaseOrder =  await PurchaseOrder.find({}).select(['_id','status','orderId']).populate('userId');
  //let category = await Category.find().select(['_id','name','imgUrl']).sort('name');
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'PurchaseOrder not found.' }); //Not Found
  return res.status(200).send(purchaseOrder);

});

router.patch('/updatePurchaseOrderById', auth, async (req, res) => {
  const { error } = validatePurchaseOrderforUpdateStatus(req.body); 
  if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
  let purchaseOrder = await PurchaseOrder.findOne({ _id : req.body.purchaseOrderId});
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'PurchaseOrder not found please provide purchaseOrderId.' });
  if(req.body.status && req.body.status.length > 0 ) purchaseOrder.status = req.body.status;
  purchaseOrder.updatedBy = req.user._id;
  purchaseOrder = await purchaseOrder.save();
  return res.status(200).send(purchaseOrder);
});

router.delete('/deletePurchaseorderByPurchaseOrderId', auth, async (req, res) => {
  purchaseOrderId = req.query.purchaseOrderId;
  if(!mongoose.Types.ObjectId.isValid(purchaseOrderId)) return res.status(400).send({statusCode:400,error:'Bad Request',message:'Please provide valid PurchaseOrderId.'});
  let purchaseOrder =  await PurchaseOrder.findByIdAndDelete({ _id :purchaseOrderId });
  if(!purchaseOrder) return res.status(404).send({ statusCode : 404, error : 'Not Found' , message : 'Brand not found.' }); //Not Found
  return res.status(200).send({statusCode : 200,message : 'Order Successfuly delete.' });

});
module.exports = router;
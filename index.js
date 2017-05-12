var express=require('express');
var app=express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.listen(process.env.PORT||3000,function(){
  console.log("connect success!!!");
});
var mongoose=require('mongoose');
mongoose.connect('mongodb://heroku_94r0pdz9:pm7mv9um6dio4a99vbr821684o@ds163340.mlab.com:63340/heroku_94r0pdz9');


var bankSchema=new mongoose.Schema({
    soTK:{
      type:String,
      required:true,
      unique:true
    },
    maPIN:{
      type:Number,
      required:true
    },
    soDU:{
      type:Number,
      require:true,
      min:100000
    }
});
var bank=mongoose.model('bankDB',bankSchema);
app.get('/',function(req,res){
  // res.json({user:'huy',pass:'xe'});
  res.send('thanhcong');
})
app.post('/tratien',function(req,res){
  var request = {
    soTK: req.body.soTK,
    soTien: req.body.soTien
  }
  bank.findOneAndUpdate({soTK:123456789},{$inc:{soDU:-request.soTien}},function(err,data){
    if(err){
      res.send('1')
    }
  })
  bank.findOneAndUpdate({soTK:request.soTK},{$inc:{soDU:request.soTien}},function(err,data){
    if(err){
      res.send('1');
    }
  });
  res.send('0');
})
app.post('/api',function(req,res){

  var request = {
    soTK: req.body.soTK,
    maPIN: req.body.maPIN,
    soTien: req.body.soTien
  }
  console.log(request);
  // console.log("huy",req.body.maPIN);
  bank.findOne({
    soTK:request.soTK
  },function(err,taikhoan){
    if(taikhoan){
      if(request.maPIN!=taikhoan.maPIN){
        res.send('1')
      } else if(request.soTien>(taikhoan.soDU+100000)){
        res.send('2');
      } else{
        taikhoan.soDU=taikhoan.soDU-request.soTien;
        taikhoan.save(function(err){
          if(err){
            res.send('-1');
          }
          bank.findOneAndUpdate({soTK:123456789},{$inc:{soDU:request.soTien}},function(err,data){
            console.log('thanhcong');
          });
          res.send('0');
        })
      }
    } else{
      res.send('3');
    }
  })
});

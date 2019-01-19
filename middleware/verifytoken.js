const jwt=require('jsonwebtoken');


module.exports=(req, res, next)=>{
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    if (token){// Token varsa anlamı taşıyor.
        //Token varsa onu verify etmemiz gerekiyor.
        jwt.verify(token, req.app.get('api_secret_key'),(err, decoded)=>{
            if(err){
                res.status(403).json({status:false, message:"Failed to authenticate token."});
        }else{
            req.decode=decoded;
            console.log("Decoded verisi:");      
            console.log(decoded);
            
            next();
        }

        });
    }else{// Token bulunamazsa 403 status kodu ile forbidden mesajı göndereceğiz. 
        res.status(403).json({status:false, message:"Forbidden"});
    }
};
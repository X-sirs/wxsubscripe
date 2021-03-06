const request = require('superagent');
const jsonfile = require('jsonfile');
const sha1 = require('sha1');
const apiconfig = require('./apiconfig');
let config = require('./config.js');
function sign(ticket, url, noncestr, timestamp) {
    let string = [
        `noncestr=${noncestr}`,
        `jsapi_ticket=${ticket}`,
        `timestamp=${timestamp}`,
        `url=http://hip.free.ngrok.cc${url}`
    ];
    console.log(sha1(string.sort().join("&")));
    return sha1(string.sort().join("&"));
}
module.exports=(req,res,next)=>{
    let url = req.url;
    let access_token = jsonfile.readFileSync('./token.json');
    let ticket;
    try{
        ticket = jsonfile.readFileSync('./ticket.json');
    }catch(err){
        ticket = null;
    };
    if(!ticket||Date.now()+900*1000>ticket.ticket_end_time){
        request.get(apiconfig.jsapi_ticket).query({
            access_token:access_token.access_token
        }).end((err,data)=>{
            let token = data.body;
            if(token.errmsg=="ok"){
                token.ticket_end_time = Date.now()+token.expires_in*1000;
                jsonfile.writeFileSync('./ticket.json',data.body,{spaces:4});
                res.locals.noncestr = Math.random().toString(36).substr(2);
                res.locals.timestamp = new Date().getTime();
                res.locals.signature = sign(token.ticket, url, res.locals.noncestr, res.locals.timestamp);
                res.locals.ticket=token.ticket;
                next();
            }else{
                res.send("获取sdk票据失败");
            }
        })
    }else{
        res.locals.noncestr = Math.random().toString(36).substr(2);
        res.locals.timestamp = new Date().getTime();
        res.locals.signature = sign(ticket.ticket, url, res.locals.noncestr, res.locals.timestamp);
        res.locals.ticket = ticket.ticket;
        next();
    }
}

var sqlBase  = require('./sqlBase');


exports.getBusinessIdByMember = function(member,callback)
{
        var query = "SELECT business_id FROM members WHERE member_id='"+member+"'";

        sqlBase.getSingleRecord(query, callback);
}

exports.getProductName = function(product_name,callback)
{
        var query = "SELECT product_name FROM products";

        sqlBase.getStaticData(query, callback);
}
var sqlBase  = require('./sqlBase');

// Any command is saved into global history for later troubleshooting etc.
exports.historyRecord = function(event, callback)
{
        var query = "INSERT INTO history (full) VALUES ('"+event.text+"')";

        sqlBase.getStaticData(query, callback);
}

// This shall inform customer about available products on the market.
exports.getProductNames = function(callback)
{
        var query = "SELECT product_name FROM products";

        sqlBase.getStaticData(query, callback);
}

// First we have to confirm, that order type exists. It can be BUY and SELL from the start, but more order types can be added.
exports.confirmCommand = function(data, callback)
{
        var query = "SELECT * FROM order_types WHERE type='" + data.command + "'";

        sqlBase.getSingleRecord(query, callback);
}

// Then we have to confirm, that product is really available.
exports.confirmProductAvailable = function(data, callback)
{
        var query = "SELECT * FROM products WHERE product_name='" + data.product + "'";

        sqlBase.getSingleRecord(query, callback);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getAskPrices = function(data, callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='SELL' ORDER BY price ASC";

        sqlBase.getStaticData(query, callback);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getBidPrices = function(data, callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='BUY' ORDER BY price ASC";

        sqlBase.getStaticData(query, callback);
}

// Correctly defined order shall be added into right place in the database table.
exports.insertOrder = function(data, callback)
{
        var query = "INSERT INTO orderbook (order_type, product_name, price) VALUES ('" + data.command + "','" + data.product + "', " + data.price + ")";
        //console.log(query);
        sqlBase.getStaticData(query, callback);
}

// After order successfully added, we have to check, if there are not so many orders, defined by variable market_depth (this is defined per product).
exports.countOrders = function(data, callback)
{
        var query = "SELECT COUNT(*) FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "'";

        sqlBase.getSingleRecord(query, callback);
}

// If there are too many orders on buy side, it will delete lowest price order in the book.
exports.deleteLowestBid = function(data, callback)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price ASC LIMIT 1";
        console.log(query);
        sqlBase.getStaticData(query, callback);
}

// If there are too many orders on sell side, it will delete highest price in the book.
exports.deleteHighestAsk = function(data, callback)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price DESC LIMIT 1";
        //console.log(query);
        sqlBase.getSingleRecord(query, callback);
}
// This is actually match making. If this succeeds, it will inform user about successful trade!
exports.deleteMatchedOrders = function(data, callback)
{
        var query = "delete from microexchange.orderbook where order_id in ( select order_id from ( (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='SELL' limit 1) union (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='BUY' limit 1) )  as t1 )";
        //var query = "SELECT * from orderbook";
        sqlBase.getStaticData(query, callback);
}
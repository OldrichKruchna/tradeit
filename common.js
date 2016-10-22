
exports.parseInputOrder = function(str) {
        var data = str.toUpperCase().split(' ');

        if(data.length > 3)
        {
            console.log('Too many of arguments!');
            return {command: '', product: '', price: 0 };
        }
        return  {
            command: data[0],
            product: data[1],
            price: data[2]
        }
}

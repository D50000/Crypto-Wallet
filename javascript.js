//CryptoArray set. elements:{value:10, name:'rose1'}
let CoinMarketCap = new Array();
//User CyptoCurrencies Amount of array.
let myWallet = [
    {Coin:'BTC', amount:0.4626},
    {Coin:'ETH', amount:6.5314},
    {Coin:'BCH', amount:4.0394},
    {Coin:'ADA', amount:25000},
    {Coin:'BTG', amount:40.4320}
];

function balance(json){
    CoinMarketCap = [
        {value:temp[0].price * myWallet[0].amount, name:'BTC'},
        {value:temp[1].price * myWallet[1].amount, name:'ETH'},
        {value:temp[2].price * myWallet[2].amount, name:'BCH'},
        {value:temp[3].price * myWallet[3].amount, name:'ADA'},
        {value:temp[4].price * myWallet[4].amount, name:'BTG'}
    ];
}


// Create a request variable and assign a new XMLHttpRequest object to it. It's same as  jQuery $.ajax .
let request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.coinmarketcap.com/v2/ticker/', true);

request.onload = function () {
    // Response prototype will be object.
    let apiResult = JSON.parse(this.response);

    if (request.status == 200) {
        // apiResult.forEach(crypto => {
        //     console.log(`${crypto.name} , ${crypto.symbol}`);     
        // });
        console.log(`${apiResult.data[1].symbol} , ${apiResult.data[1].quotes.USD.price} USD`);     
        console.log(`${apiResult.data[1027].symbol} , ${apiResult.data[1027].quotes.USD.price} USD`); 
        console.log(`${apiResult.data[1831].symbol} , ${apiResult.data[1831].quotes.USD.price} USD`); 
        console.log(`${apiResult.data[2010].symbol} , ${apiResult.data[2010].quotes.USD.price} USD`);
        console.log(`${apiResult.data[2083].symbol} , ${apiResult.data[2083].quotes.USD.price} USD`); 
        temp = [
            {price:apiResult.data[1].quotes.USD.price, coin:apiResult.data[1].symbol},
            {price:apiResult.data[1027].quotes.USD.price, coin:apiResult.data[1027].symbol},
            {price:apiResult.data[1831].quotes.USD.price, coin:apiResult.data[1831].symbol},
            {price:apiResult.data[2010].quotes.USD.price, coin:apiResult.data[2010].symbol},
            {price:apiResult.data[2083].quotes.USD.price, coin:apiResult.data[2083].symbol}
        ];
        balance(temp);
    } else {
        console.log(`Something Wrong, error code: ${request.status}.`);
    }
};

// Send request
request.send();

// Initial Echarts
let myChart = echarts.init(document.getElementById('main'));
// Configuration the Echarts status.
let option = {
    title : {
        text: 'Crypto Wallet',
        subtext: '----------------',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        x : 'center',
        y : 'bottom',
        data:['BTC','ETH','BCH','ADA','BTG']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true,
                type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'Area Mode',
            type:'pie',
            radius : [20, 110],
            center : ['30%', '50%'],
            roseType : 'area',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:[
                {value:10, name:'BTC'},
                {value:5, name:'ETH'},
                {value:15, name:'BCH'},
                {value:25, name:'ADA'},
                {value:40, name:'BTG'}
            ]
        }
    ]
};
option.series[0].data = CoinMarketCap;
//Insert the option to the Echarts.
myChart.setOption(option);

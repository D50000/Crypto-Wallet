//CryptoArray set. elements:{value:10, name:'rose1'}
let CoinMarketCap = new Array();
let CoinMarketCapCryptoList = new Array();
//User CyptoCurrencies Amount of array.
const myWallet = [
    { Coin: 'BTC', amount: 0.4626 },
    { Coin: 'ETH', amount: 6.5314 },
    { Coin: 'BCH', amount: 4.0394 },
    { Coin: 'ADA', amount: 24533 },
    { Coin: 'BTG', amount: 40.4320 }
];
// sum balance
let asset = 0;

function balance(json) {
    CoinMarketCap = [
        { value: json[0].price * myWallet[0].amount, name: json[0].coin },
        { value: json[1].price * myWallet[1].amount, name: json[1].coin },
        { value: json[2].price * myWallet[2].amount, name: json[2].coin },
        { value: json[3].price * myWallet[3].amount, name: json[3].coin },
        { value: json[4].price * myWallet[4].amount, name: json[4].coin }
    ];

    CoinMarketCap.forEach(element => {
        asset += element.value;
    });
}

function drawChart() {
    // Initial Echarts
    let myChart = echarts.init(document.getElementById('main'));
    // Configuration the Echarts status.
    let option = {
        title: {
            text: 'Crypto Wallet',
            subtext: '----------------',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['BTC', 'ETH', 'BCH', 'ADA', 'BTG']
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        series: [
            {
                name: 'Balance',
                type: 'pie',
                radius: [20, 110],
                center: ['30%', '50%'],
                roseType: 'area',
                label: {
                    normal: {
                        show: true
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
                data: [
                    { value: 10, name: 'BTC' },
                    { value: 5, name: 'ETH' },
                    { value: 15, name: 'BCH' },
                    { value: 25, name: 'ADA' },
                    { value: 40, name: 'BTG' }
                ]
            }
        ]
    };
    option.series[0].data = CoinMarketCap;
    //Insert the option to the Echarts.
    myChart.setOption(option);
    const dashboard = document.getElementById('dashBoard');
    // dashboard.textContent = `${asset} USD`;
}

// Create a request variable and assign a new XMLHttpRequest object to it. It's same as  jQuery $.ajax .
let request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.coinmarketcap.com/v2/ticker/', true);
// Send request
request.send();
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
            { price: apiResult.data[1].quotes.USD.price, coin: apiResult.data[1].symbol },
            { price: apiResult.data[1027].quotes.USD.price, coin: apiResult.data[1027].symbol },
            { price: apiResult.data[1831].quotes.USD.price, coin: apiResult.data[1831].symbol },
            { price: apiResult.data[2010].quotes.USD.price, coin: apiResult.data[2010].symbol },
            { price: apiResult.data[2083].quotes.USD.price, coin: apiResult.data[2083].symbol }
        ];

        balance(temp);
        drawChart();
    } else {
        console.log(`Something Wrong, error code: ${request.status}.`);
    }
};

function myCrytoCheck() {
    let input = document.getElementById("crytoCheck");
    let filter = input.value.toUpperCase();
    let ul = document.getElementById("myUL");
    let li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "block";
        } else {
            li[i].style.display = "none";
        }
    }
}


const listingsPromise = fetch('https://api.coinmarketcap.com/v2/listings/');
listingsPromise.then(result => result.json())
    .then(result => {
        CoinMarketCapCryptoList = result.data;
        console.log(CoinMarketCapCryptoList);
        createSearchList(CoinMarketCapCryptoList);
    })
    .catch((err) => {
        console.error(err);
    })

function createSearchList(arrayData) {
    arrayData.map(coin => {
        let li_node = document.createElement("li");
        let a_node = document.createElement("a");
        let textnode = document.createTextNode(`${coin.name} (${coin.symbol})`);
        a_node.setAttribute('href', "#");
        a_node.appendChild(textnode);
        li_node.appendChild(a_node);
        // li_node.appendChild(a_node.appendChild(textnode));
        document.getElementById("myUL").appendChild(li_node);
    });
}

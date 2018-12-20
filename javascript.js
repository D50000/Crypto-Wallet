//List for coin informations
let CoinMarketCapCryptoList = new Array();
//User CyptoCurrencies Amount of array.
let myCryptoWallet = new Array();
//Data for Draw the Chart
let drawData = new Array();


function drawChart() {
    // Initial Echarts
    let myChart = echarts.init(document.getElementById('main'));
    // Configuration the Echarts status.
    let option = {
        title: {
            text: 'Crypto Wallet',
            subtext: '---------------------------',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom'
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
                data: drawData
            }
        ]
    };
    //Insert the option to the Echarts.
    myChart.setOption(option);

    const dashboard = document.getElementById('dashBoard');
    // dashboard.textContent = `${asset} USD`;
}

//find cryto bar
function myCrytoCheck() {
    let input = document.getElementById("crytoCheck");
    let filter = input.value.toUpperCase();
    let ul = document.getElementById("myUL");
    let li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        if (a.textContent.toUpperCase().indexOf(filter) > -1) {
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
    
function toggleCheckbox(coinId, coinSymbol, e) {
    if(document.getElementById(`checkbox_${coinId}`).checked == true){
        // console.log(e);
        document.getElementById(`crytoVolume_${coinId}`).classList.remove("crytoVolume");
    }else{
        document.getElementById(`crytoVolume_${coinId}`).classList.add("crytoVolume");
    }
}

function createSearchList(arrayData) {
    arrayData.map(coin => {
        let li_node = document.createElement("li");
        let a_node = document.createElement("a");
        // a_node.setAttribute('href', "#");
        let checkbox_node = document.createElement("input");
        checkbox_node.setAttribute("type", "checkbox");
        checkbox_node.setAttribute("id", `checkbox_${coin.id}`);
        let textnode = document.createTextNode(`${coin.name} (${coin.symbol})`);
        let inputbox_node = document.createElement("input");
        inputbox_node.setAttribute("type", "text");
        inputbox_node.setAttribute("id", `crytoVolume_${coin.id}`);
        inputbox_node.setAttribute("class", "crytoVolume");
        inputbox_node.setAttribute("placeholder", `Input ${coin.symbol} volume ...`);
        a_node.appendChild(checkbox_node)
        a_node.appendChild(textnode);
        a_node.appendChild(inputbox_node);
        li_node.appendChild(a_node);
        document.getElementById("myUL").appendChild(li_node);
        document.getElementById(`checkbox_${coin.id}`).addEventListener("click", function(e) {
            toggleCheckbox(coin.id, coin.symbol, e);
        });
    });
}

function saveToCache(){
    myCryptoWallet = [];
    for (let i = 0; i < CoinMarketCapCryptoList.length; i++) {
        let coin;
        document.getElementById("crytoVolume_" + CoinMarketCapCryptoList[i].id).value == "" ? coin = null : coin = parseFloat(document.getElementById("crytoVolume_" + CoinMarketCapCryptoList[i].id).value);
        if(coin !== 0 && coin !== null && coin !== NaN){
            //console.log(coin);
            CoinMarketCapCryptoList[i].volume = coin;
            myCryptoWallet.push(CoinMarketCapCryptoList[i]);
        }
    }
    localStorage.myCryptoWallet = JSON.stringify(myCryptoWallet);
    getDrawData();
}

function getDrawData(){
    const detialCryptoList = fetch('https://api.coinmarketcap.com/v2/ticker/');
    detialCryptoList.then(result => result.json())
        .then(result => {
            drawData = [];
            for(let i=0;i<myCryptoWallet.length;i++){
                let temp = new Object;
                let key = (myCryptoWallet[i].id);
                temp.value = myCryptoWallet[i].volume;
                // temp.price = result.data[key].quotes.USD.price;
                temp.name = result.data[key].symbol;
                drawData.push(temp);
            }
            console.log(drawData);
            drawChart();
        })
        .catch((err) => {
            console.error(err);
        })
}

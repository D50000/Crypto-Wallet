//List for coin informations
let CoinMarketCapCryptoList = new Array();
//User CyptoCurrencies Amount of array.
let myCryptoWallet = new Array();
//Data for Draw the Chart
let drawData = new Array();
let drawData2 = new Array();

function loadData(){
    if(localStorage.length === 0)return;
    drawData = JSON.parse(localStorage.drawData);
    drawData2 = JSON.parse(localStorage.drawData2);
    if(drawData.length === 0 || drawData2.length === 0)return;
    drawChart();
}

function drawChart() {
    // Initial Echarts
    let myChart = echarts.init(document.getElementById('main'));
    // Configuration the Echarts status.
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
        },
        series: [
            {
                name:'Volume',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
    
                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: drawData
            },
            {
                name:'Balance',
                type:'pie',
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data: drawData2
            }
        ]
    };
    //Insert the option to the Echarts.
    myChart.setOption(option);
    const dashboard = document.getElementsByClassName('sumUSD')[0];
    let balance = 0;
    for(let i=0;i<drawData.length;i++){
        balance += (drawData[i].value * drawData2[i].value);
    }
    dashboard.textContent = `$${balance}`;
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
        document.getElementById(`crytoVolume_${coinId}`).value="";
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
    getDrawData();
}

function deleteCache(){
    localStorage.drawData = undefined;
    localStorage.drawData2 = undefined;
}

function getDrawData(){
    const detialCryptoList = fetch('https://api.coinmarketcap.com/v2/ticker/');
    detialCryptoList.then(result => result.json())
        .then(result => {
            drawData = [];
            drawData2 = [];
            for(let i=0;i<myCryptoWallet.length;i++){
                let temp = new Object;
                let temp2 = new Object;
                let key = (myCryptoWallet[i].id);
                temp.value = myCryptoWallet[i].volume;
                temp.name = result.data[key].symbol;
                drawData.push(temp);
                temp2.value = myCryptoWallet[i].volume * result.data[key].quotes.USD.price;
                temp2.name = result.data[key].symbol;
                drawData2.push(temp2);
            }
            localStorage.drawData = JSON.stringify(drawData);
            localStorage.drawData2 = JSON.stringify(drawData2);
            drawChart();
        })
        .catch((err) => {
            console.error(err);
        })
}

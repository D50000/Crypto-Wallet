//List for coin informations
let CoinMarketCapCryptoList = new Object();
//User CyptoCurrencies Amount of array.
let myCryptoWallet = new Array();
//Data for Draw the Chart
let drawData = new Array();
let drawData2 = new Array();

function loadData(){
    //return when no storage data.
    if(localStorage.length === 0)return;
    myCryptoWallet = JSON.parse(localStorage.myCryptoWallet);
    getDrawData();
    // inputDataToList(myCryptoWallet);
}

function refresh(){
    loadData();
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
        balance += drawData2[i].value;
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

//Run when loading the web.
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const headers = new Headers();
headers.append('X-CMC_PRO_API_KEY', '388d93f1-9176-44f3-85b1-1fbb42e875ca');
headers.append('Accept', 'application/json');

const listingsPromise = fetch(url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
        headers
    });
listingsPromise.then(result => result.json())
    .then(result => {
        CoinMarketCapCryptoList = result.data;
        console.log(CoinMarketCapCryptoList);
        createSearchList(CoinMarketCapCryptoList);
        if(myCryptoWallet !== "" || myCryptoWallet !== null){
            inputDataToList(myCryptoWallet);
        }
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

function createSearchList(objectData) {
    Object.entries(objectData).forEach((entry) => {
        let li_node = document.createElement("li");
        let a_node = document.createElement("a");
        // a_node.setAttribute('href', "#");
        let checkbox_node = document.createElement("input");
        checkbox_node.setAttribute("type", "checkbox");
        checkbox_node.setAttribute("id", `checkbox_${entry[0]}`);
        let textnode = document.createTextNode(`${entry[1].name} (${entry[1].symbol})`);
        let inputbox_node = document.createElement("input");
        inputbox_node.setAttribute("type", "text");
        inputbox_node.setAttribute("id", `crytoVolume_${entry[0]}`);
        inputbox_node.setAttribute("class", "crytoVolume");
        inputbox_node.setAttribute("placeholder", `Input ${entry[1].symbol} volume ...`);
        a_node.appendChild(checkbox_node)
        a_node.appendChild(textnode);
        a_node.appendChild(inputbox_node);
        li_node.appendChild(a_node);
        document.getElementById("myUL").appendChild(li_node);
        document.getElementById(`checkbox_${entry[0]}`).addEventListener("click", function(e) {
            toggleCheckbox(entry[0], entry[1].symbol, e);
        });
    });
}

function saveToCache(){
    myCryptoWallet = [];
    Object.entries(CoinMarketCapCryptoList).forEach((entry) => {
        let coin;
        document.getElementById("crytoVolume_" + entry[0]).value == "" ? coin = null : coin = parseFloat(document.getElementById("crytoVolume_" + entry[0]).value);
        if(coin !== 0 && coin !== null && coin !== NaN){
            //console.log(coin);
            let obj = new Object;
            obj.id = entry[0];
            obj.name = entry[1].name;
            obj.symbol = entry[1].symbol;
            obj.website_slug = entry[1].website_slug;
            obj.volume = coin;
            myCryptoWallet.push(obj);
        }
    });
    
    getDrawData();
}

function deleteCache(){
    localStorage.myCryptoWallet = undefined;
    for(let i=0;i<myCryptoWallet.length;i++){
        document.getElementById(`checkbox_${myCryptoWallet[i].id}`).checked = false;
        document.getElementById(`crytoVolume_${myCryptoWallet[i].id}`).classList.add("crytoVolume");
        document.getElementById(`crytoVolume_${myCryptoWallet[i].id}`).value = '';
    }
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
            localStorage.myCryptoWallet = JSON.stringify(myCryptoWallet);
            drawChart();
        })
        .catch((err) => {
            console.error(err);
        })
}

function inputDataToList(myCryptoWallet){
    for(let i=0;i<myCryptoWallet.length;i++){
        document.getElementById(`checkbox_${myCryptoWallet[i].id}`).checked = true;
        document.getElementById(`crytoVolume_${myCryptoWallet[i].id}`).classList.remove("crytoVolume");
        document.getElementById(`crytoVolume_${myCryptoWallet[i].id}`).value = myCryptoWallet[i].volume;
    }
}

var config = {
                CWBAPI:{
                    Key: "YOUR_CWAAPI_KEY",
                    Endpoint: "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/{codeOfCountry}?Authorization={API_KEY}&format=JSON&elementName={dataType}"
                },
                LineNotify:{
                    Token: "{YOUR_LINE_NOTIFY_TOKEN}",
                    Endpoint: "https://notify-api.line.me/api/notify"
                },
                ListToNotify: [ {country: "新竹市", location: "東區"}, {country: "新竹市", location: "北區"}  ]
};


var mappingCountry2Code = {
    "基隆市": "F-D0047-049",
    "臺北市": "F-D0047-061",
    "新北市": "F-D0047-069",
    "桃園市": "F-D0047-005",
    "新竹縣": "F-D0047-009",
    "新竹市": "F-D0047-053",
    "苗栗縣": "F-D0047-013",
    "臺中市": "F-D0047-073",
    "彰化縣": "F-D0047-017",
    "南投縣": "F-D0047-021",
    "雲林縣": "F-D0047-025",
    "嘉義縣": "F-D0047-029",
    "嘉義市": "F-D0047-057",
    "臺南市": "F-D0047-077",
    "高雄市": "F-D0047-065",
    "屏東縣": "F-D0047-033",
    "宜蘭縣": "F-D0047-001",
    "花蓮縣": "F-D0047-041",
    "臺東縣": "F-D0047-037",
    "澎湖縣": "F-D0047-045",
    "金門縣": "F-D0047-085",
    "連江縣": "F-D0047-081"
};

var countryLocation = {
    "基隆市": ["中正區","七堵區","暖暖區","仁愛區","中山區","安樂區","信義區"],
    "臺北市": ["松山區","信義區","大安區","中山區","中正區","大同區","萬華區","文山區","南港區","內湖區","士林區","北投區"],
    "新北市": ["板橋區","三重區","中和區","永和區","新莊區","新店區","樹林區","鶯歌區","三峽區","淡水區","汐止區","瑞芳區","土城區","蘆洲區","五股區","泰山區","林口區","深坑區","石碇區","坪林區","三芝區","石門區","八里區","平溪區","雙溪區","貢寮區","金山區","萬里區","烏來區"],
    "桃園市": ["桃園區","中壢區","大溪區","楊梅區","蘆竹區","大園區","龜山區","八德區","龍潭區","平鎮區","新屋區","觀音區","復興區"],
    "新竹縣": ["竹北市","竹東鎮","新埔鎮","關西鎮","湖口鄉","新豐鄉","芎林鄉","橫山鄉","北埔鄉","寶山鄉","峨眉鄉","尖石鄉","五峰鄉"],
    "新竹市": ["東區","北區","香山區"],
    "苗栗縣": ["苗栗市","苑裡鎮","通霄鎮","竹南鎮","頭份市","後龍鎮","卓蘭鎮","大湖鄉","公館鄉","銅鑼鄉","南庄鄉","頭屋鄉","三義鄉","西湖鄉","造橋鄉","三灣鄉","獅潭鄉","泰安鄉"],
    "臺中市": ["中區","東區","南區","西區","北區","西屯區","南屯區","北屯區","豐原區","東勢區","大甲區","清水區","沙鹿區","梧棲區","后里區","神岡區","潭子區","大雅區","新社區","石岡區","外埔區","大安區","烏日區","大肚區","龍井區","霧峰區","太平區","大里區","和平區"],
    "彰化縣": ["彰化市","鹿港鎮","和美鎮","線西鄉","伸港鄉","福興鄉","秀水鄉","花壇鄉","芬園鄉","員林市","溪湖鎮","田中鎮","大村鄉","埔鹽鄉","埔心鄉","永靖鄉","社頭鄉","二水鄉","北斗鎮","二林鎮","田尾鄉","埤頭鄉","芳苑鄉","大城鄉","竹塘鄉","溪州鄉"],
    "南投縣": ["南投市","埔里鎮","草屯鎮","竹山鎮","集集鎮","名間鄉","鹿谷鄉","中寮鄉","魚池鄉","國姓鄉","水里鄉","信義鄉","仁愛鄉"],
    "雲林縣": ["斗六市","斗南鎮","虎尾鎮","西螺鎮","土庫鎮","北港鎮","古坑鄉","大埤鄉","莿桐鄉","林內鄉","二崙鄉","崙背鄉","麥寮鄉","東勢鄉","褒忠鄉","臺西鄉","元長鄉","四湖鄉","口湖鄉","水林鄉"],
    "嘉義縣": ["太保市","朴子市","布袋鎮","大林鎮","民雄鄉","溪口鄉","新港鄉","六腳鄉","東石鄉","義竹鄉","鹿草鄉","水上鄉","中埔鄉","竹崎鄉","梅山鄉","番路鄉","大埔鄉","阿里山鄉"],
    "嘉義市": ["東區","西區"],
    "臺南市": ["新營區","鹽水區","白河區","柳營區","後壁區","東山區","麻豆區","下營區","六甲區","官田區","大內區","佳里區","學甲區","西港區","七股區","將軍區","北門區","新化區","善化區","新市區","安定區","山上區","玉井區","楠西區","南化區","左鎮區","仁德區","歸仁區","關廟區","龍崎區","永康區","東區","南區","北區","安南區","安平區","中西區"],
    "高雄市": ["鹽埕區","鼓山區","左營區","楠梓區","三民區","新興區","前金區","苓雅區","前鎮區","旗津區","小港區","鳳山區","林園區","大寮區","大樹區","大社區","仁武區","鳥松區","岡山區","橋頭區","燕巢區","田寮區","阿蓮區","路竹區","湖內區","茄萣區","永安區","彌陀區","梓官區","旗山區","美濃區","六龜區","甲仙區","杉林區","內門區","茂林區","桃源區","那瑪夏區"],
    "屏東縣": ["屏東市","潮州鎮","東港鎮","恆春鎮","萬丹鄉","長治鄉","麟洛鄉","九如鄉","里港鄉","鹽埔鄉","高樹鄉","萬巒鄉","內埔鄉","竹田鄉","新埤鄉","枋寮鄉","新園鄉","崁頂鄉","林邊鄉","南州鄉","佳冬鄉","琉球鄉","車城鄉","滿州鄉","枋山鄉","三地門鄉","霧臺鄉","瑪家鄉","泰武鄉","來義鄉","春日鄉","獅子鄉","牡丹鄉"],
    "宜蘭縣": ["宜蘭市","羅東鎮","蘇澳鎮","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","冬山鄉","五結鄉","三星鄉","大同鄉","南澳鄉"],
    "花蓮縣": ["花蓮市","鳳林鎮","玉里鎮","新城鄉","吉安鄉","壽豐鄉","光復鄉","豐濱鄉","瑞穗鄉","富里鄉","秀林鄉","萬榮鄉","卓溪鄉"],
    "臺東縣": ["臺東市","成功鎮","關山鎮","卑南鄉","鹿野鄉","池上鄉","東河鄉","長濱鄉","太麻里鄉","大武鄉","綠島鄉","海端鄉","延平鄉","金峰鄉","達仁鄉","蘭嶼鄉"],
    "澎湖縣": ["馬公市","湖西鄉","白沙鄉","西嶼鄉","望安鄉","七美鄉"],
    "金門縣": ["金城鎮","金沙鎮","金湖鎮","金寧鄉","烈嶼鄉","烏坵鄉"],
    "連江縣": ["南竿鄉","北竿鄉","莒光鄉","東引鄉"]
};

function getLocationInfo(country, location){

    var returnJSON = {
                        countryCode: null,
                        indexInCountry: -1
    };

    var index = countryLocation[country].indexOf(location);

    returnJSON.indexInCountry   = index;
    returnJSON.countryCode      = mappingCountry2Code[country];

    return returnJSON;

}

function getWeatherData(dataType, country, location) {

    var locationInfo = getLocationInfo(country, location);

    var indexLocation = locationInfo.indexInCountry;

    var codeOfCountry = locationInfo.countryCode;

    var url = config.CWBAPI.Endpoint
                    .replace("{API_KEY}", config.CWBAPI.Key)
                    .replace("{dataType}", dataType)
                    .replace("{codeOfCountry}", codeOfCountry);

    var res = UrlFetchApp.fetch(url);

    var resJSON = JSON.parse(res);

    var data = resJSON.cwbopendata.dataset.locations.location[indexLocation].weatherElement;

    var returnStr = "";

    switch(dataType) {

        case 'PoP6h':

            for(var i = 0; i < 3; i++){

                var pop6h = data[3]['time'][i]['elementValue']['value'];
                var pop6hTime = Utilities.formatDate(new Date(Date.parse(data[3]['time'][i]['startTime'])), "GMT+8", "MM-dd  HH:mm");

                returnStr += "["+ pop6hTime+ "]：" + pop6h + "%\n";

            }

            break;

        case 'T':
        default:

            for(var i = 1; i < 7; i++){

                var temperature = data[0]['time'][i]['elementValue']['value'];
                var temperatureTime = Utilities.formatDate(new Date(Date.parse(data[0]['time'][i]['dataTime'])), "GMT+8", "MM-dd  HH:mm");

                returnStr += "["+ temperatureTime+ "]：" + temperature + "°\n";

            }

            break;
    }

    return returnStr;

}

function getWeather() {

    for(i in config.ListToNotify){

        var country     = config.ListToNotify[i].country;
        var location    = config.ListToNotify[i].location;

        var tempArea = getWeatherData('T', country, location);

        var rainArea = getWeatherData('PoP6h', country, location);

        var msg = "\n{country}{location}\n未來18小時天氣預報\n〈氣溫〉\n{tempArea}\n\n〈降雨機率〉\n{rainArea}\n"
                    .replace("{country}", country)
                    .replace("{location}", location)
                    .replace("{tempArea}", tempArea)
                    .replace("{rainArea}", rainArea);

        UrlFetchApp.fetch(config.LineNotify.Endpoint, {
            headers: { Authorization: 'Bearer ' + config.LineNotify.Token },
            method: 'post',
            payload: {
                'message' : msg
            }
        });

    }

}
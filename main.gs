var config = JSON.parse(HtmlService.createTemplateFromFile('config.json').getRawContent());


var env = JSON.parse(HtmlService.createTemplateFromFile('env.json').getRawContent());
var mappingCountry2Code = JSON.parse(HtmlService.createTemplateFromFile('mappingCountry2Code.json').getRawContent());
var countryLocation = JSON.parse(HtmlService.createTemplateFromFile('countryLocation.json').getRawContent());


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

    var url = env.CWBAPI.Endpoint
                    .replace("{API_KEY}", env.CWBAPI.Key)
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

function notifyWeather() {

    for(i in config.toNotify){

        var country     = config.toNotify[i].country;
        var location    = config.toNotify[i].location;

        var tempArea = getWeatherData('T', country, location);

        var rainArea = getWeatherData('PoP6h', country, location);

        var msg = "\n{country}{location}\n未來18小時天氣預報\n〈氣溫〉\n{tempArea}\n\n〈降雨機率〉\n{rainArea}\n"
                    .replace("{country}", country)
                    .replace("{location}", location)
                    .replace("{tempArea}", tempArea)
                    .replace("{rainArea}", rainArea);

        UrlFetchApp.fetch(env.LineNotify.Endpoint, {
            headers: { Authorization: 'Bearer ' + env.LineNotify.Token },
            method: 'post',
            payload: {
                'message' : msg
            }
        });

    }

}
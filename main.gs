var API_KEY = "YOUR_CWB_API_KEY";
var LINE_NOTIFY_TOKEN = "YOUR_LINE_NOTIFY_TOKEN";
var urlAPI = "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/{codeOfCountry}?Authorization={API_KEY}&format=JSON".replace("{API_KEY}", API_KEY);
var mappingCountry = {};

for(var i = 1; i < 93; i+=4){

  var keyCurrentCountry = 'F-D0047-'+ String("00" + i).slice(-3);
  
  var url     = urlAPI.replace("{codeOfCountry}", keyCurrentCountry);
  var res     = UrlFetchApp.fetch(url);
  var resJSON = JSON.parse(res);
  var data    = resJSON['cwbopendata']['dataset']['locations'];
  
  mappingCountry[keyCurrentCountry] = {};
  mappingCountry[keyCurrentCountry]['name'] = data['locationsName'];
  mappingCountry[keyCurrentCountry]['location'] = [];
  
  for(var k = 0; k < data['location'].length; k++){
    
    mappingCountry[keyCurrentCountry]['location'].push(data['location'][k]['locationName']);
  
  }

}

function getWeatherData(dataType, codeOfCountry, indexOfLocation) {

  var url           = (urlAPI+"&elementName={dataType}").replace("{dataType}", dataType).replace("{codeOfCountry}", codeOfCountry);
  var res           = UrlFetchApp.fetch(url);
  var resJSON       = JSON.parse(res);
  var data          = resJSON['cwbopendata']['dataset']['locations']['location'][indexOfLocation]['weatherElement'];
  var locationName  = resJSON['cwbopendata']['dataset']['locations']['location'][indexOfLocation]['locationName'];
  var returnData    = [];
  
  switch(dataType) {
  
    case 'PoP6h':
      for(var i = 0; i < 3; i++){
        
        var pop6h = data[3]['time'][i]['elementValue']['value'];
        var pop6hTime = Utilities.formatDate(new Date(Date.parse(data[3]['time'][i]['startTime'])), "GMT+8", "MM-dd  HH:mm");
        
        returnData.push({time: pop6hTime, pop6h: pop6h});
        
      }
      break;
      
    case 'T':
    
      for(var i = 1; i < 7; i++){
    
        var temperature = data[0]['time'][i]['elementValue']['value'];
        var temperatureTime = Utilities.formatDate(new Date(Date.parse(data[0]['time'][i]['dataTime'])), "GMT+8", "MM-dd  HH:mm");
        
        returnData.push({time: temperatureTime, temperature: temperature});
        
      }
      break;

    default:

      break;
  }
  
  return returnData;
}

function getWeather() {

  var listToNotify = [];
  var msg = "";

  listToNotify.push( {codeOfCountry: "F-D0047-005", indexOfLocation: 0} );
  listToNotify.push( {codeOfCountry: "F-D0047-053", indexOfLocation: 0} );
  
  for(index in listToNotify){
  
    var codeOfCountry   = listToNotify[index]['codeOfCountry'];
    var indexOfLocation = listToNotify[index]['indexOfLocation'];

    msg += "\n{locatiosName}{locatioName}\n未來18小時天氣預報\n";
    msg = msg.replace("{locatiosName}", mappingCountry[codeOfCountry]['name']);
    msg = msg.replace("{locatioName}", mappingCountry[codeOfCountry]['location'][indexOfLocation]);
  
    var dataTemperature = getWeatherData('T', codeOfCountry, indexOfLocation);
    msg += "〈氣溫〉\n";
   
    for(var i = 0; i < 6; i++){
    
      var temperature     = dataTemperature[i]['temperature'];
      var temperatureTime = dataTemperature[i]['time'];
  
      msg += "["+ temperatureTime+ "]：" + temperature + "°\n";
  
    }
    
    var dataPoP6h = getWeatherData('PoP6h', codeOfCountry, indexOfLocation);
    msg += "〈降雨機率〉\n";
    
    for(var i = 0; i < 3; i++){
    
      var pop6h     = dataPoP6h[i]['pop6h'];
      var pop6hTime = dataPoP6h[i]['time'];
  
      msg += "["+ pop6hTime+ "]：" + pop6h + "%\n";
  
    }
  
  }
  
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
        'headers': {
          'Authorization': 'Bearer ' + LINE_NOTIFY_TOKEN,
        },
        'method': 'post',
        'payload': {
          'message': msg
        }
    });

}

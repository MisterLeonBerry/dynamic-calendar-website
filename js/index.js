//uwaga: jeśli strona nie pobiera żadnych wydarzeń z serwera lub daje ostrzeżenie o ich braku, zmień poniższą wartość serverError na true, aby zobaczyć przykładowe wydarzenia


$(document).ready(function(){
  
var serverError = false;  
  //disable map scrolling and zooming until the map is clicked on
 $('.map-container')
	.click(function(){
		$(this).find('iframe').addClass('clicked')})
	.mouseleave(function(){
  $(this).find('iframe').removeClass('clicked')});

 //draw current month and 5 next ones into html, add events and modals
  function drawMonths() {
    var monthsList = []; //a list of these 6 months
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var monthName = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]; 
    var monthNameRoman = ["I","II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    if (serverError === true) {month = 0;};
 
  //a loop to push the correct months into the array and draw proper calendar
  for (var i = 0; i < 6; i++)
    {
      //temp var for looping the months
      var mi = month + i;
      //looping the months and making sure the year is correct
      if (mi >= 12) {mi = mi - 12; year = today.getFullYear() + 1};
      
      //fill the months list array, can modify this to contain month and year
      monthsList.push(mi); //actually push the months here
      $("#months-list").append('<div class="month" id="' + mi + '"><div class="month-circle">' + monthNameRoman[mi] + '.' + year + '</div> <H2>' + monthName[mi] + '</h2><ul><li class="row placeholder"><div class="col-md-1 event-date"></div><div class="col-md-9 event-desc"><i>Brak wydarzeń</i></div><div class="col-md-1"></div></li></ul></div>');
      //style next year's months
     $(".month:contains(" + (today.getFullYear()+1) + ")").addClass("month-next-year");
    }
  

//this function takes in a json array and processes its data into calendar events
function jsonEvents(x) {
  // catch all null values that brake things
   for (var i = 0; i < x.length; i++) {
    $.each(x[i], function( index, value ) {
      if (x[i][index] == null) {x[i][index] = "..."; return x[i][index] };
      });
   }
   
   //crossmatch the months for json events
   monthsList.forEach(function(entry) {
 
     for (var i = 0; i < x.length; i++) {
     var start = x[i].start;
     var end = x[i].end;
     start = new Date(Date.parse(start));
     end = new Date(Date.parse(end));  
      
     //if match found, append event and modal into month  //maybe modify this to check month AND year, in case api delivers more than 12 months
     if (start.getMonth() === entry) {
        
       //prepare modal
       var title = x[i].name;
       var content =  x[i].city + ", " +  x[i].country + "<br>" + 'Od <i>' + start.toLocaleDateString() + "</i> do <i>"  + end.toLocaleDateString() + "</i><br>" + x[i].description.slice(0, 300).concat("...") + "<br>" + "<a href='" + x[i].link + "' target='_blank'>Czytaj więcej</a>";
       var modal = '<div class="modal fade" id="modal' + x[i].id + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body">' +  content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Zamknij</button></div></div></div> </div>';
       
        //remove placeholder
        $("#"+entry).find("ul li.placeholder").remove();
      
       //append event and modal into month
       $("#"+entry).find("ul").append('<li class="row event"><div class="col-md-1 event-date">' + start.getDate() + '-' + end.getDate() + '.' + monthNameRoman[start.getMonth()] + '</div><div class="col-md-9 event-desc">' + x[i].name + '</div><a href="#" id="id:' + x[i].id + '" data-toggle="modal" data-target="#modal' + x[i].id + '"><button class="col-md-1 see-btn">zobacz</button></a>' + modal + '</li>');
       } 
   }
      
  });
}
    
 //try to get events data and update calendar
 $.getJSON("http://info.studyinpoland.pl/admin/public/api/events?callback=?", function(json){
   jsonEvents(json);   
 }).fail(function(jqXHR, textStatus, errorThrown) {   if (serverError === false) {$(".event-desc").html("Uwaga: nie udało się pobrać aktualnych danych z serwera.")};
   console.log('getJSON request failed! ' + textStatus + " " + errorThrown); if (serverError === true) {jsonEvents(sample)};})
.always(function() { console.log('getJSON request ended!'); });
};
  
drawMonths();
  
  


  
}); //doc ready
    
  //sample json data if server api fails
    var sample = [{
	"id": 2,
	"name": "M\u0142odzie\u017c ze wschodniej Ukrainy zainteresowana studiami w Polsce",
	"country": "Ukraina",
	"city": "Chark\u00f3w",
	"link": "http:\/\/www.studyinpoland.pl\/konsorcjum\/index.php?option=com_content&view=article&id=9387:charkow-modziez-ze-wschodniej-ukrainy-zainteresowana-studiami-w-polsce&catid=235:127-newsletter-2016&Itemid=100143",
	"description": "<p>&bdquo;Study in Poland&rdquo; po raz pierwszy wzi\u0119\u0142o udzia\u0142 w targach \"Po\u0142tawski abiturient. Studia za granic\u0105\". Zosta\u0142y one zorganizowane w Bibliotece im. Kotlarewskiego w dniach 14-15 listopada 2016 w Po\u0142tawie. Po\u0142tawa, le\u017c\u0105ca 300 km na wsch&oacute;d od Kijowa, to prawie 300. tysi\u0119czne miasto i rozwini\u0119ty o\u015brodek o\u015bwiatowy. W mie\u015bcie dzia\u0142a 12 uczelni wy\u017cszych trzeciego i czwartego poziom&oacute;w akredytacji oraz 52 plac&oacute;wki og&oacute;lnokszta\u0142c\u0105ce.<\/p>\r\n<p>Podczas targ&oacute;w m\u0142odzi Ukrai\u0144cy interesowali si\u0119 studiami w Polsce, bior\u0105c nie tylko pod uwag\u0119 szeroki program kszta\u0142cenia, ale tak\u017ce wci\u0105\u017c niskie op\u0142aty za studia w por&oacute;wnaniu z innymi krajami. Stoisko &bdquo;Study in Poland&rdquo; oraz prezentacje oferty polskich uczelni pozwoli\u0142y im uzyska\u0107 szereg niezb\u0119dnych informacji na tematy kierunk&oacute;w, zasad przyjmowania na studia, otrzymania wiz, a tak\u017ce \u017cycia studenckiego w naszym kraju. Ich du\u017ce zainteresowanie szko\u0142ami wy\u017cszymi w Polsce \u015bwiadczy, \u017ce m\u0142odzie\u017c z Ukrainy wci\u0105\u017c powa\u017cnie my\u015bli o kszta\u0142ceniu si\u0119 w naszym kraju. To dobry znak dla polskich szk&oacute;\u0142 wy\u017cszych, dla kt&oacute;rych kwestia umi\u0119dzynarodowienia jest niezwykle istotna.<\/p>\r\n<p>W Po\u0142tawie w ramach &bdquo;Study in Poland&rdquo; udzia\u0142 wzi\u0119li przedstawiciele nast\u0119puj\u0105cych uczelni: Akademii G&oacute;rniczo-Hutniczej im. Stanis\u0142awa Staszica w Krakowie, Politechniki Cz\u0119stochowskej, Politechniki Lubelskiej, Politechniki Opolskiej, Politechniki Warszawskiej, Polsko-Japo\u0144skiej Akademii Nauk Technik Komputerowych, Szko\u0142y G\u0142&oacute;wnej Gospodarstwa Wiejskiego, Uniwersytetu Marii Curie-Sk\u0142odowskiej w Lublinie, Uniwersytetu w Bia\u0142ymstoku, Wy\u017cszej Szko\u0142y Bankowej i Collegium Civitas.<\/p>",
	"start": "2017-01-12 00:00:00",
	"end": "2017-01-13 00:00:00",
	"start_registration": "2016-11-27 00:00:00",
	"publication": 1,
	"featured": 1,
	"deleted_at": null,
	"created_at": "2016-12-14 12:01:34",
	"updated_at": "2017-01-10 14:01:52"
},
  {
	"id": 3,
	"name": "\u201eStudy in Poland\u201d po raz pierwszy w Po\u0142tawie",
	"country": "Ukraina",
	"city": "Po\u0142tawa",
	"link": "http:\/\/www.studyinpoland.pl\/konsorcjum\/index.php?option=com_content&view=article&id=9388:poltawa-study-in-poland-po-raz-pierwszy-w-poltawie&catid=235:127-newsletter-2016&Itemid=100143",
	"description": "",
	"start": "2017-02-08 00:00:00",
	"end": "2017-02-09 00:00:00",
	"start_registration": "2016-12-14 00:00:00",
	"publication": 1,
	"featured": 1,
	"deleted_at": null,
	"created_at": "2016-12-14 12:03:27",
	"updated_at": "2017-01-10 14:02:21"
}, {
	"id": 4,
	"name": " Zapraszamy na targi \"Obrazovanije i kariera\" w Mi\u0144sku - 16-18 lutego 2017",
	"country": "Bia\u0142oru\u015b",
	"city": "Mi\u0144sk",
	"link": "http:\/\/www.studyinpoland.pl\/konsorcjum\/index.php?option=com_content&view=article&id=9241:biaorus-zapraszamy-na-targi-obrazovanije-i-kariera-w-minsku-16-18-lutego-2017&catid=235:127-newsletter-2016&Itemid=100143",
	"description": "<p>W ubieg\u0142ym roku akademickim na polskich uczelniach studiowa\u0142o 4615 Bia\u0142orusin&oacute;w (w poprzednim roku by\u0142o ich 4118), co stanowi 8% og&oacute;lnej liczby student&oacute;w zagranicznych w Polsce. (dane z raport&oacute;w &bdquo;Studenci Zagraniczni w Polsce 2015&rdquo; oraz &bdquo;Studenci Zagraniczni w Polsce 2016&rdquo;).<\/p>\r\n<p>Po raz drugi Mi\u0119dzynarodowe Targi Edukacyjne &bdquo;Obrazowanie i Kariera&rdquo; odb\u0119d\u0105 si\u0119 w Narodowym Pa\u0142acu Sportu (wcze\u015bniej by\u0142y one organizowane w innej plac&oacute;wce) pod adresem:<\/p>\r\n<p>Republican Palace of Sport, 4 Pobediteley av., Minsk, Belarus<\/p>\r\n<p>W 2016 roku w targach w Mi\u0144sku wzi\u0119\u0142o udzia\u0142 blisko 100 wystawc&oacute;w z Bia\u0142orusi, Estonii, Francji, \u0141otwy, Litwy, Polski, Rosji, Turcji, Zjednoczonych Emirat&oacute;w Arabskich i Wielkiej Brytanii. Odwiedzi\u0142o je ok. 25 000 uczni&oacute;w, student&oacute;w i absolwent&oacute;w.<\/p>\r\n<p>Ze wzgl\u0119du na konieczno\u015b\u0107 uzyskania bia\u0142oruskiej wizy przez obywateli Polski, zwracamy si\u0119 do zainteresowanych uczelni z uprzejm\u0105 pro\u015bb\u0105 o przesy\u0142anie zg\u0142osze\u0144 <strong>do 17 stycznia 2017 roku<\/strong>.<\/p>",
	"start": "2017-02-16 00:00:00",
	"end": "2017-02-17 00:00:00",
	"start_registration": "2016-12-31 00:00:00",
	"publication": 1,
	"featured": 1,
	"deleted_at": null,
	"created_at": "2016-12-14 13:21:01",
	"updated_at": "2016-12-14 13:22:29"
}];

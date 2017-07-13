$(document).ready(function () {

$( function() {
               var dateFormat = "yy-mm-dd",
                 from = $( "#from" )
                   .datepicker({
                     defaultDate: "+1w",
                     changeMonth: true,
                     numberOfMonths: 3
                   })
                   .on( "change", function() {
                     to.datepicker( "option", "minDate", getDate( this ) );
                   }),
                 to = $( "#to" ).datepicker({
                   defaultDate: "+1w",
                   changeMonth: true,
                   numberOfMonths: 3
                 })
                 .on( "change", function() {
                   from.datepicker( "option", "maxDate", getDate( this ) );
                 });

               function getDate( element ) {
                 var date;
                 try {
                   date = $.datepicker.parseDate( dateFormat, element.value );
                 } catch( error ) {
                   date = null;
                 }

                 return date;
               }
             } );


     var tweetCount=0;
     var regexp = /\B\#\w\w+\b/g;


     //  TWEET COUNT..........
     $(".header-items__right__list--button1").click(function () {
     $('.body-div__left').empty();
     tweetCount =$(".header-items__left__list--tweet-count").val();



         //Fetch data.........
       $.getJSON("ad.json", function (data) {

      var htmlText = '';
            for(var i=0; i<data.length; i++){
                      htmlText += '<div class="div-conatiner">';
                      htmlText += '<p class="p-loc"> Text: '+ data[i].text + '</p>';
                      htmlText += '<p class="p-loc"> @ ' + data[i].user.screen_name + '</p>';
                      htmlText += '</div>';
                      if(i==(tweetCount-1))
                      break;
                  }
            $('.body-div__left').append(htmlText);


      });
  });

 var regexp = /\B\#\w\w+\b/g
 var hashData = "AppDirect will be at #MWC17 Join us for our cocktail party to hear updates on our Mobility Partner Program. RSVP: https://t.co/u90Ugt";
 		result = hashData.match(regexp);
 		if (result) {
hashData.index
               alert(result);
               alert(hashData);
               console.log(hashData);
            } else {
                alert("false");
            }




     //Date Modification.........

//               var fromDate,toDate,formattedJsonDate;
//
//                  fromDate =new Date($("#from").val());
//
//
//
//                   toDate =$("#to").val();
//
//
//
//              $(".header-items__right__list--button1").click(function () {
//               alert(fromDate);
//               console.log(fromDate);
//               alert(toDate);
//
//              $.getJSON("ad.json", function (data) {
//               for(var i=0; i<data.length; i++){
//
//               var jsonDate = new Date(data[i].created_at);
//               var date = new Date(jsonDate);
//               if(date.getMonth()<9){
//               formattedJsonDate = date.getFullYear() + '-' +0+ date.getMonth() + '-' + date.getDate();
//               }
//               else
//               formattedJsonDate = date.getFullYear() + '-' +date.getMonth() + '-' + date.getDate();
//
//               if(formattedJsonDate>=fromDate && formattedJsonDate<=toDate){
//                                     htmlText += '<div class="div-conatiner">';
//                                     htmlText += '<p class="p-loc"> Text: ' + data[i].text + '</p>';
//                                     htmlText += '</div>';
//                                     console.log(formattedJsonDate);
//                                    $(".div-conatiner").empty();
//                 }
//                $('.body-div__left').append(htmlText);
//               }
//
//       });
//   });




});




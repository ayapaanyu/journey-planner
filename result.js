/* 
 * 
 * This project was developed by myself and in my 
 * own words.
 * Title: Home Sweet Home, a Journey Planner to home
 * author: Aya Ishida
 * date: 31/10/2016

 */


$(document).ready(function () {

    
    $('#submission').click(function () {
        $(".results").empty();
        var journeyEnd = $('#mypostcode')[0].value;
        var journeyStart = "51.5066,-0.1062";
        var url_query = "https://api.tfl.gov.uk/Journey/JourneyResults/" + journeyStart + "/to/" + journeyEnd ;
         if($('#my_preference').prop(':checked')){
                $('#method').find('input').each(function(i, x) {
                    var mode ='mode=';
                     if(x.prop(':checked')){
                        mode += x; 
                        if(i < $('#method').find('input').length-1){mode += ',';} 
                        }         
                    }); url_query += mode;
                $('#cycling').find('input').each(function(j, y) {
                    var cycle_pref;
                     if(y.prop(':checked')){cycle_pref = y.value;}         
                    }); url_query += 'cyclePreference=' + cycle_pref;
                $('#typeOfWalk').find('input').each(function(z, k) {
                    var walk_type;
                    if(k.prop(':checked')){walk_type = k.value;}         
                }); url_query += 'walkingSpeed=' + walk_type;    
            }
            ajaxRequest(url_query);
        });
   
});
/* This function perform an AJAX request retrieving data 
 * then it updates the html with the new elements.
 * 
 * @param: url_api
 * 
 * ajaxRequest
 */

function ajaxRequest(url_api){
    
    $.ajax({
        url:url_api,
        type:'GET',
        dataType:'json',
        success:function(response){
            var result = $(".results");
            $.each(response.journeys,function(i,value){
                var journey =
                  '<div class="panel panel-default">'+
                  '<div class="panel-heading">'+
                  '<table class="table"><thead><tr><th>Duration</th><th>Departs</th><th>Arrives</th></tr></thead>'+
                  '<tbody>'+
                  '<tr><td>' +response.journeys[i].duration+ '</td>'+
                  '<td>' +response.journeys[i].startDateTime+ '</td>'+
                  '<td>' +response.journeys[i].arrivalDateTime+ '</td></tr><\tbody>'+
                  '</table></div>'+
                  '<div class="panel-body">';
                    $.each(response.journeys[i].legs,function(t){
                      journey += '<table class="table"><tbody><tr><td>' +response.journeys[i].legs[t].duration+ '</td>'+
                                '<td>' +response.journeys[i].legs[t].departurePoint.commonName+ '</td>'+
                                '<td' +response.journeys[i].legs[t].arrivalPoint.commonName+ '</td>'+
                                '<td' +response.journeys[i].legs[t].instruction.summary+ '</td></tr></tbody></table>';
                    });
                    journey += '</table</div><br>';
                result.append(journey);
                }); 
            var status = '<div class="panel panel-default">'+
                    '<p><span class="glyphicon glyphicon-info-sign"></span><b>Status Update</b></p>';
            $.each(response.lines,function(line){    
                   status += '<p>' +response.lines[line].name+ ':' +
                       $.each(response.lines[line].lineStatuses,function(stat){    
                       '</span>' + response.lines[line].lineStatuses[stat].StatusSeverityDescription+ '</span>';});
                   status +='</p>';
                        });
            status += '</div>';        
            result.append(status); 
            return;
        },
        error: function () {
            $('.results').html('<p>An error has occurred.</p>');
            return;
        }
    })
};

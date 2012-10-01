var MONTHS = ["JAN","FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

//Times in millis
var ONE_DAY= 86400000;
var ONE_WEEK = ONE_DAY * 7;

function renderFutureWeek(numWeeksAhead) {
  var now = new Date();
  var someWeeksFromNow = new Date(now.getTime() + (ONE_WEEK * numWeeksAhead));
  return renderWeekAround(someWeeksFromNow);
}

function renderWeekAround(someDate) {
  var currentMonth = someDate.getMonth();
  var currentDayOfWeek = someDate.getDay();
  var currentDate = someDate.getDate();
  var week = [];
  for(var i = 0; i < 7; i++) {
    var difference = i - currentDayOfWeek;
    if(i < currentDayOfWeek) {
      var pastDate = calculateDay(someDate, difference);
      week[i] = MONTHS[pastDate.getMonth()] + " " + pastDate.getDate();
    } else if(currentDayOfWeek == i) {
      week[i] = MONTHS[currentMonth] + " " + currentDate;
    } else if (currentDayOfWeek < i){
      var futureDate = calculateDay(someDate, difference);
      week[i] = MONTHS[futureDate.getMonth()] + " " + futureDate.getDate();
    }
  }
  return renderWeekAsHtml(week);
}

//Calculate what day it is based on "someDate" + "offsetInDays")
//eg if someDate is Oct 1, what's the date for 4 days ago (offsetInDays = -4)?
function calculateDay(someDate, offsetInDays) {
  var offsetInMillis = Math.abs(offsetInDays) * ONE_DAY;
  if(offsetInDays < 0) {
    return new Date(someDate.getTime() - offsetInMillis);
  }
  return new Date(someDate.getTime() + offsetInMillis);
}

function renderWeekAsHtml(weekArray){
  var html = "<tr>";
  for(var i = 0; i < 7; i++) {
    html += "<td>" + weekArray[i] + "</td>";
  }
  return html;
}

//Render a row of dates
var now = new Date();
$("#calendar").append(renderWeekAround(now));
$("#calendar").append(renderFutureWeek(1));
$("#calendar").append(renderFutureWeek(3));
$("#calendar").append(renderFutureWeek(5));

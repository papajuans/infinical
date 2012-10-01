// http://remysharp.com/2010/07/21/throttling-function-calls/
function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

var MONTHS = ["JAN","FEB", "MAR", "APR", 
              "MAY", "JUN", "JUL", "AUG", 
              "SEPT", "OCT", "NOV", "DEC"];

var BG_COLOR = ["#ccc", "#fff"];

//Times in millis
var ONE_DAY= 86400000;
var ONE_WEEK = ONE_DAY * 7;

//Global state to know how many weeks we've rendered already
var WEEK_OFFSET = 0;

//How many weeks to render during each infinite scroll action
var NUM_WEEKS_TO_RENDER;

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
    var anotherDay = calculateDay(someDate, difference);
    week[i] = anotherDay; 
  }
  return generateWeekAsHtmlRow(week);
}

//Calculate what day it is based on "someDate" + "offsetInDays")
//eg if someDate is Oct 1, what's the date for 4 days ago (offsetInDays = -4)?
function calculateDay(someDate, offsetInDays) {
  var offsetInMillis = offsetInDays * ONE_DAY;
  return new Date(someDate.getTime() + offsetInMillis);
}

function generateWeekAsHtmlRow(weekArray){
  var html = "<tr>";
  for(var i = 0; i < 7; i++) {
    var date = weekArray[i];
    html += "<td style=\"background-color:" + BG_COLOR[date.getMonth() % 2] + "\">";
    html += MONTHS[date.getMonth()] + " " + date.getDate();
    html += "</td>";
  }
  return html;
}

function renderMoreWeeks(numWeeks) {
  for(var i = 0; i < numWeeks; i++) {
    $("#calendar").append(renderFutureWeek(WEEK_OFFSET));
    WEEK_OFFSET++;
  }
}

$(function() {
  //Begin by rendering as many cells to fill the current viewport
  NUM_WEEKS_TO_RENDER = window.innerHeight / 40;
  console.log("Rendering " + NUM_WEEKS_TO_RENDER + " weeks.");
  renderMoreWeeks(NUM_WEEKS_TO_RENDER);
});

$(window).scroll(throttle(function(){
  //Only render while as we approach the bottom
  if($(document).height() - 60 < $(document).scrollTop() + $(window).height()) {
    console.log("appending from 10 weeks from " + WEEK_OFFSET);
    renderMoreWeeks(NUM_WEEKS_TO_RENDER);
  }
}, 500 ));	

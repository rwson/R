/**
 * App主入口
 */

"use strict";

define("calendarCtrl", ["r"], function (R) {


    R.controller("calendarApp", function (scope) {

        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            daysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthName = monthNames[month - 1];
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            daysArr[1] = 29;
        }

        scope.set({
            "showLevel": "date",
            "cur": _getDateString(date)
        });

    });

    R.bootstrap("#app");



    function _getDateString(date) {
        date = date || new Date();
        return date.getFullYear() + "-" + _toDoube(date.getMinutes() + 1) + "-" + _toDoube(date.getDate());
    }

    function _toDoube(num) {
        return "" + (num < 9 ? ("0" + num) : num);
    }

});

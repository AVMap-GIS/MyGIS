/*
 * Copyright 2010 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Externs for the Google Maps v3.9 API.
 * @see http://code.google.com/apis/maps/documentation/javascript/reference.html
 * @externs
 */

google.maps = {};

/*
 * Copyright 2011 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Externs for jQuery 1.6.1
 *
 * Note that some functions use different return types depending on the number
 * of parameters passed in. In these cases, you may need to annotate the type
 * of the result in your code, so the JSCompiler understands which type you're
 * expecting. For example:
 *    <code>var elt = /** @type {Element} * / (foo.get(0));</code>
 *
 * @see http://api.jquery.com/
 * @externs
 */

/** @typedef {(Window|Document|Element|Array.<Element>|string|jQuery|
 *     NodeList)} */
var jQuerySelector;

/**
 * @constructor
 * @param {(jQuerySelector|Element|Array.<Element>|Object|jQuery|string|
 *     function())=} arg1
 * @param {(Element|jQuery|Document|
 *     Object.<string, (string|function(jQuery.event=))>)=} arg2
 * @return {jQuery}
 */
function jQuery(arg1, arg2) {};

/**
 * @constructor
 * @extends {jQuery}
 * @param {(jQuerySelector|Element|Array.<Element>|Object|jQuery|string|
 *     function())} arg1
 * @param {(Element|jQuery|Document|
 *     Object.<string, (string|function(jQuery.event=))>)=} arg2
 * @return {jQuery}
 */
function $(arg1, arg2) {};

var tip_marker = "";
var tip_polyline = "";
var tip_polygon = "";
var tip_drive = "";
var tip_editmode = "";
var tip_undo = "";
var tip_trash = "";
var tip_btnErgaleia = "";
var tip_btnAnazitisi = "";
var tip_btnLayers = "";
var tip_btnMaps = "";
var tip_btnTables = "";
var tip_btnSave = "";

//Messages:
var msg_searchPrompt = "";
var msg_errNoLicence = "";
var msg_errAddressNotFound = "";
var msg_errWrongKML = "";
var msg_errFeatureNotImplemented = "";

//Wizard:
var wizAct_layers_1 = "";
var wizAct_layers_2 = "";
var wizAct_layers_3 = "";
var wizAct_moveList_1 = "";
var wizAct_moveList_2 = "";
var wizAct_default_1 = "";
var wizAct_default_2 = "";
var wizAct_default_3 = "";

var msg_reg_step1 = "";
var msg_reg_step2 = "";
var msg_reg_successful = "";
var msg_reg_error = "";

//Titles;
var strings=namespace("AVMap.titles");
strings.Registration={};
strings.Login={};
strings.MapRMenu={};
strings.ObjRMenu={};
strings.MapControl={};
strings.LayerControl={};
strings.Export={};
strings.Info={};
strings.Grid={};
strings.QBuilder={};
strings.BackgroundLayers={};
strings.ConfirmBox={};
strings.QuickJump={};

function namespace(namespaceString) {}
var OpenLayers = {};
var Date = {
    "CultureInfo": {
        "name": {},
        "englishName": {},
        "nativeName": {},
        "dayNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {}
        },
        "abbreviatedDayNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {}
        },
        "shortestDayNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {}
        },
        "firstLetterDayNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {}
        },
        "monthNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {},
            "7": {},
            "8": {},
            "9": {},
            "10": {},
            "11": {}
        },
        "abbreviatedMonthNames": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {},
            "7": {},
            "8": {},
            "9": {},
            "10": {},
            "11": {}
        },
        "amDesignator": {},
        "pmDesignator": {},
        "firstDayOfWeek": {},
        "twoDigitYearMax": {},
        "dateElementOrder": {},
        "formatPatterns": {
            "shortDate": {},
            "longDate": {},
            "shortTime": {},
            "longTime": {},
            "fullDateTime": {},
            "sortableDateTime": {},
            "universalSortableDateTime": {},
            "rfc1123": {},
            "monthDay": {},
            "yearMonth": {}
        },
        "regexPatterns": {
            "jan": function () {},
            "feb": function () {},
            "mar": function () {},
            "apr": function () {},
            "may": function () {},
            "jun": function () {},
            "jul": function () {},
            "aug": function () {},
            "sep": function () {},
            "oct": function () {},
            "nov": function () {},
            "dec": function () {},
            "sun": function () {},
            "mon": function () {},
            "tue": function () {},
            "wed": function () {},
            "thu": function () {},
            "fri": function () {},
            "sat": function () {},
            "future": function () {},
            "past": function () {},
            "add": function () {},
            "subtract": function () {},
            "yesterday": function () {},
            "today": function () {},
            "tomorrow": function () {},
            "now": function () {},
            "millisecond": function () {},
            "second": function () {},
            "minute": function () {},
            "hour": function () {},
            "week": function () {},
            "month": function () {},
            "day": function () {},
            "year": function () {},
            "shortMeridian": function () {},
            "longMeridian": function () {},
            "timezone": function () {},
            "ordinalSuffix": function () {},
            "timeContext": function () {}
        },
        "abbreviatedTimeZoneStandard": {
            "GMT": {},
            "EST": {},
            "CST": {},
            "MST": {},
            "PST": {}
        },
        "abbreviatedTimeZoneDST": {
            "GMT": {},
            "EDT": {},
            "CDT": {},
            "MDT": {},
            "PDT": {}
        }
    },
    "getMonthNumberFromName": function () {},
    "getDayNumberFromName": function () {},
    "isLeapYear": function () {},
    "getDaysInMonth": function () {},
    "getTimezoneOffset": function () {},
    "getTimezoneAbbreviation": function () {},
    "_validate": function () {},
    "validateMillisecond": function () {},
    "validateSecond": function () {},
    "validateMinute": function () {},
    "validateHour": function () {},
    "validateDay": function () {},
    "validateMonth": function () {},
    "validateYear": function () {},
    "today": function () {},
    "Parsing": {
        "Exception": function () {},
        "Operators": {
            "rtoken": function () {},
            "token": function () {},
            "stoken": function () {},
            "until": function () {},
            "many": function () {},
            "optional": function () {},
            "not": function () {},
            "ignore": function () {},
            "product": function () {},
            "cache": function () {},
            "any": function () {},
            "each": function () {},
            "all": function () {},
            "sequence": function () {},
            "between": function () {},
            "list": function () {},
            "set": function () {},
            "forward": function () {},
            "replace": function () {},
            "process": function () {},
            "min": function () {}
        }
    },
    "Grammar": {
        "datePartDelimiter": function () {},
        "timePartDelimiter": function () {},
        "whiteSpace": function () {},
        "generalDelimiter": function () {},
        "ctoken": function () {},
        "ctoken2": function () {},
        "h": function () {},
        "hh": function () {},
        "H": function () {},
        "HH": function () {},
        "m": function () {},
        "mm": function () {},
        "s": function () {},
        "ss": function () {},
        "hms": function () {},
        "t": function () {},
        "tt": function () {},
        "z": function () {},
        "zz": function () {},
        "zzz": function () {},
        "timeSuffix": function () {},
        "time": function () {},
        "d": function () {},
        "dd": function () {},
        "dddd": function () {},
        "ddd": function () {},
        "M": function () {},
        "MM": function () {},
        "MMMM": function () {},
        "MMM": function () {},
        "y": function () {},
        "yy": function () {},
        "yyy": function () {},
        "yyyy": function () {},
        "day": function () {},
        "month": function () {},
        "year": function () {},
        "orientation": function () {},
        "operator": function () {},
        "rday": function () {},
        "unit": function () {},
        "value": function () {},
        "expression": function () {},
        "mdy": function () {},
        "ymd": function () {},
        "dmy": function () {},
        "date": function () {},
        "format": function () {},
        "formats": function () {},
        "_formats": function () {},
        "_start": function () {},
        "start": function () {}
    },
    "Translator": {
        "hour": function () {},
        "minute": function () {},
        "second": function () {},
        "meridian": function () {},
        "timezone": function () {},
        "day": function () {},
        "month": function () {},
        "year": function () {},
        "rday": function () {},
        "finishExact": function () {},
        "finish": function () {}
    },
    "_parse": function () {},
    "getParseFunction": function () {},
    "parseExact": function () {}
}
var swfobject = {
    "registerObject": function () {},
    "getObjectById": function () {},
    "embedSWF": function () {},
    "switchOffAutoHideShow": function () {},
    "ua": {
        "w3": {},
        "pv": {
            "0": {},
            "1": {},
            "2": {}
        },
        "wk": {},
        "ie": {},
        "win": {},
        "mac": {}
    },
    "getFlashPlayerVersion": function () {},
    "hasFlashPlayerVersion": function () {},
    "createSWF": function () {},
    "showExpressInstall": function () {},
    "removeSWF": function () {},
    "createCSS": function () {},
    "addDomLoadEvent": function () {},
    "addLoadEvent": function () {},
    "getQueryParamValue": function () {},
    "expressInstallCallback": function () {}
}
/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
 
/*
Date.CultureInfo = {};
Date.getMonthNumberFromName = function (name) {};
Date.getDayNumberFromName = function (name) {};
Date.isLeapYear = function (year) {};
Date.getDaysInMonth = function (year, month) {};
Date.getTimezoneOffset = function (s, dst) {};
Date.getTimezoneAbbreviation = function (offset, dst) {};
Date.prototype.clone = function () {};
Date.prototype.compareTo = function (date) {};
Date.prototype.equals = function (date) {};
Date.prototype.between = function (start, end) {};
Date.prototype.addMilliseconds = function (value) {};
Date.prototype.addSeconds = function (value) {};
Date.prototype.addMinutes = function (value) {};
Date.prototype.addHours = function (value) {};
Date.prototype.addDays = function (value) {};
Date.prototype.addWeeks = function (value) {};
Date.prototype.addMonths = function (value) {};
Date.prototype.addYears = function (value) {};
Date.prototype.add = function (config) {};
Date._validate = function (value, min, max, name) {};
Date.validateMillisecond = function (n) {};
Date.validateSecond = function (n) {};
Date.validateMinute = function (n) {};
Date.validateHour = function (n) {};
Date.validateDay = function (n, year, month) {};
Date.validateMonth = function (n) {};
Date.validateYear = function (n) {};
Date.prototype.set = function (config) {};
Date.prototype.clearTime = function () {};
Date.prototype.isLeapYear = function () {};
Date.prototype.isWeekday = function () {};
Date.prototype.getDaysInMonth = function () {};
Date.prototype.moveToFirstDayOfMonth = function () {};
Date.prototype.moveToLastDayOfMonth = function () {};
Date.prototype.moveToDayOfWeek = function (day, orient) {};
Date.prototype.moveToMonth = function (month, orient) {};
Date.prototype.getDayOfYear = function () {};
Date.prototype.getWeekOfYear = function (firstDayOfWeek) {};
Date.prototype.isDST = function () {};
Date.prototype.getTimezone = function () {};
Date.prototype.setTimezoneOffset = function (s) {};
Date.prototype.setTimezone = function (s) {};
Date.prototype.getUTCOffset = function () {};
Date.prototype.getDayName = function (abbrev) {};
Date.prototype.getMonthName = function (abbrev) {};
Date.prototype._toString = Date.prototype.toString;
Date.prototype.toString = function (format) {};
Date.now = function () {};
Date.today = function () {};
Date.prototype._orient = +1;
Date.prototype.next = function () {};
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function () {};
Date.prototype._is = false;
Date.prototype.is = function () {};
Number.prototype._dateElement = "";
Number.prototype.fromNow = function () {};
Number.prototype.ago = function () {};

Date.prototype.toJSONString = function () {};
Date.prototype.toShortDateString = function () {};
Date.prototype.toLongDateString = function () {};
Date.prototype.toShortTimeString = function () {};
Date.prototype.toLongTimeString = function () {};
Date.prototype.getOrdinal = function () {};
Date._parse = Date.parse;
Date.parse = function (s) {};
Date.getParseFunction = function (fx) {};
Date.parseExact = function (s, fx) {};
*/
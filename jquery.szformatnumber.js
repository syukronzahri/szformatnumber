/**
 *******************************
 * jQuery SZ Format Number
 * Created by Syukron Zahri
 * Copyright (c) 2016
 *******************************
 */

$.fn.extend({
    szFormatNumber: function(param){
        $(this).each(function(index){
            var $element = $(this);
            
            var textAlign = 'left';
            
            if (param.align.toLowerCase() == 'right') {
                textAlign = 'right';
            }
            
            var sign = true;
            
            if (param.sign === false) {
                sign = false;
            }
            
            var regexBuilder = "";
            
            var decimalRegex = "";
            var decimalNumber = 0;
            
            var outputSuffix = "";
            var outputPrefix = "";
            
            var thousandSeparator = ",";
            var decimalSeparator = ".";
            var signChar = "-";
            
            var thousandSeparatorRegex = new RegExp("\\" + thousandSeparator, "g");
            var decimalSeparatorRegex = new RegExp("\\" + decimalSeparator, "g");
            var signRegex = new RegExp("\\" + signChar, "g");
            
            var decimalSeparatorCode = (decimalSeparator == ",") ? 188 : 190;
            
            var previousText = "";
            var formattedText = "";
            
            var i = 0;
            var length = (param.decimalLength == undefined) ? 0 : param.decimalLength;
            
            if (length > 0) {
                for (i = 0; i < param.decimalLength; i++) {
                    decimalNumber++;
                }
            }
            
            if (decimalNumber > 0) {
                decimalRegex = "\\.\\d" + "{" + decimalNumber.toString() + "}";
            }
            
            if (sign === true) {
                regexBuilder = "^\\d*" + decimalRegex + "$";
            } else {
                regexBuilder = "^-?\\d*" + decimalRegex + "$";
            }
            
            var finalRegex = new RegExp("^\\d*" + decimalRegex + "$");
            var formatter = "(?=(?:\\d{3})+(?:\\" + decimalSeparator + "|$))";
            var formatterRegex = new RegExp(formatter, "g");
            
            var initText = $element.val();
            initText = initText.replace(/[^\d\.\,]/g, "").replace(thousandSeparatorRegex, "");
            
            var integerPart = initText.split(decimalSeparator)[0];
            var decimalPart = initText.split(decimalSeparator)[1];
            
            var finalText = integerPart.split(formatterRegex).join(thousandSeparator);
            if (decimalPart != "" && decimalPart !== undefined) {
                finalText += decimalSeparator + decimalPart;
            }
            
            $element.val(finalText);
            
            return $element.keydown(function(event){
                var oldVal = $element.val().replace(thousandSeparatorRegex, "");
                var text = oldVal;
                
                //console.log('event.which: ' + event.which);
                //previousText = $(this).val();
                //console.log("finalRegex: " + finalRegex);
                //console.log("oldVal: " + oldVal);
                //console.log("decimalSeparatorCode: " + decimalSeparatorCode);

                event.preventDefault();
                if (!((event.which >= 48 && event.which <= 57) || event.which == decimalSeparatorCode || event.which == 8 || event.which == 173 || (event.which >= 37 && event.which <= 40))) {
                    //event.preventDefault();
                } else {
                    if (event.which >= 49 && event.which <= 57) {
                        if (param.decimalLength > 0) {
                            if (!oldVal.match(finalRegex)) {
                                text += String.fromCharCode(event.which);
                            }
                        }
                    } else if (event.which == 48) {
                        if (!oldVal.match(/^0+$/)) {
                            if (!oldVal.match(finalRegex)) {
                                text += String.fromCharCode(48);
                            }
                        }
                    } else if (event.which == decimalSeparatorCode) {
                        if (param.decimalLength > 0) {
                            if (!oldVal.match(decimalSeparatorRegex)) {
                                if (!oldVal.length) {
                                    text = text + "0" + decimalSeparator;
                                } else {
                                    text = text + decimalSeparator;
                                }
                            }
                        }
                    } else if (event.which == 8) {
                        var testVal = '0' + String.fromCharCode(decimalSeparatorCode);
                        if (oldVal == testVal) {
                            text = '';
                        } else {
                            var substrLength = oldVal.length - 1;
                            text = oldVal.substring(0, substrLength);
                        }
                    } else if (event.which == 173) {
                        
                    }
                }
                //console.log(formatterRegex);
                var intPart = text.split(decimalSeparator)[0];
                var decPart = text.split(decimalSeparator)[1];
                
                //console.log("intPart: " + intPart);
                //console.log("decPart: " + decPart);
                //console.log(decimalSeparator);
                
                text = intPart.split(formatterRegex).join(thousandSeparator);
                if (decPart) {
                    text = text + decimalSeparator + decPart;
                } else {
                    if (event.which == decimalSeparatorCode) {
                        text = text + decimalSeparator;
                    }
                }
                
                $element.val(text);
                
                if (param.event.onChange != undefined) {
                    param.event.onChange(text);
                }
            }).css(
                'text-align', textAlign
            ).keypress(function(){
                previousText = $element.val();
            }).keyup(function(event){
                //formattedText = $(this).val();
                //console.log(previousText);
            }).blur(function(){
                var text = $element.val().replace(/[^\d\.\,]/g, "");
                if (text.match(/^\d+\.{1}$/)) {
                    text = text.replace(/[\.]/g, "");
                }
                $element.val(text);
                
            }).bind('paste', function(event){
                event.preventDefault();
            });
        });
    }
})
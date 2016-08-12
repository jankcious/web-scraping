var digits="0123456789";var lowercaseLetters="abcdefghijklmnopqrstuvwxyz";var uppercaseLetters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";var whitespace=" \t\n\r";var decimalPointDelimiter=".";var phoneNumberDelimiters="()- ";var validUSPhoneChars=digits+phoneNumberDelimiters;var validWorldPhoneChars=digits+phoneNumberDelimiters+"+";var SSNDelimiters="- ";var validSSNChars=digits+SSNDelimiters;var digitsInSocialSecurityNumber=9;var digitsInUSPhoneNumber=10;var ZIPCodeDelimiters="-";var ZIPCodeDelimeter="-";var validZIPCodeChars=digits+ZIPCodeDelimiters;var digitsInZIPCode1=5;var digitsInZIPCode2=9;var creditCardDelimiters=" ";var mPrefix="You did not enter a value into the ";var mSuffix=" field. This is a required field. Please enter it now.";var sUSLastName="Last Name";var sUSFirstName="First Name";var sWorldLastName="Family Name";var sWorldFirstName="Given Name";var sTitle="Title";var sCompanyName="Company Name";var sUSAddress="Street Address";var sWorldAddress="Address";var sCity="City";var sStateCode="State Code";var sWorldState="State, Province, or Prefecture";var sCountry="Country";var sZIPCode="ZIP Code";var sWorldPostalCode="Postal Code";var sPhone="Phone Number";var sFax="Fax Number";var sDateOfBirth="Date of Birth";var sExpirationDate="Expiration Date";var sEmail="Email";var sSSN="Social Security Number";var sCreditCardNumber="Credit Card Number";var sOtherInfo="Other Information";var iStateCode="This field must be a valid two character U.S. state abbreviation (like CA for California). Please reenter it now.";var iZIPCode="This field must be a 5 or 9 digit U.S. ZIP Code (like 94043). Please reenter it now.";var iUSPhone="This field must be a 10 digit U.S. phone number (like 415 555 1212). Please reenter it now.";var iWorldPhone="This field must be a valid international phone number. Please reenter it now.";var iSSN="This field must be a 9 digit U.S. social security number (like 123 45 6789). Please reenter it now.";var iEmail="This field must be a valid email address (like foo@bar.com). Please reenter it now.";var iCreditCardPrefix="This is not a valid ";var iCreditCardSuffix=" credit card number. (Click the link on this form to see a list of sample numbers.) Please reenter it now.";var iDay="This field must be a day number between 1 and 31.  Please reenter it now.";var iMonth="This field must be a month number between 1 and 12.  Please reenter it now.";var iYear="This field must be a 2 or 4 digit year number.  Please reenter it now.";var iDatePrefix="The Day, Month, and Year for ";var iDateSuffix=" do not form a valid date.  Please reenter them now.";var pEntryPrompt="Please enter a ";var pStateCode="2 character code (like CA).";var pZIPCode="5 or 9 digit U.S. ZIP Code (like 94043).";var pUSPhone="10 digit U.S. phone number (like 415 555 1212).";var pWorldPhone="international phone number.";var pSSN="9 digit U.S. social security number (like 123 45 6789).";var pEmail="valid email address (like foo@bar.com).";var pCreditCard="valid credit card number.";var pDay="day number between 1 and 31.";var pMonth="month number between 1 and 12.";var pYear="2 or 4 digit year number.";var defaultEmptyOK=false;var daysInMonth=makeArray(12);daysInMonth[1]=31;daysInMonth[2]=29;daysInMonth[3]=31;daysInMonth[4]=30;daysInMonth[5]=31;daysInMonth[6]=30;daysInMonth[7]=31;daysInMonth[8]=31;daysInMonth[9]=30;daysInMonth[10]=31;daysInMonth[11]=30;daysInMonth[12]=31;var USStateCodeDelimiter="|";var USStateCodes="AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY|AE|AA|AE|AE|AP";function isBlank(b){for(var a=0;a<b.length;a++){var d=b.charAt(a);if((d!=" ")&&(d!="\n")&&(d!="\t")){return false}}return true}function isEmpty(a){return((a==null)||(a.length==0))}function isWhitespace(b){var a;if(isEmpty(b)){return true}for(a=0;a<b.length;a++){var d=b.charAt(a);if(whitespace.indexOf(d)==-1){return false}}return true}function stripCharsInBag(d,e){var b;var a="";for(b=0;b<d.length;b++){var f=d.charAt(b);if(e.indexOf(f)==-1){a+=f}}return a}function stripCharsNotInBag(d,e){var b;var a="";for(b=0;b<d.length;b++){var f=d.charAt(b);if(e.indexOf(f)!=-1){a+=f}}return a}function stripWhitespace(a){return stripCharsInBag(a,whitespace)}function stripInitialWhitespace(b){var a=0;while((a<b.length)&&charInString(b.charAt(a),whitespace)){a++}return b.substring(a,b.length)}function isLetter(a){return(((a>="a")&&(a<="z"))||((a>="A")&&(a<="Z")))}function isDigit(a){return((a>="0")&&(a<="9"))}function isLetterOrDigit(a){return(isLetter(a)||isDigit(a))}function isInteger(b){var a;if(isEmpty(b)){if(isInteger.arguments.length==1){return defaultEmptyOK}else{return(isInteger.arguments[1]==true)}}for(a=0;a<b.length;a++){var d=b.charAt(a);if(!isDigit(d)){return false}}return true}function isSignedInteger(c){if(isEmpty(c)){if(isSignedInteger.arguments.length==1){return defaultEmptyOK}else{return(isSignedInteger.arguments[1]==true)}}else{var b=0;var a=defaultEmptyOK;if(isSignedInteger.arguments.length>1){a=isSignedInteger.arguments[1]}if((c.charAt(0)=="-")||(c.charAt(0)=="+")){b=1}return(isInteger(c.substring(b,c.length),a))}}function isPositiveInteger(b){var a=defaultEmptyOK;if(isPositiveInteger.arguments.length>1){a=isPositiveInteger.arguments[1]}return(isSignedInteger(b,a)&&((isEmpty(b)&&a)||(parseInt(b)>0)))}function isNonnegativeInteger(b){var a=defaultEmptyOK;if(isNonnegativeInteger.arguments.length>1){a=isNonnegativeInteger.arguments[1]}return(isSignedInteger(b,a)&&((isEmpty(b)&&a)||(parseInt(b)>=0)))}function isNegativeInteger(b){var a=defaultEmptyOK;if(isNegativeInteger.arguments.length>1){a=isNegativeInteger.arguments[1]}return(isSignedInteger(b,a)&&((isEmpty(b)&&a)||(parseInt(b)<0)))}function isNonpositiveInteger(b){var a=defaultEmptyOK;if(isNonpositiveInteger.arguments.length>1){a=isNonpositiveInteger.arguments[1]}return(isSignedInteger(b,a)&&((isEmpty(b)&&a)||(parseInt(b)<=0)))}function isFloat(d){var b;var a=false;if(isEmpty(d)){if(isFloat.arguments.length==1){return defaultEmptyOK}else{return(isFloat.arguments[1]==true)}}if(d==decimalPointDelimiter){return false}for(b=0;b<d.length;b++){var e=d.charAt(b);if((e==decimalPointDelimiter)&&!a){a=true}else{if(!isDigit(e)){return false}}}return true}function isSignedFloat(c){if(isEmpty(c)){if(isSignedFloat.arguments.length==1){return defaultEmptyOK}else{return(isSignedFloat.arguments[1]==true)}}else{var b=0;var a=defaultEmptyOK;if(isSignedFloat.arguments.length>1){a=isSignedFloat.arguments[1]}if((c.charAt(0)=="-")||(c.charAt(0)=="+")){b=1}return(isFloat(c.substring(b,c.length),a))}}function isAlphabetic(b){var a;if(isEmpty(b)){if(isAlphabetic.arguments.length==1){return defaultEmptyOK}else{return(isAlphabetic.arguments[1]==true)}}for(a=0;a<b.length;a++){var d=b.charAt(a);if(!isLetter(d)){return false}}return true}function isAlphanumeric(b){var a;if(isEmpty(b)){if(isAlphanumeric.arguments.length==1){return defaultEmptyOK}else{return(isAlphanumeric.arguments[1]==true)}}for(a=0;a<b.length;a++){var d=b.charAt(a);if(!(isLetter(d)||isDigit(d))){return false}}return true}function isNumeric(b){var a;if(isEmpty(b)){if(isNumeric.arguments.length==1){return defaultEmptyOK}else{return(isNumeric.arguments[1]==true)}}for(a=0;a<b.length;a++){var d=b.charAt(a);if(!isDigit(d)){return false}}return true}function reformat(d){var a;var b=0;var e="";for(var c=1;c<reformat.arguments.length;c++){a=reformat.arguments[c];if(c%2==1){e+=a}else{e+=d.substring(b,b+a);b+=a}}return e}function isSSN(a){if(isEmpty(a)){if(isSSN.arguments.length==1){return defaultEmptyOK}else{return(isSSN.arguments[1]==true)}}return(isInteger(a)&&a.length==digitsInSocialSecurityNumber)}function isUSPhoneNumber(a){if(isEmpty(a)){if(isUSPhoneNumber.arguments.length==1){return defaultEmptyOK}else{return(isUSPhoneNumber.arguments[1]==true)}}return(isInteger(a)&&a.length==digitsInUSPhoneNumber)}function isInternationalPhoneNumber(a){if(isEmpty(a)){if(isInternationalPhoneNumber.arguments.length==1){return defaultEmptyOK}else{return(isInternationalPhoneNumber.arguments[1]==true)}}return(isPositiveInteger(a))}function isZIPCode(a){if(isEmpty(a)){if(isZIPCode.arguments.length==1){return defaultEmptyOK}else{return(isZIPCode.arguments[1]==true)}}return(isInteger(a)&&((a.length==digitsInZIPCode1)||(a.length==digitsInZIPCode2)))}function isStateCode(a){if(isEmpty(a)){if(isStateCode.arguments.length==1){return defaultEmptyOK}else{return(isStateCode.arguments[1]==true)}}return((USStateCodes.indexOf(a)!=-1)&&(a.indexOf(USStateCodeDelimiter)==-1))}function isEmail(a){var b=new RegExp(/^(([^<>()[\]\\.,;:\s@\""#]+(\.[^<>()[\]\\.,;:\s@\""#]+)*)|(\"".+\""))@((\[(2([0-4]\d|5[0-5])|1?\d{1,2})(\.(2([0-4]\d|5[0-5])|1?\d{1,2})){3} \])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);return b.test(a)}function isContiguousString(c){var a=true;var b=0;while(b<c.length){if(c.charAt(b)==" "){a=false;break}b++}return a}function isYear(a){if(isEmpty(a)){if(isYear.arguments.length==1){return defaultEmptyOK}else{return(isYear.arguments[1]==true)}}if(!isNonnegativeInteger(a)){return false}return(a.length==4)}function isIntegerInRange(f,d,c){if(isEmpty(f)){if(isIntegerInRange.arguments.length==1){return defaultEmptyOK}else{return(isIntegerInRange.arguments[1]==true)}}if(!isInteger(f,false)){return false}var e=parseInt(f);return((e>=d)&&(e<=c))}function isMonth(a){if(isEmpty(a)){if(isMonth.arguments.length==1){return defaultEmptyOK}else{return(isMonth.arguments[1]==true)}}return isIntegerInRange(a,1,12)}function isDay(a){if(isEmpty(a)){if(isDay.arguments.length==1){return defaultEmptyOK}else{return(isDay.arguments[1]==true)}}return isIntegerInRange(a,1,31)}function daysInFebruary(a){return(((a%4==0)&&((!(a%100==0))||(a%400==0)))?29:28)}function isDate(b,e,a){if(!(isYear(b,false)&&isMonth(e,false)&&isDay(a,false))){return false}var c=parseInt(b);var d=parseInt(e);var f=parseInt(a);if(f>daysInMonth[d]){return false}if((d==2)&&(f>daysInFebruary(c))){return false}return true}function promptEx(a){window.status=a}function promptEntry(a){window.status=pEntryPrompt+a}function warnEmpty(a,b){a.focus();alert(mPrefix+b+mSuffix);return false}function warnInvalid(a,b){a.focus();a.select();alert(b);return false}function checkString(a,c,b){if(checkString.arguments.length==2){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}if(isWhitespace(a.value)){return warnEmpty(a,c)}else{return true}}function checkStateCode(a,b){if(checkStateCode.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}else{a.value=a.value.toUpperCase();if(!isStateCode(a.value,false)){return warnInvalid(a,iStateCode)}else{return true}}}function reformatZIPCode(a){if(a.length==5){return a}else{return(reformat(a,"",5,"-",4))}}function checkZIPCode(a,b){if(checkZIPCode.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}else{var c=stripCharsInBag(a.value,ZIPCodeDelimiters);if(!isZIPCode(c,false)){return warnInvalid(a,iZIPCode)}else{a.value=reformatZIPCode(c);return true}}}function reformatUSPhone(a){return(reformat(a,"(",3,") ",3,"-",4))}function checkUSPhone(a,c){if(checkUSPhone.arguments.length==1){c=defaultEmptyOK}if((c==true)&&(isEmpty(a.value))){return true}else{var b=stripCharsInBag(a.value,phoneNumberDelimiters);if(!isUSPhoneNumber(b,false)){return warnInvalid(a,iUSPhone)}else{a.value=reformatUSPhone(b);return true}}}function checkInternationalPhone(a,b){if(checkInternationalPhone.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}else{if(!isInternationalPhoneNumber(a.value,false)){return warnInvalid(a,iWorldPhone)}else{return true}}}function checkEmail(a,b){if(checkEmail.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}else{if(!isEmail(a.value,false)){return warnInvalid(a,iEmail)}else{return true}}}function reformatSSN(a){return(reformat(a,"",3,"-",2,"-",4))}function checkSSN(a,b){if(checkSSN.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}else{var c=stripCharsInBag(a.value,SSNDelimiters);if(!isSSN(c,false)){return warnInvalid(a,iSSN)}else{a.value=reformatSSN(c);return true}}}function checkYear(a,b){if(checkYear.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}if(!isYear(a.value,false)){return warnInvalid(a,iYear)}else{return true}}function checkMonth(a,b){if(checkMonth.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}if(!isMonth(a.value,false)){return warnInvalid(a,iMonth)}else{return true}}function checkDay(a,b){if(checkDay.arguments.length==1){b=defaultEmptyOK}if((b==true)&&(isEmpty(a.value))){return true}if(!isDay(a.value,false)){return warnInvalid(a,iDay)}else{return true}}function checkDate(a,c,e,b,d){if(checkDate.arguments.length==4){d=false}if(!isYear(a.value)){return warnInvalid(a,iYear)}if(!isMonth(c.value)){return warnInvalid(c,iMonth)}if((d==true)&&isEmpty(e.value)){return true}else{if(!isDay(e.value)){return warnInvalid(e,iDay)}}if(isDate(a.value,c.value,e.value)){return true}alert(iDatePrefix+b+iDateSuffix);return false}function getRadioButtonValue(a){for(var b=0;b<a.length;b++){if(a[b].checked){break}}return a[b].value}function checkCreditCard(d,b){var a=getRadioButtonValue(d);var c=stripCharsInBag(b.value,creditCardDelimiters);if(!isCardMatch(a,c)){return warnInvalid(b,iCreditCardPrefix+a+iCreditCardSuffix)}else{b.value=c;return true}}function isCreditCard(a){if(a.length>19){return(false)}sum=0;mul=1;l=a.length;for(i=0;i<l;i++){digit=a.substring(l-i-1,l-i);tproduct=parseInt(digit,10)*mul;if(tproduct>=10){sum+=(tproduct%10)+1}else{sum+=tproduct}if(mul==1){mul++}else{mul--}}if((sum%10)==0){return(true)}else{return(false)}}function isVisa(a){if(((a.length==16)||(a.length==13))&&(a.substring(0,1)==4)){return isCreditCard(a)}return false}function isMasterCard(a){firstdig=a.substring(0,1);seconddig=a.substring(1,2);if((a.length==16)&&(firstdig==5)&&((seconddig>=1)&&(seconddig<=5))){return isCreditCard(a)}return false}function isAmericanExpress(a){firstdig=a.substring(0,1);seconddig=a.substring(1,2);if((a.length==15)&&(firstdig==3)&&((seconddig==4)||(seconddig==7))){return isCreditCard(a)}return false}function isDinersClub(a){firstdig=a.substring(0,1);seconddig=a.substring(1,2);if((a.length==14)&&(firstdig==3)&&((seconddig==0)||(seconddig==6)||(seconddig==8))){return isCreditCard(a)}return false}function isCarteBlanche(a){return isDinersClub(a)}function isDiscover(a){first4digs=a.substring(0,4);if((a.length==16)&&(first4digs=="6011")){return isCreditCard(a)}return false}function isEnRoute(a){first4digs=a.substring(0,4);if((a.length==15)&&((first4digs=="2014")||(first4digs=="2149"))){return isCreditCard(a)}return false}function isJCB(a){first4digs=a.substring(0,4);if((a.length==16)&&((first4digs=="3088")||(first4digs=="3096")||(first4digs=="3112")||(first4digs=="3158")||(first4digs=="3337")||(first4digs=="3528"))){return isCreditCard(a)}return false}function isAnyCard(a){if(!isCreditCard(a)){return false}if(!isMasterCard(a)&&!isVisa(a)&&!isAmericanExpress(a)&&!isDinersClub(a)&&!isDiscover(a)&&!isEnRoute(a)&&!isJCB(a)){return false}return true}function isCardMatch(a,c){a=a.toUpperCase();var b=true;if((a=="VISA")&&(!isVisa(c))){b=false}if((a=="MASTERCARD")&&(!isMasterCard(c))){b=false}if(((a=="AMERICANEXPRESS")||(a=="AMEX"))&&(!isAmericanExpress(c))){b=false}if((a=="DISCOVER")&&(!isDiscover(c))){b=false}if((a=="JCB")&&(!isJCB(c))){b=false}if((a=="DINERS")&&(!isDinersClub(c))){b=false}if((a=="CARTEBLANCHE")&&(!isCarteBlanche(c))){b=false}if((a=="ENROUTE")&&(!isEnRoute(c))){b=false}return b}function makeArray(b){for(var a=1;a<=b;a++){this[a]=0}return this};
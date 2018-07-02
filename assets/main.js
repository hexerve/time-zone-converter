$(function() {

    var userOffset, clientOffset, clientTime, userTime, timeDiff, isMaxClientOffset,
        user_timeControl, customer_timeControl, isColorMode, clientName, userName;

    //by default enable color mode
    isColorMode = true;
    document.getElementById("enable_color").checked = true;

    user_timeControl = document.getElementById("user_time");
    customer_timeControl = document.getElementById("customer_time");

    /*
    *  get the time in UTC
    *
    *  @params: timestamp = millisecounds since unix epoch
    *  @return: Object in format {Y: 1998, M: 09, D: 08, h: 13, m: 09, s: 32, d: 2}
    */
    function getTimeByTimestamp(timestamp){
        var date, Y, M, D, h, m, s, d;
        date = new Date(timestamp);
        Y = date.getUTCFullYear();
        M = date.getUTCMonth() + 1;
        D = date.getUTCDate();
        h = date.getUTCHours();
        m = date.getUTCMinutes();
        s = date.getUTCSeconds();
        d = date.getUTCDay();  
    
        if(M < 10){
            M = "0" + M;
        }
        if(D < 10){
            D = "0" + D;
        }
        if(h < 10){
            h = "0" + h;
        }
        if(m < 10){
            m = "0" + m;
        }
        if(s < 10){
            s = "0" + s;
        }

        return  {Y:Y, M:M, D:D, h:h, m:m, s:s, d:d};
    }

    /*
    *  get the time in Local timezone
    *
    *  @params: timestamp = millisecounds since unix epoch
    *  @return: Object in format {Y: 1998, M: 09, D: 08, h: 13, m: 09, s: 32, d: 2}
    */
    function getLocalTimeByTimestamp(timestamp){
        var date, Y, M, D, h, m, s, d;
        date = new Date(timestamp);
        Y = date.getFullYear();
        M = date.getMonth() + 1;
        D = date.getDate();
        h = date.getHours();
        m = date.getMinutes();
        s = date.getSeconds();
        d = date.getDay();  
    
        if(M < 10){
            M = "0" + M;
        }
        if(D < 10){
            D = "0" + D;
        }
        if(h < 10){
            h = "0" + h;
        }
        if(m < 10){
            m = "0" + m;
        }
        if(s < 10){
            s = "0" + s;
        }

        return  {Y:Y, M:M, D:D, h:h, m:m, s:s, d:d};
    }       

    /*
    * get the current time for any timezone
    *
    *  @params: offset = minutes from GMT +00:00
    *  @return: (UTC time) Object in format {Y: 1998, M: 09, D: 08, h: 13, m: 09, s: 32, d: 2}
    */
    function getTime(Offset){
        var time = new Date().getTime();
        time += Offset * 60000;
        
        return getTimeByTimestamp(time);
    }

    /*
    * set the user date and time input box color
    *
    *  @params: h: hours, m: minutes
    */
    function setUserColor(h, m){
        if( m > 0 ){
            h += 1;
        }
        if(h < 10 || h > 18){
            $("#user_time").removeClass("date_time_white").removeClass("date_time_green").
                addClass("date_time_red");
            $("#datepicker_user").removeClass("date_time_white").removeClass("date_time_green").
                addClass("date_time_red");
            
        }else{
            $("#user_time").removeClass("date_time_white").removeClass("date_time_red").
                addClass("date_time_green");
            $("#datepicker_user").removeClass("date_time_white").removeClass("date_time_red").
                addClass("date_time_green");
        }
    }

    /*
    * set the customer date and time input box color
    *
    *  @params: h: hours, m: minutes
    */
    function setCustomerColor(h, m){
        if( m > 0 ){
            h += 1;
        }
        if(h < 10 || h > 18){
            $("#customer_time").removeClass("date_time_white").removeClass("date_time_green").
                addClass("date_time_red");
            $("#datepicker_customer").removeClass("date_time_white").removeClass("date_time_green").
                addClass("date_time_red");    
        }else{
            $("#customer_time").removeClass("date_time_white").removeClass("date_time_red").
                addClass("date_time_green");
            $("#datepicker_customer").removeClass("date_time_white").removeClass("date_time_red").
                addClass("date_time_green");
        }
    }

    //disable colors
    function noColor(){
        $("#customer_time").removeClass("date_time_red").removeClass("date_time_green").
            addClass("date_time_white");
        $("#datepicker_customer").removeClass("date_time_red").removeClass("date_time_green").
            addClass("date_time_white");
        $("#user_time").removeClass("date_time_red").removeClass("date_time_green").
            addClass("date_time_white");
        $("#datepicker_user").removeClass("date_time_red").removeClass("date_time_green").
            addClass("date_time_white");
    }

    /*
    * set the user date and time input box values & color
    *
    * @params: timestamp: milliseconds, 
    *          timeDiff: difference from offset of customer
    *          isMaxClientOffset: true if client GMT is larger
    */
    function setUserTime(timestamp,timeDiff, isMaxClientOffset){
        var convertedTime;
        timeDiff *= 60000; 
        if(isMaxClientOffset){
            convertedTime = getLocalTimeByTimestamp(timestamp - timeDiff);
        }else{
            convertedTime = getLocalTimeByTimestamp(timestamp + timeDiff);
        }
        
        document.getElementById("datepicker_user").value = convertedTime.D + 
            "-" + convertedTime.M + "-" + convertedTime.Y; 

        user_timeControl.value = convertedTime.h + ":" + convertedTime.m;

        if(isColorMode){
            setUserColor(parseInt(convertedTime.h), parseInt(convertedTime.m));
        }else{
            noColor();
        }
    }

    /*
    * set the customer date and time input box values & color
    *
    * @params: timestamp: milliseconds, 
    *          timeDiff: difference from offset of customer
    *          isMaxClientOffset: true if client GMT is larger
    */
    function setCustomerTime(timestamp, timeDiff, isMaxClientOffset){
        var convertedTime;
        timeDiff *= 60000;
        if(isMaxClientOffset){
            convertedTime = getLocalTimeByTimestamp(timestamp + timeDiff);
        }else{
            convertedTime = getLocalTimeByTimestamp(timestamp - timeDiff);
        }
        document.getElementById("datepicker_customer").value = convertedTime.D + "-" + 
            convertedTime.M + "-" + convertedTime.Y; 
        customer_timeControl.value = convertedTime.h + ":" + convertedTime.m;
        
        if(isColorMode){
            setCustomerColor(parseInt(convertedTime.h), parseInt(convertedTime.m));
        }else{
            noColor();
        }
        
    }

    //make object of ZAFClient
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '180px' });

    client.get('ticket').then(function(data){

        clientName = data.ticket.requester.name;
        userName = data.ticket.assignee.user.name;

        $("#custName").text(clientName);
        $("#userName").text(userName);

        clientOffset = data.ticket.requester.timeZone.offset;
        userOffset = data.ticket.assignee.user.timeZone.offset;
        timeDiff = Math.abs(clientOffset - userOffset);

        if(clientOffset > userOffset){
            isMaxClientOffset = true;
        }else{
            isMaxClientOffset = false;
        }

        setInterval(function(){ 
            if(document.getElementById("enable_color").checked){
                isColorMode = true;

                var timestamp = $("#datepicker_user").datepicker("getDate").getTime() +
                    (parseInt(user_timeControl.value.slice(0,2)) * 60 + 
                    parseInt(user_timeControl.value.slice(3,5))) * 60000;
                
                setCustomerTime(timestamp,timeDiff, isMaxClientOffset);

                timestamp = $("#datepicker_customer").datepicker("getDate").getTime() +
                    (parseInt(customer_timeControl.value.slice(0,2)) * 60 + 
                    parseInt(customer_timeControl.value.slice(3,5))) * 60000;
                
                setUserTime(timestamp,timeDiff, isMaxClientOffset);
            }else{
                isColorMode = false;
                noColor();
            }
/*
            clientTime = getTime(clientOffset);
            userTime = getTime(userOffset);
            document.getElementById("clientTime").innerHTML = "customer Time: " + "<code>" +
                clientTime.h + " : " + clientTime.m + " : " + clientTime.s + "</code>";
            document.getElementById("userTime").innerHTML = "Your Time: " + "<code>" + 
                userTime.h  + " : " + userTime.m  + " : " + userTime.s + "</code>";    
*/        
        }, 1000);

        clientTime = getTime(clientOffset);
        userTime = getTime(userOffset);
        
        $( "#datepicker_customer" ).datepicker(
            { 
                minDate: new Date(clientTime.Y, clientTime.M - 1, clientTime.D),
                dateFormat: "dd-mm-yy", 
            }
        );
        
        $( "#datepicker_user" ).datepicker(
            { 
                minDate: new Date(userTime.Y, userTime.M - 1, userTime.D),
                dateFormat: "dd-mm-yy", 
            }
        );

        document.getElementById("datepicker_customer").value = clientTime.D + "-" + clientTime.M + 
            "-" + clientTime.Y; 
        document.getElementById("datepicker_user").value = userTime.D + "-" + userTime.M + 
            "-" + userTime.Y; 

        customer_timeControl.value = clientTime.h + ":" + clientTime.m;
        user_timeControl.value = userTime.h + ":" + userTime.m;

        if(isColorMode){
            setUserColor(parseInt(userTime.h), parseInt(userTime.m));
            setCustomerColor(parseInt(clientTime.h), parseInt(clientTime.m));
        }else{
            noColor();
        }
        
        $("#datepicker_user").change(function(){
            var timestamp = $("#datepicker_user").datepicker("getDate").getTime() +
                (parseInt(user_timeControl.value.slice(0,2)) * 60 + 
                parseInt(user_timeControl.value.slice(3,5))) * 60000;

            setCustomerTime(timestamp,timeDiff, isMaxClientOffset);
        });

        $("#datepicker_customer").change(function(){
            var timestamp = $("#datepicker_customer").datepicker("getDate").getTime() +
                (parseInt(customer_timeControl.value.slice(0,2)) * 60 + 
                parseInt(customer_timeControl.value.slice(3,5))) * 60000;

                setUserTime(timestamp,timeDiff, isMaxClientOffset);
        });

        $("#customer_time").change(function(){
            var timestamp = $("#datepicker_customer").datepicker("getDate").getTime() +
                (parseInt(customer_timeControl.value.slice(0,2)) * 60 + 
                parseInt(customer_timeControl.value.slice(3,5))) * 60000;

                setUserTime(timestamp,timeDiff, isMaxClientOffset);
        });

        $("#user_time").change(function(){
            var timestamp = $("#datepicker_user").datepicker("getDate").getTime() +
                (parseInt(user_timeControl.value.slice(0,2)) * 60 + 
                parseInt(user_timeControl.value.slice(3,5))) * 60000;

            setCustomerTime(timestamp,timeDiff, isMaxClientOffset);
        });
    });

    $("#schedule").click(function(){
        var timestamp = $("#datepicker_customer").datepicker("getDate").getTime() +
            (parseInt(customer_timeControl.value.slice(0,2)) * 60 + 
            parseInt(customer_timeControl.value.slice(3,5))) * 60000;
        var customer_Time = new Date(timestamp).toString();
        customer_Time = customer_Time.substr(0, customer_Time.indexOf('G')); 
        
        timestamp = $("#datepicker_user").datepicker("getDate").getTime() +
            (parseInt(user_timeControl.value.slice(0,2)) * 60 + 
            parseInt(user_timeControl.value.slice(3,5))) * 60000;
        var user_Time = new Date(timestamp).toString();
        user_Time = user_Time.substr(0, user_Time.indexOf('G')); 

        var hours_since_due_date = parseInt(user_timeControl.value.slice(0,2));
        var tag = "scheduled_";
        switch(hours_since_due_date){
            case 0 : 
                tag += "0";
                break;
            case 1 : 
                tag += "1";
                break;
            case 2 : 
                tag += "2";
                break;
            case 3 : 
                tag += "3";
                break;
            case 4 : 
                tag += "4";
                break;
            case 5 : 
                tag += "5";
                break;
            case 6 : 
                tag += "6";
                break;
            case 7 : 
                tag += "7";
                break;
            case 8 : 
                tag += "8";
                break;
            case 9 : 
                tag += "9";
                break;
            case 10 : 
                tag += "10";
                break;
            case 11 : 
                tag += "11";
                break;
            case 12 : 
                tag += "12";
                break;
            case 13 : 
                tag += "13";
                break;
            case 14 : 
                tag += "14";
                break;
            case 15 : 
                tag += "15";
                break;
            case 16 : 
                tag += "16";
                break;
            case 17 : 
                tag += "17";
                break;
            case 18 : 
                tag += "18";
                break;
            case 19 : 
                tag += "19";
                break;
            case 20 : 
                tag += "20";
                break;
            case 21 : 
                tag += "21";
                break;
            case 22 : 
                tag += "22";                
                break;
            case 23 : 
                tag += "23";
                break;
        }
        for(var i = 0; i < 23; i++){
            client.invoke('ticket.tags.remove', "scheduled_" + i);
        }

        var userTime = user_Time.slice(0,3) + ", " + user_Time.slice(4,15) + ", " +
             user_Time.slice(16,21);
        
        var custTime = customer_Time.slice(0,3) + ", " + customer_Time.slice(4,15) + ", " +
            customer_Time.slice(16,21);

        client.invoke('ticket.tags.add', tag);
        client.invoke('ticket.tags.add', "scheduled");
        client.set('comment.text', "meeting scheduled at <br/>" + clientName + "'s Time: " + 
            custTime + "<br/>" + userName + "'s Time: " + userTime);

        client.set('ticket.type', "task");
        client.set('ticket.customField:due_date', new Date(timestamp));
    });

});
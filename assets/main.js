$(function() {

    var userOffset, clientOffset, clientTime, userTime, timeDiff, isMaxClientOffset,
        user_timeControl, customer_timeControl, isColorMode;

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
        if(h < 10){
            document.getElementById("user_time").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
            document.getElementById("datepicker_user").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
        }else if(h > 18){
            document.getElementById("user_time").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
            document.getElementById("datepicker_user").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
        }else{
            document.getElementById("user_time").style.backgroundColor = "rgba(60, 179, 113, 0.4)";
            document.getElementById("datepicker_user").style.backgroundColor = "rgba(60, 179, 113, 0.4)";
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
        if(h < 10){
            document.getElementById("customer_time").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
            document.getElementById("datepicker_customer").style.backgroundColor = "rgba(255, 99, 71, 0.4)"; 
        }else if(h > 18){
            document.getElementById("customer_time").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
            document.getElementById("datepicker_customer").style.backgroundColor = "rgba(255, 99, 71, 0.4)";
        }else{
            document.getElementById("customer_time").style.backgroundColor = "rgba(60, 179, 113, 0.4)";
            document.getElementById("datepicker_customer").style.backgroundColor = "rgba(60, 179, 113, 0.4)";
        }
    }

    //disable colors
    function noColor(){
        document.getElementById("customer_time").style.backgroundColor = "white";
        document.getElementById("datepicker_customer").style.backgroundColor = "white";
        document.getElementById("user_time").style.backgroundColor = "white";
        document.getElementById("datepicker_user").style.backgroundColor = "white";
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
    client.invoke('resize', { width: '100%', height: '200px' });

    client.get('ticket').then(function(data){

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

            clientTime = getTime(clientOffset);
            userTime = getTime(userOffset);
            document.getElementById("clientTime").innerHTML = "customer Time: " + "<code>" +
                clientTime.h + " : " + clientTime.m + " : " + clientTime.s + "</code>";
            document.getElementById("userTime").innerHTML = "Your Time: " + "<code>" + 
                userTime.h  + " : " + userTime.m  + " : " + userTime.s + "</code>";    
        
        }, 1000);

        clientTime = getTime(clientOffset);
        userTime = getTime(userOffset);
        
        $( "#datepicker_customer" ).datepicker(
            { 
                minDate: new Date(clientTime.Y, clientTime.M, clientTime.D),
                dateFormat: "dd-mm-yy", 
            }
        );
        
        $( "#datepicker_user" ).datepicker(
            { 
                minDate: new Date(userTime.Y, userTime.M, userTime.D),
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

        client.invoke('ticket.tags.add', "scheduled");
        client.set('comment.text', "meeting scheduled at <br/>customer time: " + 
            customer_Time + "<br/> Agent Time: " +user_Time );
    });

});
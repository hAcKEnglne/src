$(document).ready(function(){ 
    var today = getToday();
    var day = addDaysToDate(today, 14); // Imposta un range fino alle 2 settimane successive
    
    $('#datepicker1').attr('min', today);
    $('#datepicker1').attr('max', day);
    timeCheck($("#timepicker1"), $("#error_message_time1"));
    timeCheck($("#timepicker2"), $("#error_message_time2"));
    noWeekend($('#datepicker1'), $("#error_message_date1"));
    noWeekend($('#datepicker2'), $("#error_message_date2"));


    $.getScript("/js/cookie.js", function() {
        console.log("Script cookie.js loaded.");
        $btoken = readCookie('bearer_token');

        // Users
        viewUsers($btoken);
        
        // Washers
        viewWashers($btoken);
        
        // Washing program Status
        viewWashingPrograms($btoken);
        
        // Load Reservations
        $("#select_user_reservation").change(function() {
            viewReservationOfUser($btoken);
        });

        // Popup Users Status
        // Mostra Users Status
        $("#info_user_btn").click(function(){
            if($("#uname option[data-id='nouser']:selected").val() == "-- Select a User --"){
                console.log("No User selected");
                alert("No User selected!\nPick one!");
                return;
            }

            $("#backscreen").show();
            $("#info_user").show();
            let userid = $("#uname").val().split(" ")[0];
            $.ajax({
                url: `/api/user/${userid}`,
                type: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },

                success: function(response){
                    let res = response["data"];
                    $("#iduser").empty();
                    $("#idnumber").empty();
                    $("#name").empty();
                    $("#surname").empty();
                    $("#email").empty();
                    $("#nationalities").addClass("user_status");
                    //$("#check_user_status").empty();

                    $("#iduser").text(res.id);
                    $("#idnumber").val(res.matricola);
                    $("#name").val(res.nome);
                    $("#surname").val(res.cognome);
                    $("#email").val(res.email);
                    console.log("res nationality: ", res.nazionalita, typeof(res.nazionalita));
                    $(`#nationality option[value=${res.nationalita}]:selected`).attr("selected", true);
                    if(res.ruolo == 1){
                        $("#role").val("Admin");
                    }else{
                        $("#role").val("User");
                   }
                    if(res.stato){
                        $("#check_user_status").prop("checked", false);
                    }else{
                        $("#check_user_status").prop("checked", true);
                    }
                },
                error: function(e){
                    console.log(e);
                }
            });
        });

        // Chiudi
        $("#close_info_user").click(function(){
            $("#info_user").hide();
            $("#backscreen").hide();
        });

        // Users Status form
        $("#user_status").submit(function(event){
            event.preventDefault();
            
            $("#info_user").hide();
            $("#backscreen").hide();
            let userid = $("#uname").val().split(" ")[0];
            let email = $("#email").val();
            let idnumber = $("#idnumber").val();
            let name = $("#name").val();
            let surname = $("#surname").val();
            let nationality = $("#nationalities").val();
            let role = $("#role").val();
            let status;
            if ($("#check_user_status").prop("checked")){
                status = "NULL";
            }else{
                status = getToday() + " " + getCurrentTime();
            }
             
            $.ajax({
                url: `/api/user/${userid}`,
                type: 'PATCH',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                data: {
                    email: email,
                    nome: name,
                    cognome: surname,
                    matricola: idnumber,
                    nationalita: nationality,
                    ruolo: role,
                    deleted_at: status,
                },

                success: function(){

                },
                error: function(e){
                    console.log(e);
                }
            });
        });
        
        // Popup Washers Status
        // Mostra Washers Status
        $("#info_washer_btn").click(function(){
            if($("#wname option:selected").val() == "-- Select a Washer --"){
                console.log("No Washer selected");
                alert("No Washer selected!\nPick one!");
                return;
            }
            var washer = $("#wname").val().split(" ");
            var washerid = washer[0];
            $("#info_washer").show();
            $("#backscreen").show();
            $.ajax({
                url: `/api/washer/${washerid}`,
                type: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                dataType: 'json',

                success: function(response){
                    let res = response["data"];
                    $("#washerid").empty();
                    $("#washername").empty();
                    $("#washerid").html(res.id);
                    $("#washername").val(res.marca);
                    if(res.stato){
                        $("#check_washer_status").prop("checked", true);
                    }else{
                        $("#check_washer_status").prop("checked", false);
                    }
                },
                error: function(e){
                    console.log(e);
                }
            });
        });

        // Chiudi
        $("#close_info_washer").click(function(){
            $("#info_washer").hide();
            $("#backscreen").hide();
        });

        // Washer Status form
        $("#washer_status").submit(function(event){
            event.preventDefault();
            if($("#wpname option:selected").val() == "-- Select a Washer --"){
                console.log("No Washer selected");
                alert("No Washer selected!\nPick one!");
                return;
            }
            let washer = $("#wname").val().split(" ");
            let washerid = washer[0];
            let washername = $("#washername").val();
            let washerstatus;
            if($("#check_washer_status").prop("checked")){
                washerstatus = 1;
            }else{
                washerstatus = 0;
            }

            $("#info_washer").hide();
            $("#backscreen").hide();
            $.ajax({
                url: `/api/washer/${washerid}`,
                type: 'PATCH',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                dataType: 'json',
                data: {
                    id: washerid,
                    marca: washername,
                    stato: washerstatus
                },

                success: function(response){
                    //var res = response["data"];
                },
                error: function(e){
                    console.log(e);
                }
            });
        });
      
        $("#info_washing_program_btn").click(function(){
            if($("#wpname option:selected").val() == "-- Select a Washing Program --"){
                console.log("No Washing Program selected");
                alert("No Washing Program selected!\nPick one!");
                return;
            }
            var washingprogram = $("#wpname").val().split(" ");
            var washingprogramid = washingprogram[0];
            $("#info_washing_program").show();
            $("#backscreen").show();
            $.ajax({
                url: `/api/washing_program/${washingprogramid}`,
                type: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                dataType: 'json',

                success: function(response){
                    var res = response["data"];
                    $("#washingprogramid").empty();
                    $("#washingprogramname").empty();
                    $("#washingprogramprice").empty();
                    $("#washingprogramtime").empty();
                    
                    $("#washingprogramid").html(res.id);
                    $("#washingprogramname").val(res.nome);
                    $("#washingprogramprice").val(res.prezzo);
                    $("#washingprogramtime").val(res.durata);
                    if(res.stato){
                        $("#check_washing_program_status").prop("checked", true);
                    }else{
                        $("#check_washing_program_status").prop("checked", false);
                    }
                },
                error: function(e){
                    console.log(e);
                }
            });
        });

        $("#close_info_washing_program").click(function(){
            $("#info_washing_program").hide();
            $("#backscreen").hide();
        });

        $("#washing_program_status").submit(function(event){
            event.preventDefault();
            let washingprogram = $("#wpname").val().split(" ");
            let washingprogramid = washingprogram[0];
            let washingprogramname = $("#washingprogramname").val();
            let washingprogramprice = $("#washingprogramprice").val();
            let washingprogramtime = $("#washingprogramtime").val() + ":00";
            let washingprogramstatus;
            if($("#check_washing_program_status").prop("checked")){
                washingprogramstatus = 1;
            }else{
                washingprogramstatus = 0;
            }

            $("#info_washing_program").hide();
            $("#backscreen").hide();
            $.ajax({
                url: `/api/washing_program/${washingprogramid}`,
                type: 'PATCH',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                dataType: 'json',
                data: {
                    nome: washingprogramname,
                    prezzo: washingprogramprice,
                    durata: washingprogramtime,
                    stato: washingprogramstatus
                },

                success: function(response){
                    //var res = response["data"];
                },
                error: function(e){
                    console.log(e);
                }
            });
        });

        // Mostra tabella edit reservation
        $("#moreinfo_reservation").click(function(){
            if($("#select_reservation option:selected").val() == "-- Select a Reservation --"){
                console.log("No Reservation selected");
                alert("No Reservation selected!\nPick a User first!");
                return;
            }
            $("#edit_reservation").show();
            $("#backscreen").show();

            let suser = $("#select_user_reservation option:selected").val().split(" ");
            let sreservation = $("#select_reservation option:selected").val().split(" ");
            $("#user1").text(suser[0]);
            $("#reservation1").text(sreservation[0]);
            selectionWasher($btoken);
            selectionWashingProgram($btoken);
            $.ajax({
                url: `/api/user/${suser[0]}/reservation/${sreservation[0]}`,
                type: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },

                success: function(response){
                    $("#datepicker1").empty();
                    $("#timepicker1").empty();
                    //$(`#washer1`).empty();
                    //$(`#washing_program1`).empty();
                    
                    let res = response["data"].orario.split(" ");
                    let tempo = res[1].split(":");
                    let ore = tempo[0];
                    let minuti = tempo[1];

                    $("#datepicker1").val(res[0]);
                    $("#timepicker1").val(ore + ':' + minuti);
                    $(`#washer1 option[data-id=${response["data"].id_washer}]`).attr("selected", true);
                    $(`#washing_program1 option[data-id=${response["data"].id_washing_program}]`).attr("selected", true);
                },
                error: function(e){
                    console.log(e);
                }
            });
        });

        // Admin Edit Reservation
        $("#reservation_admin").submit(function(event){
            event.preventDefault();
            let userid = $("#user1").text();
            let reservationid = $("#reservation1").text();
            let orario = $("#datepicker1").val() + " " + $("#timepicker1").val() + ":00";
            let washer = $("#washer1").val().split(" ");
            let washerid = washer[0];
            let washingprogram = $("#washing_program1").val().split(" ");
            let washingprogramid = washingprogram[0];

            $("#edit_reservation").hide();
            $("#backscreen").hide();
            $.ajax({
                url: `/api/user/${userid}/reservation/${reservationid}`,
                type: 'PATCH',
                async: true,
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },

                data: {
                    orario: orario,
                    id_washer: washerid,
                    id_washing_program: washingprogramid
                },

                success: function(response){
                    console.log("Reservation Edited");
                    location.reload();
                },

                error: function(e){
                    console.log("Nessuna Prenotazione Disponibile", e);
                }
            });
        });

        // Chiude tabella edit reservation
        $("#close_edit_reservation").click(function(){
            $("#edit_reservation").hide();
            $("#backscreen").hide();
        });

        // Popup di conferma eliminazione
        // Mostra
        $("#delete_reservation_submit").click(function(){
            $("#delete_field").show();
            $("#backscreen").css("z-index", 4);
        });

        // Chiudi
        $("#cancel").click(function(){
            $("#delete_field").hide();
            $("#backscreen").css("z-index", 2);
        });

        // Conferma Eliminazione
        $("#confirm_delete_submit").click(function(){
            let userid = $("#user1").text();
            let reservationid = $("#reservation1").text();

            $("#delete_field").hide();
            $("#edit_reservation").hide();
            $("#backscreen").css("z-index", 2);
            $("#backscreen").hide();
            $.ajax({
                url: `/api/user/${userid}/reservation/${reservationid}`,
                type: 'DELETE',
                headers: {
                    "Authorization": 'Bearer ' + $btoken,
                    'Accept' : 'application/json'
                },
                
                success: function(response){
                    console.log("Reservation deleted.", response);
                    location.reload();
                },
                error: function(e){
                    console.log("Error Deleting", e);
                }
            });
        });

    });
});

// Visualizza gli utenti
function viewUsers($btoken){
    $.ajax({
        url: `/api/user/`,
        async: false,
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },

        success: function(response){
            let res = response["utenti"];
            $("#uname").empty();
            for(let i in res){
                $("#select_user_reservation").append(`<option data-id=${res[i].id}>` + res[i].id + " " + res[i].email + "</option>");
                $("#uname").append(`<option data-id=${res[i].id}>` + res[i].id + " " + res[i].email + "</option>");
            }
        },
        error: function(e){
            console.log("Error Creation ", e);
        }
    });
}

// Visualizza gli le reservation dell'utente selezionato
function viewReservationOfUser($btoken){
    let userid  = $("#select_user_reservation option:selected").attr("data-id");
    $.ajax({
        url: `/api/user/${userid}/reservation`,
        async: true,
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },

        success: function(response){
            let res = response["data"];
            if(res.length){
                $("#select_reservation").empty();
                for(let i in res){
                    let giorno_ora = res[i].orario.split(" ");
                    $("#select_reservation").append(`<option data-id=${res[i].id}>` + res[i].id + " " + dayFormat(giorno_ora[0]) + "</option>");
                }
            }else{
                console.log("No Reservation available");
                $("#select_reservation").empty();
                $("#select_reservation").append("<option style='display: none'>" + "No Reservations Avaiable" + "</option>");
            }       
        },
        error: function(e){
            console.log("Error Creation ", e);
        }
    });
}

// Stampa la lista delle washer
function selectionWasher($btoken){
    $.ajax({
        url: "/api/washer",
        type: 'GET', 
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },
        dataType: "json",

        success: function(response){
            let res = response["lavasciuga"];
            $('#washer1').empty();
            for(let i in res){
                if(res[i].stato){
                    $('#washer1').append(`<option data-id=${res[i].id}>` + res[i].id  + ' ' + res[i].marca + '</option>');
                }
           }
        },
        error: function(e){
            console.log("Error", e);
        }
    });
}
// Visualizza le washer
function viewWashers($btoken){
    $.ajax({
        url: `/api/washer/`,
        async: true,
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },

        success: function(response){
            let res = response["lavasciuga"];
            $("#wname").empty();
            for(let i in res){
                $("#wname").append(`<option data-id=${res[i].id}>` + res[i].id + " " + res[i].marca + "</option>");
            }
        },
        error: function(e){
            console.log("Error Creation ", e);
        }
    });
}

// Seleziona il programma lavaggio
function selectionWashingProgram($btoken){
    $.ajax({
        url: "/api/washing_program",
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },
        dataType: "json",

        success: function(response){
            let res = response['programma'];
            $('#washing_program1').empty();
            for(let i in res){
                if(res[i].stato){
                    $('#washing_program1').append(`<option data-id=${res[i].id}>` + res[i].id  + ' ' + res[i].nome + ' ' + res[i].prezzo + '€' + '</option>');
                }
            }
        },
        error: function(e){
            console.log("Error", e);
        }
    });
}

// Visualizza i washing program
function viewWashingPrograms($btoken){
    $.ajax({
        url: `/api/washing_program/`,
        async: true,
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + $btoken,
            'Accept' : 'application/json'
        },

        success: function(response){
            let res = response["programma"];
            $("#wpname").empty();
            for(let i in res){
                $("#wpname").append(`<option data-id=${res[i].id}>` + res[i].id + " " + res[i].nome + "</option>");
            }
        },
        error: function(e){
            console.log("Error Creation ", e);
        }
    });
}

// Controlla che il tempo rientri nel range prestabilito
function timeCheck(timepicker, errortime){
    timepicker.on('input', function(){
        let t = $(this).val();
        let [hour, minute]  = t.split(":");
        hour = parseInt(hour);
        minute = parseInt(minute);

        if(!((hour >= 8 && hour < 13) || (hour >= 16 && hour < 20))){
            timepicker.val('');
            errortime.css("display", "inline");
            errortime.css("color", "red");
            errortime.html('Out of time range:<br>The available time ranges are:<br>8:00 to 13:00 and 16:00 to 20:00');
        }else{
            errortime.css("display", "none");
            errortime.html('');
        }
        timepicker.blur();
    })
}

// Controlla se il giorno selezionato è un sabato o una domenica
function noWeekend(datepicker, errordate){
    datepicker.on('input', function(){
        let day = new Date(this.value).getUTCDay();
        if([6,0].includes(day)){ // Domenica= 0, Sabato= 6
            this.value = '';
            errordate.css("display", "inline");
            errordate.css("color", "red");
            errordate.html('Weekends are not allowed');
        }else{
            errordate.css("display", "none");
            errordate.html('');
        }
        datepicker.blur();
    });
}

// Ottiene la data odierna
function getToday(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    return  yyyy + '-' + mm + '-' + dd;
}

// Ottiene le ore minuti e secondi correnti
function getCurrentTime(){
    let now = new Date();
    let HH = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();

    return  HH + ':' + mm + ':' + ss;
}

// Formatta la data in dd/mm/yyyy
function dayFormat(day){
    let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
    let date = new Date(day);
    let gg = date.getDate();
    let mm = date.getMonth();
    let yyyy = date.getFullYear();

   return gg + "/" + months[mm] + "/" + yyyy;
}

// Ottiene la data a n giorni rispetto l'odierna
function addDaysToDate(date, days){
    let day = new Date(date);
    day.setDate(day.getDate() + days);
    let dd = String(day.getDate()).padStart(2, '0');
    let mm = String(day.getMonth() + 1).padStart(2, '0');
    let yyyy = day.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

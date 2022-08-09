function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    if (username == "") {
        toastr["error"]("Enter username");
    } else if (password == "") {
        toastr["error"]("Enter password");
    } else {
        $("#sign_in_submit").html("Processing...");
        // $.blockUI({
        //   message:
        //     '<div class="spinner-grow text-danger" role="status"><span class="visually-hidden"></span></div>',
        // });
        dopost({
            url: api_link + "route/auth.php",
            data: {
                action: "login",
                username: username,
                password: password,
            },
            type: "POST",
            success: function (response) {
                console.log(response);
                try {
                    var json = JSON.parse(response);
                    if (json.statuscode == 0) {
                        var ret = {
                            sessionid: json.data.sessionid,
                            userid: json.data.userid,
                        };
                        setItem('data', json.data);
                        // window.location.href = json.data.page + "?" + $.param(ret);
                    } else {
                        // $.unblockUI();
                        // callSweetMsg(json, "eCampus Portal", "error");
                        Swal.fire({
                            title: "ITA Portal",
                            html: json.status,
                            icon: "error",
                            buttonsStyling: true,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn-sm btn-primary" },
                        });
                        $("#sign_in_submit").html("Log in to dashboard");
                    }
                } catch (e) {
                    console.log(e.message);
                }
            },
        });
    }
}

function logOut() {
    Swal.fire({
        title: "Logout",
        html: "<p class='text-dark'>Are you sure you want to logout of your account?</p>",
        iconHtml: '<i class="bi bi-box-arrow-left text-primary fs-5x"></i>',
        showCancelButton: true,
        confirmButtonText: "Logout",
        customClass: {
            confirmButton: "btn btn-primary btn-sm",
            cancelButton: 'btn btn-danger btn-sm'
        },
    }).then((result) => {
        if (result.isConfirmed) {
            mainLogout();
        }
    });
}

function mainLogout() {
    dopost({
        url: api_link + "route/users.php",
        data: {
            action: "logout",
            userid: getItem("userid"),
            sessionid: getItem("sessionid")
        },
        type: "POST",
        success: function(response) {
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    console.log("You've logged off successfully");
                    window.localStorage.clear();
                    window.location.href = "../../index.html";
                    resetItems(true);
                } else {
                    console.log("Something went wrong...");
                }
            } catch (e) {
                console.log(e.message);
            }
        },
    });
}

function goHome() {
    var ret = {
        sessionid: newQueryString('sessionid'),
        userid: newQueryString('userid')
    };
    // window.location.href = "index.html?" + serialize(ret);
    window.location.href = json.data.page + "?" + serialize(ret);
}

// GET DASHBOARD
function getDashboard() {
    setItem("token", newQueryString("token"));
    // setItem("sessionid", newQueryString("sessionid"));
    blockUI.block();

    return $.ajax({
        url: "https://covid-vaccine-system.herokuapp.com/auth/user-details/",
        data: {
            // userid: newQueryString("userid"),
            token: newQueryString("token"),
            // sessionid: newQueryString("sessionid"),
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + newQueryString("token"),
        },
        type: "GET",
        success: function(response) {
            try {
                // var json = JSON.parse(response);
                blockUI.release();
                if (response.status == 200) {
                    console.log(response);
                    setItem("token", response.token);
                    setItem("first_name", response.first_name);
                    setItem("last_name",  response.last_name);
                    
                    $("#staff_name").html(response.first_name);
                    // $(".first_name").html(json.data.first_name);
                    // $(".email").html(json.data.email);
                    // var mnu = ecampusMenuCreator(json.data.menu)
                    // mnu.insertAfter($("#dashboard_link"));

                } else {
                    // logOut();
                }
            } catch (e) {
                console.log(e.message);
            }
        },
    });
}


function getRecentBatch() {
    return dopost({
        "url": api_link + "route/users.php",
        "data": {
            "action": "getdashboard",
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid')
        },
        "type": "POST",
        "success": function (response) {
            try {
                var json = JSON.parse(response);

                if (json.statuscode == 0) {
                    var table = $("#recent_batch").DataTable({
                        // buttons: ['copy', 'excel', 'pdf', 'print'],
                        searching: true,
                        responsive: true,
                        data: json.data,
                        // dom: 'Bfrtip',
                        columns: [
                            { title: 'Application Name', data: ''},
                            { title: 'Total Students', data: '' },
                            { title: 'Application type', data: '' },
                            { title: 'Total Applied', data: '' },
                        ],
                        "columnDefs": [{
                            "defaultContent": "-",
                            "targets": "_all"
                        },]
                    });
                } else {
                    // logOut();
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    });
}

var target = document.querySelector("#kt_body");

var blockUI = new KTBlockUI(target, {
    message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Loading...</div>',
    overlayClass: "bg-white bg-opacity-50",
});

// Get list of all applications
function applicationList() {
    blockUI.block();
    return dopost({
        type: "POST",
        url: api_link + "route/applconfig.php",
        data: {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "get_appl_configs",
        },
        success: function(response) {
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    blockUI.release();
                    var estring = "";
                    $.each(json.data, function(k, v) {
                        if(k % 2 == 0) 
                        var image = `<img src="../../landing/assets/images/course-1.png" class="card-img-top p-2" alt="application image">`;
                        else 
                        var image = `<img src="../../landing/assets/images/course-2.png" class="card-img-top p-2" alt="application image">`;
                        var course = `<div class="col-lg-4 col-md-6">
                                        <div class="card mb-3 border-0" style="background-color: #FAFAFA;">
                                            ${image}
                                            <div class="card-body">
                                                <h1 class="card-title mb-3">${v.appl_name}</h1>
                                                <p class="card-text text-muted mb-2"><i class="bi bi-building pe-2"></i>Rivers State University</p>
                                                <p class="card-text text-muted"><i class="far fa-clock pe-2"></i>${v.appl_status}</p>
                                                <div class="separator my-4"></div>
                                                <div class="d-flex justify-content-between">
                                                    <h4 class="my-auto">₦${v.amount}</h4>
                                                    <a href="#" class="btn btn-sm btn-primary" onclick="enrollCourse('${v.course_code}')">Enroll</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                
                        estring += course;
                    });
                
                    $("#appl_list").html(estring);
                } else {
                    blockUI.release();
                    $("#courseDiv").hide();
                    $("#noCourseDiv").show();
                    Swal.fire({
                        title: "ITA Portal",
                        html: json.status,
                        icon: "error",
                        buttonsStyling: true,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-sm btn-primary" },
                    });
                }
            } catch (e) {
                console.error(e.message);
            }
        },
        error: function() {
            loadingerr;
        },
    });
}

// Enroll a course
function enrollCourse(course) {
    // blockUI.block();
    setItem("courseId", course);
    showAjax("", "student/enroll_form.html", "page_content");
}

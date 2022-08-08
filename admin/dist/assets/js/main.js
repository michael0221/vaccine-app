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
                json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $("#courseDiv").show();
                    $("#noCourseDiv").hide();
                    if ($.fn.DataTable.isDataTable("#appl_table")) {
                        $("#appl_table").DataTable().destroy();
                    }
                    blockUI.release();
                    var table = $("#appl_table").DataTable({
                        // buttons: ['copy', 'excel', 'pdf'],
                        data: json.data,
                        // dom: '<lf<t>ip>',
                        dom: "<'row'" +
                            "<'col-sm-6 d-flex align-items-center justify-conten-start'l>" +
                            "<'col-sm-6 d-flex align-items-center justify-content-end'f>" +
                            ">" +
                            "<'table-responsive'tr>" +
                            "<'row'" +
                            "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
                            "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
                            ">",
                        responsive: true,
                        columns: [
                            { title: "Application Name", data: "appl_name" },
                            { title: "Course Code", data: "course_code" },
                            { title: "ApplicationType", data: "appl_type" },
                            { title: "Amount", data: "amount" },
                            { title: "From", data: "start_date" },
                            { title: "To", data: "end_date" },
                            { title: "Status", data: "appl_status" },
                            { title: "Actions" },
                        ],
                        columnDefs: [{
                                targets: -1,
                                orderable: false,
                                searchable: false,
                                render: function(data, type, row) {
                                    var retstr = `<a href="#" onclick="editApplication('${row.appl_code}')" class="btn btn-sm btn-primary me-2" title="Edit application"><i class='bi bi-pencil-square'></i></a>`;
                                    retstr += `<a href="#" onclick="deleterecord('${row.appl_code}',this)" class="btn btn-sm btn-danger" title="Delete application"><i class='bi bi-trash' ></i></a>`;
                                    return retstr;
                                },
                            },

                            { defaultContent: "-", targets: "_all", },
                            // {
                            //     targets: 4,
                            //     orderable: true,
                            //     searchable: true,
                            //     render: function(data, type, row) {
                            //         var _semester = "Semester";
                            //         if (row.semester == 1) {
                            //             var _number = "First";
                            //         } else if (row.semester == 2) {
                            //             var _number = "Second";
                            //         } else if (row.semester == 3) {
                            //             var _number = "Third";
                            //         } else {
                            //             var _number = row.semester;
                            //         }
                            //         var retstr = "<span>" + _number + " " + _semester + "</span>";
                            //         return retstr;
                            //     },
                            // }
                        ],
                    });
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

// Get list of all courses
function coursesList() {
    blockUI.block();
    return dopost({
        type: "POST",
        url: api_link + "route/courses.php",
        data: {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "get_courses",
        },
        success: function(response) {
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $("#courseDiv").show();
                    $("#noCourseDiv").hide();
                    if ($.fn.DataTable.isDataTable("#courses_table")) {
                        $("#courses_table").DataTable().destroy();
                    }
                    blockUI.release();
                    var table = $("#courses_table").DataTable({
                        // buttons: ['copy', 'excel', 'pdf'],
                        data: json.data,
                        // dom: '<lf<t>ip>',
                        dom: "<'row'" +
                            "<'col-sm-6 d-flex align-items-center justify-conten-start'l>" +
                            "<'col-sm-6 d-flex align-items-center justify-content-end'f>" +
                            ">" +
                            "<'table-responsive'tr>" +
                            "<'row'" +
                            "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
                            "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
                            ">",
                        responsive: true,
                        columns: [
                            { title: "Course Name", data: "course_title" },
                            { title: "Course Code", data: "course_code" },
                            { title: "Amount", data: "course_amount" },
                            { title: "Course Category", data: "category" },
                            { title: "From", data: "start_date" },
                            { title: "To", data: "end_date" },
                            { title: "Actions" },
                        ],
                        columnDefs: [{
                                targets: -1,
                                orderable: false,
                                searchable: false,
                                render: function(data, type, row) {
                                    var retstr = `<a href="#" onclick="editCourses('${row.course_code}')" class="btn btn-sm btn-primary me-2 mb-1" title="Edit course"><i class='bi bi-pencil-square'></i>Edit</a>`;
                                    retstr += `<a href="#" onclick="deleterecord('${row.course_code}',this)" class="btn btn-sm btn-danger" title="Delete course"><i class='bi bi-trash' ></i>Delete</a>`;
                                    return retstr;
                                },
                            },

                            { defaultContent: "-", targets: "_all", },
                        ],
                    });
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

// Get list of all batches
function batchList() {
    blockUI.block();

    return dopost({
        type: "POST",
        url: api_link + "route/cohorts.php",
        data: {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "get_cohorts",
        },
        success: function(response) {
            try {
                json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $("#batchDiv").show();
                    $("#noBatchDiv").hide();
                    if ($.fn.DataTable.isDataTable("#batches_table")) {
                        $("#batches_table").DataTable().destroy();
                    }
                    blockUI.release();
                    var table = $("#batches_table").DataTable({
                        // buttons: ['copy', 'excel', 'pdf'],
                        data: json.data,
                        // dom: '<lf<t>ip>',
                        dom: "<'row'" +
                            "<'col-sm-6 d-flex align-items-center justify-conten-start'l>" +
                            "<'col-sm-6 d-flex align-items-center justify-content-end'f>" +
                            ">" +
                            "<'table-responsive'tr>" +
                            "<'row'" +
                            "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
                            "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
                            ">",
                        responsive: true,
                        columns: [{
                            title: "Application Name",
                            data: "application"
                        }, {
                            title: "Batch Code",
                            data: "batchcode"
                        }, {
                            title: "Date From",
                            data: "startdate"
                        }, {
                            title: "Date To",
                            data: "enddate"
                        }, {
                            title: "Batch Days",
                            data: "batchdys"
                        }, {
                            title: "Batch Status",
                            data: "status"
                        }, {
                            title: "Actions"
                        }, ],
                        columnDefs: [{
                                targets: -1,
                                orderable: false,
                                searchable: false,
                                render: function(data, type, row) {
                                    var retstr = `<div class="d-flex align-items-center">`
                                    retstr += `<a href="#" onclick="addTimeSlot('${row.batch_id}','${row.batchcode}')" class="btn btn-sm btn-primary me-2 mb-1" title="Add Time Slot">Add Time Slot </a>`
                                    retstr += `<a href="#" onclick="editBatch('${row.batch_id}')" class="btn btn-outline btn-sm btn-outline-primary me-2 mb-1" title="Edit batch">Edit</a>`;
                                    retstr += `<i onclick="deleteBatch('${row.batch_id}',this)" class='bi bi-trash fs-3 text-danger' ></i>`;
                                    retstr += `</div>`
                                    return retstr;
                                },
                            }, {
                                targets: 5,
                                orderable: false,
                                searchable: false,
                                render: function(data, type, row) {
                                    var status = row.status;
                                    var color = ''
                                    switch (status) {

                                        case "On going":
                                            color = "primary"
                                            break;
                                        case "Closed":
                                            color = "danger"
                                            break;
                                        case "Pending":
                                            color = "warning"
                                            break;
                                        default:
                                            color = "success"

                                    }
                                    var retstr = `<span class="badge badge-light-${color}">${status}</span>`
                                    return retstr;
                                },
                            },

                            {
                                defaultContent: "-",
                                targets: "_all",
                            },

                        ],
                    });
                } else {
                    blockUI.release();
                    $("#batchDiv").hide();
                    $("#noBatchDiv").show();
                    Swal.fire({
                        title: "ITA Portal",
                        html: json.status,
                        icon: "error",
                        buttonsStyling: true,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-sm btn-primary"
                        },
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

function populateCollectionXX() {
    $.blockUI({
        message: 'Processing....'
    });
    dopost({
        "type": "POST",
        "url": api_link + "route/payment.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "listcollections"
        },
        "success": function (response) {
            try {
                json = JSON.parse(response);
                $.unblockUI('hide');
                var table = $('#collection_table').DataTable({
                    buttons: ['copy', 'excel', 'pdf'],
                    data: json.data,
                    dom: 'Bfrtip',
                    //responsive:true,

                    columns: [
                        {
                            title: "S/no",
                            data: "sno"
                        },
                        {
                            title: "Collection Name",
                            data: "collection_name"
                        },
                        {
                            title: "Application",
                            data: "application_code"
                        },
                        {
                            title: "Collection Code",
                            data: "collection_code"
                        },
                        {
                            title: "Amount",
                            data: "collection_amount"
                        },
                        {
                            title: "Payment Gateway",
                            data: "payment_gateway"
                        },
                        {
                            title: "Payment Mode",
                            data: "payment_mode"
                        },
                        {
                            title: "Payment Status",
                            data: "payment_status"
                        },
                        {
                            title: "Actions"
                        }

                        ],
                    "columnDefs": [{
                            "targets": -1,
                            "orderable": false,
                            "searchable": false,
                            "render": function (data, type, row) {
                                var retstr = "<a href=\"#\" onclick=\"showedit('" + row.collection_code + "')\" class=\"btn btn-outline-primary m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air\"><i class=\"la la-edit\"></i></a> ";
                                retstr += "<a href=\"#\" onclick=\"deleterecord('" + row.collection_code + "')\" class=\"btn btn-outline-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air\"><i class=\"la la-close\"></i></a>";
                                return retstr;
                            }
                        },
                        {
                            "targets": 7,
                            "orderable": false,
                            "searchable": false,
                            "render": function (data, type, row) {
                                var myclass = 'primary';
                                var myvalue = 'Active';
                                if (row.payment_status == '0') {
                                    myclass = 'danger';
                                    myvalue = 'Not Active';
                                }
                                var retstr = '<span class="m-badge m-badge--' + myclass + ' m-badge--wide">' + myvalue + '</span>';
                                return retstr;
                            }
                        }

                                      ]
                });


            } catch (e) {
                console.error(e.message);
            }
        },
        "error": loadingerr
    });

}



function populateCollection() {
    blockUI.block();
    return dopost({
        type: "POST",
        url: api_link + "route/payments.php",
        data: {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "listcollections",
        },
        success: function (response) {
            try {
                json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $("#collectionDiv").show();
                    $("#nocollectionDiv").hide();
                    if ($.fn.DataTable.isDataTable("#collection_table")) {
                        $("#collection_table").DataTable().destroy();
                    }
                    blockUI.release();
                    var table = $("#collection_table").DataTable({
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
                            {
                                title: "S/no",
                                data: "sno"
                        },
                            {
                                title: "Collection Name",
                                data: "collection_name"
                        },
                            {
                                title: "Application",
                                data: "application_code"
                        },
                            {
                                title: "Collection Code",
                                data: "collection_code"
                        },
                            {
                                title: "Amount",
                                data: "collection_amount"
                        },
                            {
                                title: "Payment Gateway",
                                data: "payment_gateway"
                        },
                            {
                                title: "Payment Mode",
                                data: "payment_mode"
                        },
                            {
                                title: "Payment Status"
                        },
                            {
                                title: "Actions"
                        }

                        ],
                        columnDefs: [{
                                targets: -1,
                                orderable: false,
                                searchable: false,
                                render: function (data, type, row) {
                                    var retstr = `<div class="d-flex align-items-center">`
                                    retstr += `<a href="#" onclick="editBatch('${row.sno}')" class="btn btn-outline btn-sm btn-outline-primary me-2 mb-1" title="Edit batch">Edit</a>`;
                                    retstr += `<i onclick="deleteBatch('${row.sno}',this)" class='bi bi-trash fs-3 text-danger' ></i>`;
                                    retstr += `</div>`
                                    return retstr;
                                },
                            }, {
                                targets: 5,
                                orderable: false,
                                searchable: false,
                                render: function (data, type, row) {
                                    var status = row.payment_status;
                                    var color = ''
                                    switch (status) {

                                        case 1:
                                            color = "success"
                                            break;
                                        case 0:
                                            color = "danger"
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
        error: function () {
            loadingerr;
        },
    });
}





function donew() {
    $("#accounts_modal").modal({
        show: true
    });

}

function showform() {

    $("#modal_body").load("admin/collections_edit.html", function (responseTxt, statusTxt, xhr) {

        $("#btn_submit").attr("onclick", "createcollection()");
        $("#btn_submit").html("Create New Collection");
        $("#collections_modal").modal({
            show: true
        });
    });

}

function showedit(collection) {

    $(document).ajaxStart(mApp.blockPage({
        overlayColor: "#000000",
        type: "loader",
        state: "primary",
        message: "Processing..."
    })).ajaxStop(mApp.unblockPage);

    dopost({

        "type": "POST",
        "url": api_link + "/collections.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "collection": collection,
            "action": "getcollection"
        },
        "success": function (response) {
            try {
                var json = JSON.parse(response);

                if (json.statuscode == 0) {
                    $("#modal_body").load("admin/collections_edit.html", function (responseTxt, statusTxt, xhr) {
                        autopopulateForm($("#edit_collections"), removeNulls(json.data));
                        $("#btn_submit").attr("onclick", "updaterecord('" + collection + "')");
                        $("#btn_submit").html("Update Collection");
                        $("#error_div").html('');

                        //showAjax('','admin/bank_accounts_edit.html','modal_body');
                    });
                    $("#collections_modal").modal({
                        backdrop: true
                    });

                } else {
                    doshowalert("Error", json)
                }

            } catch (e) {
                console.error(e.message);
            }
        },
        "error": loadingerr
    });


    //$('#class1 option:selected').html(queryString('class'));

}

function createcollection() {
    //$('#class1 option:selected').html(queryString('class'));
    var otp = $("#otp").val();
    if (otp == "" || otp == null) {
        doalert("Please Enter OTP");
        return false;
    }
    var postdata = $("#add_collections").serialize();
    blockUI.block();
    dopost({
        "type": "POST",
        "url": api_link + "/route/payments.php",
        "data": postdata + "&userid=" + getItem('userid') + "&sessionid=" + getItem('sessionid') + "&action=savecollection&otp=" + otp,
        "success": function (response) {
            try {

                var json = JSON.parse(response);
                blockUI.release();
                if (json.statuscode == 0) {
                    toastr.success(json.status);
                    $("#add_collections").resetForm();
                    $(function () {
                        $('#exampleModal').modal('toggle');
                    });
                    populateCollection();
                } else if (json.statuscode == -3) {
                    Swal.fire({
                        title: "ITA Portal",
                        html: json.data,
                        icon: "error",
                        buttonsStyling: true,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-sm btn-primary"
                        },
                    });

                } else {
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
        //  "error": loadingerr
    });

}


function updaterecord(actid) {
    //$('#class1 option:selected').html(queryString('class'));
    var otp = $("#optv").val();
    if (otp == "" || otp == null) {
        doalert("Please Enter OTP");
        return false;
    }
    var splitinfo = [];
    var postdata = $("#edit_collections").serialize();
    postdata += "&userid=" + getItem('userid') + "&sessionid=" + getItem('sessionid') + "&action=updatecollection&actid=" + actid + "&split_info=" + splitinfo + "&otp=" + otp;
    /*
    var postdata = {
          "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "tax_name":$("#tax_name").val(),
            "tax_code":$("#tax_code").val(),
            "tax_subname":$("#tax_subname").val(),
            "tax_description":$("#tax_description").val(),
            "tax_amount":$("#tax_amount").val(),
            "payers_role":$("#payers_role").val(),
            "collection_account":$("#collection_account").val(),
            "school_category":$("#school_category option:selected").val(),
            "tax_status":$("#tax_status").val(),
            "action":"updatecollection",
            "otp":otp,
            "actid":actid,
            "split_info":[]
      }
      */
    $("tr.selected").each(function () {
        var split_info = {};
        $(this).find('td').each(function (idx, el) {
            switch (idx) {
                case 0:
                    split_info['id'] = $(this).find('#accountid').val();;
                    break;
                case 1:
                    split_info['transaction_split_ratio'] = $(this).find('#tratio').val();
                    break;
                case 2:
                    split_info['transaction_charge_type'] = $(this).find('#ctype option:selected').val();
                    break;
                case 3:
                    split_info['transaction_charge'] = $(this).find('#tcharge').val();
                    break;


            }
        });
        if (split_info != {})
            postdata.split_info.push(split_info);
    });

    dopost({

        "type": "POST",
        "url": api_link + "/collections.php",
        "data": postdata,
        "success": function (response) {
            try {

                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $("#page_content").load("admin/collections.html", function (responseTxt, statusTxt, xhr) {
                        $("#collections_modal").modal('hide');
                        // swal("Successful!","");
                        mApp.unprogress(), swal({
                            title: "GOOD",
                            text: "Collection updated successfully!",
                            type: "success",
                            confirmButtonClass: "btn btn-secondary m-btn m-btn--wide"
                        });

                    });
                } else {
                    swal("Input Error", json.status);
                }

            } catch (e) {
                console.error(e.message);
            }
        },
        "error": loadingerr
    });

}


function deleterecord(actid) {

    bootbox.confirm("Are you sure you want to delete this record?", function (result) {

        if (result == true) {

            mApp.blockPage({
                overlayColor: "#000000",
                type: "loader",
                state: "primary",
                message: "Processing..."
            });
            dopost({

                "type": "POST",
                "url": api_link + "/collections.php",
                "data": {
                    "userid": getItem('userid'),
                    "sessionid": getItem('sessionid'),
                    "action": "deletecollection",
                    "actid": actid
                },
                "success": function (response) {
                    try {
                        $.unblockUI('hide');
                        var json = JSON.parse(response);
                        if (json.statuscode == 0) {
                            doshowalert("Successful", json);

                            showAjax('', 'admin/collections.html', 'page_content');

                        } else {
                            $("#error_div").html(function () {
                                var retstr = '<div class="m-alert m-alert--outline m-alert--outline-2x alert alert-warning alert-dismissible fade show" role="alert">';
                                retstr += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button><strong>';
                                retstr += 'Error! </strong>' + json.status + ' ' + json.data + '</div>';
                                return retstr;
                            });
                        }

                    } catch (e) {
                        console.error(e.message);
                    }
                },
                "error": loadingerr
            });
        }


    });


}



$("#btnAdd").click(function () {
    var div = $("<tr />");
    div.html(GetDynamicTextBox(""));
    $("#TextBoxContainer").append(div);
});
$(".remove").click(function () {
    $(this).closest("tr").remove();
});

function GetDynamicTextBox(value) {
    return '<td><input name = "DynamicTextBox" type="text" value = "' + value + '" class="form-control" /></td>' + '<td><select name="" class="form-control"><option> Select</option><option> Male</option><option> Female</option></select></td>' + '<td><input name = "DynamicTextBox" type="radio" value = "' + value + '" /></td>' + '<td><input name = "DynamicTextBox" type="checkbox" value = "' + value + '" /></td>' + '<td><button type="button" class="btn btn-danger remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>'
}

// getApplications();
function getApplication() {
    blockUI.block();
    return dopost({
        type: "POST",
        url: api_link + "route/applconfig.php",
        data: {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "get_appl_configs",
        },
        "success": function (response) {
            try {
                blockUI.release();
                var json = JSON.parse(response);
                var data = json.data;
                if (json.statuscode == 0) {


                    $('#application_code').html("<option>Select Application</option>");
                    for (var idx in json.data) {
                        var option = $("<option />");
                        option.text(json.data[idx].appl_name);
                        option.val(json.data[idx].appl_code);
                        $("#application_code").append(option);
                    }


                    //  cId.select2({
                    //      tags: true
                    //  });
                }

            } catch (e) {
                console.error(e.status);
            }
        },
        // "error": loadingerr
    });
}

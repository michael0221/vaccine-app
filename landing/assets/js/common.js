var api_link = window.location.protocol + "//" + window.location.host + "/php/api/";
// var api_link = window.location.protocol + "//" + window.location.host + (window.location.host.indexOf(demoServer) == -1 ? "/mis" : "") + "/php/api/";
function getPathLocation() {
    var myLoc = window.location.href;
    if (myLoc.indexOf("/student/") == -1 && myLoc.indexOf("/admin/") == -1)
        return ".";
    else
        return "..";
}
var formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
});
const serialize = obj => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');
var applyAccountBalance = function (obj, balance, feeamount) {
    if ($(obj).prop('checked') == false)
        return;
    var balApply = parseFloat(feeamount > balance ? balance : feeamount);
    var diff = parseFloat(feeamount - balApply);
    balance = parseFloat(balance);
    var msg = "You are about to apply " + balApply.toMoney() + " from your account balance of " + balance.toMoney() + " to this fee payment.";
    if (diff > 0) {
        msg += " However you will be required to pay the difference of " + diff.toMoney() + " with the TopUp option.";
    }
    msg += " Do you wish to proceed with this action?";
    Swal.fire({
        icon: 'info',
        title: 'eCampus Portal',
        text: msg,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            var button = $(obj).parent().parent().parent().parent().find("button");
            var payPanelData = JSON.parse(button.attr('postdata'));
            $(obj).prop('checked', false);
            dopost({
                "url": api_link + "/fetch_priv_data.php",
                "data": {
                    "userid": getItem('userid'),
                    "sessionid": getItem('sessionid'),
                    "action": "applyaccountbalance",
                    "data": payPanelData.paypanel
                },
                "type": "POST",
                "success": (response) => {
                    try {
                        var json = JSON.parse(response);
                        if (json.statuscode == 0) {
                            window.location.reload();
                        } else
                            callSweetMsg(json, "eCampus Portal", "error");


                    } catch (e) {
                        $.unblockUI();
                        console.log(e.message);
                    }

                },
                "error": function (jqXHR, textStatus) {
                    $.unblockUI();
                    console.log("Login Error");
                }
            });
        } else if (result.isDenied) {
            $(obj).prop('checked', false);
        }
    })

}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getstates(state = null) {
    var ngstates = {
        "Abia": [
            " Aba North",
            "Aba South",
            "Arochukwu",
            "Bende",
            "Ikwuano",
            "Isiala-Ngwa North",
            "Isiala-Ngwa South",
            "Isuikwato",
            "Obi Ngwa",
            "Ohafia",
            "Osisioma Ngwa",
            "Ugwunagbo",
            "Ukwa East",
            "Ukwa West",
            "Umu-Neochi",
            "Umuahia North",
            "Umuahia South"
        ],
        "Abuja": [
            "Abaji",
            "Abuja Municipal",
            "Bwari",
            "Gwagwalada",
            "Kuje",
            "Kwali"
        ],
        "Adamawa": [
            "Demsa",
            "Fufore",
            "Ganaye",
            "Gireri",
            "Gombi",
            "Guyuk",
            "Hong",
            "Jada",
            "Lamurde",
            "Madagali",
            "Maiha",
            "Mayo-Belwa",
            "Michika",
            "Mubi North",
            "Mubi South",
            "Numan",
            "Shelleng",
            "Song",
            "Toungo",
            "Yola North",
            "Yola South"
        ],
        "Akwa Ibom": [
            "Abak",
            "Eastern Obolo",
            "Eket",
            "Esit Eket",
            "Essien Udim",
            "Etim Ekpo",
            "Etinan",
            "Ibeno",
            "Ibesikpo Asutan",
            "Ibiono Ibom",
            "Ika",
            "Ikono",
            "Ikot Abasi",
            "Ikot Ekpene",
            "Ini",
            "Itu",
            "Mbo",
            "Mkpat Enin",
            "Nsit Atai",
            "Nsit Ibom",
            "Nsit Ubium",
            "Obot Akara",
            "Okobo",
            "Onna",
            "Oron",
            "Oruk Anam",
            "Udung Uko",
            "Ukanafun",
            "Uruan",
            "Urue-Offong\/Oruko",
            "Uyo"
        ],
        "Anambra": [
            "Aguata",
            "Anambra East",
            "Anambra West",
            "Anaocha",
            "Awka North",
            "Awka South",
            "Ayamelum",
            "Dunukofia",
            "Ekwusigo",
            "Idemili North",
            "Idemili south",
            "Ihiala",
            "Njikoka",
            "Nnewi North",
            "Nnewi South",
            "Ogbaru",
            "Onitsha North",
            "Onitsha South",
            "Orumba North",
            "Orumba South",
            "Oyi"
        ],
        "Bauchi": [
            "Alkaleri",
            "Bauchi",
            "Bogoro",
            "Damban",
            "Darazo",
            "Dass",
            "Ganjuwa",
            "Giade",
            "Itas\/Gadau",
            "Jama'are",
            "Katagum",
            "Kirfi",
            "Misau",
            "Ningi",
            "Shira",
            "Tafawa-Balewa",
            "Toro",
            "Warji",
            "Zaki"
        ],
        "Bayelsa": [
            "Brass",
            "Ekeremor",
            "Kolokuma\/Opokuma",
            "Nembe",
            "Ogbia",
            "Sagbama",
            "Southern Ijaw",
            "Yenegoa"
        ],
        "Benue": [
            "Ado",
            "Agatu",
            "Apa",
            "Buruku",
            "Gboko",
            "Guma",
            "Gwer East",
            "Gwer West",
            "Katsina-Ala",
            "Konshisha",
            "Kwande",
            "Logo",
            "Makurdi",
            "Obi",
            "Ogbadibo",
            "Ohimini",
            "Oju",
            "Okpokwu",
            "Oturkpo",
            "Tarka",
            "Ukum",
            "Ushongo",
            "Vandeikya"
        ],
        "Borno": [
            "Abadam",
            "Askira\/Uba",
            "Bama",
            "Bayo",
            "Biu",
            "Chibok",
            "Damboa",
            "Dikwa",
            "Gubio",
            "Guzamala",
            "Gwoza",
            "Hawul",
            "Jere",
            "Kaga",
            "Kala\/Balge",
            "Konduga",
            "Kukawa",
            "Kwaya Kusar",
            "Mafa",
            "Magumeri",
            "Maiduguri",
            "Marte",
            "Mobbar",
            "Monguno",
            "Ngala",
            "Nganzai",
            "Shani"
        ],
        "Cross River": [
            "Abi",
            "Akamkpa",
            "Akpabuyo",
            "Bakassi",
            "Bekwara",
            "Biase",
            "Boki",
            "Calabar Municipality",
            "Calabar South",
            "Etung",
            "Ikom",
            "Obanliku",
            "Obudu",
            "Odubra",
            "Odukpani",
            "Ogoja",
            "Yala",
            "Yarkur"
        ],
        "Delta": [
            "Aniocha",
            "Aniocha South",
            "Bomadi",
            "Burutu",
            "Ethiope East",
            "Ethiope West",
            "Ika North-East",
            "Ika South",
            "Isoko North",
            "Isoko south",
            "Ndokwa East",
            "Ndokwa West",
            "Okpe",
            "Oshimili",
            "Oshimili North",
            "Patani",
            "Sapele",
            "Udu",
            "Ughelli North",
            "Ughelli South",
            "Ukwani",
            "Uvwie",
            "Warri Central",
            "Warri North",
            "Warri South"
        ],
        "Ebonyi": [
            "Abakaliki",
            "Afikpo North",
            "Afikpo South",
            "Ebonyi",
            "Ezza",
            "Ezza South",
            "Ishielu",
            "Ivo",
            "lkwo",
            "Ohaozara",
            "Ohaukwu",
            "Onicha"
        ],
        "Edo": [
            "Akoko-Edo",
            "Central",
            "Egor",
            "Esan Central",
            "Esan North-East",
            "Esan South-East",
            "Esan West",
            "Etsako Central",
            "Etsako East",
            "Igueben",
            "Oredo",
            "Orhionwon",
            "Ovia South-East",
            "Ovia SouthWest",
            "Owan",
            "Uhunmwonde",
            "Ukpoba"
        ],
        "Ekiti": [
            "Ado",
            "Efon",
            "Ekiti South-West",
            "Ekiti-East",
            "Ekiti-West",
            "Emure\/Ise\/Orun",
            "Gbonyin",
            "Ido\/Osi",
            "Ijero,",
            "Ikare",
            "Ikole",
            "Ilejemeje.",
            "Irepodun",
            "Ise\/Orun",
            "Moba",
            "Oye"
        ],
        "Enugu": [
            "Agwu",
            "Aninri",
            "Enugu Eas",
            "Enugu North",
            "Enugu South,",
            "Ezeagu",
            "Igbo-Ekiti",
            "Igbo-Eze South",
            "IgboEze North",
            "Isi-Uzo",
            "Nkanu",
            "Nkanu East",
            "Nsukka",
            "Oji-River",
            "Udenu.",
            "Udi",
            "Udi Agwu",
            "Uzo-Uwani"
        ],
        "Gombe": [
            "Akko",
            "Balanga",
            "Billiri",
            "Dukku",
            "Funakaye",
            "Gombe",
            "Kaltungo",
            "Kwami",
            "Nafada\/Bajoga",
            "Shomgom",
            "Yamaltu\/Delta."
        ],
        "Imo": [
            " Nwangele",
            "Aboh-Mbaise",
            "Ahiazu-Mbaise",
            "Ehime-Mbano",
            "Ezinihitte",
            "Ideato North",
            "Ideato South",
            "Ihitte\/Uboma",
            "Ikeduru",
            "Isiala Mbano",
            "Isu",
            "Mbaitoli",
            "Ngor-Okpala",
            "Njaba",
            "Nkwerre",
            "Obowo",
            "Oguta",
            "Ohaji\/Egbema",
            "Okigwe",
            "Orlu",
            "Orsu",
            "Oru East",
            "Oru West",
            "Owerri North",
            "Owerri West",
            "Owerri-Municipal"
        ],
        "Jigawa": [
            "Auyo",
            "Babura",
            "Biriniwa",
            "Birni Kudu",
            "Buji",
            "Dutse",
            "Gagarawa",
            "Garki",
            "Gumel",
            "Guri",
            "Gwaram",
            "Gwiwa",
            "Hadejia",
            "Jahun",
            "Kafin Hausa",
            "Kaugama Kazaure",
            "Kiri Kasamma",
            "Kiyawa",
            "Maigatari",
            "Malam Madori",
            "Miga",
            "Ringim",
            "Roni",
            "Sule-Tankarkar",
            "Taura",
            "Yankwashi"
        ],
        "Kaduna": [
            " Zaria",
            "Birni-Gwari",
            "Chikun",
            "Giwa",
            "Igabi",
            "Ikara",
            "Jaba",
            "Jema'a",
            "Kachia",
            "Kaduna North",
            "Kaduna South",
            "Kagarko",
            "Kajuru",
            "Kaura",
            "Kauru",
            "Kubau",
            "Kudan",
            "Lere",
            "Makarfi",
            "Sabon-Gari",
            "Sanga",
            "Soba",
            "Zango-Kataf"
        ],
        "Kano": [
            " Tofa",
            "Ajingi",
            "Albasu",
            "Bagwai",
            "Bebeji",
            "Bichi",
            "Bunkure",
            "Dala",
            "Dambatta",
            "Dawakin Kudu",
            "Dawakin Tofa",
            "Doguwa",
            "Fagge",
            "Gabasawa",
            "Garko",
            "Garum",
            "Gaya",
            "Gezawa",
            "Gwale",
            "Gwarzo",
            "Kabo",
            "Kano Municipal",
            "Karaye",
            "Kibiya",
            "Kiru",
            "kumbotso",
            "Kunchi",
            "Kura",
            "Madobi",
            "Makoda",
            "Mallam",
            "Minjibir",
            "Nasarawa",
            "Rano",
            "Rimin Gado",
            "Rogo",
            "Shanono",
            "Sumaila",
            "Takali",
            "Tarauni",
            "Tsanyawa",
            "Tudun Wada",
            "Ungogo",
            "Warawa",
            "Wudil"
        ],
        "Katsina": [
            "Bakori",
            "Batagarawa",
            "Batsari",
            "Baure",
            "Bindawa",
            "Charanchi",
            "Dan Musa",
            "Dandume",
            "Danja",
            "Daura",
            "Dutsi",
            "Dutsin-Ma",
            "Faskari",
            "Funtua",
            "Ingawa",
            "Jibia",
            "Kafur",
            "Kaita",
            "Kankara",
            "Kankia",
            "Katsina",
            "Kurfi",
            "Kusada",
            "Mai'Adua",
            "Malumfashi",
            "Mani",
            "Mashi",
            "Matazuu",
            "Musawa",
            "Rimi",
            "Sabuwa",
            "Safana",
            "Sandamu",
            "Zango"
        ],
        "Kebbi": [
            "Aleiro",
            "Arewa-Dandi",
            "Argungu",
            "Augie",
            "Bagudo",
            "Birnin Kebbi",
            "Bunza",
            "Dandi",
            "Fakai",
            "Gwandu",
            "Jega",
            "Kalgo",
            "Koko\/Besse",
            "Maiyama",
            "Ngaski",
            "Sakaba",
            "Shanga",
            "Suru",
            "Wasagu\/Danko",
            "Yauri",
            "Zuru"
        ],
        "Kogi": [
            "Adavi",
            "Ajaokuta",
            "Ankpa",
            "Bassa",
            "Dekina",
            "Ibaji",
            "Idah",
            "Igalamela-Odolu",
            "Ijumu",
            "Kabba\/Bunu",
            "Kogi",
            "Lokoja",
            "Mopa-Muro",
            "Ofu",
            "Ogori\/Mangongo",
            "Okehi",
            "Okene",
            "Olamabolo",
            "Omala",
            "Yagba East",
            "Yagba West"
        ],
        "Kwara": [
            "Asa",
            "Baruten",
            "Edu",
            "Ekiti",
            "Ifelodun",
            "Ilorin East",
            "Ilorin West",
            "Irepodun",
            "Isin",
            "Kaiama",
            "Moro",
            "Offa",
            "Oke-Ero",
            "Oyun",
            "Pategi"
        ],
        "Lagos": [
            "Agege",
            "Ajeromi-Ifelodun",
            "Alimosho",
            "Amuwo-Odofin",
            "Apapa",
            "Badagry",
            "Epe",
            "Eti-Osa",
            "Ibeju\/Lekki",
            "Ifako-Ijaye",
            "Ikeja",
            "Ikorodu",
            "Kosofe",
            "Lagos Island",
            "Lagos Mainland",
            "Mushin",
            "Ojo",
            "Oshodi-Isolo",
            "Shomolu",
            "Surulere"
        ],
        "Nasarawa": [
            "Akwanga",
            "Awe",
            "Doma",
            "Karu",
            "Keana",
            "Keffi",
            "Kokona",
            "Lafia",
            "Nasarawa",
            "Nasarawa-Eggon",
            "Obi",
            "Toto",
            "Wamba"
        ],
        "Niger": [
            "Agaie",
            "Agwara",
            "Bida",
            "Borgu",
            "Bosso",
            "Chanchaga",
            "Edati",
            "Gbako",
            "Gurara",
            "Katcha",
            "Kontagora",
            "Lapai",
            "Lavun",
            "Magama",
            "Mariga",
            "Mashegu",
            "Mokwa",
            "Muya",
            "Pailoro",
            "Rafi",
            "Rijau",
            "Shiroro",
            "Suleja",
            "Tafa",
            "Wushishi"
        ],
        "Ogun": [
            "Abeokuta North",
            "Abeokuta South",
            "Ado-Odo\/Ota",
            "Egbado North",
            "Egbado South",
            "Ewekoro",
            "Ifo",
            "Ijebu East",
            "Ijebu North",
            "Ijebu North East",
            "Ijebu Ode",
            "Ikenne",
            "Imeko-Afon",
            "Ipokia",
            "Obafemi-Owode",
            "Odeda",
            "Odogbolu",
            "Ogun Waterside",
            "Remo North",
            "Shagamu"
        ],
        "Ondo": [
            "Akoko North East",
            "Akoko North West",
            "Akoko South Akure East",
            "Akoko South West",
            "Akure North",
            "Akure South",
            "Ese-Odo",
            "Idanre",
            "Ifedore",
            "Ilaje",
            "Ile-Oluji",
            "Irele",
            "Odigbo",
            "Okeigbo",
            "Okitipupa",
            "Ondo East",
            "Ondo West",
            "Ose",
            "Owo"
        ],
        "Osun": [
            "Aiyedade",
            "Aiyedire",
            "Atakumosa East",
            "Atakumosa West",
            "Boluwaduro",
            "Boripe",
            "Ede North",
            "Ede South",
            "Egbedore",
            "Ejigbo",
            "Ife Central",
            "Ife East",
            "Ife North",
            "Ife South",
            "Ifedayo",
            "Ifelodun",
            "Ila",
            "Ilesha East",
            "Ilesha West",
            "Irepodun",
            "Irewole",
            "Isokan",
            "Iwo",
            "Obokun",
            "Odo-Otin",
            "Ola-Oluwa",
            "Olorunda",
            "Oriade",
            "Orolu",
            "Osogbo"
        ],
        "Oyo": [
            "Afijio",
            "Akinyele",
            "Atiba",
            "Atigbo",
            "Egbeda",
            "Ibadan North",
            "Ibadan North East",
            "Ibadan North West",
            "Ibadan South East",
            "Ibadan South West",
            "IbadanCentral",
            "Ibarapa Central",
            "Ibarapa East",
            "Ibarapa North",
            "Ido",
            "Irepo",
            "Iseyin",
            "Itesiwaju",
            "Iwajowa",
            "Kajola",
            "Lagelu Ogbomosho North",
            "Ogbmosho South",
            "Ogo Oluwa",
            "Olorunsogo",
            "Oluyole",
            "Ona-Ara",
            "Orelope",
            "Ori Ire",
            "Oyo East",
            "Oyo West",
            "Saki East",
            "Saki West",
            "Surulere"
        ],
        "Plateau": [
            "Barikin Ladi",
            "Bassa",
            "Bokkos",
            "Jos East",
            "Jos North",
            "Jos South",
            "Kanam",
            "Kanke",
            "Langtang North",
            "Langtang South",
            "Mangu",
            "Mikang",
            "Pankshin",
            "Qua'an Pan",
            "Riyom",
            "Shendam",
            "Wase"
        ],
        "Rivers": [
            "Abua\/Odual",
            "Ahoada East",
            "Ahoada West",
            "Akuku Toru",
            "Andoni",
            "Asari-Toru",
            "Bonny",
            "Degema",
            "Eleme",
            "Emohua",
            "Etche",
            "Gokana",
            "Ikwerre",
            "Khana",
            "Obio\/Akpor",
            "Ogba\/Egbema\/Ndoni",
            "Ogu\/Bolo",
            "Okrika",
            "Omumma",
            "Opobo\/Nkoro",
            "Oyigbo",
            "Port-Harcourt",
            "Tai"
        ],
        "Sokoto": [
            "Binji",
            "Bodinga",
            "Dange-shnsi",
            "Gada",
            "Gawabawa",
            "Goronyo",
            "Gudu",
            "Illela",
            "Isa",
            "kebbe",
            "Kware",
            "Rabah",
            "Sabon birni",
            "Shagari",
            "Silame",
            "Sokoto North",
            "Sokoto South",
            "Tambuwal",
            "Tqngaza",
            "Tureta",
            "Wamako",
            "Wurno",
            "Yabo"
        ],
        "Taraba": [
            "Ardo-kola",
            "Bali",
            "Cassol",
            "Donga",
            "Gashaka",
            "Ibi",
            "Jalingo",
            "Karin-Lamido",
            "Kurmi",
            "Lau",
            "Sardauna",
            "Takum",
            "Ussa",
            "Wukari",
            "Yorro",
            "Zing"
        ],
        "Yobe": [
            "Bade",
            "Bursari",
            "Damaturu",
            "Fika",
            "Fune",
            "Geidam",
            "Gujba",
            "Gulani",
            "Jakusko",
            "Karasuwa",
            "Karawa",
            "Machina",
            "Nangere",
            "Nguru Potiskum",
            "Tarmua",
            "Yunusari",
            "Yusufari"
        ],
        "Zamfara": [
            "Anka",
            "Bakura",
            "Birnin Magaji",
            "Bukkuyum",
            "Bungudu",
            "Gummi",
            "Gusau",
            "Kaura",
            "Maradun",
            "Maru",
            "Namoda",
            "Shinkafi",
            "Talata Mafara",
            "Tsafe",
            "Zurmi"
        ]
    };
    if (state == null)
        return Object.keys(ngstates);
    else if (Object.keys(ngstates).includes(state))
        return ngstates[state];
    return [];
}

var dropZoneObj;

function createUploader(el, uploadPath, fnSucc, jsonData, mimeType) {
    Dropzone.autoDiscover = false;
    var config = {
        url: uploadPath,
        parallelUploads: 1,
        uploadMultiple: false,
        maxFiles: 1,
        maxFilesize: 50,
        autoProcessQueue: false,
        addRemoveLinks: true,
        acceptedFiles: mimeType,
        accept: function (file, done) {
            var reader = new FileReader();
            reader.onload = (event) => {
                var base64String = event.target.result;
                var fileName = file.name
                dropZoneObj = this;
                if (fileName.indexOf(".pdf") > -1)
                    uploadDropZoneFile({
                        upload: {
                            filename: file.upload.filename
                        },
                        dataURL: base64String
                    }, fnSucc, this, uploadPath, (typeof (jsonData) == 'function' ? jsonData() : jsonData));
            };
            reader.readAsDataURL(file);


        },
        init: function () {
            this.createThumbnailFromUrl = function (file, image, callback, crossOrigin) {
                // console.error(JSON.stringify(file));
                var fileData = {
                    upload: {
                        filename: file.upload.filename
                    },
                    dataURL: file.dataURL
                };
                uploadDropZoneFile(fileData, fnSucc, this, uploadPath, (typeof (jsonData) == 'function' ? jsonData() : jsonData));

            };
            this.on("error", function (file, response) {

                if (!(mylocation.indexOf('file://') == 0 || mylocation.indexOf('filex://') == 0))
                    successfulMessage(response);
                switch (file.type) {
                    case 'image/jpeg':
                        break;
                    case 'image/png':
                        break;
                    case 'image/jpg':
                        break;
                    case 'application/pdf':
                        break;
                    default:
                        doalert('Please upload correct file format' + response);
                        break;
                }
            });
            this.on("canceled", function (file, response) {
                isFileInProgress = false;

                window.onbeforeunload = function () {
                    /* unbind */
                };
            });
            this.on('success', function (file, response) {
                fnSucc(file, response, this);
            });
            this.on('addedfile', function (a) {
                $.blockUI({
                    message: '<div class="bg-transparent" id="preloader"><div class="bg-transparent" id="status"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div></div>'
                });
                this.options.params = (typeof (jsonData) == 'function' ? jsonData() : jsonData);
                this.processFile(a);


            });
            this.on("complete", function (file) {
                $.unblockUI('hide');
                this.removeAllFiles(true);
            });
        },

    };
    if (iOSversion() == "none")
        config['capture'] = "camera";
    $(el).dropzone(config);
}
var uploadDropZoneFile = (file, fn, obj, path, data) => {
    var uploadingFile = file;
    var mylocation = window.location.href;
    if (mylocation.indexOf('file://') == 0 || mylocation.indexOf('filex://') == 0) {
        $.blockUI({
            message: '<div class="bg-transparent" id="preloader"><div class="bg-transparent" id="status"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div></div>',
            baseZ: 4000
        });
        data["src"] = file.upload.filename;
        data["file"] = file.dataURL;
        dopost({
            "url": path,
            "type": "POST",
            "data": data,
            "success": (response) => {
                var id = "";
                $.unblockUI();
                try {
                    try {
                        var json = JSON.parse(response);
                        if (json.statuscode != 0) {
                            $(obj).parent().find('.dropzone-item').addClass("bg-danger");
                            $(obj).parent().find('.dropzone-filename').addClass("text-white");
                            $(obj).parent().find('.flaticon2-cross').addClass("text-white");
                        } else {
                            $(obj).parent().find('.dropzone-item').addClass("bg-success");
                            $(obj).parent().find('.dropzone-filename').addClass("text-white");
                            $(obj).parent().find('.flaticon2-cross').addClass("text-white");
                            $(obj).parent().find('.dropzone-error').hide();
                        }
                    } catch (e) {}
                    fn(file, response, obj);
                    obj.removeAllFiles(true);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        });
    }
};

function setImgSrc(obj, url) {
    return dopost({
        "url": url,
        "type": "POST",
        "data": {
            "userid": getItem('userid'),
            "type": "base64"
        },
        "success": (response) => {
            try {

                obj.attr('src', response);

            } catch (e) {
                console.error('Error' + e.message);

            }
        }
    });
}

function getImageFile(img_src, file = "profile") {
    var img_link = api_link + '/route/get_image.php?user=' + getItem('userid') + '&file=' + file;
    return setImgSrc($('.' + img_src), img_link);
}

function callPhotoViewer(file = '') {
    var img_link = api_link + '/route/get_image.php?user=' + getItem('userid') + '&file=' + file;
    file = file.replace(".jpg", "");
    var modal = $('<div id="myModal2" class="modal fade"><div class="modal-dialog modal-xl"><div class="modal-content" id="testprint"><div class="modal-header bg-primary"><button type="button" class="close btn btn-sm btn-icon btn-active-color-primary" data-dismiss="modal"><i class="bx bx-window-close text-white"></i></button><h5 class="modal-title text-white text-uppercase">' + file + '</h5></div><div class="modal-body scroll-y pt-0 pb-15 row mx-0 p-5" id="modal_print"><img class="img-fluid" src="' + img_link + '" /></div><div class="modal-footer"><div class="d-flex justify-content-end"><button type="button" class="btn btn-light-primary fw-bold me-5" id="printbtn">Print</button><button type="button" class="btn btn-success fw-bold me-5 download_btn" id="download_btn">Download</button></div></div></div></div></div>');

    modal.modal('show');
    $(modal.find("#printbtn")).click(() => {
        var mode = 'iframe'; //popup
        var close = mode == "popup";
        var options = {
            mode: mode,
            popClose: close
        };
        $('#modal_print').printArea(options);
        //divRow.append(col4);
    });

    modal.find("#download_btn").click(() => {
        let cont = document.getElementById("modal_print");
        html2canvas(cont, {
            allowTaint: true,
            useCORS: true
        }).then(function (canvas) {
            var anchorTag = document.createElement("a");
            anchorTag.download = file + ".jpg";
            anchorTag.href = canvas.toDataURL();
            anchorTag.target = '_blank';
            anchorTag.click();
        });
    })

}


function doalert(json) {
    Swal.fire({
        title: "ITA Portal",
        html: json,
        icon: "info",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}

function callSweetMsg(json, title, etype) {
    Swal.fire({
        title: title,
        html: json.status,
        type: etype,
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}


function callSweetMsgNormal(title, msg, etype) {
    Swal.fire({
        title: title,
        html: msg,
        type: etype,
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}


function newQueryString(a) {
    var test = window.location.href;
    var testArr = test.split("#");
    test = testArr[0];
    var findstr = (a + '=');
    if (test.indexOf(findstr) != -1) {
        test = test.substring(test.indexOf(findstr) + findstr.length);
        if (test.indexOf('&') != -1) {
            test = test.substring(0, test.indexOf('&'));
        }
        return decodeURIComponent(test);
    }
    return "";
}

function userDetails() {
    // $.blockUI({
    //     message: '<img style="margin: 0 0.5rem;" src="/assets/images/loader.png" width="auto">'
    // });
    dopost({
        "type": "POST",
        "url": api_link + "/processdata.php",
        "data": {
            "userid": newQueryString('userid'),
            "sessionid": newQueryString('sessionid'),
            "action": "getuser_details"
        },
        "success": function (response) {
            try {
                // $.unblockUI('hide');
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $(".firstname").html(json.data[0].firstname).addClass("text-capitalize");
                    $(".email").html(json.data[0].email);
                    $(".username").html(json.data[0].username);
                    $(".role").html(json.data[0].role);
                    $(".fullname").html(json.data[0].lastname + ' ' + json.data[0].firstname)
                    setItem("useralias", json.data[0].useralias);
                    setItem("userid", json.data[0].userid);
                    setItem("role", json.data[0].role);
                    setItem("email", json.data[0].email);
                    setItem("phone", json.data[0].phoneno);
                    setItem("surname", json.data[0].lastname);
                    setItem("firstname", json.data[0].firstname);
                    setItem("sessionid", newQueryString('sessionid'));

                    if (json.data[0].role == 'admin')
                        $(".admin-role").show();
                    if (json.data[0].role == 'supervisor')
                        $(".supervisor").show();

                    $('.preloader').hide();
                    $('#layout-wrapper').show();

                    $(".nk-app-root").show(200);

                    if (json.data[0].role == 'dpp')
                        getStatistics(),
                        getDppCaseFiles();

                    // if (json.data[0].role == 'lawyer' || json.data[0].role == 'counsel')
                    if (json.data[0].role == 'lawyer')
                        getStatistics(),
                        getLawyerCaseFiles();

                    if (json.data[0].role == 'printing_officer')
                        getStatistics(),
                        getPrintOfficerCases();

                    if (json.data[0].role == 'hag')
                        getStatistics(),
                        getHagCaseFiles();

                    if (json.data[0].role == 'counsel')
                        getStatistics(),
                        getCounselCaseFiles();

                    else
                        dppReport();
                } else {
                    // callSweetMsg(json.status, "eCampus", "error");
                }
            } catch (e) {
                console.error(e.stack);
            }
        },
    });
}


function CreateUser() {
    if ($("#firstname").val() == '' || $("#lastname").val() == '' || $("#password").val() == '' || $("#cpassword").val() == '' || $("#role option:selected").val() == '') {
        callSweetMsg({
            statuscode: -1,
            status: "All fields are compulsory"
        }, "eCampus", "error");
        return;
    }

    if ($("#password").val() != $("#cpassword").val()) {
        callSweetMsg({
            statuscode: -1,
            status: "Password field mismatch."
        }, "eCampus", "error");
        return;
    }
    dopost({
        "type": "POST",
        "url": api_link + "/processdata.php",
        "data": {
            "userid": newQueryString('userid'),
            "sessionid": newQueryString('sessionid'),
            "firstname": $("#firstname").val(),
            "lastname": $("#lastname").val(),
            "password": $("#password").val(),
            "cpassword": $("#cpassword").val(),
            "role": $("#role option:selected").val(),
            "action": "createstaff"
        },
        "success": function (response) {
            try {
                var json = JSON.parse(response);
                console.log(json);
                if (json.statuscode == 0) {
                    callSweetMsg(json, "eCampus", "success");
                } else
                    callSweetMsg(json, "eCampus", "error");
            } catch (e) {
                console.error(e.stack);
            }
        },
    });
}


function statisticsBreakdown(act) {
    dopost({
        "url": api_link + "/statistics.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": act,
        },
        "type": "POST",
        "success": function (response) {
            try {
                var json = JSON.parse(response);
                for (var idx in json) {
                    $("." + idx).html("");
                    if ($("." + idx).length > 0) {
                        if (json[idx].length > 0) {
                            $("." + idx).html((json[idx][0].total == null || json[idx][0].total == "") ? "0" : json[idx][0].total);
                        }
                    }
                }
                $(".shortlist_div").show();
                $('html,body').animate({
                    scrollTop: $("#shortlist_div").offset().top
                }, 'slow');
            } catch (e) {
                console.error(e.message);
            }
        }
    });
}

function successfulMessage(json) {
    var etype;
    if (json.statuscode == 0) etype = 'success';
    else etype = 'error';
    swal({
        title: "CoMiS",
        html: json.status,
        type: etype,
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}


function changePassword() {
    if ($("#password").val() == '' || $("#cpassword").val() == '' || $("#username").val() == '') {
        callSweetMsg({
            statuscode: -1,
            status: "All fields are compulsory"
        }, "eCampus", "error");
        return;
    }

    if ($("#password").val() != $("#cpassword").val()) {
        callSweetMsg({
            statuscode: -1,
            status: "Password field mismatch."
        }, "eCampus", "error");
        return;
    }
    dopost({
        "url": api_link + "/processdata.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "username": $("#username").val(),
            "password": $("#password").val(),
            "action": 'change_password',
        },
        "type": "POST",
        "success": function (response) {
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    callSweetMsg(json, "eCampus", "success");
                } else
                    callSweetMsg(json, "eCampus", "error");

            } catch (e) {
                console.error(e.message);
            }
        }
    });
}



function dopost(injson) {
    var dopostAction = function (json) {
        var search = json.data;
        if ("test".constructor === search.constructor)
            json["data"] = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
                return key === "" ? value : decodeURIComponent(value)
            })

        try {
            window.ComisApp.execute(function (response) {
                if (response === '')
                    response = '{}';
                if (testResponse(response))
                    json.success(response);
            }, json.error, 'AppPlugin', json.url, [json.data]);
        } catch (e) {
            try {
                //if(window.bfMobileApp.useCordova())
                cordova.exec(function (response) {
                    if (response === '')
                        response = '{}';
                    if (testResponse(response))
                        json.success(response);
                }, json.error, 'AppPlugin', 'dopost', [json.url, json.data, window.location.href]);
                //else
                //   window.bfMobileApp.exec(json.success.toString(), json.error.toString(), 'BfAppPlugin', 'dopost', JSON.stringify({"args":[json.url, json.data]}));
            } catch (e) {
                try {
                    if (window.location.href.indexOf("file://") == 0 || window.location.href.indexOf("filex://") == 0) {
                        window.setTimeout(function () {
                            dopost(json);
                        }, 1000);
                        return;
                    }
                    try {
                        if (!json.data.hasOwnProperty('userid')) {
                            json.data['userid'] = getItem('userid');
                        }

                    } catch (e) {
                        console.error(e.stack);
                    }

                    if (typeof Fingerprint2 === 'function' && Fingerprint2 != null) {
                        var fp2 = new Fingerprint2();
                        fp2.get(function (result) {
                            var result2 = getItem("sysid");
                            if (result2 === '' || result2 == null || result2 === 'undefined' || typeof (result2) === 'undefined') {
                                result2 = result;
                                setItem('sysid', result2);
                            }
                            json.data['sysid'] = result2;
                            dopostoffline(json);
                        });
                    } else
                        dopostoffline(json);
                } catch (e) {
                    console.error(e.stack);
                }
            }

        }
    };

    return new Promise(function (resolve, reject) {
        var success = injson.success;
        var newinjson = injson;
        newinjson['success'] = (response) => {
            success(response);
            resolve();
        };
        dopostAction(newinjson);
    });
}


function setItem(key, value) {
    try {
        var storedata = {};
        var store = $('body').find('#ecampuslocalstorage');
        if (store.length > 0) {
            storedata = JSON.parse(decodeData(store.val()));
        } else {
            $('body').append($("<input type=hidden value='" + encodeData("{}") + "' id='ecampuslocalstorage'/>"));
            store = $('body').find('#ecampuslocalstorage');
        }
        storedata[key] = value;
        store.val(encodeData(JSON.stringify(storedata)));
    } catch (e) {
        console.error(e.stack);
    }
}

function getItem(key) {
    var storedata = {};
    try {
        var store = $('body').find('#ecampuslocalstorage');
        if (store.length > 0) {
            storedata = JSON.parse(decodeData(store.val()));
        } else {
            $('body').append($("<input type=hidden value='" + encodeData("{}") + "' id='ecampuslocalstorage'/>"));
            store = $('body').find('#ecampuslocalstorage');
        }

    } catch (e) {
        console.error(e.stack);
    }
    if (storedata.hasOwnProperty(key)) {
        return storedata[key];
    } else
        return "";
}
/*
var _0xf4ff=['function','AES','decrypt'];(function(_0x5e34c7,_0x357e8f){var _0x40bad1=function(_0x317150){while(--_0x317150){_0x5e34c7['push'](_0x5e34c7['shift']());}};_0x40bad1(++_0x357e8f);}(_0xf4ff,0x1dd));var _0xd185=function(_0x32f3a5,_0x5e6daa){_0x32f3a5=_0x32f3a5-0x0;var _0x31234e=_0xf4ff[_0x32f3a5];return _0x31234e;};function encodeData(_0x22c39f){if(typeof btoa!=_0xd185('0x0'))return _0x22c39f;return btoa(CryptoJS[_0xd185('0x1')]['encrypt'](_0x22c39f,sessionid));}function decodeData(_0xb8123e){if(typeof atob!=_0xd185('0x0'))return _0xb8123e;return CryptoJS[_0xd185('0x1')][_0xd185('0x2')](atob(_0xb8123e),sessionid);};

*/
function encodeData(data) {
    if (typeof btoa != 'function')
        return data;
    return btoa(data);
    //return btoa(CryptoJS.AES.encrypt(data, sessionid));
}

function decodeData(data) {
    if (typeof atob != 'function')
        return data;
    return atob(data);
    //return CryptoJS.AES.decrypt(atob(data), myPassword);
}

function removeItem(key) {
    var storedata = {};
    try {
        var store = $('body').find('#ecampuslocalstorage');
        if (store.length > 0) {
            storedata = JSON.parse(decodeData(store.val()));
        } else {
            $('body').append($("<input type=hidden value='" + encodeData("{}") + "' id='ecampuslocalstorage'/>"));
            store = $('body').find('#ecampuslocalstorage');
        }
        if (storedata.hasOwnProperty(key)) {
            delete storedata[key];
            store.val(encodeData(JSON.stringify(storedata)));
        }

    } catch (e) {
        console.error(e.stack);
    }
}

function resetItems(donotload) {
    try {
        var storedata = {};
        var store = $('body').find('#ecampuslocalstorage');
        if (store.length > 0) {
            storedata = JSON.parse(store.val());
        } else {
            $('body').append($("<input type=hidden value='{}' id='ecampuslocalstorage'/>"));
            store = $('body').find('#ecampuslocalstorage');
        }
        store.val(encodeData("{}"));

    } catch (e) {
        console.error(e.stack);
    }
    if (!(typeof donotload === 'undefined' ? false : donotload))
        window.location.href = "index.html";
}


function testResponse(respponse) {
    var ret = true;
    try {
        var json = JSON.parse(respponse);
        if (json.statuscode == 401) {
            json.statuscode = -1;
            json.sessionerror = json.status;
        }
        if (json.hasOwnProperty('sessionerror')) {
            if (json.statuscode == -1) {
                $.unblockUI();
                sessionMsg(json)
                ret = false;
            }
        }
    } catch (e) {
        console.error(e.message);
    }
    return ret;
}

function printPDF(quality = 1, div) {
    html2canvas(document.querySelector('#' + div), {
        scale: quality
    }).then(canvas => {
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
        pdf.output('datauristring');
    });
}

function dopostoffline(json) {
    if (window.location.href.indexOf('file://') != 0) {

        var isApp = false;
        if (json.type == "POST") {

            $.post('/php/dopost.php?url=' + encodeURIComponent(json.url), json.data, function (response) {
                    if (response === '')
                        response = '{}';
                    if (testResponse(response))
                        json.success(response);
                })
                .fail(json.error);

        } else {

            $.get('/php/dopost.php?url=' + encodeURIComponent(json.url), function (response) {
                    if (response === '')
                        response = '{}';
                    if (testResponse(response))
                        json.success(response);
                })
                .fail(json.error);

        }
    } else {
        window.setTimeout(function () {
            dopost(json);
        }, 300)
    }
}

function displayExistDoc() {
    var extra = {
        "uid": $("#bvn").val(),
    };

    dopost({
        "url": api_link + "/resourceshelf.php",
        "type": "POST",
        "success": function (response) {
            try {
                var json = JSON.parse(response);

                for (var idx in json.book) {
                    if (json.book[idx].title === "nysc.pdf")
                        $(".checkupload1").show();
                    if (json.book[idx].title === "application_letter.pdf")
                        $(".checkupload2").show();
                    if (json.book[idx].title === "bsc_certificate.pdf")
                        $(".checkupload3").show();
                    if (json.book[idx].title === "olevel_certificate.pdf")
                        $(".checkupload4").show();
                    if (json.book[idx].title === "lga_certificate.pdf")
                        $(".checkupload5").show();
                    if (json.book[idx].title === "msc_certificate.pdf")
                        $(".checkupload6").show();
                }

            } catch (e) {
                doalert("Error while fetching data!" + e.toString());
            }
        },
        "data": extra
    });

}



function login() {
    var userid = $('#email').val();
    var pwd = $('#password').val();
    $.blockUI({
        message: '<div id="preloader"><div id="status"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div></div>'
    })
    if (userid != '' && pwd != '') {
        dopost({
            "url": api_link + "/login.php",
            "data": {
                "email": userid,
                "password": pwd
                //                 "myaction": "Login"
            },
            "type": "POST",
            "success": function (response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        var ret = {
                            sessionid: json.data.sessionid,
                            userid: json.data.userid
                        };

                        setItem("uid", json.data.userid);

                        var rl = json.data.role;
                        if (rl == 'dpp_registry')
                            window.location.href = "admin.html?" + serialize(ret);
                        else if (rl == 'dpp')
                            window.location.href = "dpp_dashboard.html?" + serialize(ret);
                        else if (rl == 'lawyer')
                            window.location.href = "lawyer_dashboard.html?" + serialize(ret);
                        else if (rl == 'printing_officer')
                            window.location.href = "printofficer_dashboard.html?" + serialize(ret);
                        else if (rl == 'hag')
                            window.location.href = "hag_dashboard.html?" + serialize(ret);
                        else if (rl == 'counsel')
                            window.location.href = "filing_lawyer.html?" + serialize(ret);

                    } else {
                        callSweetMsg(json, "eCampus", "error");
                    }
                    // $.unblockUI();


                } catch (e) {
                    $.unblockUI();
                    console.error(e.stack);
                }
            },
            "error": function (jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    } else {
        if (username == '' || pwd == '') {
            doalert("Please enter your login parameters");
        }
    }
}


function createDataTableNew(dataSet, table, editable, url) {

    if ($('#' + table).length == 0) {
        alert("Table container not found!");

        return;
    } else {

        if ($.fn.dataTable.isDataTable('#' + table)) {
            $('#' + table).DataTable().destroy();
            $('#' + table).html("");
            //$('#'+table).DataTable().empty();
        } else {
            $('#' + table).html("");
            //$('#'+table).DataTable().empty();
        }

    }
    var mycolumns = [];
    var dataSet2 = [];
    if (dataSet.length > 0) {
        var row = dataSet[0];
        for (var idx in row) {
            mycolumns.push({
                "title": idx.toUpperCase()
            });
        }
        for (var idx0 in dataSet) {
            var row = dataSet[idx0];
            var rowData = [];

            for (var idx in row) {
                rowData.push(row[idx]);
            }
            dataSet2.push(rowData);
        }

    }
    var mySettings = {
        ajax: function (data, callback, settings) {
            console.log(settings);
            console.log(callback);
            console.log(data);
        },
        data: dataSet2,
        columns: mycolumns,
        search: {
            smart: false
        },
        //sDom: '<"top"><"clear">rt<"bottom"><"clear">',

        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]

    };
    console.log(mySettings);
    console.log(dataSet2);
    console.log(table);
    $('#' + table).DataTable(mySettings);
}


function callPlayer(addedby, file, src_type) {
    var pdf_link = api_link + '/get_assignment_file.php?&user=' + addedby + '&userid=' + getItem('userid') + '&file=' + file + '';
    var modal;
    if (src_type == 'pdf')
        modal = $('<div id="" class="modal fade" role="dialog"><div class="modal-dialog" style="max-width:60% !important"><div class="modal-content"><div class="modal-header bg-primary white-text"><button type="button" class="close" data-dismiss="modal">&times;</button><h5 class="modal-title white-text">' + file + '</h5></div><div class="modal-body embed-responsive embed-responsive-16by9">  <iframe fullscreen src="' + pdf_link + '" frameborder="0" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe></div></div></div></div>');
    else if (src_type == 'image')
        modal = $('<div id="" class="modal fade" role="dialog"><div class="modal-dialog" style="max-width:24%"><div class="modal-content"><div class="modal-header bg-primary white-text"><button type="button" class="close" data-dismiss="modal">&times;</button><h5 class="modal-title white-text">' + file + '</h5></div><div class="modal-body"><img src="' + pdf_link + '" style="width:100%" /></div></div></div></div>');
    modal.modal();
}


var page_redirect = window.location.href;

function sessionMsg(json) {
    swal.fire({
            title: "Session Management",
            html: json.status,
            type: "error",
            icon: "error",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            buttons: true,
            dangerMode: true,
            closeOnConfirm: false
        })
        .then((willDelete) => {
            resetItems(true);
            if (willDelete)
                window.location.href = "../login.html";
        });
}




try {
    var fingerprint_script_file = $("<script/>");
    fingerprint_script_file.attr("type", "text/javascript");
    var this_script_file = $('script').last();
    var this_script_file_path = this_script_file.attr('src');
    fingerprint_script_file.attr("src", this_script_file_path.replace("common.js", "fingerprint.min.js"));
    this_script_file.after(fingerprint_script_file);
} catch (e) {
    console.log(e.message);
}


function readFormData(formDiv, retArr = false) {
    var fieldIndex = 0;
    var processdeFields = [];
    var validationReport0 = [];
    var retData = {};
    $(formDiv).find("[fields]").each(function () {
        fieldIndex++;
        $(this).attr("fieldmarker", fieldIndex);
    })
    var getValidationResult = (rulesStr, value) => {
        var rulesArr = rulesStr.split("|");
        resultArr = [];
        for (var ruleIdx in rulesArr) {
            var r = gumpToFormValidator(rulesArr[ruleIdx], value);
            if (r.valid == false)
                resultArr.push(r);
        }
        return resultArr;
    };
    var readFieldElements = function (obj, excludes, validationReport) {
        var ret = {};
        $(obj).find("[fields]").each(function () {
            if (!excludes.includes($(this).attr('fieldmarker'))) {
                var readThisData = true;
                if ($(this).prop("type") == "radio" || $(this).prop("type") == "checkbox") {
                    if (!$(this).prop("checked"))
                        readThisData = false;
                }

                if (readThisData) {
                    var myFieldName = $(this).attr('fields');
                    if (ret.hasOwnProperty(myFieldName)) {
                        if (!Array.isArray(ret[myFieldName])) {
                            var dataHolder = ret[myFieldName];
                            ret[myFieldName] = [];
                            ret[myFieldName].push(dataHolder);
                        }
                        var val = $(this).val();
                        if ($(this).prop("type") == "radio" || $(this).prop("type") == "checkbox") {
                            if ($(this).attr("returnval") == "bool")
                                val = $(this).prop("checked");
                        }
                        ret[myFieldName].push(val);
                    } else {
                        var val = $(this).val();
                        if ($(this).prop("type") == "radio" || $(this).prop("type") == "checkbox") {
                            if ($(this).attr("returnval") == "bool")
                                val = $(this).prop("checked");
                        }
                        ret[$(this).attr('fields')] = val;
                    }
                }
                excludes.push($(this).attr('fieldmarker'));
                if ($(this)[0].hasAttribute("rules")) {
                    var rulStr = $(this).attr("rules");
                    if (rulStr != "") {
                        var validate = getValidationResult(rulStr, $(this).val());
                        if (Array.isArray(validate)) {
                            if (validate.length > 0) {
                                validationReport[$(this).attr('fields')] = validate;
                            }
                        }
                    }
                }
            }
        });
        return validationReport, excludes, ret;
    };
    var combineFields = function (inData) {
        var ret = {};
        for (var idx in inData) {
            for (var idx2 in inData[idx]) {
                ret[idx2] = inData[idx][idx2];
            }
        }
        return ret;
    }
    var readGroupArrays = function (obj, excludes, validationReport) {
        var outArr = {};
        $(obj).find(".fieldclassarr").each(function () {
            var fieldClass = $(this);
            var fieldName = fieldClass.attr("fieldname");
            if ($(this).find(".fieldclassitems").length > 0) {
                var fieldclassitems = [];
                $(this).find(".fieldclassitems").each(function () {
                    var data = {};
                    if ($(this).find(".fieldclass").length > 0)
                        validationReport, excludes, data["fieldobjects"] = readGroupObjects(this, excludes, validationReport);
                    if ($(this).find(".fieldclassarr").length > 0)
                        validationReport, excludes, data["fieldarrays"] = readGroupArrays(this, excludes, validationReport);
                    validationReport, excludes, data["fieldelements"] = readFieldElements(this, excludes, validationReport);
                    data = combineFields(data);
                    fieldclassitems.push(data);
                });
                outArr[fieldName] = fieldclassitems;
            }

        });
        return validationReport, excludes, outArr;
    }
    var readGroupObjects = function (obj, excludes, validationReport) {
        var outArr = {};
        $(obj).find(".fieldclass").each(function () {
            var fieldClass = $(this);
            var fieldName = fieldClass.attr("fieldname");
            var data = {};
            if ($(this).find(".fieldclass").length > 0)
                validationReport, excludes, data["fieldobjects"] = readGroupObjects(this, excludes, validationReport);
            if ($(this).find(".fieldclassarr").length > 0)
                validationReport, excludes, data["fieldarrays"] = readGroupArrays(this, excludes, validationReport);
            validationReport, excludes, data["fieldelements"] = readFieldElements(this, excludes, validationReport);
            outArr[fieldName] = combineFields(data);
        });
        return validationReport, excludes, outArr;
    };

    validationReport0, processdeFields, retData["fieldobjects"] = readGroupObjects(formDiv, processdeFields, validationReport0);
    validationReport0, processdeFields, retData["fieldarrays"] = readGroupArrays(formDiv, processdeFields, validationReport0);
    validationReport0, processdeFields, retData["fieldelements"] = readFieldElements(formDiv, processdeFields, validationReport0);
    retData = combineFields(retData);
    $(formDiv).find("[fields]").each(function () {
        $(this).removeAttr("fieldmarker");
    })
    if (retArr == true)
        return {
            "validation": validationReport0,
            "data": retData
        };
    return retData;
}

function ddlistApplications($ctl, sel = "") {
    //$('#class1 option:selected').html(queryString('class'));
    dopost({
        "type": "POST",
        "url": api_link + "route/applconfig.php",
        "data": {
            userid: getItem("userid"),
            sessionid: getItem("sessionid"),
            action: "get_appl_configs",
        },
        "success": function (response) {
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    var strr = "";
                    var x = "";
                    $.each(json.data, function (key, val) {
                        if (val.appl_code == "" || val.appl_code == "[Select]" || val.appl_code == null) {
                            strr += ""
                        } else {
                            if (sel) {
                                x = (sel == val.appl_code ? 'selected' : "");
                            }
                            strr += '<option value="' + val.appl_code + '" ' + x + '>' + val.appl_name + '</option>';
                        }

                    })
                    $ctl.html(strr);


                }


            } catch (e) {
                console.error(e.message);
            }
        },

        "error": function (response) {
            console.log(response)
        }
    });
}


function createDropdown($ctl, data) {
    var strr = "";
    var x = "";
    $.each(data, function (key, val) {

        strr += '<option value="' + val + '" ' + '>' + val + '</option>';


    })
    $ctl.html(strr);
}

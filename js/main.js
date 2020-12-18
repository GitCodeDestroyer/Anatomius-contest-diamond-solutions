const fs = require('fs')

function renderIllsOfPart (id) {
    selectedPart = partsArray[partsEnArray.indexOf(id)];
    selectedPartIlls = [];
    illForSelectedPatient = modifiedData.ills[modifiedData.patients.indexOf(rowID)];
    for (var i = 0; i < illForSelectedPatient.length; i++) {
        if (illForSelectedPatient[i][2] == selectedPart) {
            selectedPartIlls.push(illForSelectedPatient[i]);
        }
    }
    $('.part-info')[0].innerHTML = '';
    for (var i = -1; i < selectedPartIlls.length - 1; i++) {
        $('.part-info')[0].innerHTML += '<h2>Болезнь № ' + (i + 2) + '</h2>';
        $('.part-info')[0].innerHTML += '<h4>Название болезни</h4>';
        $('.part-info')[0].innerHTML += '<p>' + selectedPartIlls[i + 1][1] + '</p>';
        $('.part-info')[0].innerHTML += '<h4>Описание болезни</h4>';
        $('.part-info')[0].innerHTML += '<p>' + selectedPartIlls[i + 1][3] + '</p>';
    }
    if ($('.part-info')[0].innerHTML == '') {
        $('.part-info')[0].innerHTML = '<h4 class="no-ills">Нет болезней в этой части тела</h4>'
    }else {
        $('.part-info')[0].innerHTML = '<h1>' + selectedPart + '</h1>' + $('.part-info')[0].innerHTML;
    }
    $('.part-info').css('display','block');
    $('.new-ill').css('display','none');
}

function showImagedView () {
    $('.imaged-info').css('display', 'block');
    $('.part-info').css('display', 'block');
    $('.new-ill').css('display', 'none');
    $('.tabled-info').css('display', 'none');
    $('.imaged-btn').addClass('active');
    $('.tabled-btn').removeClass('active');
    // Click to part of body
    $('path').click(function(e) {
        $('path').each(function (index, element) {
            $(element).removeAttr('style');
        });
        $(this).css('fill', '#ffc1c1');
        renderIllsOfPart($(this)[0].id);
    });
}

function saveData() {
    fs.writeFile('data/patients.json', JSON.stringify(modifiedData), function (err) {
        if (err) throw err;
    });
}

function getFile (file) {
    fs.appendFileSync(file, '##&$$#@#$&*@#&$*');
    var fileValue = fs.readFileSync(file, {
        encoding: 'utf-8'
    });
    if (fileValue != '##&$$#@#$&*@#&$*') {
        input = fileValue.replace(/\#\#\&\$\$\#\@\#\$\&\*\@\#\&\$\*/gi, "");
        fs.writeFileSync(file, input);
        users = JSON.parse(input);
    } else {
        var newFile = {
            patients: [],
            ills: []
        };
        fs.writeFileSync(file, JSON.stringify(newFile));
    }
    return JSON.parse(fs.readFileSync(file, {
        encoding: 'utf-8'
    }));
}

var data = getFile('data/patients.json'),
    modifiedData = data,
    patientLastId,
    illLastId,
    illForSelectedPatient = [],
    rowID,
    selectedPartIlls = [],
    partsArray = [
        "Голова", "Левый глаз", "Правый глаз", "Левое ухо", "Правое ухо", "Нос", "Рот", "Шея", "Грудь", "Грудь (материнская)", "Живот", "Таз", "Анал", "Левое плечо", "Правое плечо", "Левая верхняя часть руки", "Правая верхняя часть руки", "Левая локоть", "Правая локоть", "Левая нижняя часть руки", "Правая нижняя часть руки", "Левая кисть", "Правая кисть", "Левая ладонь", "Правая ладонь", "Левая верхняя часть ноги", "Правая верхняя часть ноги", "Левое колено", "Правое колено", "Левая нижняя часть ноги", "Правая нижняя часть ноги", "Левая ступа", "Правая ступа"
    ];
    partsEnArray = ["head", "l-eye", "r-eye", "l-ear", "r-ear", "nose", "mouth", "neck", "chest", "breast", "stomach", "pelvis", "anal", "l-shoulder", "r-shoulder", "l-up-arm", "r-up-arm", "l-elbow", "r-elbow", "l-down-arm", "r-down", "l-wrist", "r-wrist", "l-palm", "r-palm", "l-up-leg", "r-up-leg", "l-knee", "r-knee", "l-down-leg", "r-down-leg", "l-foot", "r-foot"];

// Images for imaged view
var imageFemale = fs.readFileSync('resources/app/images/female.svg', {encoding: 'utf-8'}),
    imageMale = fs.readFileSync('resources/app/images/male.svg', {encoding: 'utf-8'});

$(document).ready(function () {
    //!!!!!!!!!!!!!!!!! Initialize Table !!!!!!!!!!!!!!!!//
    var patients = $('#patients').DataTable({
        lengthMenu: [-1],
        sDom: "ftr",
        select: true,
        data: data.patients,
        columns: [
            {title: "ID"},
            {title: "ФИО"},
            {title: "Пол"},
            {title: "Дата добавления"},
        ],
    });
    var ills = $('#ills').DataTable({
        lengthMenu: [-1],
        sDom: "ftr",
        select: true,
        data: data.ills,
        columns: [
            {title: "ID"},
            {title: "Название"},
            {title: "Часть тела"},
            {title: "Описание"},
        ]
    });
    
    //!!!!!!!!!!!!!!!!! Setting last id !!!!!!!!!!!!!!!!//
    if (!$($($('#patients tbody').children()[0]).children()[0]).hasClass('dataTables_empty')) {
        patientLastId = patients.rows().data()[patients.rows()[0].length - 1][0];
    }else {
        patientLastId = 0;
    }
    //!!!!!!!!!!!!!!!!! Actions, events !!!!!!!!!!!!!!!!//

    // Double click to patients row
    $('#patients tbody').on("dblclick", 'tr', function(e) {
        e.stopPropagation();
        rowID = patients.row(this).data();
        if (rowID) {
            $('.table-view').css('display','none');
            $('.patient-ills').css('display','block');
            $('.new-patient').css('display', 'none');
            $('.new-ill').css('display', 'block');
            ills.rows().remove().draw(false);
            illForSelectedPatient = modifiedData.ills[modifiedData.patients.indexOf(rowID)];
            ills.rows.add(illForSelectedPatient).draw();
        }
        if (illForSelectedPatient.length != 0) {
            illLastId = ills.rows().data()[ills.rows()[0].length - 1][0];
        }else {
            illLastId = 0;
        }
        $('#rowId')[0].innerHTML = rowID[1];
        if (rowID[2] == "Мужчина") {
            $('.imaged-info')[0].innerHTML = imageMale;
            $('#opt-breast').attr('disabled', 'true');
        }else {
            $('.imaged-info')[0].innerHTML = imageFemale;
            $('#opt-breast').removeAttr('disabled');
        }
    });

    // Double click to ills row
    $('#ills tbody').on("dblclick", 'tr', function(e) {
        if ($($($('#ills tbody').children()[0]).children()[0]).hasClass('dataTables_empty')) {
            return false;
        }
        e.stopPropagation();
        illData = ills.row(this).data();
        showImagedView();
        $('#' + partsEnArray[partsArray.indexOf(illData[2])]).css('fill', '#ffc1c1');
        selectedIll = $('#' + partsEnArray[partsArray.indexOf(illData[2])]);
        $('.part-info').css('display','block');
        $('.new-ill').css('display','none');
        renderIllsOfPart(selectedIll[0].id);
    });
    
        // click to remove patients row button
    $('.table-view .remove').click(function () {
        // console.log(modifiedData.ills);
        for (var i = 0; i < patients.rows('.selected')[0].length; i++) {
            console.log(patients.rows('.selected')[0][i]);
            modifiedData.ills.splice(parseInt(patients.rows('.selected')[0][i]), 1);
        }
        saveData();
        patients.rows('.selected').remove().draw(false);
        modifiedData.patients = patients.rows().data().toArray();
    });

    // click to remove ills row button
    $('.patient-ills .remove').click(function (e) {
        e.preventDefault();
        ills.rows('.selected').remove().draw(false);
        modifiedData.ills[modifiedData.patients.indexOf(rowID)] = ills.rows().data().toArray();
    });

    // save button
    $('.save').click(function() {
        saveData();
    });

    // View buttons
    $('.tabled-btn').click(function () {
        $('.tabled-info').css('display', 'block');
        $('.new-ill').css('display', 'block');
        $('.imaged-info').css('display', 'none');
        $('.part-info').css('display', 'none');
        $('.tabled-btn').addClass('active');
        $('.imaged-btn').removeClass('active');
    });
    $('.back-btn').click(function () {
        $('.table-view').css('display', 'block');
        $('.new-patient').css('display', 'block');
        $('.patient-ills').css('display', 'none');
        $('.part-info').css('display', 'none');
        $('.new-ill').css('display', 'none');
    });
    $('.imaged-btn').click(function(){showImagedView()});
    
    // Submit records
    $('.new-patient .submit-patient').click(function (e) { 
        e.preventDefault();
        var name = $('#name')[0];
        var sexError;
        var sex = $('input[name=sex]:checked')[0];
        var nameError;
        var date = $('#date')[0];
        var dateError;
        if (!sex) {
            $('.sex .error')[0].innerHTML = 'Выберите пол';
            sexError = true;
        }
        else {
            $('.sex .error')[0].innerHTML = '';
            sexError = false;
        }
        if (name.value == "") {
            $('.name .error')[0].innerHTML = 'Заполните поле';
            nameError = true;
        }
        else {
            nameError = false;
            $('.name .error')[0].innerHTML = '';
        }
        if (date.value == "") {
            $('.date .error')[0].innerHTML = 'Укажите дату';
            dateError = true;
        }
        else {
            $('.date .error')[0].innerHTML = '';
            dateError = false;
        }
        if (!sexError && !nameError && !dateError) {
            patientLastId++;
            patients.row.add([
                patientLastId,
                name.value,
                sex.value,
                date.value,
            ]).draw(false);
            modifiedData.patients = patients.rows().data().toArray();
            modifiedData.ills.push([]);
        }
        saveData();
    });
    $('.new-ill .submit-ill').click(function (e) { 
        e.preventDefault();
        var illName = $('#ill-name')[0];
        var illNameError;
        var illPart = $('#ill-part')[0];
        var illPartError;
        var desc = $('#desc')[0];
        var descError;
        if (illName.value == "") {
            $('.ill-name .error')[0].innerHTML = 'Заполните поле';
            illNameError = true;
        }
        else {
            $('.sex .error')[0].innerHTML = '';
            illNameError = false;
        }
        if (illPart.value == "1") {
            $('.ill-part .error')[0].innerHTML = 'Укажите часть тела';
            illPartError = true;
        }
        else {
            illPartError = false;
            $('.ill-part .error')[0].innerHTML = '';
        }
        if (desc.value == "") {
            $('.desc .error')[0].innerHTML = 'Укажите дату';
            descError = true;
        }
        else {
            $('.desc .error')[0].innerHTML = '';
            descError = false;
        }
        if (!illNameError && !illPartError && !descError) {
            illLastId++;
            ills.row.add([
                illLastId,
                illName.value,
                partsArray[illPart.value - 2],
                desc.value,
            ]).draw(false);
            modifiedData.ills[modifiedData.patients.indexOf(rowID)] = ills.rows().data().toArray();
        }
        saveData();
    });
});

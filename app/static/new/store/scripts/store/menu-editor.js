jQuery(document).ready(function () {
    /* =============== DEMO =============== */
    // menu items
    // var arrayjson = [{
    //     "href": "http://home.com",
    //     "icon": "fas fa-home",
    //     "text": "Home",
    //     "target": "_top",
    //     "title": "My Home"
    // }, {"icon": "fas fa-chart-bar", "text": "Opcion2"}, {
    //     "icon": "fas fa-bell",
    //     "text": "Opcion3"
    // }, {"icon": "fas fa-crop", "text": "Opcion4"}, {
    //     "icon": "fas fa-flask",
    //     "text": "Opcion5"
    // }, {"icon": "fas fa-map-marker", "text": "Opcion6"}, {
    //     "icon": "fas fa-search",
    //     "text": "Opcion7",
    //     "children": [{
    //         "icon": "fas fa-plug",
    //         "text": "Opcion7-1",
    //         "children": [{"icon": "fas fa-filter", "text": "Opcion7-1-1"}]
    //     }]
    // }];
    var arrayjson = $("#menu_maker_hidden_input").val();
    // icon picker options
    var iconPickerOptions = {searchText: "Buscar...", labelHeader: "{0}/{1}"};
    // sortable list options
    var sortableListOptions = {
        placeholderCss: {'background-color': "#cccccc"}
    };

    var editor = new MenuEditor('myEditor', {listOptions: sortableListOptions, iconPicker: iconPickerOptions});
    editor.setForm($('#frmEdit'));
    editor.setUpdateButton($('#btnUpdate'));
    $('#btnReload').on('click', function () {
        editor.setData(arrayjson);
    });

    $('#btnOutput').on('click', function () {
        var str = editor.getString();
        $("#out").text(str);
    });

    $("#btnUpdate").click(function () {
        editor.update();
        $("#menu_maker_hidden_input").val(editor.getString());
    });

    $('#btnAdd').click(function () {
        editor.add();
        $("#menu_maker_hidden_input").val(editor.getString());
    });
    /* ====================================== */

    /** PAGE ELEMENTS **/
    $('[data-toggle="tooltip"]').tooltip();
    $.getJSON("https://api.github.com/repos/davicotico/jQuery-Menu-Editor", function (data) {
        $('#btnStars').html(data.stargazers_count);
        $('#btnForks').html(data.forks_count);
    });
    //this sets of value of menu maker field everytime form is saved
    $('#save').click(function() {
        $("#menu_maker_hidden_input").val(editor.getString());
    });


    // load data into menu_maker everytime
    editor.setData(arrayjson);
});
        
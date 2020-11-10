function getFormData($form) {
    const serializeArray = $form.serializeArray();
    const indexed_array = {};

    $.map(serializeArray, function (n, i) {
        if (n['value'] === ""){
            indexed_array[n['name']] = null;
        }
        else indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
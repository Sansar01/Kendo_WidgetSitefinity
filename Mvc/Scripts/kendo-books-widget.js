(function () {
    window.vote = function (e) {
        e.preventDefault();
        var sf_appPath = $('#sfAppPath').val();

        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        console.log("data ", sf_appPath + 'home/vote/' + dataItem.Title)
        $.post(sf_appPath + 'home/vote/' + dataItem.Title, function (data) {
            $('#booksGrid').data('kendoGrid').dataSource.read();
            $("#booksGrid").data('kendoGrid').refresh();
        });
    };
}());
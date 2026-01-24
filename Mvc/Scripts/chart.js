$(document).ready(function () {
    $(".options").bind("change", refresh);
    $(document).bind("kendo:skinChange", updateTheme);
});

function refresh() {
    var chart = $("#chart").data("kendoChart"),
        series = chart.options.series,
        type = $("input[name=seriesType]:checked").val(),
        stack = $("#stack").prop("checked");

    for (var i = 0, length = series.length; i < length; i++) {
        series[i].stack = stack;
        series[i].type = type;
    };

    chart.refresh();
}

function updateTheme() {
    $("#chart").getKendoChart().setOptions({ theme: kendoTheme });
}
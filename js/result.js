/**
 * File was created by Øyvind Skeie Liland on 17.02.18
 */

/**
 * Retrieve organization number from url and show result
 */
function show() {
    var param = retrieveParam();
    if (param) {
        getResult(param[1]);
    } else {
        $("#searchResultContainer").append("<h1>Ugyldig input</h1>");
    }
}

/**
 * concatinate a url and pass it to getJSON() to retrieve JSON file from server
 * @param nr - organization number to be searched for (with HTTP-request)
 */
function getResult(nr) {
    var format = "json";
    var url = "http://data.brreg.no/enhetsregisteret/enhet/" + nr + "." + format;
    getJSON(url);
}

/**
 * Extracts parameter from URL and matches against Regular Expression
 * @returns {RegExpMatchArray | null}
 */
function retrieveParam() {
    var url = window.location.href;
    var regex = /\?orgNumber=(\d+)$/;

    return url.match(regex);
}

/**
 * Called when searching for a specific organization number
 * @param resultJSON - the json file retrieved from the register
 */
function showResult(resultJSON) {
    var i = 0;
    $("#searchResultContainer").append("<table id=org" + i + ">" + "</table>");

    var infoList = extractInfo(resultJSON, i);
    for (var str in infoList) {
        if (infoList[str].value !== undefined) {
            $("#org" + i).append("<tr><td>" + "<strong>" + infoList[str].key + "</strong>" + ":</td><td>" + infoList[str].value + "</td></tr>");
        }
    }

    // If bankrupt set background-color red
    if ($("#org" + i).hasClass("konkurs")) {
        $("body").css("background-color", "#f05053");
        $("<h2>Denne bedriten er konkurs</h2>").insertBefore("#org" + i);
    }
}

/**
 * Called when no organization was found
 */
function noOrganizationFound() {
    var param = retrieveParam();
    if (param) {
        $("#searchResultContainer").append("<h1> Fant ikke noen bedrift med organisasjonsnummer: " + param[1] + "</h1>");
    } else {
        $("#searchResultContainer").append("<h1> Fant ikke noen bedrift med organisasjonsnummeret </h1>");
    }
}
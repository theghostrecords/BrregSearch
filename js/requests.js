/**
 * File was created by Øyvind Skeie Liland on 15.02.18
 */

/**
 * Send a HTTP-GET-request for the json file containing information about the organization
 * @param url - including file to be retrieved from the server
 */
function getJSON(url) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        //readyState == 4: Fetch operation is complete - status==200: success
        if (this.readyState === 4 && this.status === 200) {
            // Parse result and pass it on for further processing
            var resultJSON = JSON.parse(this.responseText);
            if (resultJSON["data"] === undefined) { // Searching 'with' organization number
                showResult(resultJSON);
            } else {  // Incremental/live search
                showResults(resultJSON["data"]);
            }
        } else if (this.readyState === 4 && (this.status === 404 || this.status === 400)) {
            noOrganizationFound();
        }
    };
    request.open("GET", url, true);
    request.send();
}


/**
 * Pair used for information about a company - Info-type: info
 * @returns Object containing Key-Value pair
 */
function keyValue(k, val) {
    return {
        key: k,
        value: val
    };
}

/**
 * Check if a JSON "tree" exists
 * @param json - JSON object
 * @param str - Key to search for
 * @return {boolean} - If subtree exists
 */
function checkIfExist(json, str) {
    return json[str] !== undefined;
}


/**
 * Retrieves the important information from the json file
 * @param resultJSON - json file
 * @param i - how many organizations have been seen so far
 * @returns {Array} - list of keyvalue pairs containing the data retrieved
 */
function extractInfo(resultJSON, i) {
    // Extract the most important information from json file
    var infoList = [];
    var orgNr = resultJSON["organisasjonsnummer"];
    infoList.push(keyValue("Organisasjonsnummer", orgNr));
    var name = resultJSON["navn"];
    infoList.push(keyValue("Navn", name));
    var orgFormBeskrivelse = resultJSON["orgform"]["beskrivelse"];
    infoList.push(keyValue("Type", orgFormBeskrivelse));
    var stiftetDato = resultJSON["stiftelsesdato"];
    infoList.push(keyValue("Stiftet", stiftetDato));
    var registrertDato = resultJSON["registreringsdatoEnhetsregisteret"];
    infoList.push(keyValue("Registrert", registrertDato));
    var antallAnsatt = resultJSON["antallAnsatte"];
    infoList.push(keyValue("Antall Ansatte", antallAnsatt));
    var epost = resultJSON["epost"];
    if (epost !== undefined)
        infoList.push(keyValue("E-post", "<a href=mailto:" + epost + " target='_top'>" + epost + "</a>"));
    var hjemmeside = resultJSON['hjemmeside'];
    if (hjemmeside !== undefined)
        infoList.push(keyValue("Hjemmeside", "<a href=https://" + hjemmeside + " >" + hjemmeside + "</a>"));

    // To avoid accessing undefined trees - check if it exists first
    if (checkIfExist(resultJSON, "institusjonellSektorkode")) {
        var sektorKode = resultJSON["institusjonellSektorkode"]["kode"] + " " + resultJSON["institusjonellSektorkode"]["beskrivelse"];
        infoList.push(keyValue("Sektor kode", sektorKode));
    }
    if (checkIfExist(resultJSON, "naeringskode1")) {
        var naering = resultJSON["naeringskode1"]["kode"] + " " + resultJSON["naeringskode1"]["beskrivelse"];
        infoList.push(keyValue("Næringskode", naering));
    }
    if (checkIfExist(resultJSON, "foretningsadresse")) {
        var forAdr = resultJSON["forretningsadresse"]["adresse"] + ", " + resultJSON["forretningsadresse"]["postnummer"] + " " + resultJSON["forretningsadresse"]["poststed"];
        infoList.push(keyValue("Foretningsadresse", forAdr));
        var kommune = resultJSON["forretningsadresse"]["kommune"];
        infoList.push(keyValue("Kommune", kommune));
    }
    if (checkIfExist(resultJSON, "postadresse")) {
        var postAdr = resultJSON["postadresse"]["adresse"] + ", " + resultJSON["postadresse"]["postnummer"] + " " + resultJSON["postadresse"]["poststed"];
        infoList.push(keyValue("Postadresse", postAdr));
    }

    // If bankrupt change text and add to bankrupt class
    var konkurs = resultJSON["konkurs"];
    if (konkurs === "J") {
        infoList.push(keyValue("Konkurs", "Ja"));
        $("#org" + i).addClass("konkurs"); // Add to konkurs class for styling purposes
    } else {
        infoList.push(keyValue("Konkurs", "Nei"));
    }
    return infoList;
}

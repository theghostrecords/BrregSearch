/**
 * File was created by Øyvind Skeie Liland on 17.02.18
 */

var page = 0;
const pageSize = 100;

/**
 * Called to show search results (when multiple results are available)
 */
function instantSearchName() {
    var name = document.getElementById("nameSearchField").value;
    var format = "json";
    var url = "https://data.brreg.no/enhetsregisteret/enhet." + format + "?page=" + page + "&size=" + pageSize + "&$filter=startswith(navn,'" + name + "')";
    getJSON(url);
}

/**
 * add organizations found to incremental search box
 * @param resultJSON - the json file retrieved from the register
 */
function showResults(resultJSON) {
    for (var i = 0; i < resultJSON.length; i++) {
        var infoList = extractInfo(resultJSON[i], i);
        var orgNumb = infoList[0].value;
        var orgName = infoList[1].value;

        // Check if the organization is bankrupt
        var konk = false;
        for (var obj in infoList) {
            if (infoList[obj].key === "Konkurs" && infoList[obj].value === "Ja") {
                konk = true;
            }
        }

        // Avoid adding the same element more than once
        if ($("#" + orgNumb).length == 0) {
            if (konk) {
                $("#tabList").append("<li id='" + orgNumb + "' class='konkurs' onclick='redirectToResult(" + orgNumb + ")'><a title='Denne bedriften er konkurs'>" + orgName + "</a></li>");
            } else {
                $("#tabList").append("<li id='" + orgNumb + "' onclick='redirectToResult(" + orgNumb + ")'><a>" + orgName + "</a></li>");
            }
        }
    }
    addShowMoreButton();

}

/**
 * Adds a show more "button" at the end of the incr.search list
 */
function addShowMoreButton() {
    // Add show more button to the end of the list
    if ($("#tabList").children().length >= 100 && (page + 1) * pageSize < 10000) {
        $("#tabList").append("<li id='more'><a> Vis mer.. </a></li>");

        $("#more").click(function () {
            showMore();
            // Timeout for other events to trigger first
            setTimeout(function () {
                $("#more").remove();
            }, 0);
        });
    }
}

/**
 * Function increases page count and adds more organizations to the live search list
 */
function showMore() {
    page++;
    instantSearchName();
}

/**
 * Clear the current results from the incremental search box
 */
function clearScreen() {
    $("#tabList").children("li").each(function (i) {
        this.remove();
    });
}

/**
 * Redirect user to result page
 */
function redirectToResult(number) {
    window.location.assign("./result.html?orgNumber=" + number);
}

/**
 * Search for a specific organization number
 */

function searchOrgNr() {
    var nr = document.getElementById("orgSearchField").value;
    redirectToResult(nr);
}

$(document).ready(function () {
    // Initialize button with search-icon
    $("#orgSearchButton").button({
        icon: "ui-icon-search"
    });

    // Initialize button with search-icon
    $("#nameSearchButton").button({
        icon: "ui-icon-search"
    });


    $("#orgForm").submit(function (e) {
        searchOrgNr();
        e.preventDefault();
    });

    // If submitting the name form
    $("#nameForm").submit(function (e) {
        clearScreen();
        instantSearchName();
    });

    // Listen for user keypresses in the searchfield - Used for instant search results
    $("#nameSearchField").on("keyup focus", function (e) {
        clearScreen();

        if ((document.getElementById("nameSearchField").value).length < 3) {
            return;
        } else {
            page = 0; // Reset page count
            instantSearchName()
        }
    });

    // Show the incremental search box
    $("#nameSearchField").focus(function () {
        // If number of characters in input field exceeds 3 show the incremental search box
        var interval = setInterval(function () {
            var cnt = $("#nameSearchField").val().length;
            if (cnt < 3) {
                return;
            }
            $(".incrSearch").show(500);
            $("#tabList").children("li").each(function () {
                $(this).show(500);
            });
            clearInterval(interval);
        }, 1000);
    });

    // Hide the live search box: Listen on document body - if click is outside of the form elements hide it
    $(window).click(function (e) {
        if ($(e.target).closest("#nameForm").length > 0) { // If target is descendant of nameform: returns > 0
            return false;
        }
        $(".incrSearch").hide(1000);
        $("#tabList").children("li").each(function () {
            $(this).hide(1000);
        });
    });
});

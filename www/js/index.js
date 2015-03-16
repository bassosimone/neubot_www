/*-
 * This file is part of Neubot <http://www.neubot.org/>.
 *
 * Neubot is free software. See AUTHORS and LICENSE for more
 * information on the copying conditions.
 */

//
// The "main" of Neubot web interface.
//

// TODO: move this function inside .ready() to
// avoid polluting the function space
function process_state(data) {

    var now = utils.getNow();
    var value = '';

    if (data.events.pid) {
        jQuery("#pid").text(data.events.pid);
    }

    if (data.events.next_rendezvous) {
        value = utils.getTimeFromSeconds(data.events.next_rendezvous);
        // The sysadmin might have adjusted the clock
        if (value && value > now) {
            jQuery("#next_rendezvous").text(utils.formatMinutes(value - now));
        }
    }a

    if (data.events.since) {
        value = utils.getTimeFromSeconds(data.events.since, true);
        if (value) {
            jQuery("#since").text(value);
        }
    }

    if (data.events.negotiate) {
        if (data.events.negotiate.queue_pos) {
            jQuery("#queuePos").text(data.events.negotiate.queue_pos);
        }
        else {
            jQuery("#queuePos").text(0);
        }
    }

    if (data.events.test_name) {
        jQuery("#testName").text(data.events.test_name);
    }
}

jQuery(document).ready(function() {

    //
    // This translates the parts of the DOM that are loaded
    // at the moment in which it is invoked.
    //
    // FIXME It does not translate inside the "tabs".
    //
    i18n.translate(function () {

        //
        // By default load the status.html page
        //
        $('#content').load('status.html', function () {

            $(".i18n").css("visibility", "visible");
            utils.setActiveTab("index");  // XXX non consistent naming

            //
            // Arrange things so that when we click on a button we
            // change "tab" in the UX:
            //
            $('#statusbutton').click(function () {
                $('#content').load('status.html', function () {
                    $(".i18n").css("visibility", "visible");
                    utils.setActiveTab("index");  // XXX non consistent naming
                });
            });
            $('#resultsbutton').click(function () {
                $('#content').load('results.html', function () {
                    $(".i18n").css("visibility", "visible");
                    utils.setActiveTab("results");
                });
            });
            $('#logbutton').click(function () {
                $('#content').load('log.html', function () {
                    $(".i18n").css("visibility", "visible");
                    utils.setActiveTab("log");
                });
            });
            $('#privacybutton').click(function () {
                $('#content').load('privacy.html', function () {
                    $(".i18n").css("visibility", "visible");
                    utils.setActiveTab("privacy");
                });
            });
            $('#settingsbutton').click(function () {
                $('#content').load('settings.html', function () {
                    $(".i18n").css("visibility", "visible");
                    utils.setActiveTab("settings");
                });
            });

            // We need this to use jqplot.
            jQuery.jqplot.config.enablePlugins = true;

            //
            // This starts a function that runs periodically to
            // track the state of the Neubot process.
            //
            tracker = state.tracker(process_state);
            tracker.start();

        });
    });
});

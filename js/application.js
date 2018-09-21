/*
 * Application main file
 */

(function() {

    function triangleViewMain() {
        // Load UI elements
        let ui = new Ui(window.document);

        // Warn before leaving page
        window.onbeforeunload = function() {
            if (ui.dirty) {
                return 'Changes will not be saved';
            }
        };
    }

    document.addEventListener("DOMContentLoaded", triangleViewMain);
})();

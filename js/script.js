/* Copy the contact email to the clipboard. The page works without this. */

(function () {
    "use strict";

    var note = document.getElementById("copy-note");

    function showDone() {
        note.textContent = "Copied to clipboard.";
        note.classList.add("is-done");
        setTimeout(function () {
            note.textContent = "";
            note.classList.remove("is-done");
        }, 2500);
    }

    /* Fallback for older browsers or clipboard-API failures */
    function copyWithFallback(text) {
        var el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        var ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (err) {
            ok = false;
        }
        document.body.removeChild(el);
        if (ok) {
            showDone();
        } else {
            note.textContent = "Copy failed — select it manually.";
            setTimeout(function () { note.textContent = ""; }, 3000);
        }
    }

    document.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var text = btn.getAttribute("data-copy");
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(showDone).catch(function () {
                    copyWithFallback(text);
                });
            } else {
                copyWithFallback(text);
            }
        });
    });
})();

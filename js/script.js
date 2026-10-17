/* Small, unobtrusive JavaScript.
   The site works fine without it. This adds two extras:
   1. the dark-mode toggle button in the header (all pages)
   2. the "copy email address" button on the contact page */

(function () {
    "use strict";

    /* ---------- Dark mode ---------- */

    var root = document.documentElement;
    var themeBtn = document.getElementById("theme-toggle");

    function themeLabel() {
        /* the button always shows the mode you would switch TO */
        return root.getAttribute("data-theme") === "dark" ? "Light" : "Dark";
    }

    function paintThemeBtn() {
        if (themeBtn) {
            themeBtn.textContent = themeLabel();
        }
    }

    function setTheme(value) {
        if (value === "dark") {
            root.setAttribute("data-theme", "dark");
        } else {
            root.removeAttribute("data-theme");
        }
        try {
            localStorage.setItem("theme", value);
        } catch (err) {
            /* private browsing etc. — the choice just won't persist */
        }
        paintThemeBtn();
    }

    if (themeBtn) {
        paintThemeBtn();
        themeBtn.addEventListener("click", function () {
            setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    }

    /* ---------- Copy email address ---------- */

    var note = document.getElementById("copy-note");

    function showDone() {
        note.textContent = "Copied to clipboard.";
        note.classList.add("is-done");
        setTimeout(function () {
            note.textContent = "";
            note.classList.remove("is-done");
        }, 2500);
    }

    function copyWithClipboard(text) {
        navigator.clipboard.writeText(text).then(showDone).catch(function () {
            copyWithFallback(text);
        });
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
                copyWithClipboard(text);
            } else {
                copyWithFallback(text);
            }
        });
    });
})();

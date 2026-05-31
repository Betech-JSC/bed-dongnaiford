"use strict";

function scrollToSection(id, spaceTop = 0) {
    const elem = document.getElementById(id);
    if (elem) {
        window.scrollTo({
            top: elem.getBoundingClientRect().top + window.scrollY - spaceTop,
            behavior: "smooth",
        });
    }
}

export { scrollToSection };

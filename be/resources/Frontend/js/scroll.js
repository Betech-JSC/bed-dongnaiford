'use strict'

function scrollToSection(id, spaceTop = 0, spaceTopMobile = 0) {
    const elem = document.getElementById(id)
    const isScreenPC = window.matchMedia('(min-width: 1024px)').matches
    if (elem) {
        if (isScreenPC) {
            window.scrollTo({
                top: elem.getBoundingClientRect().top + window.scrollY - spaceTop,
                behavior: 'smooth',
            })
        } else {
            window.scrollTo({
                top: elem.getBoundingClientRect().top + window.scrollY - spaceTopMobile,
                behavior: 'smooth',
            })
        }
    }
}

export { scrollToSection }

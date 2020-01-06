// ==UserScript==
// @name         autoscout24.com
// @namespace    https://www.autoscout24.com/
// @version      0.1
// @description  Hide unwanted ads
// @author       Eros Nicolau
// @match        *.autoscout24.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    console.clear()
    let ls = window.localStorage

    // Add the hide icons to the listing ads
    let cadAds = document.querySelectorAll('.cl-list-element:not(.cl-ad-inpager):not([id])')
    cadAds.length > 0 && [...cadAds].map(e => {
        let idChunks = e.querySelector('[id]').id.split('-'),
            id = idChunks[idChunks.length - 1]
        addMonkey(e, id)
    })

    // Check to see if you're on a car page; If so, then add the hide icon to the Details box
    try {
        if (document.querySelectorAll('#cldt-contact-form')[0].getAttribute('data-classified-guid')) {
            let idChunks = document.querySelectorAll('#cldt-contact-form')[0].getAttribute('data-classified-guid').split('-'),
                id = idChunks[idChunks.length - 1]
            addMonkey( document.querySelector('main'), id )
        }
    } catch (e){}

    // Look into localStorage and hide all the cars that match the hidden cars list
    let currentCars = JSON.parse(ls.getItem("Hidden Cars")) || [];
    if (currentCars.length > 0) {
        currentCars.map(c => {
            let that = document.querySelectorAll('[data-hiddenid="'+c+'"]')
            that.length > 0 && [...that].map(el => toggleCar(el, [...el.classList].includes('hiddenButton')))
        })
    }

    function addMonkey(e, id){
        console.log(e, id)
        let tlink = document.createElement('a'),
            link = e.parentNode.insertBefore(tlink, e);
        link.setAttribute('href','#')
        link.setAttribute('data-hiddenid', id);
        link.classList.add('hideMe')
        link.innerText = '🙈'
        link.addEventListener("click", function(el){
            el.preventDefault()
            let that = el.target.closest('.hideMe')
            toggleCar(that, [...that.classList].includes('hiddenButton'))
        }, false);
    }

    function toggleCar(el, hidden){
        let id = el.getAttribute('data-hiddenid')
        let currentCars = JSON.parse(ls.getItem("Hidden Cars")) || [];
        if(hidden == true) {
            el.nextSibling.classList.remove("hiddenAd")
            el.classList.remove('hiddenButton')
            ls.setItem("Hidden Cars", JSON.stringify(currentCars.filter(e => e != id)))
        } else {
            el.nextSibling.classList.add("hiddenAd")
            el.classList.add("hiddenButton")
            !currentCars.includes(id) && ls.setItem("Hidden Cars", JSON.stringify([id, ...currentCars]))
        }
    }

    // Add custom CSS
    var head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style"),
        customCSS = ''
    head.appendChild(style)
    style.type = "text/css"
    customCSS += ".hideMe {font-size: 18px; cursor: pointer; float: right; transform: translate(-2px, 12px); z-index: 6; position: relative; text-decoration: none}"
    customCSS += ".hero-image + .viewport .hideMe {transform: none; position: absolute; right: -13px;}"
    customCSS += ".hideMe:hover {opacity: .5}"
    customCSS += ".hidden, .adcontainer-tr, .a, .rightBranding, [id^=Crt], #bnr {display: none !important}"
    customCSS += ".hiddenAd {height: 40px; min-height: unset !important; overflow: hidden; opacity: 0.15; display: block}"
    customCSS += "main.hiddenAd {height: 600px}"
    customCSS += ".hiddenAd td {display: block}"
    customCSS += ".hiddenAd .tags {display: none;}"
    customCSS += ".hiddenAd td {display: block; float: left;}"
    customCSS += ".price {font-size: 16px !important}"
    customCSS += ".price + span {display: none}"
    customCSS += ".hiddenAd .td-price {position: absolute; right: 20px; padding: 0 !important; transform: translateY(-5px);}"
    customCSS += ".hiddenAd .title-cell {max-width: calc(100% - 230px); padding: 0 !important; transform: translateY(-5px);}"
    customCSS += ".hiddenAd .title-cell h3 {font-size: 16px !important}"
    customCSS += ".hiddenButton {opacity: 0.15}"
    if (style.styleSheet) style.styleSheet.cssText = customCSS
    else style.appendChild(document.createTextNode(customCSS))

})();

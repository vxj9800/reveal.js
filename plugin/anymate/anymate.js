// Anymate Plugin
// Allows any element to react to reveal.js events.
// Written By: Vatsal Joshi
// Email: vajoshi.baroda@gmail.com

// Following four line just works.
// Copied from one of the reveal.js plugins.
// The idea here is to create a function expression.
// The advantage is that functions and variables defined inside this function are not accessible by the outside world unless attached as the members of the object being returned by the function. This basically behaves like a single object with hidden members.
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Anymate = t()
}(this, (function() {
    "use strict";

    // The reveal.js instance this plugin is attached to
    let slidesDeck;

    // Some necessary variables to keep track of the system state.
    let animPlaying = false;
    let animObjs = new Array();
    let animUpdateIntIdx = null;
    let animUpdateCounter = 0;
    let animUpdateDt = 1;      // This exists for the update function that depend on ode solvers. It can be used to change the integration time step on the fly.

    // Functions for animations to register themselves so that update and pause can be controlled
    function registerAnim(animObj) {
        animObjs.push(animObj);
    }

    // Function to find indices to the elements that are on the current slide
    function setCurrentSlideElems(idxh, idxv) {
        for (let animObj of animObjs)
            if (idxh == animObj.idxh && idxv == animObj.idxv)
                animObj.onCurrentSlide = true;
            else
                animObj.onCurrentSlide = false;
    }

    // Function to call the update functions of the animations that are on the current slide
    function callUpdateFuns() {
        animUpdateCounter += animUpdateDt;
        for (let animObj of animObjs)
            if (animObj.onCurrentSlide && (typeof animObj.update === "function"))
                animObj.update(animUpdateCounter, animUpdateDt, animObj.onCurrentFragm);
    }

    // Function to call the play functions of the animations that are on the current slide
    function callPlayFuns() {
        for (let animObj of animObjs)
            if (animObj.onCurrentSlide && (typeof animObj.play === "function"))
                animObj.play();
    }

    // Function to call the pause functions of the animations that are on the current slide
    function callPauseFuns() {
        for (let animObj of animObjs)
            if (animObj.onCurrentSlide && (typeof animObj.pause === "function"))
                animObj.pause();
    }

    // Function to call the reset functions of the animations that are on the current slide
    function callResetFuns() {
        if (animPlaying) {
            clearInterval(animUpdateIntIdx);
            animPlaying = false;
            callPauseFuns();
        }
        animUpdateCounter = 0;
        animUpdateDt = 1;
        for (let animObj of animObjs)
            if (animObj.onCurrentSlide && (typeof animObj.reset === "function"))
                animObj.reset();
    }

    // Function to update and pause animation on the respective slied
    function playPauseAnim() {
        if (animPlaying) {
            clearInterval(animUpdateIntIdx);
            animPlaying = false;
            callPauseFuns();
        }
        else {
            callPlayFuns();
            animPlaying = true;
            animUpdateIntIdx = setInterval(callUpdateFuns.bind(this), 16);
        }
    }

    // Function to handle the slide change event
    function handleSlideChange(event) {
        callResetFuns();
        setCurrentSlideElems(event.indexh, event.indexv);
    }

    // Function to handle the slides ready event
    function handleSlidesReady(event) {
        if (animObjs.length)
            setCurrentSlideElems(event.indexh, event.indexv);
        else
            setTimeout(handleSlidesReady.bind(this, event), 500);
    }

    // Function to handle the fragment shown event
    function handleFragShown(event) {
        if (animObjs.length) {
            for (let frag of event.fragments)
                for (let animObj of animObjs)
                    if (frag.id == animObj.id) {
                        animObj.onCurrentFragm = true;
                        if (typeof animObj.fragShown === "function")
                            animObj.fragShown();
                    }
        }
        else
            setTimeout(handleFragShown.bind(this, event), 500);
    }

    // Function to handle the fragment hidden event
    function handleFragHidden(event) {
        for (let frag of event.fragments)
            for (let animObj of animObjs)
                if (frag.id == animObj.id) {
                    animObj.onCurrentFragm = false;
                    if (typeof animObj.fragHidden === "function")
                        animObj.fragHidden();
                }
    }

    // Change global time speed
    function increaseAnimUpdateDt() {
        animUpdateDt += 0.1;
    }
    function decreaseAnimUpdateDt() {
        animUpdateDt -= 0.1;
        if (animUpdateDt < 0) {
            animUpdateDt = 0;
        }
    }

    return {
		id: 'anymate',

		init(reveal) {
            slidesDeck = reveal;
            slidesDeck.on('ready', handleSlidesReady);
            slidesDeck.on('slidechanged', handleSlideChange);
            slidesDeck.on('fragmentshown', handleFragShown);
            slidesDeck.on('fragmenthidden', handleFragHidden);
            slidesDeck.addKeyBinding({ keyCode: 32, key: 'Space', description: 'Play or Pause the animations' }, playPauseAnim);
            slidesDeck.addKeyBinding({ keyCode: 82, key: 'R', description: 'Reset the animations' }, callResetFuns);
            slidesDeck.addKeyBinding({ keyCode: 188, key: '<', description: 'Slow down the animations' }, decreaseAnimUpdateDt);
            slidesDeck.addKeyBinding({ keyCode: 190, key: '>', description: 'Speed up the animations' }, increaseAnimUpdateDt);
        },

        register: registerAnim
	}
}));
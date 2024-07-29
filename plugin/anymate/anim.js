// anime Class
// Allows creation of javascript objects that are managed by Anymate plugin.
// Written By: Vatsal Joshi
// Email: vajoshi.baroda@gmail.com

class anim {
    #initAnimIntIdx = null;
    constructor(elemID) {
        this.id = elemID;
        this.#initAnimIntIdx = setInterval(this.#initializeAnimation.bind(this), 100);
    }

    // Function for the animation to initialize itself
    #initializeAnimation() {
        if (document.readyState === 'complete') {
            this.elem = document.getElementById(this.id);
            if (this.elem != null) {
                let slide = this.elem.closest('section');
                if (slide != null) {
                    this.idxh = Reveal.getIndices(slide).h;
                    this.idxv = Reveal.getIndices(slide).v;
                    this.onCurrentSlide = false;
                    this.onCurrentFragm = false;
                    clearInterval(this.#initAnimIntIdx);
                    if (typeof this.init === "function")
                        this.init();
                    this.#registerWithAnymate();
                }
                else {
                    clearInterval(this.#initAnimIntIdx);
                    throw this.id + ": This element is not inside a 'section' element.";
                }
            }
            else {
                clearInterval(this.#initAnimIntIdx);
                throw this.id + ": This element doesn't exist.";
            }
        }
    }

    // Function to register this object with Anymate plugin
    #registerWithAnymate() {
        if (typeof Anymate === "undefined")
            setTimeout(this.#registerWithAnymate.bind(this), 500);
        else
            Anymate.register(this);
    }
}
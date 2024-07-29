let animRect = new anim('animRect')
animRect.init = function () {
    anime.remove(this.elem);
    anime({
        targets: this.elem,
        width: 500,
        height: 200,
        x: -250,
        y: -100,
        rx: 0,
        ry: 0,
        easing: 'easeInCirc'
    });
}
animRect.fragShown = function () {
    anime.remove(this.elem);
    anime({
        targets: this.elem,
        width: 200,
        height: 200,
        x: -100,
        y: -100,
        rx: 100,
        ry: 100,
        easing: 'easeInCirc'
    });
}
animRect.fragHidden = function () {
    this.init();
}
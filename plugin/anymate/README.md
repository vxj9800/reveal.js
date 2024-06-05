# Anymate (A [reveal.js](https://revealjs.com/) Plugin) #
This plugin is designed to animate any HTML element present in a `<section>` element of a reveal.js presentation.

The way this is achieved is by first adding an `id` attribute to any tag, must be a children of a `<section>` element, that needs to be animated. The value of this `id` attribute is then provided to an `anim` type javascript object through the constructor `anim(elemID)`. This object can contain the following event driven functions
```
init()                  =>  Mandatory function. Initializes the element into a correct state. Called at the presentation initialization.
update(animT, animDt)   =>  Update the state of the element. The input arguments are somewhat convoluted right now. By default, this
                            function is called every 16ms. The animT starts from 0 and increments by animDt every time this function
                            is called. Parameter animDt is 1 by default, but it can be changed by the amount of +-0.1 using < or >.
                            In future, this approach might change. The default callback interval of 16ms may become 20ms, giving 50Hz
                            update rate. Along with it, the animT and animDt may give real-time values, i.e. animDt will start with
                            being 50ms and can be increased or decreased in the intervals of 1ms and animT will start with being 0
                            and increment by the amount of animDt every time this function is called.
fragShown()             =>  This function is called when the element becomes 'visible' because of being a fragment. This is just an
                            attribute that is set by reveal.js framework to make different elements in one slide appear or disappear
                            at different times. The use of this function is take advantage of this feature and make the element do
                            whatever we want it to do.
fragHidden()            =>  This function is called when the element becomes 'invisible' because of being a fragment.
reset()                 =>  This function is supposed to put the element in its default state. It is called either at the slide change
                            or by pressing r key on the keyboard.
```
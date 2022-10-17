<h1 align="center">
    Simple Vanilla Carousel
</h1>

<p align="center">
    <img src="simple-vanilla-carousel.gif" alt="Simple Vanilla Carousel">
</p>

## Features

- It's a vanilla javascript slider with minimal configuration;
- Each slide can contains various HTML tags, not just images;
- Slides can be scrolled manually by mouse or touch events;
- Slides can be scrolled automaticaly by using a timer;
- It's fully configurable;
- It just works.

## Quick start

Just copy the `dist/simple-vanilla-carousel.min.js` file somewhere on your website, then add this `HTML` code to your webpage:

```html
<div id="carousel">
    <div>slide 1</div>
    <div>slide 2</div>
    <div>slide 3</div>
    <div>slide 4</div>
    <div>slide 5</div>
</div>
<script src="simple-vanilla-carousel.min.js"></script>
<script>
  const el = document.getElementById('carousel');

  const options = {
      delay: 5000,
  };

  window.simpleVanillaCarousel = new SimpleVanillaCarousel(el, options);
</script>
```

## API

```javascript
// Get the div element that contains the slides.
const sliderElement = document.getElementById('simple-vanilla-carousel');

// Configurable parameters, see below.
const config = {};

// Instanciate a new Simple Vanilla Carousel.
const SimpleVanillaCarousel = new SimpleVanillaCarousel(sliderElement, config);
```

```javascript
// Go to the previous slide.
SimpleVanillaCarousel.prev();

// Go to the next slide.
SimpleVanillaCarousel.next();

// Go to second slide.
SimpleVanillaCarousel.jump(2);
```

```javascript
// Start the timer, which switch slides automaticaly.
pandaTimer.start();

// Stop the timer.
pandaTimer.stop();
```

## Default configuration

```javascript
{
    delay: 5000,    // Number that represents the delay in milliseconds before
                    // scrolling to the next slide. Defaults is 5000.

    speed: 750,     // Number that represents the speed in milliseconds of
                    // slides transition. Default is 750ms

    threshold: 100, // Number that represents the minimum deplacement in pixels
                    // to manualy scroll to the next slide.
                    // Default is 100 pixels.
}
```

## Show your appreciation / Support the author

If you like [Simple Vanilla Carousel](https://github.com/chuot/simple-vanilla-carousel) please consider **starring the repository** to show you appreciation to the author for his hard work. It cost nothing but is really appreciated.

If you use [Simple Vanilla Carousel](https://github.com/chuot/simple-vanilla-carousel) for commercial purposes or derive income from it, please consider [sponsoring this project](https://github.com/sponsors/chuot) to help support continued development.

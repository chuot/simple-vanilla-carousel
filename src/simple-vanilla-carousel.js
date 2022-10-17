/*
 * *****************************************************************************
 * @license
 * Simple Vanilla Carousel <https://github.com/chuot/simple-vanilla-carousel>
 * Copyright (C) 2022 Chrystian Huot <chrystian.huot@saubeo.solutions>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 * ****************************************************************************
 */

class SimpleVanillaCarousel {
    get index() {
        return this.#index;
    }

    #carousel;
    #config;
    #clientX = 0
    #clientY = 0;
    #count = 0;
    #index = 0;
    #offsetLeft = 0;
    #previousClientX = 0;
    #previousClientY = 0;
    #previousOffsetLeft = 0;
    #slides = document.createElement('div');
    #timer;

    constructor(carousel, options) {
        if (carousel instanceof HTMLDivElement)
            this.#carousel = carousel;
        else
            throw 'carousel is not an instanceof HTMLDivElement';

        this.#config = {
            delay: typeof options?.delay === 'number' ? Math.abs(options.delay) : SimpleVanillaCarousel.defaultConfig.delay,
            speed: typeof options?.speed === 'number' ? Math.abs(options.speed) : SimpleVanillaCarousel.defaultConfig.speed,
            threshold: typeof options?.threshold === 'number' ? Math.abs(options.threshold) : SimpleVanillaCarousel.defaultConfig.threshold,
        };

        this.#count = carousel.children.length;

        this.#slides.classList.add('slides');

        this.#carousel.appendChild(this.#slides);

        this.#slides.appendChild(this.#carousel.children.item(this.#carousel.children.length - 2).cloneNode(true));
        this.#slides.appendChild(this.#carousel.children.item(0).cloneNode(true));

        while (this.#carousel.children.length > 1) {
            const slide = this.#carousel.removeChild(this.#carousel.firstElementChild);
            this.#slides.insertBefore(slide, this.#slides.lastElementChild);
        }

        for (let i = 0; i < this.#slides.children.length; i++)
            this.#slides.children.item(i).style.flex = '0 0 100%';

        Object.assign(this.#carousel.style, {
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            userSelect: 'none',
        });

        Object.assign(this.#slides.style, {
            display: 'flex',
            left: '-100%',
            position: 'relative',
        });

        this.#carousel.addEventListener('mousedown', this);
        this.#carousel.addEventListener('touchstart', this);
        this.#carousel.addEventListener('touchmove', this);
        this.#carousel.addEventListener('touchend', this);

        this.#slides.addEventListener('transitionend', this);

        document.addEventListener('visibilitychange', this);       

        window.addEventListener('resize', this);

        this.start();
    }

    handleEvent(event) {
        switch (event?.type) {
            case 'visibilitychange':
                if (this.#timer !== null)
                    if (document.hidden === true)
                        clearInterval(this.#timer);
                    else if (document.hidden === false)
                        this.start();
                break;

            case 'mousedown':
            case 'touchstart':
                this.#scrollBegin(event);
                break;

            case 'mousemove':
            case 'touchmove':
                this.#scrollMove(event);
                break;

            case 'mouseup':
            case 'touchend':
                this.#scrollEnd(event);
                break;

            case 'resize':
                this.#scrollToIndex();
                break;

            case 'transitionend':
                this.#validateIndex();
                break;
        }
    }

    jump(slide) {
        if (typeof slide !== 'number' || slide < 1 || slide > this.#count)
            throw `invalid slide number (1..${this.#count})`;

        this.#index = slide - 1;

        this.#scrollToIndex();
    }

    next() {
        if (this.#index < this.#count) {
            this.#index++;

            this.#scrollToIndex();
        }
    }

    prev() {
        if (this.#index >= 0) {
            this.#index--;

            this.#scrollToIndex();
        }
    }

    start() {
        if (this.#config.delay > 0)
            this.#timer = setInterval(() => this.next(), this.#config.delay);
    }

    stop() {
        if (this.#timer !== null) {
            clearInterval(this.#timer);

            this.#timer = null;
        }
    }

    #scrollBegin(event) {
        if (this.#timer !== null) clearInterval(this.#timer);

        this.#validateIndex();

        this.#previousOffsetLeft = this.#slides.offsetLeft;

        if (event?.touches?.length) {
            this.#previousClientX = event.touches[0].clientX;
            this.#previousClientY = event.touches[0].clientY;

        } else {
            this.#previousClientX = event?.clientX ?? 0;
            this.#previousClientY = event?.clientY ?? 0;

            document.addEventListener('mousemove', this);
            document.addEventListener('mouseup', this);
        }
    }

    #scrollEnd(event) {
        this.#offsetLeft = this.#slides.offsetLeft;

        if (!event?.touches?.length) {
            document.removeEventListener('mousemove', this);
            document.removeEventListener('mouseup', this);
        }

        if (this.#offsetLeft - this.#previousOffsetLeft < -this.#config.threshold)
            this.#index++;

        else if (this.#offsetLeft - this.#previousOffsetLeft > this.#config.threshold)
            this.#index--;

        this.#scrollToIndex();

        if (this.#timer !== null) this.start();
    }

    #scrollMove(event) {
        if (event?.touches?.length) {
            this.#clientX = this.#previousClientX - event.touches[0].clientX;
            this.#clientY = this.#previousClientY - event.touches[0].clientY;

            this.#previousClientX = event.touches[0].clientX;
            this.#previousClientY = event.touches[0].clientY;

        } else {
            this.#clientX = this.#previousClientX - event?.clientX;
            this.#clientY = this.#previousClientY - event?.clientY;

            this.#previousClientX = event?.clientX;
            this.#previousClientY = event?.clientY;
        }

        if (this.#clientX ** 2 > this.#clientY ** 2)
            event.preventDefault();
        else
            return;

        let offset = this.#slides.offsetLeft - this.#clientX;

        if (offset > 0)
            offset = 0;

        else if (offset < -(this.#count + 1) * this.#slides.offsetWidth)
            offset = -(this.#count + 1) * this.#slides.offsetWidth;

        this.#slides.style.left = `${offset}px`;
    }

    #scrollToIndex() {
        Object.assign(this.#slides.style, {
            left: `${-this.#slides.offsetWidth - this.#index * this.#slides.offsetWidth}px`,
            transition: `left ${this.#config.speed}ms ease-out`,
        });
    }

    #validateIndex() {
        const index = this.#index;

        this.#slides.style.transition = '';

        if (this.#index < 0)
            this.#index = this.#count - 1;
        else if (this.#index >= this.#count)
            this.#index = 0;

        if (this.#index !== index)
            this.#slides.style.left = `${-this.#slides.offsetWidth - this.#index * this.#slides.offsetWidth}px`;
    }
}

SimpleVanillaCarousel.defaultConfig = {
    delay: 5000,
    speed: 750,
    threshold: 100,
};

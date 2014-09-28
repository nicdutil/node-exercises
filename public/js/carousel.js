//////////////////////////////////////////////////////////////////////
// Service, Method Carousel
//////////////////////////////////////////////////////////////////////

var carousels = {};
var buttonSelected = {};

var CAROUSEL_WAIT = minToMillis(5);
var CAROUSEL_TIMEOUT = secToMillis(30);
// accordeon collapse handler 

function secToMillis(s) {
    return s * 1000
};

function minToMillis(m) {
    return m * secToMillis(60)
};


var Carousel = function Carousel() {
    this.active = true;
    this.currIndex = 0;
    this.prevIndex = -1;
    this.items;
    this.timeout;
    this.timerId;
    this.id;
};

Carousel.prototype.pause = function() {
    var that = this;
    clearTimeout(this.timerId);
    this.timerId = setTimeout(function() {
        that.start();
    }, CAROUSEL_WAIT);
}

Carousel.prototype.stop = function() {
    var id = this.id;
    var currButton = this.items.eq(this.prevIndex);
    this.active = false;
    $(buttonSelected[this.id]).removeClass('selected-button');
    $(buttonSelected[this.id] + ' ' + 'img').addClass('grayfilter');

    buttonSelected[this.id] = undefined;
    clearTimeout(this.timerId);
}

Carousel.prototype.start = function() {
    var id = this.id;
    var currIndex = 0;
    this.active = true;
    $.each(this.items, function(key, value) {
        if (value === buttonSelected[id]) {
            currIndex = key;
            return false;
        }
    });
    this.prevIndex = currIndex - 1;
    if (currIndex == this.items.length) {
        currIndex = 0;
    }
    this.currIndex = currIndex;

    if (typeof buttonSelected[id] !== "undefined") {
        $(buttonSelected[id]).removeClass('selected-button');
    }

    this.nextItem();
}

Carousel.prototype.nextItem = function() {
    var currButton;

    currButton = this.items.eq(this.currIndex);
    selectButton(this.id, currButton.prop('id'));
    showPanel(this.id, currButton.prop('id'));
    this.prevIndex = this.currIndex;
    this.currIndex++;

    if (this.currIndex == this.items.length) {
        this.currIndex = 0;
    }
    var that = this;
    this.timerId = setTimeout($.proxy(function() {
        this.nextItem()
    }, this), this.timeout);
}

function initCarousel(id, timeout) {
    var c = new Carousel();
    timeout = typeof timeout !== 'undefined' ? timeout : CAROUSEL_TIMEOUT;
    c.timeout = timeout;
    c.items = $('#' + id + ' ' + 'button');
    c.id = id;
    carousels[id] = c;
    c.start();
}
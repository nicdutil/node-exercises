
////////////////////////////////////////////////////////////////////////////
// img slider
////////////////////////////////////////////////////////////////////////////

var slider = namespace('ifc.slider');
slider.x = 0;
slider.TIMEOUT = 5000;
slider.init = function() {
    slider.items = $('.slider .slide');
    slider.length = slider.items.length;
    if (slider.length < 2) {
        return;
    }
    for (i = 1; i < slider.length; i++) {
        $(slider.items[i]).css('opacity', '0');
    }
    setTimeout(slider.nextSlide, slider.TIMEOUT);
}

slider.getSlideSelector = function(x) {
    var sel = '.slider  .slide:nth-child(' + (x + 1) + ')';
    return sel;
}

slider.hideSlide = function(x) {
    var sel = slider.getSlideSelector(x);

    $(sel).animate({
        'opacity': '0'
    }, 500);
}

slider.showSlide = function(x) {
    var sel = slider.getSlideSelector(x);
    $(sel).animate({
        'opacity': '1'
    }, 500, function() {
        setTimeout(slider.nextSlide, slider.TIMEOUT);
    });
}

slider.nextSlide = function() {
    var next = (slider.x + 1) % slider.length;
    slider.hideSlide(slider.x);
    slider.showSlide(next);
    slider.x = next;
}


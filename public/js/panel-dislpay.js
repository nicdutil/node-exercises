tablet.carouselHandler = function(direction) {
    var waypoint = this.id;
    var panelDisplay = $('#' + waypoint + ' .content-block').css('display');

    if (panelDisplay == 'none' && direction == "down" && carousels[waypoint] === undefined) {
        initCarousel(waypoint);
    }
}

tablet.teamHandler = function(direction) {
    var length = $('#screen-team-photo').html().trim().length;

    if (direction === "down" && length === 0) {
        showPanel('team', 'nic-button');
    }
}

tablet.initWayPoints = function() {
    $('#services,#screen-method').waypoint(tablet.carouselHandler, {
        offset: '50%'
    });

    $('#team').waypoint(tablet.teamHandler, {
        offset: '50%'
    });

};

/////////////////////////////////////////////////////////////////////////////
// Mouser event registering
/////////////////////////////////////////////////////////////////////////////


function selectButton(sectionId, buttonId) {
    var c = carousels[sectionId];
    var b = buttonSelected[sectionId];

    if (c !== undefined) {
        c.pause();
    }

    if (b !== undefined) {
        $(b).removeClass('selected-button');
        $(b + ' ' + 'img').addClass('grayfilter');
    }

    buttonId = hashTag(buttonId);
    buttonSelected[sectionId] = buttonId;
    $(buttonId).addClass('selected-button');
    $(buttonId + ' ' + 'img').removeClass('grayfilter');
}


/////////////////////////////////////////////////////////////////////////////
// Screen Panel Display 
/////////////////////////////////////////////////////////////////////////////

function prefix(id) {
    return id.split('-')[0].trim()
};
FADE_DURATION = 200;
function fadeHtml(obj, direction, complete) {
    if (direction === 'in') {
        $(obj['selector']).fadeIn(FADE_DURATION,'linear', function() {
            if (complete) {
                complete();
            }
        });
    } else {
        $(obj.selector).fadeOut(FADE_DURATION,'linear', function() {
            complete(obj);
        });
    }
}

function parse(sectionId, buttonId, suffix) {
    var pre = prefix(buttonId);
    var o = {};

    o['id'] = '#' + pre + '-' + suffix;
    o['html'] = $(o['id']).html().trim();
    o['selector'] = '#' + sectionId + '-' + suffix;

    if (prefix(sectionId) === sectionId) {
        o['selector'] = '#screen-' + sectionId + '-' + suffix;
    }
    return o;
}

var firstPanel = true;


function showPanel(sectionId, buttonId) {
    var t = parse(sectionId, buttonId, 'text');
    var p = parse(sectionId, buttonId, 'photo');

    if (firstPanel) {
        $(t['selector']).html(t['html']);
        $(p['selector']).html(p['html']);
        firstPanel = false;
        if (notouch) {
            tablet.add_hoverclass('#screen-services .content-block a', 'hover-underline');
        }
        return;
    }

    var buttonPrefix = prefix(buttonId);

    var htmlCallback = function(ob) {
        $(ob['selector']).html(ob['html']);
        if (notouch) {
            tablet.add_hoverclass('#screen-services .content-block a', 'hover-underline');
        }
    }

    var excelCallBack = function(ob) {
        if (buttonPrefix === 'excel') {
            $('#screen-canvas-wrapper').css('display', 'none');
            $('#screen-canvas-wrapper').removeClass('hide');
            $('#screen-canvas-wrapper').fadeIn(FADE_DURATION);
        } else {
            $(ob['selector']).html(ob['html']);
            fadeHtml(ob, 'in');
        }
    }

    var scrollToCallBack = function(ob) {
        $('#screen-services #consult-anchor').scrollTo({
            speed: 800,
            offset: 0,
            easing: 'easeInOutCubic'
        });
    }

    fadeHtml(t, 'out', htmlCallback);

    canvasHide = 'none' !== $('#screen-canvas-wrapper').css('display');
    if (canvasHide && sectionId === 'services') {
        $('#screen-canvas-wrapper').fadeOut(FADE_DURATION,function() {
            $(p['selector']).css('display', 'none');
            $(p['selector']).html(p['html']);
            fadeHtml(p, 'in');
        });
    } else {
        fadeHtml(p, 'out', excelCallBack);
    }

    if (buttonPrefix === 'consult') {
        fadeHtml(t, 'in', scrollToCallBack);
    } else {
        fadeHtml(t, 'in');
    }
}

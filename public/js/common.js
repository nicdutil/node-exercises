/*! Copyright 2014 Infocinc (www.infocinc.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/

function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';

    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
}

//////////////////////////////////////////////////////////////////////
// Globals
//////////////////////////////////////////////////////////////////////
var cm = namespace('ifc.common');

cm.navMiniMode = false;
cm.screenType;
cm.screenTypeEnum = {
    MOBILE: 0,
    TABLET_PORTRAIT: 1,
    TABLET_LANDSCAPE: 2,
    DESKTOP_LG: 3,
    DESKTOP_WIDE: 4
};


///////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////

function hashTag(id) {
    return '#' + id
};

Array.prototype.last = function() {
    return this[this.length - 1];
}

function queryMediaState() {
    var size = parseInt($('#media-state').css('font-size'), 10);
    var screenType;
    if (size === 1) {
        screenType = cm.screenTypeEnum.MOBILE;
    } else if (size === 2) {
        screenType = cm.screenTypeEnum.TABLET_PORTRAIT;
    } else if (size === 3) {
        screenType = cm.screenTypeEnum.TABLET_LANDSCAPE;
    } else if (size === 4) {
        screenType = cm.screenTypeEnum.DESKTOP_LG;
    } else {
        screenType = cm.screenTypeEnum.DESKTOP_WIDE;
    }
    return screenType;
}

$.fn.isOnScreen = function() {

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};


//////////////////////////////////////////////////////////////////////
// Waypoints handlers
//////////////////////////////////////////////////////////////////////

function navBarResizeHandler(direction) {
    var src;
    var fixedFlag = 'fixed' === $('#fixed-bar').css('position');
    if (!fixedFlag)
        return;

    if (direction === "down") {
        $('#fixed-bar').addClass('navbar-mini');
        navMiniMode = true;
    } else {
        $('#fixed-bar').removeClass('navbar-mini');
        navMiniMode = false;
    }
}

///////////////////////////////////////////////////////////////////////////
// Scroll Tos registering
///////////////////////////////////////////////////////////////////////////

var hero_anchors = [
    '#services-hero-anchor',
    '#project-hero-anchor',
    '#team-hero-anchor',
    '#banner-anchor-service',
    '#team-banner-anchor',
    '#contact-hero-anchor'
];

var footer_anchors = [
    '#services-footer-anchor',
    '#team-footer-anchor',
    '#top-footer-anchor', 
    '#project-footer-anchor'
];

var main_nav_anchors = [
    '#top-nav-anchor', 
    '#slideone-nav-anchor',
    '#slidetwo-nav-anchor', 
    '#slidethree-nav-anchor',
    '#slidefour-nav-anchor',
    '#slidefive-nav-anchor',
    '#slidesix-nav-anchor','#soumission'
];


function registerScrollsTo() {
    var media_state = queryMediaState();

    $(main_nav_anchors.join()).scrollTo({
        speed: 800,
        offset: 0,
        easing: 'easeInOutCubic'
    });

    $(hero_anchors.join()).scrollTo({
        speed: 1000,
        offset: 0,
        easing: 'easeInOutCubic'
    });


    if (media_state !== 'MOBILE') {
        $(footer_anchors.join()).scrollTo({
            speed: 1500,
            offset: 0,
            easing: 'easeInOutCubic'
        });
    }
}

///////////////////////////////////////////////////////////////////////////
// Google Analytics & FB SDK
///////////////////////////////////////////////////////////////////////////

var ganal = namespace('ifc.analytics');

ganal.create_event = function(label, value, url) {
    e = {
        'hitType': 'event',
        'eventCategory': 'button',
        'eventAction': 'click',
        'eventLabel': label,
        'eventValue': value,
        'page': url,
        'nonInteraction': false
    }
    return e;
}



ganal.track_navclicks = function() {
    var path = document.location.pathname;
    $('.center-navigation').on('click', function() {
        eo = ganal.create_event('nav-button', 1, path);
        ga('send', eo);
    });
    $('#navbar-collapse a').on('click', function(e) {
        var navitem = $(e.target).text().toLowerCase() + '-menuitem';
        eo = ganal.create_event(navitem, 1, path);
        ga('send', eo);
    });
}

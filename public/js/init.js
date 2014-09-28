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


/////////////////////////////////////////////////////////////////////////
// Mobile Init
/////////////////////////////////////////////////////////////////////////
var mobile = namespace('ifc.mobile');


mobile.arrowUpNoHashTag = function() {
    $('#arrow-up-anchor').on('click', function(e) {
        e.preventDefault();
        var loc = window.location;
        window.location.href = '#';
        if (history.pushState) {
            history.pushState("", document.title, loc.pathname);
        }
    });
}


mobile.initWayPoints = function() {
    $('#apropos-banner').waypoint(function(direction) {
        if (direction === "down") {
            $('#fixed-icons').children().removeClass('invisible');
        } else {
            $('#fixed-icons').children().addClass('invisible');
        }
    });
};

mobile.navbarClickHandler = function() {
    $('#navbar-collapse').on('show.bs.collapse', function() {
        $('#fixed-bar').css('opacity', '1');
    });
    $('#navbar-collapse').on('hide.bs.collapse', function() {
        $('#fixed-bar').css('opacity', '');
    });

}


mobile.init = function() {
    mobile.arrowUpNoHashTag();
    mobile.initWayPoints();
    mobile.navbarClickHandler();
}



/////////////////////////////////////////////////////////////////////
//  Initialization
//////////////////////////////////////////////////////////////////////


function adaptForMobile() {
    site_state = queryMediaState();

    if (site_state === 'MOBILE') {
        $('#fbook-anchor').attr('href', "https://m.facebook.com/pages/infocinc/896328063714402");
        $('#footer-fbook-anchor').attr('href', "https://m.facebook.com/pages/infocinc/896328063714402");
        var viewportHeight = $(window).height();
    }
}



function initScrollsTo() {
    registerScrollsTo();
}

function initWayPoints() {
    $('#apropos-banner').waypoint(navBarResizeHandler, {
        offset: '0%'
    });
};



function initScrollDepth() {
    $.scrollDepth();
}

///////////////////////////////
// detectIE
// no support below IE 9 as of 2014.09.02
///////////////////////////////

function detectIE() {
    'use strict';
    // Detecting IE
    var oldIE;
    if ($('html').is('.lt-ie9')) {
        oldIE = true;
    }
    if (oldIE) {
        $('#main').css('display', 'none');
        // do nothing which will prevent content from being shown 
    }
    return oldIE;
}



function twitter(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}

function commonInit() {
    twitter(document, 'script', 'twitter-wjs');
    $("#skype-call-anchor").prop('href', 'skype:infoCinc?call'); // skype href in js for seo friendliness
    document.addEventListener("touchstart", function() {}, false); // allow css active to work in safari
    initScrollsTo();
    initWayPoints();
}


function init() {
    var oldIE = detectIE();
    if (oldIE) {
        return;
    }

    cm.screenType = queryMediaState();
    commonInit();
    if (cm.screenType === cm.screenTypeEnum.MOBILE) {
        mobile.init();
    }
    ifc.tablet.init();
    ganal.track_navclicks();
    initScrollDepth();
}

$(document).ready(function() {
    init();
});

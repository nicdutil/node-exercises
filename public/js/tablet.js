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

///////////////////////////////////////////////////////////////////////
// Globals
///////////////////////////////////////////////////////////////////////
var mediaSwitch;
var tablet = namespace('ifc.tablet');
var initialScreenType;
var initFlag = true;
var notouch = $('html').hasClass('no-touch');

/////////////////////////////////////////////////////////////////////////////////
// unclassified
//////////////////////////////////////////////////////////////////////////////////

tablet.add_hoverclass = function(selectors, classname) {
    $(selectors).hover(
        function() {
            $(this).addClass(classname)
        },
        function() {
            $(this).removeClass(classname);
        }
    );
    $(selectors).focusin(function() {$(this).addClass(classname)});
    $(selectors).focusout(function() {$(this).removeClass(classname)});
}

//////////////////////////////////////////////////////////////////////////////////
// Enquire registering
//////////////////////////////////////////////////////////////////////////////////

function registerMediaCallbacks() {
    mediaSwitch = false;

    enquire.register("screen and (min-width:768px)", {

        unmatch: function() {
            mediaSwitch = true;
            mobile.navbarClickHandler();
        },

        match: function() {
            if ((cm.screenType === cm.screenTypeEnum.MOBILE) || mediaSwitch) {
                $('#navbar-collapse').off();
            }

            var stop = $('#apropos-banner').offset().top;

            if ((!cm.navMiniMode) && (stop < $(window).scrollTop())) {
                $('#fixed-bar').addClass('navbar-mini');
                cm.navMiniMode = true;
            }


            if (notouch) {
                tablet.add_hoverclass('#footer-contact a, #footer-community a,'+
                    '#footer-nav a', 'hover-underline');
                tablet.add_hoverclass('.center-navigation a','navbox-hover');
            }
        }
    });
}


/////////////////////////////////////////////////////////////////
// Resize handler
/////////////////////////////////////////////////////////////////
tablet.resize = function() {
    var mediaState = queryMediaState();
}

tablet.resizeHandlers = function() {
    window.addEventListener('resize', tablet.resize, false);
}


tablet.modernizrTests = function(complete) {
    var load = [{
        test: window.matchMedia,
        nope: "js/vendor/matchMedia.min.js"
    }, {
        test: window.matchMedia.addListener,
        nope: "js/vendor/matchMedia.addListener.min.js"
    }, {
        both: ['js/vendor/enquire.min.js'],
        complete: function() {
            complete();
        }
    }];
    Modernizr.load(load);
}


tablet.init = function() {
    tablet.resizeHandlers();
    tablet.modernizrTests(registerMediaCallbacks);
}

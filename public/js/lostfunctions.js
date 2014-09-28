ganal.track_socialnetworks = function() {
    var send_fbevent = function(action, targetUrl) {
        var page = '/' + targetUrl.split('/').last();
        var obj = ganal.create_socialinteraction('facebook', action, targetUrl, page);
        ga('send', obj);
    }
    FB.Event.subscribe('edge.create', function(targetUrl) {
        send_fbevent('like', targetUrl);
    });
    FB.Event.subscribe('edge.remove', function(targetUrl) {
        send_fbevent('unlike', targetUrl);
    });
}
ganal.create_socialinteraction = function(network, action, target, page) {
    var obj = {
        'hitType': 'social',
        'socialNetwork': network,
        'socialAction': action,
        'socialTarget': target,
        'page': page
    }
    return obj;
}
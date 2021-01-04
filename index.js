function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        console.log('top');
        fn();
    } else {
        if (window.Turbolinks && window.Turbolinks.supported) {
            document.addEventListener('turbolinks:load', fn);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
}

function hasClass(el, name) {
    if (el.classList)
        return el.classList.contains(name);
    else
        return new RegExp('(^| )' + name + '( |$)', 'gi').test(el.className);
}

function removeClass(el, name) {
    if (el.classList)
        el.classList.remove(name);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function addClass(el, name) {
    if (el.classList)
        el.classList.add(name);
    else
        el.className += ' ' + name;
}

function trigger(el, name) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, false);
    el.dispatchEvent(event);
}

function triggerCustom(el, name, data) {
    if (window.CustomEvent) {
        var event = new CustomEvent(name, { detail: data });
    } else {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, true, data);
    }
    el.dispatchEvent(event);
}

function POST(url, options) {
    return fetch(url, Object.assign({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    }, options));
};

function PATCH(url, options) {
    return fetch(url, Object.assign({
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            
        },
        credentials: 'same-origin',
    }, options));
};

function DELETE(url, options) {
    return fetch(url, Object.assign({
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    }, options));
};

function GET(url, options) {
    var headers = options.headers;
    delete options.headers;

    return fetch(url, Object.assign({
        method: 'GET',
        headers: Object.assign({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        }, headers),
        credentials: 'same-origin',
    }, options));
};

// Page through all pages
//
// Returns a promise resolved with json if non-paginated resource OR array
// of all data.
//
// Assumes a response of
// {
//   links: { next: "url" }.
//   data: []
// }
//
// Example:
//   page(GET, "/some-resource").then(function (data) {
//     console.log(data); // etc - prints array of all data
//   });
//
function page(fn, url, options, data) {
    data = data || [];
    return new Promise(function (resolve, reject) {
        fn(url, options).then(function (resp) {
            return resp.json();
        }).then(function (json) {
            // faster.... when we have es6
            // if (json.data && json.data.push) data.push(...json.data);
            if (json.data && json.data.push) data = data.concat(json.data);
            if (json.links && json.links.next) {
                page(fn, json.links.next, options, data).then(resolve).catch(reject);
            } else {
                resolve(data);
            }
        }).catch(reject);
    });
}


module.exports = {
    ready,
    hasClass,
    removeClass,
    addClass, trigger,
    triggerCustom,
    POST,
    PATCH,
    DELETE,
    GET,
    page
}
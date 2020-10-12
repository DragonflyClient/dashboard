$(function () {
    function adjust(elements, offset, min, max) {
        // initialize parameters
        offset = offset || 0;
        min = min || 0;
        max = max || Infinity;
        elements.each(function () {
            var element = $(this);
            // add element to measure pixel length of text
            var id = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
            var tag = $('<span id="' + id + '">' + element.val() + '</span>').css({
                'display': 'none',
                'font-family': element.css('font-family'),
                'font-size': element.css('font-size'),
            }).appendTo('body');
            // adjust element width on keydown
            function update() {
                // give browser time to add current letter
                setTimeout(function () {
                    // prevent whitespace from being collapsed
                    tag.html(element.val().replace(/ /g, '&nbsp'));
                    // clamp length and prevent text from scrolling
                    var size = Math.max(min, Math.min(max, tag.width() + offset));
                    if (size < max)
                        element.scrollLeft(0);
                    // apply width to element
                    element.width(size);
                }, 0);
            };
            update();
            element.keydown(update);
        });
    }
    // apply to our element
    adjust($('.adjust'), 10, 20, 500);
});


let newTip;
let userDiff = false;
const username = document.getElementById('account__username-input')
const usernameIcon = document.getElementById('account__username-icon')

username.addEventListener('keyup', (e) => {
    checkUsername(e)
})

usernameIcon.addEventListener('click', (event) => {
    const el = event.target
    if (username.value.trim() !== el.dataset.defaultUsername && userDiff && validUsername(username.value)) return setUsername(username.value)
})

function checkUsername(event) {
    if (!newTip) {
        newTip = tippy(username, {
            placement: 'bottom',
            animation: 'perspective',
            content: 'Your Dragonfly username can only contain numbers, uppercase and lowercase letters.', // <--- not an option! set it on the element as an attribute
        });
    }
    const key = event.key
    const el = event.target
    if (!validUsername(username.value)) {
        newTip.state.isEnabled = true
        newTip.show()
        username.style.background = "gray"
    } else {
        newTip.hide()
        newTip.state.isEnabled = false
        username.style.background = "white"
    }

    if (key == "Enter" && username.value.trim() !== el.dataset.defaultUsername) return setUsername(username.value)
    if (el.dataset.defaultUsername !== username.value.trim()) {
        userDiff = true
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
    } else {
        userDiff = true
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    }
}

function setUsername(username) {
    console.log("Set username to ", username)
}

function validUsername(username) {
    const match = username.match(/[a-zA-Z0-9]*/)
    if (match[0] !== username) {
        return false
    } else {
        return true
    }
}
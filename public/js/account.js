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

const accountDataInput = document.querySelectorAll('.account__input')

console.log(accountDataInput)
accountDataInput.forEach(input => {
    input.addEventListener('keyup', (e) => {
        if (e.target.dataset.inputType === "email") {
            setEmail(e.target.dataset.default, e.target, e.keyCode)
        } else if (e.target.dataset.inputType === "username") {
            setUsername(e.target.dataset.default, e.target, e.keyCode)
        }
    })
})

async function setEmail(email, input, key) {
    console.log(input.value)
    if (!validateInput(email, input.value)) {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    } else {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
        if (key == '13') {
            const result = await fetch(`https://email-verification.playdragonfly.net/change`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: input.value })
            })
            const data = await result.json()
            console.log(data, "DAD")
        }
    }
}

async function setUsername(username, input, key) {
    console.log(input.value)
    const bodyData = {
        name: input.value
    }
    if (!validateInput(username, input.value)) {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    } else {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
        if (key == '13') {
            const result = await fetch('https://api.playdragonfly.net/v1/authentication/rename', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            })
            const data = await result.json()
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Nice one!',
                    text: `Username changed to "${input.value}"`
                })
            } else if (data.next) {
                Swal.fire({
                    icon: 'error',
                    title: 'Damn',
                    text: `You can change your username again ${moment(data.next).fromNow()}`,
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Whoops.',
                    text: data.error ? data.error : "Something went wrong please try again later.",
                })
            }
        }
    }
}

function validateInput(initial, current) {
    if (initial === current.trim()) return false
    else return true
}
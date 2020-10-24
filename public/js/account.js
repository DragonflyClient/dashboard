const urlParams = new URLSearchParams(window.location.search);

window.addEventListener('load', () => {
    const screenSize = window.innerWidth < 1000 ? "mobile" : "desktop"
    const scrollDelay = 0
    if (screenSize === "mobile") scrollDelay = 550
    if (urlParams.get('red') === "redeem") {
        const targetElement = document.getElementById('redeem-cosmetic-wrapper')
        const posY = targetElement.getBoundingClientRect().top
        console.log(posY)
        document.getElementsByTagName("html")[0].style.scrollBehavior = "smooth"
        setTimeout(() => {
            window.scrollBy(0, posY)
            document.getElementsByTagName("html")[0].style.scrollBehavior = "auto"
        }, scrollDelay);
    }
})

const accordionList = document.querySelectorAll('.accordion-item-header');

accordionList.forEach((accordionHeader) => {
    accordionHeader.addEventListener('click', (event) => {
        toggleAccordion(accordionHeader);
    });
});

function toggleAccordion(element) {
    element.classList.toggle('accordion-active');
    const accordionItemBody = element.nextElementSibling.nextElementSibling;
    if (element.classList.contains('accordion-active')) {
        accordionList.forEach((otherAccordion) => {
            if (otherAccordion !== element) {
                otherAccordion.classList.remove('accordion-active')
                otherAccordion.nextElementSibling.nextElementSibling.style.maxHeight = 0;
            }
        })
        accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + 'px';
    } else {
        accordionItemBody.style.maxHeight = '0';
    }
}

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

const accountDataInput = document.querySelectorAll('.account__input')
const accountDataIcon = document.querySelectorAll('.account__input-icon')

accountDataIcon.forEach(icon => {
    icon.addEventListener('click', (e) => {
        console.log(e.target.previousElementSibling)
        const target = e.target.previousElementSibling
        console.log(target)
        if (target.dataset.inputType === "email") {
            setEmail(target.dataset.default, target, 0000)
        } else if (target.dataset.inputType === "username") {
            setUsername(target.dataset.default, target, 0000)
        }
    })
})

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
    if (!validateInput(email, input.value)) {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    } else {
        input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
        if (key == '13' || key == 0000) {
            const result = await fetch(`https://email-verification.playdragonfly.net/change`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: input.value })
            })
            const data = await result.json()
            console.log(data)
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Nice one!',
                    text: `Sent verification email to "${input.value}". Click the link in the email to update your email address.`
                })
            } else if (data.next) {
                Swal.fire({
                    icon: 'error',
                    title: 'Damn',
                    text: `You can change your email address again ${moment(data.next).fromNow()}`,
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Whoops.',
                    text: data.message ? data.message : "Something went wrong please try again later.",
                })
            }
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
        if (key == '13' || key == 0000) {
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
                console.log(input.value)
                setNewDefault('username', input.value, input)
                Swal.fire({
                    icon: 'success',
                    title: 'Nice one!',
                    text: `Username changed to "${bodyData.name}"`
                })
            } else if (data.next) {
                Swal.fire({
                    icon: 'error',
                    title: 'Damn',
                    text: `You can change your username again ${moment(data.next).fromNow()}`,
                })
                input.value = username
                if (!validateInput(username, input.value)) {
                    input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
                } else {
                    input.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
                }
                adjust($('.adjust'), 10, 20, 500);
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

function setNewDefault(type, value, el) {
    console.log(type, value, el, "set")
    if (type == "username") {
        // defaultUsername = username
        el.value = value
        el.dataset.default = value
    }
    const username = el.dataset.default
    console.log(username, value)
    if (!validateInput(username, value)) {
        el.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    } else {
        el.nextElementSibling.innerHTML = '<svg class="account__username-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
    }
}

const uuidInput = document.getElementById('uuid-input')

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

function copyUUID() {
    uuidInput.select();
    uuidInput.setSelectionRange(0, 99999)
    document.execCommand("copy");

    Toast.fire({
        icon: 'success',
        title: 'UUID copied to clipboard!'
    })
}

const cosmeticTokenSubmit = document.getElementById('cosmetic-token-submit')
const cosmeticTokenForm = document.getElementById('cosmetic-token-form')

cosmeticTokenSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    cosmeticTokenSubmit.setAttribute('disabled', true)
    var formData = new FormData(cosmeticTokenForm)
    const submitData = {}
    for (var [key, value] of formData.entries()) {
        console.log(key, value);
        submitData[key] = value
    }
    if (submitData.token !== "") {
        const result = await fetch(`https://api.playdragonfly.net/v1/cosmetics/token/${submitData.token}`, {
            "method": "POST",
            "credentials": "include"
        })
        const responseData = await result.json()
        console.log(responseData)
        cosmeticTokenSubmit.removeAttribute('disabled')
        if (responseData.success) {
            document.getElementById('cosmetic-token-input').value = ""
            Swal.fire({
                icon: 'success',
                title: 'Nice!',
                text: responseData.message ? responseData.message : `Token successfully redeemed. Check your cosmetic!`,
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Whoops.',
                text: responseData.error ? responseData.error : "Something went wrong please try again later.",
            })
        }
    } else {
        cosmeticTokenSubmit.removeAttribute('disabled')
        Swal.fire({
            icon: 'error',
            title: 'Oh oh',
            text: "That's an interesting token :)",
        })
    }
})
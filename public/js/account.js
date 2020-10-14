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


const usernameInput = document.getElementById('account__username-input')
const usernameIcon = document.getElementById('account__username-icon')
const uuidCopyBtn = document.getElementById('account__uuid-copy')

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

uuidCopyBtn.addEventListener('click', (e) => {
    const uuidInput = document.getElementById('uuid-input')

    uuidInput.select();
    uuidInput.setSelectionRange(0, 99999);

    document.execCommand("copy");
    Toast.fire({
        icon: 'success',
        title: 'UUID copied to clipboard!'
    })
})

let newTip;
let userDiff = false;
let defaultUsername = usernameIcon.previousElementSibling.dataset.defaultUsername;

console.log(defaultUsername)

usernameInput.addEventListener('keyup', (e) => {
    checkUsername(e)
})

usernameIcon.addEventListener('click', (event) => {
    const icon = event.target
    const el = icon.previousElementSibling
    if (usernameInput.value.trim() !== el.dataset.defaultUsername && userDiff && validUsername(usernameInput.value)) return setUsername(usernameInput.value)
})

function checkUsername(event) {
    if (!newTip) {
        newTip = tippy(usernameInput, {
            placement: 'bottom',
            animation: 'perspective',
            content: 'Your Dragonfly username can only contain numbers, uppercase and lowercase letters.', // <--- not an option! set it on the element as an attribute
        });
    }
    const key = event.key
    const el = event.target
    if (!validUsername(usernameInput.value)) {
        newTip.state.isEnabled = true
        newTip.show()
        usernameInput.style.background = "gray"
        return updateIcon('same')
    } else {
        newTip.hide()
        newTip.state.isEnabled = false
        usernameInput.style.background = "white"
    }

    if (key == "Enter" && usernameInput.value.trim() !== el.dataset.defaultUsername && userDiff && validUsername(usernameInput.value)) return setUsername(usernameInput.value)

    if (el.dataset.defaultUsername !== usernameInput.value.trim()) {
        userDiff = true
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
    } else {
        userDiff = false
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    }
}

async function setUsername(username) {
    const bodyData = {
        name: username
    }
    console.log("Set username to ", username)
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Don't save`,
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
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
                    text: `Username changed to "${username}"`
                })
                setNewDefault(username)
            } else if (data.next) {
                usernameInput.value = defaultUsername
                console.log(usernameInput.value)
                updateIcon('same')
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
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })
}

function setNewDefault(username) {
    updateIcon('same')
    defaultUsername = username
    usernameInput.value = username
    usernameInput.dataset.defaultUsername = username
}

function updateIcon(type) {
    console.log(type)
    if (type == "different") {
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>'
    } else {
        usernameIcon.innerHTML = '<svg class="account__username-icon_check" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg>'
    }
}

function validUsername(username) {
    const match = username.match(/[a-zA-Z0-9]*/)
    if (match[0] === username && username.length >= 4 && username.length <= 16) {
        return true
    } else {
        return false
    }
}
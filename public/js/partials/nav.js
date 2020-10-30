const navToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1200,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
const logoutBtn = document.getElementById('logout-btn')
logoutBtn.addEventListener('click', async (e) => {
    const result = await fetch('/auth/logout', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await result.json()
    if (data.success) window.location.href = `https://playdragonfly.net/login?ref=${window.location.href}`
})

const notificationCounter = document.getElementById('notification-counter')
const notificationList = document.getElementById('notification-list')
let notifications = []
fetch('https://api.playdragonfly.net/v1/community/notifications', {
    credentials: 'include'
}).then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.notifications.length > 0) {
            notifications = data.notifications
            notificationList.innerHTML = ''
            listNotifications()
        }
    })
    .catch(err => {
        console.log(err)
    })

const types = {
    gift: {
        icon: "fa-gift",
        bgColor: "bg-drgn-primary",
        border: "border-left-drgn-primary"
    },
    information: {
        icon: "fa-info-circle",
        bgColor: "bg-primary",
        border: "border-left-primary"
    }
};

function listNotifications() {
    //           | Optional |
    let unread = 0
    notifications.reverse().forEach(notification => {
        if (!notification.read) {
            unread++
        }
        let type;
        Object.keys(types).map(function (key, index) {
            if (notification.icon == key) type = types[key];
        });
        const sendTime = new Date().getTime() < notification.sendTime ? moment(new Date().getTime()).fromNow() : moment(notification.sendTime).fromNow()
        var nth = 0;
        let notificationMessage = notification.message
        if (notificationMessage.indexOf('**') > -1)
            notificationMessage = notification.message.replace(/\*\*/g, function (match, i, original) {
                nth++;
                return nth % 2 === 0 ? "</b>" : "<b>";
            });
        notificationList.innerHTML += `
    <div data-nid="${notification._id}" data-nread="${notification.read}" onclick='notificationAction("${notification.action && notification.action.type === "open_url" ? notification.action.target : ''}", "${notification._id}", ${notification.read})' class="${!notification.read ? type.border : ''} notification-item dropdown-item d-flex align-items-center cursor-pointer">
        <div class="mr-3">
            <div class="icon-circle ${type.bgColor}">
                <i class="fas ${type.icon} text-white"></i>
            </div>
        </div>
        <div>
            <div class="small text-gray-500">${sendTime}${notification.category ? " · " + notification.category : ""}</div>
            <span class="font-weight-bold">${notificationMessage}</span>
        </div>
    </div>`
    })
    if (unread <= 9 && unread > 0) {
        notificationCounter.innerText = unread
    } else if (unread > 9) {
        notificationCounter.innerText = '9+'
    } else {
        notificationCounter.innerText = ''
    }
}

async function notificationAction(actionURL, notificationId, read) {
    await fetch(`https://api.playdragonfly.net/v1/community/notifications/${notificationId}`, {
        credentials: 'include',
        method: 'PATCH'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data, "READ")
        })
    // Set to read via API
    if (actionURL && actionURL.length > 0) {
        window.location.href = actionURL
    }
    if (!read) {
        fetch('https://api.playdragonfly.net/v1/community/notifications', {
            credentials: 'include'
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                notifications = data.notifications
                notificationList.innerHTML = ''
                listNotifications()
                console.log('notifications')
            })
            .catch(err => {
                console.log(err)
            })
    }
}

const readAllBtn = document.getElementById('read-all-icon')

readAllBtn.addEventListener('click', () => {
    readAll()
})

async function readAll() {
    let allRead = true
    notificationList.childNodes.forEach(notification => {
        if (!notification.tagName) return false
        console.log(notification.dataset.nread, "ADDD")
        if (notification.dataset.nread == "false") allRead = false
    })
    console.log(allRead)
    if (!allRead) {
        console.log('Setting all to read...')
        await fetch(`https://api.playdragonfly.net/v1/community/notifications/all`, {
            credentials: 'include',
            method: 'PATCH'
        })
            .then(res => res.json())
            .then(async data => {
                if (data.success) {
                    navToast.fire({
                        icon: 'success',
                        title: 'Set all notification to read'
                    })
                    console.log('Loading new...')
                    await fetch('https://api.playdragonfly.net/v1/community/notifications', {
                        credentials: 'include'
                    }).then(res => res.json())
                        .then(data => {
                            notificationList.innerHTML = ''
                            notifications = data.notifications
                            listNotifications()
                            console.log('notifications')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
    }
    console.log(allRead)
}
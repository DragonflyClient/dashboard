console.log('nav')
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

let notifications = [{
    icon: "information",
    category: "Username",
    message: `You've changed your username to "julii"`,
    send_time: 1567548000, // Mittwoch, 4. September
    action: null,
    read: true,
    read_time: null
}, {
    icon: "gift",
    category: "Cosmetics",
    message: `You've received **Dragonfly Wings** by **moritz**!`,
    send_time: 1568152800, // Mittwoch, 11. September
    action: {
        type: "open_url!",
        target:
            "https://dashboard.playdragonfly.net/cosmetics?qualifier=ABCDE-FGHJI-KLMN-OPQRSTU"
    },
    read: false,
    read_time: null
}];

const notificationCounter = document.getElementById('notification-counter')
const notificationList = document.getElementById('notification-list')
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
        console.log(notification.message)
        if (!notification.read) {
            unread++
        }
        let type;
        Object.keys(types).map(function (key, index) {
            if (notification.icon == key) type = types[key];
        });
        const sendTime = moment(notification.sendTime).format('LL')
        var nth = 0;
        console.log(notification.message, "MESSa");
        let notificationMessage = notification.message
        if (notificationMessage.indexOf('**') > -1)
            notificationMessage = notification.message.replace(/\*\*/g, function (match, i, original) {
                nth++;
                return nth % 2 === 0 ? "</b>" : "<b>";
            });
        console.log(notification.action)
        notificationList.innerHTML += `
    <a onclick='notificationAction("${notification.action && notification.action.type === "open_url" ? notification.action.target : ''}", "${notification._id}", ${notification.read})' class="${!notification.read ? type.border : ''} notification-item dropdown-item d-flex align-items-center cursor-pointer">
        <div class="mr-3">
            <div class="icon-circle ${type.bgColor}">
                <i class="fas ${type.icon} text-white"></i>
            </div>
        </div>
        <div>
            <div class="small text-gray-500">${sendTime}${notification.category ? " · " + notification.category : ""}</div>
            <span class="font-weight-bold">${notificationMessage}</span>
        </div>
    </a>`
    })
    if (unread != 0)
        notificationCounter.innerText = unread + "+"
    else notificationCounter.innerText = ''
    console.log(unread, "UNREAD")
}

async function notificationAction(actionURL, notificationId, read) {
    console.log(read, !read)
    await fetch(`https://api.playdragonfly.net/v1/community/notifications/${notificationId}`, {
        credentials: 'include',
        method: 'PATCH'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data, "READ")
        })
    // Set to read via API
    console.log(actionURL)
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
            })
            .catch(err => {
                console.log(err)
            })
    }
}
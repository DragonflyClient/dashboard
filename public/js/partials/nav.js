
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
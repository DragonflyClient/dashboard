// async function unlinkMinecraftAccount(item) {
//     console.log(item.id);
//     const result = await fetch('https://dashboard.playdragonfly.net/minecraft/unlink', {
//         headers: { "Content-Type": "application/json" },
//         method: 'POST',
//         credentials: 'include',
//         body: JSON.stringify({ id: item.id }),
//     })
//     const data = await result.json()
//     console.log(data, "DATA")
// }

function unlinkMinecraftAccount(item) {
    fetch('https://api.playdragonfly.net/v1/minecraft/cookie/unlink', {
        method: 'POST',
        credentials: 'include',
        body: item.id,
    })
        .then((res) => res.json())
        .then((data) => {
            const accountCard = document.getElementById('minecraft-account-card')
            if (data.success) {
                if (item.parentElement.parentElement.childElementCount === 2) {
                    item.parentElement.remove()
                    accountCard.innerHTML = "<p style=\"padding-top: 10px\">All linked minecraft accounts are displayed here.</p>"
                } else {
                    item.parentElement.remove()
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                });
            }
        });
}
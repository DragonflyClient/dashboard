function bindCosmetic(minecraft, qualifier) {
    fetch(`https://api.playdragonfly.net/v1/cosmetics/bind`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cosmeticQualifier: qualifier,
            minecraftUUID: minecraft
        })
    }).then((res) => {
        if (res.status === 200) {
            res.json().then(async (res) => {
                if (res.success) {
                    console.log(res)
                    Swal.fire({
                        icon: 'success',
                        title: 'Nice one!',
                        text: `You have successfully linked this cosmetic to the Minecraft account ${await getMinecraftName(minecraft)}`,
                        preConfirm: () => {
                            window.location.reload()
                        }
                    })
                } else {
                    console.log(res.error)
                }
            });
        } else {
            res.json().then(res => console.log(res.error))
        }
    });
}

function unbindCosmetic(minecraft, qualifier) {
    fetch(`https://api.playdragonfly.net/v1/cosmetics/bind`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cosmeticQualifier: qualifier,
            minecraftUUID: minecraft,
            unbind: true
        })
    }).then((res) => {
        if (res.status === 200) {
            res.json().then(async (res) => {
                if (res.success) {
                    console.log(res)
                    Swal.fire({
                        icon: 'success',
                        title: 'Nice one!',
                        text: `You have successfully unlinked this cosmetic to the Minecraft account ${await getMinecraftName(minecraft)}`,
                        preConfirm: () => {
                            window.location.reload()
                        }
                    })
                } else {
                    console.log(res.error)
                }
            });
        } else {
            res.json().then(res => console.log(res.error))
        }
    });
}

async function getMinecraftName(uuid) {
    const response = await fetch(`https://api.minetools.eu/uuid/${uuid}`);
    const data = await response.json();
    return data.name;
}
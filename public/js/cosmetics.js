const dragonflyUsername = localStorage.getItem('user')

if (dragonflyUsername)
    document.getElementById('dragonfly-username').innerText = dragonflyUsername;

async function loadAvailableCosmetics() {
    const result = await fetch(`https://api.playdragonfly.net/v1/cosmetics/available`)
    const json = await result.json()
    return json.availableCosmetics
}

fetch('https://api.playdragonfly.net/v1/authentication/cookie/token', {
    method: 'POST',
    credentials: 'include',
}).then((res) => {
    if (res.status === 200) {
        res.json().then(async (res) => {
            if (res.success) {
                localStorage.setItem('user', res.username)
                const dragonflyUUID = res.uuid
                const dragonflyCosmetics = await loadCosmetics(dragonflyUUID)
                const cosmeticsWrapper = document.getElementById('cosmetics-wrapper')

                document.getElementById('dragonfly-username').innerText = res.username;

                let firstIn = false;
                console.log(dragonflyCosmetics)
                const availableCosmetics = await loadAvailableCosmetics()
                for (cosmetic of dragonflyCosmetics.cosmetics) {
                    const model = availableCosmetics.find(element => element.cosmeticId == cosmetic.cosmeticId)
                    console.log(model)
                    const cosmeticCard = `<div class="col-xl-4">
                        <div class="card shadow mb-4">
                            <!-- Card Header - Dropdown -->
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">
                                    ${model.name}
                                </h6>
                            </div>
                            <!-- Card Body -->
                            <div class="card-body card-body-cosmetic">
                                <div class="cosmetic-image">
                                    <img src="${model.image}"
                                        alt="Cosmetic">
                                </div>
                            </div>
                            <div class="cosmetic-account-section">
                                <div class="cosmetic-description">
                                    <p>Choose a Minecraft account on which you want to use this cosmetic.</p>
                                </div>
                                <hr>
                                <div class="cosmetic-account-chooser">
                                    <div class="card-body minecraft-account-card" id="minecraft-account-card">
                                        ${await loadMinecraftAccounts(res, dragonflyCosmetics.cosmetics, cosmetic)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

                    if (!firstIn) cosmeticsWrapper.innerHTML = '';
                    firstIn = true;
                    cosmeticsWrapper.innerHTML += cosmeticCard;
                }
            } else {
                console.log('test');
                setTimeout(() => {
                    location.href = 'https://playdragonfly.net/dashboard2332/login?ref=https://playdragonfly.net/dashboard2332/';
                }, 5000);
            }
        });
    }
});

async function loadCosmetics(uuid) {
    const result = await fetch(`https://api.playdragonfly.net/v1/cosmetics/find?dragonfly=${uuid}`, { credentials: 'include' })
    const data = result.json()
    return data
}

let totalRuns = 0;
async function loadMinecraftAccounts(res, cosmetics, cosmetic) {
    let accountItems = '';
    for (let i = 0; i < res.linkedMinecraftAccounts.length; i++) {
        const bound = res.linkedMinecraftAccounts[i] == cosmetic.minecraft
        const className = bound ? "unbind" : "check"
        const tooltip = bound ? "Unbind from" : "Bind to"
        const icon = bound ? "times" : "check"
        const functionName = bound ? "unbind" : "bind";

        const accountItem = `
                <div class="minecraft-account-item">
                    <div class="minecraft-account">
                        <img class="minecraft-skull" width="50px"
                            src="https://crafatar.com/avatars/${res.linkedMinecraftAccounts[i]
            }"
                            alt="Head">
                        <div class="minecraft-account-info">
                            <h4 class="small font-weight-bold minecraft-account-name">
                                ${await getMinecraftName(res.linkedMinecraftAccounts[i])}
                            </h4>
                        </div>
                    </div>
                    <div onclick="${functionName}Cosmetic('${res.linkedMinecraftAccounts[i]}', '${cosmetic.cosmeticQualifier}')"
                        class="minecraft-account-${className}" title="${tooltip} account ${await getMinecraftName(res.linkedMinecraftAccounts[i])}">
                        <i class="fas fa-${icon} float-right minecraft-account-${className}-icon"></i>
                    </div>
                </div>`;

        accountItems += accountItem
    }
    totalRuns++

    console.log(totalRuns)
    if (totalRuns === cosmetics.length) {
        const cosmeticsHide = document.getElementById('cosmetics-hide')
        cosmeticsHide.style.opacity = 0;
        cosmeticsHide.addEventListener('transitionend', (e) => {
            console.log('ended')
            cosmeticsHide.style.display = 'none'

        })
    }
    return accountItems
}

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
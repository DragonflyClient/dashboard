document.getElementById('dragonfly-username').innerText = localStorage.getItem('user');
fetch('https://api.playdragonfly.net/v1/authentication/cookie/token', {
  method: 'POST',
  credentials: 'include',
}).then((res) => {
  res.json().then(async (res) => {
    if (res.success) {
      localStorage.setItem('user', res.username)
      console.log(res.creationDate)
      document.getElementById('dragonfly-username').innerText = res.username;
      document.getElementById('dragonfly-account-creation-date').innerText = moment(res.creationDate).format('LL');

      const minecraftAccountCard = document.getElementById('minecraft-account-card');
      if (res.linkedMinecraftAccounts && res.linkedMinecraftAccounts.length > 0) {
        let firstIn = false;
        for (let i = 0; i < res.linkedMinecraftAccounts.length; i++) {
          const accountItem = `
                <div class="minecraft-account-item">
                    <div class="minecraft-account">
                        <img class="minecraft-skull" width="50px" src="https://crafatar.com/avatars/${res.linkedMinecraftAccounts[i]
            }" alt="Head" />
                        <div class="minecraft-account-info">
                        <h4 class="small font-weight-bold minecraft-account-name">
                            ${await getMinecraftName(res.linkedMinecraftAccounts[i])}
                        </h4>
                        <div class="minecraft-account-uuid">${res.linkedMinecraftAccounts[i]}</div>
                        </div>
                    </div>
                    <div id=${res.linkedMinecraftAccounts[i]
            } onclick="unlinkMinecraftAccount(this)" class="minecraft-account-unlink" title="Unlink Minecraft Account">
                        <i class="fas fa-unlink float-right minecraft-account-unlink-icon"></i>
                    </div>
                </div>`;
          if (!firstIn) minecraftAccountCard.innerHTML = '';
          firstIn = true;
          minecraftAccountCard.innerHTML += accountItem;
        }
      } else {
        minecraftAccountCard.innerHTML =
          '<div class="minecraft-account-uuid minecraft-account-none">No Minecraft accounts linked.</div>';
      }
    } else {
      console.log('test');
      setTimeout(() => {
        location.href = 'https://playdragonfly.net/dashboard2332/login?ref=https://playdragonfly.net/dashboard2332/';
      }, 5);
    }
  });
})
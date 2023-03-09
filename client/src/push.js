export const push = (data) => {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        const notification = new Notification(data.title , {
          body: data.body,
          icon : data.icon === null ? 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true' : data.icon,
          silent : true
        });

        // Add onclick event listener to the notification
            notification.addEventListener('click', data.onClick);
      }
    });
  };
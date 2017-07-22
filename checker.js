chrome.storage.local.get('firstLoad', function(firstLoad) {
  if (typeof firstLoad.firstLoad === "undefined") {
    chrome.storage.local.set({
      dnd: false,
      regions: ["NA", "EU", "AU", "SA"],
      premium: false,
      ignores: [],
      notifyBefore: 60000 * 600,
      ttl: 60000 * 5,
      firstLoad: false,
      notifyOnce: false
    }, function() {
      app()
    })
  } else {
    app()
  }
});

function reload() {
  fetch('https://uhc.projectthing.tk/v1/futureuhc')
    .then(function(response) {
      return response.json()
      response = null
    }).then(function(res) {
      var times = 0
      res.matches.map(function(data) {
        notify(data.id, data.time, data.server, data.region, data.gameMode, data.hosts, data.premium, data.slots, function(id) {
          setTimeout(function() {
            chrome.storage.local.get(["notifyOnce"], function(data) {
              if (data.notifyOnce) {
                addIgnore(String(id))
              }
            })
          }, 7000)
        })
        setTimeout(function() {
          chrome.notifications.clear(String(data.id))
        }, 7000)
      })
    }).catch(function(err) {
      chrome.notifications.create(
        'errorMessage', {
          type: 'basic',
          iconUrl: 'logo.png',
          title: "Whoops",
          message: "It seems that our server or the Badlion website is down!",
        }
      );
      console.log(err)
      err = null
    })
  chrome.storage.local.get("ttl", function(ttl) {
    setTimeout(reload, ttl.ttl)
  })
}

function addIgnore(id) {
  console.log(id)
  chrome.storage.local.get('ignores', function(ignore) {
    ignore.ignores.push(id)
    chrome.storage.local.set({
      ignores: ignore.ignores
    })
    chrome.notifications.clear(String(id))
    console.log(id)
  })
}

function notify(id, time, server, region, gameMode, hosts, premium, slots, callback) {
  chrome.storage.local.get(["ignores", "regions", "dnd", "notifyBefore", "premium", "notifyOnce"], function(notifications) {
    if (notifications.dnd == false &&
      notifications.ignores.indexOf(String(id)) == -1 &&
      (notifications.regions.indexOf(region) !== -1 || notifications.premium == premium) &&
      (time - +new Date()) < notifications.notifyBefore &&
      Math.round((time - +new Date()) / 60000) > 0
       ) {
      if (premium == true) {
        server = "BAC " + server
      }
      chrome.notifications.create(
        String(id), {
          type: 'basic',
          iconUrl: 'logo.png',
          title: "Upcoming UHC",
          message: "[" + server + "] " + slots + " slots " + gameMode + " hosted by " + hosts + " in " + Math.round((time - +new Date()) / 60000) + " minutes",
          buttons: [{
            title: "Ignore this UHC"
          }],
          requireInteraction: true
        },
        function() {
          callback(String(id))
        }
      );
      console.log(server + " " + slots + " slots " + gameMode + " hosted by " + hosts)
    }
  })
}

function app() {
  chrome.notifications.onButtonClicked.addListener(addIgnore);
  reload()
  chrome.storage.local.get("ttl", function(ttl) {
    setTimeout(reload, ttl.ttl)
  })
}

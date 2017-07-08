$("#reset").click(function() {
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
    $("#successmessage").html("Reset all settings.")
    $("#success").fadeIn()
   window.location.reload()
    chrome.extension.getBackgroundPage().reload()
  })
})
$("#clearIgnores").click(function() {
  chrome.storage.local.set({
    ignores: []
  }, function() {
    $("#successmessage").html("Successfully cleared ignore list")
    $("#success").fadeIn()
  })
})
$(".close").click(function() {
  $(".alert").fadeOut()
})
$("#save").click(function() {
  if (Number($("#ttl").val()) == 0 || Number($("#notifyBefore").val()) == 0) {
    $("#failuremessage").html("Please fill in all inputs")
    $("#failure").fadeIn()
    return false;
  }
  if (Number($("#ttl").val()) < 1 || Number($("#notifyBefore").val()) < 1) {
    $("#failuremessage").html("All inputs must be more than 1.")
    $("#failure").fadeIn()
    return false;
  }
  var regions = []
  $(".region").each(function() {
    if ($(this).is(":checked")) {
      regions.push($(this).attr("id"))
    }
  })
  chrome.storage.local.set({
    dnd: $("#dnd").is(":checked"),
    regions: regions,
    premium: $("#premium").is(":checked"),
    notifyBefore: Number($("#notifyBefore").val()) * 60000,
    ttl: Number($("#ttl").val()) * 60000,
    notifyOnce: $("#notifyOnce").is(":checked")
  }, function() {
    $("#successmessage").html("Saved all settings.")
    $("#success").fadeIn()
    chrome.extension.getBackgroundPage().reload()
  })
})
$(document).ready(function() {
  chrome.storage.local.get(["dnd", "regions", "premium", "ignores", "notifyBefore", "ttl", "notifyOnce"], function(data) {
    if (data.dnd == true) {
      $("#dnd").bootstrapToggle('on');
    }
    data.regions.forEach(function(x) {
      $("#" + x).bootstrapToggle('on');
    })
    if (data.premium == true) {
      $("#premium").bootstrapToggle('on');
    }
    if (data.notifyOnce == true) {
      $("#notifyOnce").bootstrapToggle("on")
    }
    $("#ttl").val(data.ttl / 60000)
    $("#notifyBefore").val(data.notifyBefore / 60000)
  })
})

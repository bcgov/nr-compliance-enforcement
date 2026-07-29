// Returns the user to the app root once the deploy has settled. Paired with the
// "Try now" button, which lets users navigate immediately rather than waiting.
setTimeout(function () {
  window.location.assign("/");
}, 120000);
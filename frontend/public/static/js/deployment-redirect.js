// Served by Caddy when a hashed asset is requested that this pod's build does
// not contain — i.e. the browser is holding an index.html from a different
// build during a rolling deploy. Redirecting to the static reloading page lets
// the deploy settle before the app reloads on a single consistent build.
window.location.href = "/reloading.html";
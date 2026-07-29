// Installed in <head> before the stylesheet <link> is parsed, so its
// capture-phase listener is in place if a stylesheet fails to load.
//
// During a rolling deploy, a browser holding an index.html from one build can
// have its hashed CSS request routed (by the load balancer, which has no pod
// affinity) to a pod running a different build that lacks that file. Caddy
// returns 404 for the missing stylesheet, the <link> fires an error event, and
// this guard sends the user to the static reloading page so the deploy can
// settle before the app reloads on a single consistent build.
(function () {
  let redirecting = false;

  function handleResourceError(event) {
    const target = event.target;

    // Resource error events do not bubble, so this must run in the capture
    // phase. Scope strictly to stylesheet links: fonts, images, and map tiles
    // fail routinely for unrelated reasons and must not trigger a reload.
    if (target?.tagName !== "LINK" || target?.rel !== "stylesheet") {
       return;
     }

    if (redirecting) {
      return;
    }
    redirecting = true;

    window.location.href = "/reloading.html";
  }

  document.addEventListener("error", handleResourceError, true);
})();
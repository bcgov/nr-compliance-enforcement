const utcDate = new Date()
const date = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000)
if (window.location.href.indexOf("localhost") > -1 && date.getMonth() === 3 && date.getDate() === 1) {
    const array = new Uint32Array(10);
    // eslint-disable-next-line no-restricted-globals
    self.crypto.getRandomValues(array);
    const random = array[1] % 10 + 1;
    if (random === 1) {
        setTimeout(function () {
            const text = new SpeechSynthesisUtterance(atob('ZGlkIHlvdSByZW1lbWJlciB0byBhZGQgdW5pdCB0ZXN0cz8='));
            speechSynthesis.speak(text);
        }, 15000);
    }
    else if (random === 2) {
      window.onload = function() {
        document.body.style = 'cursor: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/np_cursor_740125_000000.png), default; !important'
      }
    }
    else if (random === 3) {
      const _audio = new Audio(
        atob('aHR0cHM6Ly9hcmNoaXZlLm9yZy9kb3dubG9hZC9OZXZlckdvbm5hR2l2ZVlvdVVwL2pvY29mdWxsaW50ZXJ2aWV3NDEubXAz')
      );
      _audio.load();
      window.addEventListener('click', () => {
        _audio.play();
      });      
    }
}
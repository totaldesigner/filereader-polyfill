/**
* Does the browser not have the FileReader already
*/
(function () {
  if (("FileReader" in window)) {
    return;
  }

  /**
   * Base64 Encoding as documented at...
   * http://www.webtoolkit.info/javascript-base64.html
   */
  /*
  * base64.js - Base64 encoding and decoding functions
  *
  * See: http://developer.mozilla.org/en/docs/DOM:window.btoa
  *      http://developer.mozilla.org/en/docs/DOM:window.atob
  *
  * Copyright (c) 2007, David Lindquist <david.lindquist@gmail.com>
  * Released under the MIT license
  * 
  * Modified by Andrew Dodson
  */
  window.btoa = function(s) {
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      e = [],
      i = 0,
      b,
      buf;

    while (i < s.length) {
      b = [s.charCodeAt(i++), s.charCodeAt(i++), s.charCodeAt(i++)];
      buf = (b[0] << 16) + ((b[1] || 0) << 8) + (b[2] || 0);
      e.push(
        c.charAt((buf & (63 << 18)) >> 18),
        c.charAt((buf & (63 << 12)) >> 12),
        c.charAt(isNaN(b[1]) ? 64 : (buf & (63 << 6)) >> 6),
        c.charAt(isNaN(b[2]) ? 64 : (buf & 63))
      );
    }
    return e.join('');
  }

  window.atob = function(s) {
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      buf,
      a = b = d = [],
      j = i = 0;

    if ((s.length % 4 != 0) || (new RegExp('[^' + c + ']').test(s)) || (/=/.test(s) && (/=[^=]/.test(s) || /={3}/.test(s))))
      throw new Error('Invalid base64 data');

    while (i < s.length) {
      j = i;
      a = [];
      for (; i < j + 4; i++)
        a.push(c.indexOf(s.charAt(i)));

      buf = (a[0] << 18) + (a[1] << 12) + ((a[2] & 63) << 6) + (a[3] & 63);
      b = [((buf & (255 << 16)) >> 16), ((a[2] == 64) ? -1 : (buf & (255 << 8)) >> 8), ((a[3] == 64) ? -1 : (buf & 255))];

      for (j = 0; j < 3; j++)
        if (b[j] >= 0 || j === 0)
          d.push(String.fromCharCode(b[j]));
    }
    return d.join('');
  }

  /**
  * Add FileReader to the window object
  */
  window.FileReader = function () {

    this.onload;
    this.result;
    this.readAsDataURL = function (file) {
      // Use the extension from the filename to determine the MIME-TYPE
      this.read("data:" + file.type + ";base64," + file.data);
    };
    this.readAsBinaryString = function (file) {
      this.read(atob(file.data));
    };
    this.readAsText = function (file, encoding) {
      this.read(atob(file.data));
    };
    this.readAsArrayBuffer = function (file) {
      throw ("Whoops FileReader.readAsArrayBuffer is unimplemented");
    }

    // Generic response
    // Passes a fake ProgressEvent
    this.read = function (result, opt) {
      this.result = result;
      if (this.onload) {
        this.onload({
          target: { result: result }
        });
      }
      else throw ("Please define the onload event handler first");
    };
  };
})();

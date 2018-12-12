var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-15609829-1']);
_gaq.push(['_addDevId', 'i9k95']); // Google Analyticator App ID with Google
_gaq.push(['_gat._anonymizeIp']);
_gaq.push(['_trackPageview']);

// (function () {
//   var ga = document.createElement('script');
//   ga.type = 'text/javascript';
//   ga.async = true;
//   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0];
//   s.parentNode.insertBefore(ga, s);
//   console.info("add script...");
// })();

window.MathJax = {
  showProcessingMessages: false,
  rmessageStyle: "none",
  tex2jax: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    processEscapes: true
  },
  "fast-preview": {
    disabled: true
  },
  SVG: {
    linebreaks: {automatic: true, width: "80% container"}
  },
  "HTML-CSS": {
    linebreaks: {automatic: true, width: "80% container"}
  },
  CommonHTML: {
    linebreaks: {automatic: true, width: "80% container"}
  },
  AuthorInit: function () {
    // ***Modal*** "Samples" -- switch renderer button
    var HUB = MathJax.Hub;

    HUB.Register.StartupHook("Begin Typeset", function () {
      //
      //  Get the current renderer and set the page's
      //  menu item to reflect that.
      //
      var renderer = HUB.config.menuSettings.renderer;
      //document.getElementById("Renderer").value = renderer;
    });
    //  Listen for radio button messages and
    //  if the renderer changes, update the page's menu.
    HUB.Register.StartupHook("MathMenu Ready", function () {
      delete MathJax.Menu.Renderer.Messages.MML.Firefox;
      MathJax.Extension.MathMenu.signal.Interest(function (message) {
        if (message[0] === "radio button") {
          var renderer = message[1].value;
          if (String(renderer).match(/^(HTML-CSS|NativeMML|SVG)$/)) {
            document.getElementById("Renderer").value = renderer;
          }
        }
      });
    });
    //  When the renderer changes, ask the MathMenu to change
    //  the renderer (this way we get any warning messages
    window.setMode = function (renderer) {
      var MENU = MathJax.Menu,
        original = MENU.cookie.renderer; // the original renderer
      //
      //  Wait for the menu to update before posting the dialog for
      //  switching to MathML
      //
      setTimeout(function () {
        MENU.config.settings.renderer = renderer; // Set the new renderer
        MENU.Renderer.call(this); // Change it using the menu action
        if (MENU.cookie.renderer != original) {
          // If the cookie changed,
          if (original == null) {
            delete MENU.cookie.renderer;
          } else {
            MENU.cookie.renderer = original;
          } // Put back the original renderer
          MENU.saveCookie(); //  and save the cookie
        }
        HUB.Queue(function () {
          // Update the menu in case the user cancelled the change
          document.getElementById("Renderer").value =
            HUB.outputJax["jax/mml"][0].id;
        });
      }, 10);
    };

    // ***Modal**** "Live Demo"
    var Preview = {
      delay: 150, // delay after keystroke before updating
      preview: null, // filled in by Init below
      buffer: null, // filled in by Init below
      timeout: null, // store setTimout id
      mjRunning: false, // true when MathJax is processing
      refreshNeeded: false, // true if refresh needed after MathJax finishes
      oldText: null, // used to check if an update is needed
      //  Get the preview and buffer DIV's
      Init: function () {
        this.preview = document.getElementById("MathPreview");
        this.buffer = document.getElementById("MathBuffer");
      },
      //  Switch the buffer and preview, and display the right one.
      //  (We use visibility:hidden rather than display:none since
      //  the results of running MathJax are more accurate that way.)
      SwapBuffers: function () {
        var buffer = this.preview,
          preview = this.buffer;
        this.buffer = buffer;
        this.preview = preview;
        buffer.style.visibility = "hidden";
        buffer.style.position = "absolute";
        preview.style.position = "";
        preview.style.visibility = "";
      },
      //  This gets called when a key is pressed in the textarea.
      //  We check if there is already a pending update and clear it if so.
      //  Then set up an update to occur after a small delay (so if more keys
      //    are pressed, the update won't occur until after there has been
      //    a pause in the typing).
      //  The callback function is set up below, after the Preview object is set up.
      Update: function () {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        var callback = MathJax.Callback(["CreatePreview", this]);
        this.timeout = setTimeout(callback, this.delay);
      },
      //  Creates the preview and runs MathJax on it.
      //  If MathJax is already trying to render the code, return
      //  If the text hasn't changed, return
      //  Otherwise, indicate that MathJax is running, and start the
      //    typesetting.  After it is done, call PreviewDone.
      CreatePreview: function () {
        Preview.timeout = null;
        if (this.mjRunning) {
          this.refreshNeeded = true;
          return;
        }
        var text = document.getElementById("MathInput").value;
        if (text === this.oldtext) return;
        this.buffer.innerHTML = this.oldtext = text;
        this.mjRunning = true;
        MathJax.Hub.Queue(
          ["Typeset", MathJax.Hub, this.buffer], ["PreviewDone", this]
        );
      },
      //  Indicate that MathJax is no longer running,
      //  and swap the buffers to show the results.
      PreviewDone: function () {
        this.mjRunning = false;
        this.SwapBuffers();
        if (this.refreshNeeded) {
          this.refreshNeeded = false;
          this.CreatePreview();
        }
      },
      HandleTemplate:function (event) {
        if(!event.path) return;
        var tx;
        for(var i = 0; i < event.path.length; i++){
          tx = event.path[i];
          // console.log(tx.id);
          if(tx.id){
            if((tx.id.match(/^\d+/))){
              document.getElementById("MathInput").value=TEMPLATE[tx.id].LaTex;
              // document.getElementById("MathInput").
              // console.log(Preview);
              this.Update();
              continue;
            }
          }
        }
      }
    };
    Preview.Init();
    var inputarea = document.getElementById('MathInput');
    inputarea.addEventListener('input', Preview.Update.bind(Preview), false);

    Preview.Update();

    var list = document.getElementsByClassName("list-group");
    var item;
    for (var i = 0; i < TEMPLATE.length; i++) {
      item = document.createElement("a");
      item.setAttribute("class", "list-group-item");
      item.setAttribute("id", i + "");
      // item.setAttribute("onclick", "handle(event)");
      item.addEventListener('click', Preview.HandleTemplate.bind(Preview), false);
      item.innerHTML = TEMPLATE[i].LaTex;
      list[0].appendChild(item);
    }

  }
};



var handle = function (event) {

  var tx;
  for(var i = 0; i < event.path.length; i++){
    tx = event.path[i];
    // console.log(tx.id);
    if(tx.id){
      if((tx.id.match(/^\d+/))){
        document.getElementById("MathInput").value=TEMPLATE[tx.id].LaTex;
        // document.getElementById("MathInput").
        // console.log(Preview);
      }
    }
  }
}

//window.onhashchange = followHash;
var script = document.createElement('script');
//script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML-full';
//script.src = 'http://127.0.0.1:8080/MathJax/MathJax.js?config=TeX-MML-AM_CHTML';
script.src = './MathJax/MathJax.js?config=TeX-MML-AM_CHTML';
document.head.appendChild(script);
define("ace/ext/static_highlight", [
  "require",
  "exports",
  "module",
  "ace/edit_session",
  "ace/layer/text",
  "ace/config",
  "ace/lib/dom",
], function (e, t, n) {
  "use strict";
  var r = e("../edit_session").EditSession,
    i = e("../layer/text").Text,
    s =
      ".ace_static_highlight {font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Droid Sans Mono', monospace;font-size: 12px;white-space: pre-wrap}.ace_static_highlight .ace_gutter {width: 2em;text-align: right;padding: 0 3px 0 0;margin-right: 3px;}.ace_static_highlight.ace_show_gutter .ace_line {padding-left: 2.6em;}.ace_static_highlight .ace_line { position: relative; }.ace_static_highlight .ace_gutter-cell {-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;user-select: none;top: 0;bottom: 0;left: 0;position: absolute;}.ace_static_highlight .ace_gutter-cell:before {content: counter(ace_line, decimal);counter-increment: ace_line;}.ace_static_highlight {counter-reset: ace_line;}",
    o = e("../config"),
    u = e("../lib/dom"),
    a = function () {
      this.config = {};
    };
  a.prototype = i.prototype;
  var f = function (e, t, n) {
    var r = e.className.match(/lang-(\w+)/),
      i = t.mode || (r && "ace/mode/" + r[1]);
    if (!i) return !1;
    var s = t.theme || "ace/theme/textmate",
      o = "",
      a = [];
    if (e.firstElementChild) {
      var l = 0;
      for (var c = 0; c < e.childNodes.length; c++) {
        var h = e.childNodes[c];
        h.nodeType == 3 ? ((l += h.data.length), (o += h.data)) : a.push(l, h);
      }
    } else (o = u.getInnerText(e)), t.trim && (o = o.trim());
    f.render(o, i, s, t.firstLineNumber, !t.showGutter, function (t) {
      u.importCssString(t.css, "ace_highlight"), (e.innerHTML = t.html);
      var r = e.firstChild.firstChild;
      for (var i = 0; i < a.length; i += 2) {
        var s = t.session.doc.indexToPosition(a[i]),
          o = a[i + 1],
          f = r.children[s.row];
        f && f.appendChild(o);
      }
      n && n();
    });
  };
  (f.render = function (e, t, n, i, s, u) {
    function h() {
      var r = f.renderSync(e, t, n, i, s);
      return u ? u(r) : r;
    }
    var a = 1,
      l = r.prototype.$modes;
    typeof n == "string" &&
      (a++,
      o.loadModule(["theme", n], function (e) {
        (n = e), --a || h();
      }));
    var c;
    return (
      t && typeof t == "object" && !t.getTokenizer && ((c = t), (t = c.path)),
      typeof t == "string" &&
        (a++,
        o.loadModule(["mode", t], function (e) {
          if (!l[t] || c) l[t] = new e.Mode(c);
          (t = l[t]), --a || h();
        })),
      --a || h()
    );
  }),
    (f.renderSync = function (e, t, n, i, o) {
      i = parseInt(i || 1, 10);
      var u = new r("");
      u.setUseWorker(!1), u.setMode(t);
      var f = new a();
      f.setSession(u), u.setValue(e);
      var l = [],
        c = u.getLength();
      for (var h = 0; h < c; h++)
        l.push("<div class='ace_line'>"),
          o ||
            l.push(
              "<span class='ace_gutter ace_gutter-cell' unselectable='on'></span>"
            ),
          f.$renderLine(l, h, !0, !1),
          l.push("\n</div>");
      var p =
        "<div class='" +
        n.cssClass +
        "'>" +
        "<div class='ace_static_highlight" +
        (o ? "" : " ace_show_gutter") +
        "' style='counter-reset:ace_line " +
        (i - 1) +
        "'>" +
        l.join("") +
        "</div>" +
        "</div>";
      return f.destroy(), { css: s + n.cssText, html: p, session: u };
    }),
    (n.exports = f),
    (n.exports.highlight = f);
});
(function () {
  window.require(["ace/ext/static_highlight"], function () {});
})();

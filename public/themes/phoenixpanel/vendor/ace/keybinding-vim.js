define("ace/keyboard/vim", [
  "require",
  "exports",
  "module",
  "ace/range",
  "ace/lib/event_emitter",
  "ace/lib/dom",
  "ace/lib/oop",
  "ace/lib/keys",
  "ace/lib/event",
  "ace/search",
  "ace/lib/useragent",
  "ace/search_highlight",
  "ace/commands/multi_select_commands",
  "ace/mode/text",
  "ace/multi_select",
], function (e, t, n) {
  "use strict";
  function r() {
    function t(e) {
      return typeof e != "object"
        ? e + ""
        : "line" in e
        ? e.line + ":" + e.ch
        : "anchor" in e
        ? t(e.anchor) + "->" + t(e.head)
        : Array.isArray(e)
        ? "[" +
          e.map(function (e) {
            return t(e);
          }) +
          "]"
        : JSON.stringify(e);
    }
    var e = "";
    for (var n = 0; n < arguments.length; n++) {
      var r = arguments[n],
        i = t(r);
      e += i + "  ";
    }
    console.log(e);
  }
  function m(e) {
    return { row: e.line, column: e.ch };
  }
  function g(e) {
    return new E(e.row, e.column);
  }
  function x(e) {
    e.setOption("disableInput", !0),
      e.setOption("showCursorWhenSelecting", !1),
      v.signal(e, "vim-mode-change", { mode: "normal" }),
      e.on("cursorActivity", Jn),
      tt(e),
      v.on(e.getInputField(), "paste", M(e));
  }
  function T(e) {
    e.setOption("disableInput", !1),
      e.off("cursorActivity", Jn),
      v.off(e.getInputField(), "paste", M(e)),
      (e.state.vim = null);
  }
  function N(e, t) {
    this == v.keyMap.vim && v.rmClass(e.getWrapperElement(), "cm-fat-cursor"),
      (!t || t.attach != C) && T(e, !1);
  }
  function C(e, t) {
    this == v.keyMap.vim && v.addClass(e.getWrapperElement(), "cm-fat-cursor"),
      (!t || t.attach != C) && x(e);
  }
  function k(e, t) {
    if (!t) return undefined;
    var n = O(e);
    if (!n) return !1;
    var r = v.Vim.findKey(t, n);
    return typeof r == "function" && v.signal(t, "vim-keypress", n), r;
  }
  function O(e) {
    if (e.charAt(0) == "'") return e.charAt(1);
    var t = e.split(/-(?!$)/),
      n = t[t.length - 1];
    if (t.length == 1 && t[0].length == 1) return !1;
    if (t.length == 2 && t[0] == "Shift" && n.length == 1) return !1;
    var r = !1;
    for (var i = 0; i < t.length; i++) {
      var s = t[i];
      s in L ? (t[i] = L[s]) : (r = !0), s in A && (t[i] = A[s]);
    }
    return r
      ? (X(n) && (t[t.length - 1] = n.toLowerCase()), "<" + t.join("-") + ">")
      : !1;
  }
  function M(e) {
    var t = e.state.vim;
    return (
      t.onPasteFn ||
        (t.onPasteFn = function () {
          t.insertMode ||
            (e.setCursor(St(e.getCursor(), 0, 1)),
            yt.enterInsertMode(e, {}, t));
        }),
      t.onPasteFn
    );
  }
  function H(e, t) {
    var n = [];
    for (var r = e; r < e + t; r++) n.push(String.fromCharCode(r));
    return n;
  }
  function R(e, t) {
    return t >= e.firstLine() && t <= e.lastLine();
  }
  function U(e) {
    return /^[a-z]$/.test(e);
  }
  function z(e) {
    return "()[]{}".indexOf(e) != -1;
  }
  function W(e) {
    return _.test(e);
  }
  function X(e) {
    return /^[A-Z]$/.test(e);
  }
  function V(e) {
    return /^\s*$/.test(e);
  }
  function $(e, t) {
    for (var n = 0; n < t.length; n++) if (t[n] == e) return !0;
    return !1;
  }
  function K(e, t, n, r, i) {
    if (t === undefined && !i)
      throw Error("defaultValue is required unless callback is provided");
    n || (n = "string"), (J[e] = { type: n, defaultValue: t, callback: i });
    if (r) for (var s = 0; s < r.length; s++) J[r[s]] = J[e];
    t && Q(e, t);
  }
  function Q(e, t, n, r) {
    var i = J[e];
    r = r || {};
    var s = r.scope;
    if (!i) throw Error("Unknown option: " + e);
    if (i.type == "boolean") {
      if (t && t !== !0) throw Error("Invalid argument: " + e + "=" + t);
      t !== !1 && (t = !0);
    }
    i.callback
      ? (s !== "local" && i.callback(t, undefined),
        s !== "global" && n && i.callback(t, n))
      : (s !== "local" && (i.value = i.type == "boolean" ? !!t : t),
        s !== "global" && n && (n.state.vim.options[e] = { value: t }));
  }
  function G(e, t, n) {
    var r = J[e];
    n = n || {};
    var i = n.scope;
    if (!r) throw Error("Unknown option: " + e);
    if (r.callback) {
      var s = t && r.callback(undefined, t);
      if (i !== "global" && s !== undefined) return s;
      if (i !== "local") return r.callback();
      return;
    }
    var s = i !== "global" && t && t.state.vim.options[e];
    return (s || (i !== "local" && r) || {}).value;
  }
  function et() {
    (this.latestRegister = undefined),
      (this.isPlaying = !1),
      (this.isRecording = !1),
      (this.replaySearchQueries = []),
      (this.onRecordingDone = undefined),
      (this.lastInsertModeChanges = Z());
  }
  function tt(e) {
    return (
      e.state.vim ||
        (e.state.vim = {
          inputState: new ot(),
          lastEditInputState: undefined,
          lastEditActionCommand: undefined,
          lastHPos: -1,
          lastHSPos: -1,
          lastMotion: null,
          marks: {},
          fakeCursor: null,
          insertMode: !1,
          insertModeRepeat: undefined,
          visualMode: !1,
          visualLine: !1,
          visualBlock: !1,
          lastSelection: null,
          lastPastedText: null,
          sel: {},
          options: {},
        }),
      e.state.vim
    );
  }
  function rt() {
    nt = {
      searchQuery: null,
      searchIsReversed: !1,
      lastSubstituteReplacePart: undefined,
      jumpList: Y(),
      macroModeState: new et(),
      lastChararacterSearch: {
        increment: 0,
        forward: !0,
        selectedCharacter: "",
      },
      registerController: new lt({}),
      searchHistoryController: new ct({}),
      exCommandHistoryController: new ct({}),
    };
    for (var e in J) {
      var t = J[e];
      t.value = t.defaultValue;
    }
  }
  function ot() {
    (this.prefixRepeat = []),
      (this.motionRepeat = []),
      (this.operator = null),
      (this.operatorArgs = null),
      (this.motion = null),
      (this.motionArgs = null),
      (this.keyBuffer = []),
      (this.registerName = null);
  }
  function ut(e, t) {
    (e.state.vim.inputState = new ot()), v.signal(e, "vim-command-done", t);
  }
  function at(e, t, n) {
    this.clear(),
      (this.keyBuffer = [e || ""]),
      (this.insertModeChanges = []),
      (this.searchQueries = []),
      (this.linewise = !!t),
      (this.blockwise = !!n);
  }
  function ft(e, t) {
    var n = nt.registerController.registers[e];
    if (!e || e.length != 1) throw Error("Register name must be 1 character");
    (n[e] = t), q.push(e);
  }
  function lt(e) {
    (this.registers = e),
      (this.unnamedRegister = e['"'] = new at()),
      (e["."] = new at()),
      (e[":"] = new at()),
      (e["/"] = new at());
  }
  function ct() {
    (this.historyBuffer = []), this.iterator, (this.initialPrefix = null);
  }
  function dt(e, t) {
    pt[e] = t;
  }
  function vt(e, t) {
    var n = [];
    for (var r = 0; r < t; r++) n.push(e);
    return n;
  }
  function gt(e, t) {
    mt[e] = t;
  }
  function bt(e, t) {
    yt[e] = t;
  }
  function wt(e, t, n) {
    var r = Math.min(Math.max(e.firstLine(), t.line), e.lastLine()),
      i = Pt(e, r) - 1;
    i = n ? i + 1 : i;
    var s = Math.min(Math.max(0, t.ch), i);
    return E(r, s);
  }
  function Et(e) {
    var t = {};
    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
    return t;
  }
  function St(e, t, n) {
    return (
      typeof t == "object" && ((n = t.ch), (t = t.line)),
      E(e.line + t, e.ch + n)
    );
  }
  function xt(e, t) {
    return { line: t.line - e.line, ch: t.line - e.line };
  }
  function Tt(e, t, n, r) {
    var i,
      s = [],
      o = [];
    for (var u = 0; u < t.length; u++) {
      var a = t[u];
      if (
        (n == "insert" && a.context != "insert") ||
        (a.context && a.context != n) ||
        (r.operator && a.type == "action") ||
        !(i = Nt(e, a.keys))
      )
        continue;
      i == "partial" && s.push(a), i == "full" && o.push(a);
    }
    return { partial: s.length && s, full: o.length && o };
  }
  function Nt(e, t) {
    if (t.slice(-11) == "<character>") {
      var n = t.length - 11,
        r = e.slice(0, n),
        i = t.slice(0, n);
      return r == i && e.length > n
        ? "full"
        : i.indexOf(r) == 0
        ? "partial"
        : !1;
    }
    return e == t ? "full" : t.indexOf(e) == 0 ? "partial" : !1;
  }
  function Ct(e) {
    var t = /^.*(<[\w\-]+>)$/.exec(e),
      n = t ? t[1] : e.slice(-1);
    if (n.length > 1)
      switch (n) {
        case "<CR>":
          n = "\n";
          break;
        case "<Space>":
          n = " ";
          break;
        default:
      }
    return n;
  }
  function kt(e, t, n) {
    return function () {
      for (var r = 0; r < n; r++) t(e);
    };
  }
  function Lt(e) {
    return E(e.line, e.ch);
  }
  function At(e, t) {
    return e.ch == t.ch && e.line == t.line;
  }
  function Ot(e, t) {
    return e.line < t.line ? !0 : e.line == t.line && e.ch < t.ch ? !0 : !1;
  }
  function Mt(e, t) {
    return (
      arguments.length > 2 &&
        (t = Mt.apply(undefined, Array.prototype.slice.call(arguments, 1))),
      Ot(e, t) ? e : t
    );
  }
  function _t(e, t) {
    return (
      arguments.length > 2 &&
        (t = _t.apply(undefined, Array.prototype.slice.call(arguments, 1))),
      Ot(e, t) ? t : e
    );
  }
  function Dt(e, t, n) {
    var r = Ot(e, t),
      i = Ot(t, n);
    return r && i;
  }
  function Pt(e, t) {
    return e.getLine(t).length;
  }
  function Ht(e) {
    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
  }
  function Bt(e) {
    return e.replace(/([.?*+$\[\]\/\\(){}|\-])/g, "\\$1");
  }
  function jt(e, t, n) {
    var r = Pt(e, t),
      i = new Array(n - r + 1).join(" ");
    e.setCursor(E(t, r)), e.replaceRange(i, e.getCursor());
  }
  function Ft(e, t) {
    var n = [],
      r = e.listSelections(),
      i = Lt(e.clipPos(t)),
      s = !At(t, i),
      o = e.getCursor("head"),
      u = qt(r, o),
      a = At(r[u].head, r[u].anchor),
      f = r.length - 1,
      l = f - u > u ? f : 0,
      c = r[l].anchor,
      h = Math.min(c.line, i.line),
      p = Math.max(c.line, i.line),
      d = c.ch,
      v = i.ch,
      m = r[l].head.ch - d,
      g = v - d;
    m > 0 && g <= 0
      ? (d++, s || v--)
      : m < 0 && g >= 0
      ? (d--, a || v++)
      : m < 0 && g == -1 && (d--, v++);
    for (var y = h; y <= p; y++) {
      var b = { anchor: new E(y, d), head: new E(y, v) };
      n.push(b);
    }
    return (
      (u = i.line == p ? n.length - 1 : 0),
      e.setSelections(n),
      (t.ch = v),
      (c.ch = d),
      c
    );
  }
  function It(e, t, n) {
    var r = [];
    for (var i = 0; i < n; i++) {
      var s = St(t, i, 0);
      r.push({ anchor: s, head: s });
    }
    e.setSelections(r, 0);
  }
  function qt(e, t, n) {
    for (var r = 0; r < e.length; r++) {
      var i = n != "head" && At(e[r].anchor, t),
        s = n != "anchor" && At(e[r].head, t);
      if (i || s) return r;
    }
    return -1;
  }
  function Rt(e, t) {
    var n = t.lastSelection,
      r = function () {
        var t = e.listSelections(),
          n = t[0],
          r = t[t.length - 1],
          i = Ot(n.anchor, n.head) ? n.anchor : n.head,
          s = Ot(r.anchor, r.head) ? r.head : r.anchor;
        return [i, s];
      },
      i = function () {
        var t = e.getCursor(),
          r = e.getCursor(),
          i = n.visualBlock;
        if (i) {
          var s = i.width,
            o = i.height;
          r = E(t.line + o, t.ch + s);
          var u = [];
          for (var a = t.line; a < r.line; a++) {
            var f = E(a, t.ch),
              l = E(a, r.ch),
              c = { anchor: f, head: l };
            u.push(c);
          }
          e.setSelections(u);
        } else {
          var h = n.anchorMark.find(),
            p = n.headMark.find(),
            d = p.line - h.line,
            v = p.ch - h.ch;
          (r = { line: r.line + d, ch: d ? r.ch : v + r.ch }),
            n.visualLine &&
              ((t = E(t.line, 0)), (r = E(r.line, Pt(e, r.line)))),
            e.setSelection(t, r);
        }
        return [t, r];
      };
    return t.visualMode ? r() : i();
  }
  function Ut(e, t) {
    var n = t.sel.anchor,
      r = t.sel.head;
    t.lastPastedText &&
      ((r = e.posFromIndex(e.indexFromPos(n) + t.lastPastedText.length)),
      (t.lastPastedText = null)),
      (t.lastSelection = {
        anchorMark: e.setBookmark(n),
        headMark: e.setBookmark(r),
        anchor: Lt(n),
        head: Lt(r),
        visualMode: t.visualMode,
        visualLine: t.visualLine,
        visualBlock: t.visualBlock,
      });
  }
  function zt(e, t, n) {
    var r = e.state.vim.sel,
      i = r.head,
      s = r.anchor,
      o;
    return (
      Ot(n, t) && ((o = n), (n = t), (t = o)),
      Ot(i, s)
        ? ((i = Mt(t, i)), (s = _t(s, n)))
        : ((s = Mt(t, s)),
          (i = _t(i, n)),
          (i = St(i, 0, -1)),
          i.ch == -1 &&
            i.line != e.firstLine() &&
            (i = E(i.line - 1, Pt(e, i.line - 1)))),
      [s, i]
    );
  }
  function Wt(e, t, n) {
    var r = e.state.vim;
    t = t || r.sel;
    var n = n || r.visualLine ? "line" : r.visualBlock ? "block" : "char",
      i = Xt(e, t, n);
    e.setSelections(i.ranges, i.primary), Kn(e);
  }
  function Xt(e, t, n, r) {
    var i = Lt(t.head),
      s = Lt(t.anchor);
    if (n == "char") {
      var o = !r && !Ot(t.head, t.anchor) ? 1 : 0,
        u = Ot(t.head, t.anchor) ? 1 : 0;
      return (
        (i = St(t.head, 0, o)),
        (s = St(t.anchor, 0, u)),
        { ranges: [{ anchor: s, head: i }], primary: 0 }
      );
    }
    if (n == "line") {
      if (!Ot(t.head, t.anchor)) {
        s.ch = 0;
        var a = e.lastLine();
        i.line > a && (i.line = a), (i.ch = Pt(e, i.line));
      } else (i.ch = 0), (s.ch = Pt(e, s.line));
      return { ranges: [{ anchor: s, head: i }], primary: 0 };
    }
    if (n == "block") {
      var f = Math.min(s.line, i.line),
        l = Math.min(s.ch, i.ch),
        c = Math.max(s.line, i.line),
        h = Math.max(s.ch, i.ch) + 1,
        p = c - f + 1,
        d = i.line == f ? 0 : p - 1,
        v = [];
      for (var m = 0; m < p; m++)
        v.push({ anchor: E(f + m, l), head: E(f + m, h) });
      return { ranges: v, primary: d };
    }
  }
  function Vt(e) {
    var t = e.getCursor("head");
    return (
      e.getSelection().length == 1 && (t = Mt(t, e.getCursor("anchor"))), t
    );
  }
  function $t(e, t) {
    var n = e.state.vim;
    t !== !1 && e.setCursor(wt(e, n.sel.head)),
      Ut(e, n),
      (n.visualMode = !1),
      (n.visualLine = !1),
      (n.visualBlock = !1),
      v.signal(e, "vim-mode-change", { mode: "normal" }),
      n.fakeCursor && n.fakeCursor.clear();
  }
  function Jt(e, t, n) {
    var r = e.getRange(t, n);
    if (/\n\s*$/.test(r)) {
      var i = r.split("\n");
      i.pop();
      var s;
      for (var s = i.pop(); i.length > 0 && s && V(s); s = i.pop())
        n.line--, (n.ch = 0);
      s ? (n.line--, (n.ch = Pt(e, n.line))) : (n.ch = 0);
    }
  }
  function Kt(e, t, n) {
    (t.ch = 0), (n.ch = 0), n.line++;
  }
  function Qt(e) {
    if (!e) return 0;
    var t = e.search(/\S/);
    return t == -1 ? e.length : t;
  }
  function Gt(e, t, n, r, i) {
    var s = Vt(e),
      o = e.getLine(s.line),
      u = s.ch,
      a = i ? D[0] : P[0];
    while (!a(o.charAt(u))) {
      u++;
      if (u >= o.length) return null;
    }
    r ? (a = P[0]) : ((a = D[0]), a(o.charAt(u)) || (a = D[1]));
    var f = u,
      l = u;
    while (a(o.charAt(f)) && f < o.length) f++;
    while (a(o.charAt(l)) && l >= 0) l--;
    l++;
    if (t) {
      var c = f;
      while (/\s/.test(o.charAt(f)) && f < o.length) f++;
      if (c == f) {
        var h = l;
        while (/\s/.test(o.charAt(l - 1)) && l > 0) l--;
        l || (l = h);
      }
    }
    return { start: E(s.line, l), end: E(s.line, f) };
  }
  function Yt(e, t, n) {
    At(t, n) || nt.jumpList.add(e, t, n);
  }
  function Zt(e, t) {
    (nt.lastChararacterSearch.increment = e),
      (nt.lastChararacterSearch.forward = t.forward),
      (nt.lastChararacterSearch.selectedCharacter = t.selectedCharacter);
  }
  function nn(e, t, n, r) {
    var i = Lt(e.getCursor()),
      s = n ? 1 : -1,
      o = n ? e.lineCount() : -1,
      u = i.ch,
      a = i.line,
      f = e.getLine(a),
      l = {
        lineText: f,
        nextCh: f.charAt(u),
        lastCh: null,
        index: u,
        symb: r,
        reverseSymb: (n ? { ")": "(", "}": "{" } : { "(": ")", "{": "}" })[r],
        forward: n,
        depth: 0,
        curMoveThrough: !1,
      },
      c = en[r];
    if (!c) return i;
    var h = tn[c].init,
      p = tn[c].isComplete;
    h && h(l);
    while (a !== o && t) {
      (l.index += s), (l.nextCh = l.lineText.charAt(l.index));
      if (!l.nextCh) {
        (a += s), (l.lineText = e.getLine(a) || "");
        if (s > 0) l.index = 0;
        else {
          var d = l.lineText.length;
          l.index = d > 0 ? d - 1 : 0;
        }
        l.nextCh = l.lineText.charAt(l.index);
      }
      p(l) && ((i.line = a), (i.ch = l.index), t--);
    }
    return l.nextCh || l.curMoveThrough ? E(a, l.index) : i;
  }
  function rn(e, t, n, r, i) {
    var s = t.line,
      o = t.ch,
      u = e.getLine(s),
      a = n ? 1 : -1,
      f = r ? P : D;
    if (i && u == "") {
      (s += a), (u = e.getLine(s));
      if (!R(e, s)) return null;
      o = n ? 0 : u.length;
    }
    for (;;) {
      if (i && u == "") return { from: 0, to: 0, line: s };
      var l = a > 0 ? u.length : -1,
        c = l,
        h = l;
      while (o != l) {
        var p = !1;
        for (var d = 0; d < f.length && !p; ++d)
          if (f[d](u.charAt(o))) {
            c = o;
            while (o != l && f[d](u.charAt(o))) o += a;
            (h = o), (p = c != h);
            if (c == t.ch && s == t.line && h == c + a) continue;
            return { from: Math.min(c, h + 1), to: Math.max(c, h), line: s };
          }
        p || (o += a);
      }
      s += a;
      if (!R(e, s)) return null;
      (u = e.getLine(s)), (o = a > 0 ? 0 : u.length);
    }
    throw new Error("The impossible happened.");
  }
  function sn(e, t, n, r, i, s) {
    var o = Lt(t),
      u = [];
    ((r && !i) || (!r && i)) && n++;
    var a = !r || !i;
    for (var f = 0; f < n; f++) {
      var l = rn(e, t, r, s, a);
      if (!l) {
        var c = Pt(e, e.lastLine());
        u.push(
          r
            ? { line: e.lastLine(), from: c, to: c }
            : { line: 0, from: 0, to: 0 }
        );
        break;
      }
      u.push(l), (t = E(l.line, r ? l.to - 1 : l.from));
    }
    var h = u.length != n,
      p = u[0],
      d = u.pop();
    return r && !i
      ? (!h && (p.from != o.ch || p.line != o.line) && (d = u.pop()),
        E(d.line, d.from))
      : r && i
      ? E(d.line, d.to - 1)
      : !r && i
      ? (!h && (p.to != o.ch || p.line != o.line) && (d = u.pop()),
        E(d.line, d.to))
      : E(d.line, d.from);
  }
  function on(e, t, n, r) {
    var i = e.getCursor(),
      s = i.ch,
      o;
    for (var u = 0; u < t; u++) {
      var a = e.getLine(i.line);
      o = fn(s, a, r, n, !0);
      if (o == -1) return null;
      s = o;
    }
    return E(e.getCursor().line, o);
  }
  function un(e, t) {
    var n = e.getCursor().line;
    return wt(e, E(n, t - 1));
  }
  function an(e, t, n, r) {
    if (!$(n, I)) return;
    t.marks[n] && t.marks[n].clear(), (t.marks[n] = e.setBookmark(r));
  }
  function fn(e, t, n, r, i) {
    var s;
    return (
      r
        ? ((s = t.indexOf(n, e + 1)), s != -1 && !i && (s -= 1))
        : ((s = t.lastIndexOf(n, e - 1)), s != -1 && !i && (s += 1)),
      s
    );
  }
  function ln(e, t, n, r, i) {
    function c(t) {
      return !/\S/.test(e.getLine(t));
    }
    function h(e, t, n) {
      return n ? c(e) != c(e + t) : !c(e) && c(e + t);
    }
    function p(t) {
      r = r > 0 ? 1 : -1;
      var n = e.ace.session.getFoldLine(t);
      n &&
        t + r > n.start.row &&
        t + r < n.end.row &&
        (r = (r > 0 ? n.end.row : n.start.row) - t);
    }
    var s = t.line,
      o = e.firstLine(),
      u = e.lastLine(),
      a,
      f,
      l = s;
    if (r) {
      while (o <= l && l <= u && n > 0) p(l), h(l, r) && n--, (l += r);
      return new E(l, 0);
    }
    var d = e.state.vim;
    if (d.visualLine && h(s, 1, !0)) {
      var v = d.sel.anchor;
      h(v.line, -1, !0) && (!i || v.line != s) && (s += 1);
    }
    var m = c(s);
    for (l = s; l <= u && n; l++) h(l, 1, !0) && (!i || c(l) != m) && n--;
    (f = new E(l, 0)), l > u && !m ? (m = !0) : (i = !1);
    for (l = s; l > o; l--)
      if (!i || c(l) == m || l == s) if (h(l, -1, !0)) break;
    return (a = new E(l, 0)), { start: a, end: f };
  }
  function cn(e, t, n, r) {
    var i = t,
      s,
      o,
      u = {
        "(": /[()]/,
        ")": /[()]/,
        "[": /[[\]]/,
        "]": /[[\]]/,
        "{": /[{}]/,
        "}": /[{}]/,
      }[n],
      a = { "(": "(", ")": "(", "[": "[", "]": "[", "{": "{", "}": "{" }[n],
      f = e.getLine(i.line).charAt(i.ch),
      l = f === a ? 1 : 0;
    (s = e.scanForBracket(E(i.line, i.ch + l), -1, null, { bracketRegex: u })),
      (o = e.scanForBracket(E(i.line, i.ch + l), 1, null, { bracketRegex: u }));
    if (!s || !o) return { start: i, end: i };
    (s = s.pos), (o = o.pos);
    if ((s.line == o.line && s.ch > o.ch) || s.line > o.line) {
      var c = s;
      (s = o), (o = c);
    }
    return r ? (o.ch += 1) : (s.ch += 1), { start: s, end: o };
  }
  function hn(e, t, n, r) {
    var i = Lt(t),
      s = e.getLine(i.line),
      o = s.split(""),
      u,
      a,
      f,
      l,
      c = o.indexOf(n);
    i.ch < c ? (i.ch = c) : c < i.ch && o[i.ch] == n && ((a = i.ch), --i.ch);
    if (o[i.ch] == n && !a) u = i.ch + 1;
    else for (f = i.ch; f > -1 && !u; f--) o[f] == n && (u = f + 1);
    if (u && !a)
      for (f = u, l = o.length; f < l && !a; f++) o[f] == n && (a = f);
    return !u || !a
      ? { start: i, end: i }
      : (r && (--u, ++a), { start: E(i.line, u), end: E(i.line, a) });
  }
  function pn() {}
  function dn(e) {
    var t = e.state.vim;
    return t.searchState_ || (t.searchState_ = new pn());
  }
  function vn(e, t, n, r, i) {
    e.openDialog
      ? e.openDialog(t, r, {
          bottom: !0,
          value: i.value,
          onKeyDown: i.onKeyDown,
          onKeyUp: i.onKeyUp,
          selectValueOnOpen: !1,
        })
      : r(prompt(n, ""));
  }
  function mn(e) {
    var t = gn(e) || [];
    if (!t.length) return [];
    var n = [];
    if (t[0] !== 0) return;
    for (var r = 0; r < t.length; r++)
      typeof t[r] == "number" && n.push(e.substring(t[r] + 1, t[r + 1]));
    return n;
  }
  function gn(e) {
    var t = !1,
      n = [];
    for (var r = 0; r < e.length; r++) {
      var i = e.charAt(r);
      !t && i == "/" && n.push(r), (t = !t && i == "\\");
    }
    return n;
  }
  function yn(e) {
    var t = "|(){",
      n = "}",
      r = !1,
      i = [];
    for (var s = -1; s < e.length; s++) {
      var o = e.charAt(s) || "",
        u = e.charAt(s + 1) || "",
        a = u && t.indexOf(u) != -1;
      r
        ? ((o !== "\\" || !a) && i.push(o), (r = !1))
        : o === "\\"
        ? ((r = !0),
          u && n.indexOf(u) != -1 && (a = !0),
          (!a || u === "\\") && i.push(o))
        : (i.push(o), a && u !== "\\" && i.push("\\"));
    }
    return i.join("");
  }
  function wn(e) {
    var t = !1,
      n = [];
    for (var r = -1; r < e.length; r++) {
      var i = e.charAt(r) || "",
        s = e.charAt(r + 1) || "";
      bn[i + s]
        ? (n.push(bn[i + s]), r++)
        : t
        ? (n.push(i), (t = !1))
        : i === "\\"
        ? ((t = !0),
          W(s) || s === "$"
            ? n.push("$")
            : s !== "/" && s !== "\\" && n.push("\\"))
        : (i === "$" && n.push("$"), n.push(i), s === "/" && n.push("\\"));
    }
    return n.join("");
  }
  function Sn(e) {
    var t = new v.StringStream(e),
      n = [];
    while (!t.eol()) {
      while (t.peek() && t.peek() != "\\") n.push(t.next());
      var r = !1;
      for (var i in En)
        if (t.match(i, !0)) {
          (r = !0), n.push(En[i]);
          break;
        }
      r || n.push(t.next());
    }
    return n.join("");
  }
  function xn(e, t, n) {
    var r = nt.registerController.getRegister("/");
    r.setText(e);
    if (e instanceof RegExp) return e;
    var i = gn(e),
      s,
      o;
    if (!i.length) s = e;
    else {
      s = e.substring(0, i[0]);
      var u = e.substring(i[0]);
      o = u.indexOf("i") != -1;
    }
    if (!s) return null;
    G("pcre") || (s = yn(s)), n && (t = /^[^A-Z]*$/.test(s));
    var a = new RegExp(s, t || o ? "i" : undefined);
    return a;
  }
  function Tn(e, t) {
    e.openNotification
      ? e.openNotification('<span style="color: red">' + t + "</span>", {
          bottom: !0,
          duration: 5e3,
        })
      : alert(t);
  }
  function Nn(e, t) {
    var n = "";
    return (
      e && (n += '<span style="font-family: monospace">' + e + "</span>"),
      (n += '<input type="text"/> <span style="color: #888">'),
      t && ((n += '<span style="color: #888">'), (n += t), (n += "</span>")),
      n
    );
  }
  function kn(e, t) {
    var n = (t.prefix || "") + " " + (t.desc || ""),
      r = Nn(t.prefix, t.desc);
    vn(e, r, n, t.onClose, t);
  }
  function Ln(e, t) {
    if (e instanceof RegExp && t instanceof RegExp) {
      var n = ["global", "multiline", "ignoreCase", "source"];
      for (var r = 0; r < n.length; r++) {
        var i = n[r];
        if (e[i] !== t[i]) return !1;
      }
      return !0;
    }
    return !1;
  }
  function An(e, t, n, r) {
    if (!t) return;
    var i = dn(e),
      s = xn(t, !!n, !!r);
    if (!s) return;
    return Mn(e, s), Ln(s, i.getQuery()) ? s : (i.setQuery(s), s);
  }
  function On(e) {
    if (e.source.charAt(0) == "^") var t = !0;
    return {
      token: function (n) {
        if (t && !n.sol()) {
          n.skipToEnd();
          return;
        }
        var r = n.match(e, !1);
        if (r) {
          if (r[0].length == 0) return n.next(), "searching";
          if (!n.sol()) {
            n.backUp(1);
            if (!e.exec(n.next() + r[0])) return n.next(), null;
          }
          return n.match(e), "searching";
        }
        while (!n.eol()) {
          n.next();
          if (n.match(e, !1)) break;
        }
      },
      query: e,
    };
  }
  function Mn(e, t) {
    var n = dn(e),
      r = n.getOverlay();
    if (!r || t != r.query)
      r && e.removeOverlay(r),
        (r = On(t)),
        e.addOverlay(r),
        e.showMatchesOnScrollbar &&
          (n.getScrollbarAnnotate() && n.getScrollbarAnnotate().clear(),
          n.setScrollbarAnnotate(e.showMatchesOnScrollbar(t))),
        n.setOverlay(r);
  }
  function _n(e, t, n, r) {
    return (
      r === undefined && (r = 1),
      e.operation(function () {
        var i = e.getCursor(),
          s = e.getSearchCursor(n, i);
        for (var o = 0; o < r; o++) {
          var u = s.find(t);
          o == 0 && u && At(s.from(), i) && (u = s.find(t));
          if (!u) {
            s = e.getSearchCursor(n, t ? E(e.lastLine()) : E(e.firstLine(), 0));
            if (!s.find(t)) return;
          }
        }
        return s.from();
      })
    );
  }
  function Dn(e) {
    var t = dn(e);
    e.removeOverlay(dn(e).getOverlay()),
      t.setOverlay(null),
      t.getScrollbarAnnotate() &&
        (t.getScrollbarAnnotate().clear(), t.setScrollbarAnnotate(null));
  }
  function Pn(e, t, n) {
    return (
      typeof e != "number" && (e = e.line),
      t instanceof Array ? $(e, t) : n ? e >= t && e <= n : e == t
    );
  }
  function Hn(e) {
    var t = e.ace.renderer;
    return {
      top: t.getFirstFullyVisibleRow(),
      bottom: t.getLastFullyVisibleRow(),
    };
  }
  function In(e, t, n, r, i, s, o, u, a) {
    function c() {
      e.operation(function () {
        while (!f) h(), p();
        d();
      });
    }
    function h() {
      var t = e.getRange(s.from(), s.to()),
        n = t.replace(o, u);
      s.replace(n);
    }
    function p() {
      while (s.findNext() && Pn(s.from(), r, i)) {
        if (!n && l && s.from().line == l.line) continue;
        e.scrollIntoView(s.from(), 30),
          e.setSelection(s.from(), s.to()),
          (l = s.from()),
          (f = !1);
        return;
      }
      f = !0;
    }
    function d(t) {
      t && t(), e.focus();
      if (l) {
        e.setCursor(l);
        var n = e.state.vim;
        (n.exMode = !1), (n.lastHPos = n.lastHSPos = l.ch);
      }
      a && a();
    }
    function m(t, n, r) {
      v.e_stop(t);
      var i = v.keyName(t);
      switch (i) {
        case "Y":
          h(), p();
          break;
        case "N":
          p();
          break;
        case "A":
          var s = a;
          (a = undefined), e.operation(c), (a = s);
          break;
        case "L":
          h();
        case "Q":
        case "Esc":
        case "Ctrl-C":
        case "Ctrl-[":
          d(r);
      }
      return f && d(r), !0;
    }
    e.state.vim.exMode = !0;
    var f = !1,
      l = s.from();
    p();
    if (f) {
      Tn(e, "No matches for " + o.source);
      return;
    }
    if (!t) {
      c(), a && a();
      return;
    }
    kn(e, {
      prefix: "replace with <strong>" + u + "</strong> (y/n/a/q/l)",
      onKeyDown: m,
    });
  }
  function qn(e) {
    var t = e.state.vim,
      n = nt.macroModeState,
      r = nt.registerController.getRegister("."),
      i = n.isPlaying,
      s = n.lastInsertModeChanges,
      o = [];
    if (!i) {
      var u = s.inVisualBlock ? t.lastSelection.visualBlock.height : 1,
        a = s.changes,
        o = [],
        f = 0;
      while (f < a.length) o.push(a[f]), a[f] instanceof Gn ? f++ : (f += u);
      (s.changes = o),
        e.off("change", $n),
        v.off(e.getInputField(), "keydown", Yn);
    }
    !i &&
      t.insertModeRepeat > 1 &&
      (Zn(e, t, t.insertModeRepeat - 1, !0),
      (t.lastEditInputState.repeatOverride = t.insertModeRepeat)),
      delete t.insertModeRepeat,
      (t.insertMode = !1),
      e.setCursor(e.getCursor().line, e.getCursor().ch - 1),
      e.setOption("keyMap", "vim"),
      e.setOption("disableInput", !0),
      e.toggleOverwrite(!1),
      r.setText(s.changes.join("")),
      v.signal(e, "vim-mode-change", { mode: "normal" }),
      n.isRecording && Xn(n);
  }
  function Rn(e) {
    b.unshift(e);
  }
  function Un(e, t, n, r, i) {
    var s = { keys: e, type: t };
    (s[t] = n), (s[t + "Args"] = r);
    for (var o in i) s[o] = i[o];
    Rn(s);
  }
  function zn(e, t, n, r) {
    var i = nt.registerController.getRegister(r);
    if (r == ":") {
      i.keyBuffer[0] && Fn.processCommand(e, i.keyBuffer[0]),
        (n.isPlaying = !1);
      return;
    }
    var s = i.keyBuffer,
      o = 0;
    (n.isPlaying = !0), (n.replaySearchQueries = i.searchQueries.slice(0));
    for (var u = 0; u < s.length; u++) {
      var a = s[u],
        f,
        l;
      while (a) {
        (f = /<\w+-.+?>|<\w+>|./.exec(a)),
          (l = f[0]),
          (a = a.substring(f.index + l.length)),
          v.Vim.handleKey(e, l, "macro");
        if (t.insertMode) {
          var c = i.insertModeChanges[o++].changes;
          (nt.macroModeState.lastInsertModeChanges.changes = c),
            er(e, c, 1),
            qn(e);
        }
      }
    }
    n.isPlaying = !1;
  }
  function Wn(e, t) {
    if (e.isPlaying) return;
    var n = e.latestRegister,
      r = nt.registerController.getRegister(n);
    r && r.pushText(t);
  }
  function Xn(e) {
    if (e.isPlaying) return;
    var t = e.latestRegister,
      n = nt.registerController.getRegister(t);
    n &&
      n.pushInsertModeChanges &&
      n.pushInsertModeChanges(e.lastInsertModeChanges);
  }
  function Vn(e, t) {
    if (e.isPlaying) return;
    var n = e.latestRegister,
      r = nt.registerController.getRegister(n);
    r && r.pushSearchQuery && r.pushSearchQuery(t);
  }
  function $n(e, t) {
    var n = nt.macroModeState,
      r = n.lastInsertModeChanges;
    if (!n.isPlaying)
      while (t) {
        r.expectCursorActivityForChange = !0;
        if (
          t.origin == "+input" ||
          t.origin == "paste" ||
          t.origin === undefined
        ) {
          var i = t.text.join("\n");
          r.maybeReset && ((r.changes = []), (r.maybeReset = !1)),
            r.changes.push(i);
        }
        t = t.next;
      }
  }
  function Jn(e) {
    var t = e.state.vim;
    if (t.insertMode) {
      var n = nt.macroModeState;
      if (n.isPlaying) return;
      var r = n.lastInsertModeChanges;
      r.expectCursorActivityForChange
        ? (r.expectCursorActivityForChange = !1)
        : (r.maybeReset = !0);
    } else e.curOp.isVimOp || Qn(e, t);
    t.visualMode && Kn(e);
  }
  function Kn(e) {
    var t = e.state.vim,
      n = wt(e, Lt(t.sel.head)),
      r = St(n, 0, 1);
    t.fakeCursor && t.fakeCursor.clear(),
      (t.fakeCursor = e.markText(n, r, { className: "cm-animate-fat-cursor" }));
  }
  function Qn(e, t) {
    var n = e.getCursor("anchor"),
      r = e.getCursor("head");
    t.visualMode && !e.somethingSelected()
      ? $t(e, !1)
      : !t.visualMode &&
        !t.insertMode &&
        e.somethingSelected() &&
        ((t.visualMode = !0),
        (t.visualLine = !1),
        v.signal(e, "vim-mode-change", { mode: "visual" }));
    if (t.visualMode) {
      var i = Ot(r, n) ? 0 : -1,
        s = Ot(r, n) ? -1 : 0;
      (r = St(r, 0, i)),
        (n = St(n, 0, s)),
        (t.sel = { anchor: n, head: r }),
        an(e, t, "<", Mt(r, n)),
        an(e, t, ">", _t(r, n));
    } else t.insertMode || (t.lastHPos = e.getCursor().ch);
  }
  function Gn(e) {
    this.keyName = e;
  }
  function Yn(e) {
    function i() {
      return (
        n.maybeReset && ((n.changes = []), (n.maybeReset = !1)),
        n.changes.push(new Gn(r)),
        !0
      );
    }
    var t = nt.macroModeState,
      n = t.lastInsertModeChanges,
      r = v.keyName(e);
    if (!r) return;
    (r.indexOf("Delete") != -1 || r.indexOf("Backspace") != -1) &&
      v.lookupKey(r, "vim-insert", i);
  }
  function Zn(e, t, n, r) {
    function u() {
      s ? ht.processAction(e, t, t.lastEditActionCommand) : ht.evalInput(e, t);
    }
    function a(n) {
      if (i.lastInsertModeChanges.changes.length > 0) {
        n = t.lastEditActionCommand ? n : 1;
        var r = i.lastInsertModeChanges;
        er(e, r.changes, n);
      }
    }
    var i = nt.macroModeState;
    i.isPlaying = !0;
    var s = !!t.lastEditActionCommand,
      o = t.inputState;
    t.inputState = t.lastEditInputState;
    if (s && t.lastEditActionCommand.interlaceInsertRepeat)
      for (var f = 0; f < n; f++) u(), a(1);
    else r || u(), a(n);
    (t.inputState = o), t.insertMode && !r && qn(e), (i.isPlaying = !1);
  }
  function er(e, t, n) {
    function r(t) {
      return typeof t == "string" ? v.commands[t](e) : t(e), !0;
    }
    var i = e.getCursor("head"),
      s = nt.macroModeState.lastInsertModeChanges.inVisualBlock;
    if (s) {
      var o = e.state.vim,
        u = o.lastSelection,
        a = xt(u.anchor, u.head);
      It(e, i, a.line + 1), (n = e.listSelections().length), e.setCursor(i);
    }
    for (var f = 0; f < n; f++) {
      s && e.setCursor(St(i, f, 0));
      for (var l = 0; l < t.length; l++) {
        var c = t[l];
        if (c instanceof Gn) v.lookupKey(c.keyName, "vim-insert", r);
        else {
          var h = e.getCursor();
          e.replaceRange(c, h, h);
        }
      }
    }
    s && e.setCursor(St(i, 0, 1));
  }
  function nr(e, t, n) {
    t.length > 1 && t[0] == "n" && (t = t.replace("numpad", "")),
      (t = tr[t] || t);
    var r = "";
    return (
      n.ctrlKey && (r += "C-"),
      n.altKey && (r += "A-"),
      n.shiftKey && (r += "S-"),
      (r += t),
      r.length > 1 && (r = "<" + r + ">"),
      r
    );
  }
  function ir(e) {
    var t = new e.constructor();
    return (
      Object.keys(e).forEach(function (n) {
        var r = e[n];
        Array.isArray(r)
          ? (r = r.slice())
          : r && typeof r == "object" && r.constructor != Object && (r = ir(r)),
          (t[n] = r);
      }),
      e.sel &&
        (t.sel = {
          head: e.sel.head && Lt(e.sel.head),
          anchor: e.sel.anchor && Lt(e.sel.anchor),
        }),
      t
    );
  }
  function sr(e, t, n) {
    var r = !1,
      i = S.maybeInitVimState_(e),
      s = i.visualBlock || i.wasInVisualBlock;
    i.wasInVisualBlock && !e.ace.inMultiSelectMode
      ? (i.wasInVisualBlock = !1)
      : e.ace.inMultiSelectMode && i.visualBlock && (i.wasInVisualBlock = !0);
    if (
      t == "<Esc>" &&
      !i.insertMode &&
      !i.visualMode &&
      e.ace.inMultiSelectMode
    )
      e.ace.exitMultiSelectMode();
    else if (s || !e.ace.inMultiSelectMode || e.ace.inVirtualSelectionMode)
      r = S.handleKey(e, t, n);
    else {
      var o = ir(i);
      e.operation(function () {
        e.ace.forEachSelection(function () {
          var i = e.ace.selection;
          e.state.vim.lastHPos =
            i.$desiredColumn == null ? i.lead.column : i.$desiredColumn;
          var s = e.getCursor("head"),
            u = e.getCursor("anchor"),
            a = Ot(s, u) ? 0 : -1,
            f = Ot(s, u) ? -1 : 0;
          (s = St(s, 0, a)),
            (u = St(u, 0, f)),
            (e.state.vim.sel.head = s),
            (e.state.vim.sel.anchor = u),
            (r = rr(e, t, n)),
            (i.$desiredColumn =
              e.state.vim.lastHPos == -1 ? null : e.state.vim.lastHPos),
            e.virtualSelectionMode() && (e.state.vim = ir(o));
        }),
          e.curOp.cursorActivity && !r && (e.curOp.cursorActivity = !1);
      }, !0);
    }
    return r;
  }
  function ar(e, t) {
    t.off("beforeEndOperation", ar);
    var n = t.state.cm.vimCmd;
    n && t.execCommand(n.exec ? n : n.name, n.args), (t.curOp = t.prevOp);
  }
  var i = e("../range").Range,
    s = e("../lib/event_emitter").EventEmitter,
    o = e("../lib/dom"),
    u = e("../lib/oop"),
    a = e("../lib/keys"),
    f = e("../lib/event"),
    l = e("../search").Search,
    c = e("../lib/useragent"),
    h = e("../search_highlight").SearchHighlight,
    p = e("../commands/multi_select_commands"),
    d = e("../mode/text").Mode.prototype.tokenRe;
  e("../multi_select");
  var v = function (e) {
    (this.ace = e),
      (this.state = {}),
      (this.marks = {}),
      (this.$uid = 0),
      (this.onChange = this.onChange.bind(this)),
      (this.onSelectionChange = this.onSelectionChange.bind(this)),
      (this.onBeforeEndOperation = this.onBeforeEndOperation.bind(this)),
      this.ace.on("change", this.onChange),
      this.ace.on("changeSelection", this.onSelectionChange),
      this.ace.on("beforeEndOperation", this.onBeforeEndOperation);
  };
  (v.Pos = function (e, t) {
    if (!(this instanceof E)) return new E(e, t);
    (this.line = e), (this.ch = t);
  }),
    (v.defineOption = function (e, t, n) {}),
    (v.commands = {
      redo: function (e) {
        e.ace.redo();
      },
      undo: function (e) {
        e.ace.undo();
      },
      newlineAndIndent: function (e) {
        e.ace.insert("\n");
      },
    }),
    (v.keyMap = {}),
    (v.addClass = v.rmClass = v.e_stop = function () {}),
    (v.keyName = function (e) {
      if (e.key) return e.key;
      var t = a[e.keyCode] || "";
      return (
        t.length == 1 && (t = t.toUpperCase()),
        (t =
          f.getModifierString(e).replace(/(^|-)\w/g, function (e) {
            return e.toUpperCase();
          }) + t),
        t
      );
    }),
    (v.keyMap["default"] = function (e) {
      return function (t) {
        var n = t.ace.commands.commandKeyBinding[e.toLowerCase()];
        return n && t.ace.execCommand(n) !== !1;
      };
    }),
    (v.lookupKey = function fr(e, t, n) {
      typeof t == "string" && (t = v.keyMap[t]);
      var r = typeof t == "function" ? t(e) : t[e];
      if (r === !1) return "nothing";
      if (r === "...") return "multi";
      if (r != null && n(r)) return "handled";
      if (t.fallthrough) {
        if (!Array.isArray(t.fallthrough)) return fr(e, t.fallthrough, n);
        for (var i = 0; i < t.fallthrough.length; i++) {
          var s = fr(e, t.fallthrough[i], n);
          if (s) return s;
        }
      }
    }),
    (v.signal = function (e, t, n) {
      return e._signal(t, n);
    }),
    (v.on = f.addListener),
    (v.off = f.removeListener),
    (v.isWordChar = function (e) {
      return e < "" ? /^\w$/.test(e) : ((d.lastIndex = 0), d.test(e));
    }),
    function () {
      u.implement(v.prototype, s),
        (this.destroy = function () {
          this.ace.off("change", this.onChange),
            this.ace.off("changeSelection", this.onSelectionChange),
            this.ace.off("beforeEndOperation", this.onBeforeEndOperation),
            this.removeOverlay();
        }),
        (this.virtualSelectionMode = function () {
          return this.ace.inVirtualSelectionMode && this.ace.selection.index;
        }),
        (this.onChange = function (e) {
          var t = { text: e.action[0] == "i" ? e.lines : [] },
            n = (this.curOp = this.curOp || {});
          n.changeHandlers ||
            (n.changeHandlers =
              this._eventRegistry.change && this._eventRegistry.change.slice());
          if (this.virtualSelectionMode()) return;
          n.lastChange
            ? (n.lastChange.next = n.lastChange = t)
            : (n.lastChange = n.change = t),
            this.$updateMarkers(e);
        }),
        (this.onSelectionChange = function () {
          var e = (this.curOp = this.curOp || {});
          e.cursorActivityHandlers ||
            (e.cursorActivityHandlers =
              this._eventRegistry.cursorActivity &&
              this._eventRegistry.cursorActivity.slice()),
            (this.curOp.cursorActivity = !0),
            this.ace.inMultiSelectMode &&
              this.ace.keyBinding.removeKeyboardHandler(p.keyboardHandler);
        }),
        (this.operation = function (e, t) {
          if ((!t && this.curOp) || (t && this.curOp && this.curOp.force))
            return e();
          (t || !this.ace.curOp) && this.curOp && this.onBeforeEndOperation();
          if (!this.ace.curOp) {
            var n = this.ace.prevOp;
            this.ace.startOperation({
              command: { name: "vim", scrollIntoView: "cursor" },
            });
          }
          var r = (this.curOp = this.curOp || {});
          this.curOp.force = t;
          var i = e();
          return (
            this.ace.curOp &&
              this.ace.curOp.command.name == "vim" &&
              (this.ace.endOperation(),
              !r.cursorActivity && !r.lastChange && n && (this.ace.prevOp = n)),
            (t || !this.ace.curOp) && this.curOp && this.onBeforeEndOperation(),
            i
          );
        }),
        (this.onBeforeEndOperation = function () {
          var e = this.curOp;
          e &&
            (e.change && this.signal("change", e.change, e),
            e && e.cursorActivity && this.signal("cursorActivity", null, e),
            (this.curOp = null));
        }),
        (this.signal = function (e, t, n) {
          var r = n ? n[e + "Handlers"] : (this._eventRegistry || {})[e];
          if (!r) return;
          r = r.slice();
          for (var i = 0; i < r.length; i++) r[i](this, t);
        }),
        (this.firstLine = function () {
          return 0;
        }),
        (this.lastLine = function () {
          return this.ace.session.getLength() - 1;
        }),
        (this.lineCount = function () {
          return this.ace.session.getLength();
        }),
        (this.setCursor = function (e, t) {
          typeof e == "object" && ((t = e.ch), (e = e.line)),
            this.ace.inVirtualSelectionMode || this.ace.exitMultiSelectMode(),
            this.ace.session.unfold({ row: e, column: t }),
            this.ace.selection.moveTo(e, t);
        }),
        (this.getCursor = function (e) {
          var t = this.ace.selection,
            n =
              e == "anchor"
                ? t.isEmpty()
                  ? t.lead
                  : t.anchor
                : e == "head" || !e
                ? t.lead
                : t.getRange()[e];
          return g(n);
        }),
        (this.listSelections = function (e) {
          var t = this.ace.multiSelect.rangeList.ranges;
          return !t.length || this.ace.inVirtualSelectionMode
            ? [
                {
                  anchor: this.getCursor("anchor"),
                  head: this.getCursor("head"),
                },
              ]
            : t.map(function (e) {
                return {
                  anchor: this.clipPos(g(e.cursor == e.end ? e.start : e.end)),
                  head: this.clipPos(g(e.cursor)),
                };
              }, this);
        }),
        (this.setSelections = function (e, t) {
          var n = this.ace.multiSelect,
            r = e.map(function (e) {
              var t = m(e.anchor),
                n = m(e.head),
                r =
                  i.comparePoints(t, n) < 0
                    ? new i.fromPoints(t, n)
                    : new i.fromPoints(n, t);
              return (
                (r.cursor = i.comparePoints(r.start, n) ? r.end : r.start), r
              );
            });
          if (this.ace.inVirtualSelectionMode) {
            this.ace.selection.fromOrientedRange(r[0]);
            return;
          }
          t ? r[t] && r.push(r.splice(t, 1)[0]) : (r = r.reverse()),
            n.toSingleRange(r[0].clone());
          var s = this.ace.session;
          for (var o = 0; o < r.length; o++) {
            var u = s.$clipRangeToDocument(r[o]);
            n.addRange(u);
          }
        }),
        (this.setSelection = function (e, t, n) {
          var r = this.ace.selection;
          r.moveTo(e.line, e.ch),
            r.selectTo(t.line, t.ch),
            n && n.origin == "*mouse" && this.onBeforeEndOperation();
        }),
        (this.somethingSelected = function (e) {
          return !this.ace.selection.isEmpty();
        }),
        (this.clipPos = function (e) {
          var t = this.ace.session.$clipPositionToDocument(e.line, e.ch);
          return g(t);
        }),
        (this.markText = function (e) {
          return { clear: function () {}, find: function () {} };
        }),
        (this.$updateMarkers = function (e) {
          var t = e.action == "insert",
            n = e.start,
            r = e.end,
            s = (r.row - n.row) * (t ? 1 : -1),
            o = (r.column - n.column) * (t ? 1 : -1);
          t && (r = n);
          for (var u in this.marks) {
            var a = this.marks[u],
              f = i.comparePoints(a, n);
            if (f < 0) continue;
            if (f === 0 && t) {
              if (a.bias != 1) {
                a.bias == -1;
                continue;
              }
              f = 1;
            }
            var l = t ? f : i.comparePoints(a, r);
            if (l > 0) {
              (a.row += s), (a.column += a.row == r.row ? o : 0);
              continue;
            }
            !t &&
              l <= 0 &&
              ((a.row = n.row), (a.column = n.column), l === 0 && (a.bias = 1));
          }
        });
      var e = function (e, t, n, r) {
        (this.cm = e),
          (this.id = t),
          (this.row = n),
          (this.column = r),
          (e.marks[this.id] = this);
      };
      (e.prototype.clear = function () {
        delete this.cm.marks[this.id];
      }),
        (e.prototype.find = function () {
          return g(this);
        }),
        (this.setBookmark = function (t, n) {
          var r = new e(this, this.$uid++, t.line, t.ch);
          if (!n || !n.insertLeft) r.$insertRight = !0;
          return (this.marks[r.id] = r), r;
        }),
        (this.moveH = function (e, t) {
          if (t == "char") {
            var n = this.ace.selection;
            n.clearSelection(), n.moveCursorBy(0, e);
          }
        }),
        (this.findPosV = function (e, t, n, r) {
          if (n == "page") {
            var i = this.ace.renderer,
              s = i.layerConfig;
            (t *= Math.floor(s.height / s.lineHeight)), (n = "line");
          }
          if (n == "line") {
            var o = this.ace.session.documentToScreenPosition(e.line, e.ch);
            r != null && (o.column = r),
              (o.row += t),
              (o.row = Math.min(
                Math.max(0, o.row),
                this.ace.session.getScreenLength() - 1
              ));
            var u = this.ace.session.screenToDocumentPosition(o.row, o.column);
            return g(u);
          }
          debugger;
        }),
        (this.charCoords = function (e, t) {
          if (t == "div" || !t) {
            var n = this.ace.session.documentToScreenPosition(e.line, e.ch);
            return { left: n.column, top: n.row };
          }
          if (t == "local") {
            var r = this.ace.renderer,
              n = this.ace.session.documentToScreenPosition(e.line, e.ch),
              i = r.layerConfig.lineHeight,
              s = r.layerConfig.characterWidth,
              o = i * n.row;
            return { left: n.column * s, top: o, bottom: o + i };
          }
        }),
        (this.coordsChar = function (e, t) {
          var n = this.ace.renderer;
          if (t == "local") {
            var r = Math.max(0, Math.floor(e.top / n.lineHeight)),
              i = Math.max(0, Math.floor(e.left / n.characterWidth)),
              s = n.session.screenToDocumentPosition(r, i);
            return g(s);
          }
          if (t == "div") throw "not implemented";
        }),
        (this.getSearchCursor = function (e, t, n) {
          var r = !1,
            i = !1;
          e instanceof RegExp &&
            !e.global &&
            ((r = !e.ignoreCase), (e = e.source), (i = !0));
          var s = new l();
          t.ch == undefined && (t.ch = Number.MAX_VALUE);
          var o = { row: t.line, column: t.ch },
            u = this,
            a = null;
          return {
            findNext: function () {
              return this.find(!1);
            },
            findPrevious: function () {
              return this.find(!0);
            },
            find: function (t) {
              s.setOptions({
                needle: e,
                caseSensitive: r,
                wrap: !1,
                backwards: t,
                regExp: i,
                start: a || o,
              });
              var n = s.find(u.ace.session);
              return (
                n &&
                  n.isEmpty() &&
                  u.getLine(n.start.row).length == n.start.column &&
                  ((s.$options.start = n), (n = s.find(u.ace.session))),
                (a = n),
                a
              );
            },
            from: function () {
              return a && g(a.start);
            },
            to: function () {
              return a && g(a.end);
            },
            replace: function (e) {
              a && (a.end = u.ace.session.doc.replace(a, e));
            },
          };
        }),
        (this.scrollTo = function (e, t) {
          var n = this.ace.renderer,
            r = n.layerConfig,
            i = r.maxHeight;
          (i -= (n.$size.scrollerHeight - n.lineHeight) * n.$scrollPastEnd),
            t != null &&
              this.ace.session.setScrollTop(Math.max(0, Math.min(t, i))),
            e != null &&
              this.ace.session.setScrollLeft(Math.max(0, Math.min(e, r.width)));
        }),
        (this.scrollInfo = function () {
          return 0;
        }),
        (this.scrollIntoView = function (e, t) {
          if (e) {
            var n = this.ace.renderer,
              r = { top: 0, bottom: t };
            n.scrollCursorIntoView(
              m(e),
              (n.lineHeight * 2) / n.$size.scrollerHeight,
              r
            );
          }
        }),
        (this.getLine = function (e) {
          return this.ace.session.getLine(e);
        }),
        (this.getRange = function (e, t) {
          return this.ace.session.getTextRange(
            new i(e.line, e.ch, t.line, t.ch)
          );
        }),
        (this.replaceRange = function (e, t, n) {
          return (
            n || (n = t),
            this.ace.session.replace(new i(t.line, t.ch, n.line, n.ch), e)
          );
        }),
        (this.replaceSelections = function (e) {
          var t = this.ace.selection;
          if (this.ace.inVirtualSelectionMode) {
            this.ace.session.replace(t.getRange(), e[0] || "");
            return;
          }
          t.inVirtualSelectionMode = !0;
          var n = t.rangeList.ranges;
          n.length || (n = [this.ace.multiSelect.getRange()]);
          for (var r = n.length; r--; )
            this.ace.session.replace(n[r], e[r] || "");
          t.inVirtualSelectionMode = !1;
        }),
        (this.getSelection = function () {
          return this.ace.getSelectedText();
        }),
        (this.getSelections = function () {
          return this.listSelections().map(function (e) {
            return this.getRange(e.anchor, e.head);
          }, this);
        }),
        (this.getInputField = function () {
          return this.ace.textInput.getElement();
        }),
        (this.getWrapperElement = function () {
          return this.ace.containter;
        });
      var t = {
        indentWithTabs: "useSoftTabs",
        indentUnit: "tabSize",
        tabSize: "tabSize",
        firstLineNumber: "firstLineNumber",
        readOnly: "readOnly",
      };
      (this.setOption = function (e, n) {
        this.state[e] = n;
        switch (e) {
          case "indentWithTabs":
            (e = t[e]), (n = !n);
            break;
          default:
            e = t[e];
        }
        e && this.ace.setOption(e, n);
      }),
        (this.getOption = function (e, n) {
          var r = t[e];
          r && (n = this.ace.getOption(r));
          switch (e) {
            case "indentWithTabs":
              return (e = t[e]), !n;
          }
          return r ? n : this.state[e];
        }),
        (this.toggleOverwrite = function (e) {
          return (this.state.overwrite = e), this.ace.setOverwrite(e);
        }),
        (this.addOverlay = function (e) {
          if (!this.$searchHighlight || !this.$searchHighlight.session) {
            var t = new h(null, "ace_highlight-marker", "text"),
              n = this.ace.session.addDynamicMarker(t);
            (t.id = n.id),
              (t.session = this.ace.session),
              (t.destroy = function (e) {
                t.session.off("change", t.updateOnChange),
                  t.session.off("changeEditor", t.destroy),
                  t.session.removeMarker(t.id),
                  (t.session = null);
              }),
              (t.updateOnChange = function (e) {
                var n = e.start.row;
                n == e.end.row
                  ? (t.cache[n] = undefined)
                  : t.cache.splice(n, t.cache.length);
              }),
              t.session.on("changeEditor", t.destroy),
              t.session.on("change", t.updateOnChange);
          }
          var r = new RegExp(e.query.source, "gmi");
          (this.$searchHighlight = e.highlight = t),
            this.$searchHighlight.setRegexp(r),
            this.ace.renderer.updateBackMarkers();
        }),
        (this.removeOverlay = function (e) {
          this.$searchHighlight &&
            this.$searchHighlight.session &&
            this.$searchHighlight.destroy();
        }),
        (this.getScrollInfo = function () {
          var e = this.ace.renderer,
            t = e.layerConfig;
          return {
            left: e.scrollLeft,
            top: e.scrollTop,
            height: t.maxHeight,
            width: t.width,
            clientHeight: t.height,
            clientWidth: t.width,
          };
        }),
        (this.getValue = function () {
          return this.ace.getValue();
        }),
        (this.setValue = function (e) {
          return this.ace.setValue(e);
        }),
        (this.getTokenTypeAt = function (e) {
          var t = this.ace.session.getTokenAt(e.line, e.ch);
          return t && /comment|string/.test(t.type) ? "string" : "";
        }),
        (this.findMatchingBracket = function (e) {
          var t = this.ace.session.findMatchingBracket(m(e));
          return { to: t && g(t) };
        }),
        (this.indentLine = function (e, t) {
          t === !0
            ? this.ace.session.indentRows(e, e, "	")
            : t === !1 && this.ace.session.outdentRows(new i(e, 0, e, 0));
        }),
        (this.indexFromPos = function (e) {
          return this.ace.session.doc.positionToIndex(m(e));
        }),
        (this.posFromIndex = function (e) {
          return g(this.ace.session.doc.indexToPosition(e));
        }),
        (this.focus = function (e) {
          return this.ace.focus();
        }),
        (this.blur = function (e) {
          return this.ace.blur();
        }),
        (this.defaultTextHeight = function (e) {
          return this.ace.renderer.layerConfig.lineHeight;
        }),
        (this.scanForBracket = function (e, t, n, r) {
          var i = r.bracketRegex.source;
          if (t == 1)
            var s = this.ace.session.$findClosingBracket(
              i.slice(1, 2),
              m(e),
              /paren|text/
            );
          else
            var s = this.ace.session.$findOpeningBracket(
              i.slice(-2, -1),
              { row: e.line, column: e.ch + 1 },
              /paren|text/
            );
          return s && { pos: g(s) };
        }),
        (this.refresh = function () {
          return this.ace.resize(!0);
        }),
        (this.getMode = function () {
          return { name: this.getOption("mode") };
        });
    }.call(v.prototype);
  var y = (v.StringStream = function (e, t) {
    (this.pos = this.start = 0),
      (this.string = e),
      (this.tabSize = t || 8),
      (this.lastColumnPos = this.lastColumnValue = 0),
      (this.lineStart = 0);
  });
  (y.prototype = {
    eol: function () {
      return this.pos >= this.string.length;
    },
    sol: function () {
      return this.pos == this.lineStart;
    },
    peek: function () {
      return this.string.charAt(this.pos) || undefined;
    },
    next: function () {
      if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    },
    eat: function (e) {
      var t = this.string.charAt(this.pos);
      if (typeof e == "string") var n = t == e;
      else var n = t && (e.test ? e.test(t) : e(t));
      if (n) return ++this.pos, t;
    },
    eatWhile: function (e) {
      var t = this.pos;
      while (this.eat(e));
      return this.pos > t;
    },
    eatSpace: function () {
      var e = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > e;
    },
    skipToEnd: function () {
      this.pos = this.string.length;
    },
    skipTo: function (e) {
      var t = this.string.indexOf(e, this.pos);
      if (t > -1) return (this.pos = t), !0;
    },
    backUp: function (e) {
      this.pos -= e;
    },
    column: function () {
      throw "not implemented";
    },
    indentation: function () {
      throw "not implemented";
    },
    match: function (e, t, n) {
      if (typeof e != "string") {
        var s = this.string.slice(this.pos).match(e);
        return s && s.index > 0
          ? null
          : (s && t !== !1 && (this.pos += s[0].length), s);
      }
      var r = function (e) {
          return n ? e.toLowerCase() : e;
        },
        i = this.string.substr(this.pos, e.length);
      if (r(i) == r(e)) return t !== !1 && (this.pos += e.length), !0;
    },
    current: function () {
      return this.string.slice(this.start, this.pos);
    },
    hideFirstChars: function (e, t) {
      this.lineStart += e;
      try {
        return t();
      } finally {
        this.lineStart -= e;
      }
    },
  }),
    (v.defineExtension = function (e, t) {
      v.prototype[e] = t;
    }),
    o.importCssString(
      ".normal-mode .ace_cursor{  border: 1px solid red;  background-color: red;  opacity: 0.5;}.normal-mode .ace_hidden-cursors .ace_cursor{  background-color: transparent;}.ace_dialog {  position: absolute;  left: 0; right: 0;  background: white;  z-index: 15;  padding: .1em .8em;  overflow: hidden;  color: #333;}.ace_dialog-top {  border-bottom: 1px solid #eee;  top: 0;}.ace_dialog-bottom {  border-top: 1px solid #eee;  bottom: 0;}.ace_dialog input {  border: none;  outline: none;  background: transparent;  width: 20em;  color: inherit;  font-family: monospace;}",
      "vimMode"
    ),
    (function () {
      function e(e, t, n) {
        var r = e.ace.container,
          i;
        return (
          (i = r.appendChild(document.createElement("div"))),
          n
            ? (i.className = "ace_dialog ace_dialog-bottom")
            : (i.className = "ace_dialog ace_dialog-top"),
          typeof t == "string" ? (i.innerHTML = t) : i.appendChild(t),
          i
        );
      }
      function t(e, t) {
        e.state.currentNotificationClose && e.state.currentNotificationClose(),
          (e.state.currentNotificationClose = t);
      }
      v.defineExtension("openDialog", function (n, r, i) {
        function a(e) {
          if (typeof e == "string") f.value = e;
          else {
            if (o) return;
            (o = !0),
              s.parentNode.removeChild(s),
              u.focus(),
              i.onClose && i.onClose(s);
          }
        }
        if (this.virtualSelectionMode()) return;
        i || (i = {}), t(this, null);
        var s = e(this, n, i.bottom),
          o = !1,
          u = this,
          f = s.getElementsByTagName("input")[0],
          l;
        if (f)
          i.value && ((f.value = i.value), i.select !== !1 && f.select()),
            i.onInput &&
              v.on(f, "input", function (e) {
                i.onInput(e, f.value, a);
              }),
            i.onKeyUp &&
              v.on(f, "keyup", function (e) {
                i.onKeyUp(e, f.value, a);
              }),
            v.on(f, "keydown", function (e) {
              if (i && i.onKeyDown && i.onKeyDown(e, f.value, a)) return;
              if (e.keyCode == 27 || (i.closeOnEnter !== !1 && e.keyCode == 13))
                f.blur(), v.e_stop(e), a();
              e.keyCode == 13 && r(f.value);
            }),
            i.closeOnBlur !== !1 && v.on(f, "blur", a),
            f.focus();
        else if ((l = s.getElementsByTagName("button")[0]))
          v.on(l, "click", function () {
            a(), u.focus();
          }),
            i.closeOnBlur !== !1 && v.on(l, "blur", a),
            l.focus();
        return a;
      }),
        v.defineExtension("openNotification", function (n, r) {
          function a() {
            if (s) return;
            (s = !0), clearTimeout(o), i.parentNode.removeChild(i);
          }
          if (this.virtualSelectionMode()) return;
          t(this, a);
          var i = e(this, n, r && r.bottom),
            s = !1,
            o,
            u = r && typeof r.duration != "undefined" ? r.duration : 5e3;
          return (
            v.on(i, "click", function (e) {
              v.e_preventDefault(e), a();
            }),
            u && (o = setTimeout(a, u)),
            a
          );
        });
    })();
  var b = [
      { keys: "<Left>", type: "keyToKey", toKeys: "h" },
      { keys: "<Right>", type: "keyToKey", toKeys: "l" },
      { keys: "<Up>", type: "keyToKey", toKeys: "k" },
      { keys: "<Down>", type: "keyToKey", toKeys: "j" },
      { keys: "<Space>", type: "keyToKey", toKeys: "l" },
      { keys: "<BS>", type: "keyToKey", toKeys: "h", context: "normal" },
      { keys: "<C-Space>", type: "keyToKey", toKeys: "W" },
      { keys: "<C-BS>", type: "keyToKey", toKeys: "B", context: "normal" },
      { keys: "<S-Space>", type: "keyToKey", toKeys: "w" },
      { keys: "<S-BS>", type: "keyToKey", toKeys: "b", context: "normal" },
      { keys: "<C-n>", type: "keyToKey", toKeys: "j" },
      { keys: "<C-p>", type: "keyToKey", toKeys: "k" },
      { keys: "<C-[>", type: "keyToKey", toKeys: "<Esc>" },
      { keys: "<C-c>", type: "keyToKey", toKeys: "<Esc>" },
      { keys: "<C-[>", type: "keyToKey", toKeys: "<Esc>", context: "insert" },
      { keys: "<C-c>", type: "keyToKey", toKeys: "<Esc>", context: "insert" },
      { keys: "s", type: "keyToKey", toKeys: "cl", context: "normal" },
      { keys: "s", type: "keyToKey", toKeys: "c", context: "visual" },
      { keys: "S", type: "keyToKey", toKeys: "cc", context: "normal" },
      { keys: "S", type: "keyToKey", toKeys: "VdO", context: "visual" },
      { keys: "<Home>", type: "keyToKey", toKeys: "0" },
      { keys: "<End>", type: "keyToKey", toKeys: "$" },
      { keys: "<PageUp>", type: "keyToKey", toKeys: "<C-b>" },
      { keys: "<PageDown>", type: "keyToKey", toKeys: "<C-f>" },
      { keys: "<CR>", type: "keyToKey", toKeys: "j^", context: "normal" },
      {
        keys: "H",
        type: "motion",
        motion: "moveToTopLine",
        motionArgs: { linewise: !0, toJumplist: !0 },
      },
      {
        keys: "M",
        type: "motion",
        motion: "moveToMiddleLine",
        motionArgs: { linewise: !0, toJumplist: !0 },
      },
      {
        keys: "L",
        type: "motion",
        motion: "moveToBottomLine",
        motionArgs: { linewise: !0, toJumplist: !0 },
      },
      {
        keys: "h",
        type: "motion",
        motion: "moveByCharacters",
        motionArgs: { forward: !1 },
      },
      {
        keys: "l",
        type: "motion",
        motion: "moveByCharacters",
        motionArgs: { forward: !0 },
      },
      {
        keys: "j",
        type: "motion",
        motion: "moveByLines",
        motionArgs: { forward: !0, linewise: !0 },
      },
      {
        keys: "k",
        type: "motion",
        motion: "moveByLines",
        motionArgs: { forward: !1, linewise: !0 },
      },
      {
        keys: "gj",
        type: "motion",
        motion: "moveByDisplayLines",
        motionArgs: { forward: !0 },
      },
      {
        keys: "gk",
        type: "motion",
        motion: "moveByDisplayLines",
        motionArgs: { forward: !1 },
      },
      {
        keys: "w",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !0, wordEnd: !1 },
      },
      {
        keys: "W",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !0, wordEnd: !1, bigWord: !0 },
      },
      {
        keys: "e",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !0, wordEnd: !0, inclusive: !0 },
      },
      {
        keys: "E",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !0, wordEnd: !0, bigWord: !0, inclusive: !0 },
      },
      {
        keys: "b",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !1, wordEnd: !1 },
      },
      {
        keys: "B",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !1, wordEnd: !1, bigWord: !0 },
      },
      {
        keys: "ge",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !1, wordEnd: !0, inclusive: !0 },
      },
      {
        keys: "gE",
        type: "motion",
        motion: "moveByWords",
        motionArgs: { forward: !1, wordEnd: !0, bigWord: !0, inclusive: !0 },
      },
      {
        keys: "{",
        type: "motion",
        motion: "moveByParagraph",
        motionArgs: { forward: !1, toJumplist: !0 },
      },
      {
        keys: "}",
        type: "motion",
        motion: "moveByParagraph",
        motionArgs: { forward: !0, toJumplist: !0 },
      },
      {
        keys: "<C-f>",
        type: "motion",
        motion: "moveByPage",
        motionArgs: { forward: !0 },
      },
      {
        keys: "<C-b>",
        type: "motion",
        motion: "moveByPage",
        motionArgs: { forward: !1 },
      },
      {
        keys: "<C-d>",
        type: "motion",
        motion: "moveByScroll",
        motionArgs: { forward: !0, explicitRepeat: !0 },
      },
      {
        keys: "<C-u>",
        type: "motion",
        motion: "moveByScroll",
        motionArgs: { forward: !1, explicitRepeat: !0 },
      },
      {
        keys: "gg",
        type: "motion",
        motion: "moveToLineOrEdgeOfDocument",
        motionArgs: {
          forward: !1,
          explicitRepeat: !0,
          linewise: !0,
          toJumplist: !0,
        },
      },
      {
        keys: "G",
        type: "motion",
        motion: "moveToLineOrEdgeOfDocument",
        motionArgs: {
          forward: !0,
          explicitRepeat: !0,
          linewise: !0,
          toJumplist: !0,
        },
      },
      { keys: "0", type: "motion", motion: "moveToStartOfLine" },
      {
        keys: "^",
        type: "motion",
        motion: "moveToFirstNonWhiteSpaceCharacter",
      },
      {
        keys: "+",
        type: "motion",
        motion: "moveByLines",
        motionArgs: { forward: !0, toFirstChar: !0 },
      },
      {
        keys: "-",
        type: "motion",
        motion: "moveByLines",
        motionArgs: { forward: !1, toFirstChar: !0 },
      },
      {
        keys: "_",
        type: "motion",
        motion: "moveByLines",
        motionArgs: { forward: !0, toFirstChar: !0, repeatOffset: -1 },
      },
      {
        keys: "$",
        type: "motion",
        motion: "moveToEol",
        motionArgs: { inclusive: !0 },
      },
      {
        keys: "%",
        type: "motion",
        motion: "moveToMatchedSymbol",
        motionArgs: { inclusive: !0, toJumplist: !0 },
      },
      {
        keys: "f<character>",
        type: "motion",
        motion: "moveToCharacter",
        motionArgs: { forward: !0, inclusive: !0 },
      },
      {
        keys: "F<character>",
        type: "motion",
        motion: "moveToCharacter",
        motionArgs: { forward: !1 },
      },
      {
        keys: "t<character>",
        type: "motion",
        motion: "moveTillCharacter",
        motionArgs: { forward: !0, inclusive: !0 },
      },
      {
        keys: "T<character>",
        type: "motion",
        motion: "moveTillCharacter",
        motionArgs: { forward: !1 },
      },
      {
        keys: ";",
        type: "motion",
        motion: "repeatLastCharacterSearch",
        motionArgs: { forward: !0 },
      },
      {
        keys: ",",
        type: "motion",
        motion: "repeatLastCharacterSearch",
        motionArgs: { forward: !1 },
      },
      {
        keys: "'<character>",
        type: "motion",
        motion: "goToMark",
        motionArgs: { toJumplist: !0, linewise: !0 },
      },
      {
        keys: "`<character>",
        type: "motion",
        motion: "goToMark",
        motionArgs: { toJumplist: !0 },
      },
      {
        keys: "]`",
        type: "motion",
        motion: "jumpToMark",
        motionArgs: { forward: !0 },
      },
      {
        keys: "[`",
        type: "motion",
        motion: "jumpToMark",
        motionArgs: { forward: !1 },
      },
      {
        keys: "]'",
        type: "motion",
        motion: "jumpToMark",
        motionArgs: { forward: !0, linewise: !0 },
      },
      {
        keys: "['",
        type: "motion",
        motion: "jumpToMark",
        motionArgs: { forward: !1, linewise: !0 },
      },
      {
        keys: "]p",
        type: "action",
        action: "paste",
        isEdit: !0,
        actionArgs: { after: !0, isEdit: !0, matchIndent: !0 },
      },
      {
        keys: "[p",
        type: "action",
        action: "paste",
        isEdit: !0,
        actionArgs: { after: !1, isEdit: !0, matchIndent: !0 },
      },
      {
        keys: "]<character>",
        type: "motion",
        motion: "moveToSymbol",
        motionArgs: { forward: !0, toJumplist: !0 },
      },
      {
        keys: "[<character>",
        type: "motion",
        motion: "moveToSymbol",
        motionArgs: { forward: !1, toJumplist: !0 },
      },
      { keys: "|", type: "motion", motion: "moveToColumn" },
      {
        keys: "o",
        type: "motion",
        motion: "moveToOtherHighlightedEnd",
        context: "visual",
      },
      {
        keys: "O",
        type: "motion",
        motion: "moveToOtherHighlightedEnd",
        motionArgs: { sameLine: !0 },
        context: "visual",
      },
      { keys: "d", type: "operator", operator: "delete" },
      { keys: "y", type: "operator", operator: "yank" },
      { keys: "c", type: "operator", operator: "change" },
      {
        keys: ">",
        type: "operator",
        operator: "indent",
        operatorArgs: { indentRight: !0 },
      },
      {
        keys: "<",
        type: "operator",
        operator: "indent",
        operatorArgs: { indentRight: !1 },
      },
      { keys: "g~", type: "operator", operator: "changeCase" },
      {
        keys: "gu",
        type: "operator",
        operator: "changeCase",
        operatorArgs: { toLower: !0 },
        isEdit: !0,
      },
      {
        keys: "gU",
        type: "operator",
        operator: "changeCase",
        operatorArgs: { toLower: !1 },
        isEdit: !0,
      },
      {
        keys: "n",
        type: "motion",
        motion: "findNext",
        motionArgs: { forward: !0, toJumplist: !0 },
      },
      {
        keys: "N",
        type: "motion",
        motion: "findNext",
        motionArgs: { forward: !1, toJumplist: !0 },
      },
      {
        keys: "x",
        type: "operatorMotion",
        operator: "delete",
        motion: "moveByCharacters",
        motionArgs: { forward: !0 },
        operatorMotionArgs: { visualLine: !1 },
      },
      {
        keys: "X",
        type: "operatorMotion",
        operator: "delete",
        motion: "moveByCharacters",
        motionArgs: { forward: !1 },
        operatorMotionArgs: { visualLine: !0 },
      },
      {
        keys: "D",
        type: "operatorMotion",
        operator: "delete",
        motion: "moveToEol",
        motionArgs: { inclusive: !0 },
        context: "normal",
      },
      {
        keys: "D",
        type: "operator",
        operator: "delete",
        operatorArgs: { linewise: !0 },
        context: "visual",
      },
      {
        keys: "Y",
        type: "operatorMotion",
        operator: "yank",
        motion: "moveToEol",
        motionArgs: { inclusive: !0 },
        context: "normal",
      },
      {
        keys: "Y",
        type: "operator",
        operator: "yank",
        operatorArgs: { linewise: !0 },
        context: "visual",
      },
      {
        keys: "C",
        type: "operatorMotion",
        operator: "change",
        motion: "moveToEol",
        motionArgs: { inclusive: !0 },
        context: "normal",
      },
      {
        keys: "C",
        type: "operator",
        operator: "change",
        operatorArgs: { linewise: !0 },
        context: "visual",
      },
      {
        keys: "~",
        type: "operatorMotion",
        operator: "changeCase",
        motion: "moveByCharacters",
        motionArgs: { forward: !0 },
        operatorArgs: { shouldMoveCursor: !0 },
        context: "normal",
      },
      {
        keys: "~",
        type: "operator",
        operator: "changeCase",
        context: "visual",
      },
      {
        keys: "<C-w>",
        type: "operatorMotion",
        operator: "delete",
        motion: "moveByWords",
        motionArgs: { forward: !1, wordEnd: !1 },
        context: "insert",
      },
      {
        keys: "<C-i>",
        type: "action",
        action: "jumpListWalk",
        actionArgs: { forward: !0 },
      },
      {
        keys: "<C-o>",
        type: "action",
        action: "jumpListWalk",
        actionArgs: { forward: !1 },
      },
      {
        keys: "<C-e>",
        type: "action",
        action: "scroll",
        actionArgs: { forward: !0, linewise: !0 },
      },
      {
        keys: "<C-y>",
        type: "action",
        action: "scroll",
        actionArgs: { forward: !1, linewise: !0 },
      },
      {
        keys: "a",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "charAfter" },
        context: "normal",
      },
      {
        keys: "A",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "eol" },
        context: "normal",
      },
      {
        keys: "A",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "endOfSelectedArea" },
        context: "visual",
      },
      {
        keys: "i",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "inplace" },
        context: "normal",
      },
      {
        keys: "I",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "firstNonBlank" },
        context: "normal",
      },
      {
        keys: "I",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { insertAt: "startOfSelectedArea" },
        context: "visual",
      },
      {
        keys: "o",
        type: "action",
        action: "newLineAndEnterInsertMode",
        isEdit: !0,
        interlaceInsertRepeat: !0,
        actionArgs: { after: !0 },
        context: "normal",
      },
      {
        keys: "O",
        type: "action",
        action: "newLineAndEnterInsertMode",
        isEdit: !0,
        interlaceInsertRepeat: !0,
        actionArgs: { after: !1 },
        context: "normal",
      },
      { keys: "v", type: "action", action: "toggleVisualMode" },
      {
        keys: "V",
        type: "action",
        action: "toggleVisualMode",
        actionArgs: { linewise: !0 },
      },
      {
        keys: "<C-v>",
        type: "action",
        action: "toggleVisualMode",
        actionArgs: { blockwise: !0 },
      },
      {
        keys: "<C-q>",
        type: "action",
        action: "toggleVisualMode",
        actionArgs: { blockwise: !0 },
      },
      { keys: "gv", type: "action", action: "reselectLastSelection" },
      { keys: "J", type: "action", action: "joinLines", isEdit: !0 },
      {
        keys: "p",
        type: "action",
        action: "paste",
        isEdit: !0,
        actionArgs: { after: !0, isEdit: !0 },
      },
      {
        keys: "P",
        type: "action",
        action: "paste",
        isEdit: !0,
        actionArgs: { after: !1, isEdit: !0 },
      },
      { keys: "r<character>", type: "action", action: "replace", isEdit: !0 },
      { keys: "@<character>", type: "action", action: "replayMacro" },
      { keys: "q<character>", type: "action", action: "enterMacroRecordMode" },
      {
        keys: "R",
        type: "action",
        action: "enterInsertMode",
        isEdit: !0,
        actionArgs: { replace: !0 },
      },
      { keys: "u", type: "action", action: "undo", context: "normal" },
      {
        keys: "u",
        type: "operator",
        operator: "changeCase",
        operatorArgs: { toLower: !0 },
        context: "visual",
        isEdit: !0,
      },
      {
        keys: "U",
        type: "operator",
        operator: "changeCase",
        operatorArgs: { toLower: !1 },
        context: "visual",
        isEdit: !0,
      },
      { keys: "<C-r>", type: "action", action: "redo" },
      { keys: "m<character>", type: "action", action: "setMark" },
      { keys: '"<character>', type: "action", action: "setRegister" },
      {
        keys: "zz",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "center" },
      },
      {
        keys: "z.",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "center" },
        motion: "moveToFirstNonWhiteSpaceCharacter",
      },
      {
        keys: "zt",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "top" },
      },
      {
        keys: "z<CR>",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "top" },
        motion: "moveToFirstNonWhiteSpaceCharacter",
      },
      {
        keys: "z-",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "bottom" },
      },
      {
        keys: "zb",
        type: "action",
        action: "scrollToCursor",
        actionArgs: { position: "bottom" },
        motion: "moveToFirstNonWhiteSpaceCharacter",
      },
      { keys: ".", type: "action", action: "repeatLastEdit" },
      {
        keys: "<C-a>",
        type: "action",
        action: "incrementNumberToken",
        isEdit: !0,
        actionArgs: { increase: !0, backtrack: !1 },
      },
      {
        keys: "<C-x>",
        type: "action",
        action: "incrementNumberToken",
        isEdit: !0,
        actionArgs: { increase: !1, backtrack: !1 },
      },
      {
        keys: "a<character>",
        type: "motion",
        motion: "textObjectManipulation",
      },
      {
        keys: "i<character>",
        type: "motion",
        motion: "textObjectManipulation",
        motionArgs: { textObjectInner: !0 },
      },
      {
        keys: "/",
        type: "search",
        searchArgs: { forward: !0, querySrc: "prompt", toJumplist: !0 },
      },
      {
        keys: "?",
        type: "search",
        searchArgs: { forward: !1, querySrc: "prompt", toJumplist: !0 },
      },
      {
        keys: "*",
        type: "search",
        searchArgs: {
          forward: !0,
          querySrc: "wordUnderCursor",
          wholeWordOnly: !0,
          toJumplist: !0,
        },
      },
      {
        keys: "#",
        type: "search",
        searchArgs: {
          forward: !1,
          querySrc: "wordUnderCursor",
          wholeWordOnly: !0,
          toJumplist: !0,
        },
      },
      {
        keys: "g*",
        type: "search",
        searchArgs: {
          forward: !0,
          querySrc: "wordUnderCursor",
          toJumplist: !0,
        },
      },
      {
        keys: "g#",
        type: "search",
        searchArgs: {
          forward: !1,
          querySrc: "wordUnderCursor",
          toJumplist: !0,
        },
      },
      { keys: ":", type: "ex" },
    ],
    w = [
      { name: "colorscheme", shortName: "colo" },
      { name: "map" },
      { name: "imap", shortName: "im" },
      { name: "nmap", shortName: "nm" },
      { name: "vmap", shortName: "vm" },
      { name: "unmap" },
      { name: "write", shortName: "w" },
      { name: "undo", shortName: "u" },
      { name: "redo", shortName: "red" },
      { name: "set", shortName: "se" },
      { name: "set", shortName: "se" },
      { name: "setlocal", shortName: "setl" },
      { name: "setglobal", shortName: "setg" },
      { name: "sort", shortName: "sor" },
      { name: "substitute", shortName: "s", possiblyAsync: !0 },
      { name: "nohlsearch", shortName: "noh" },
      { name: "delmarks", shortName: "delm" },
      { name: "registers", shortName: "reg", excludeFromCommandHistory: !0 },
      { name: "global", shortName: "g" },
    ],
    E = v.Pos,
    S = function () {
      return st;
    };
  v.defineOption("vimMode", !1, function (e, t, n) {
    t && e.getOption("keyMap") != "vim"
      ? e.setOption("keyMap", "vim")
      : !t &&
        n != v.Init &&
        /^vim/.test(e.getOption("keyMap")) &&
        e.setOption("keyMap", "default");
  });
  var L = { Shift: "S", Ctrl: "C", Alt: "A", Cmd: "D", Mod: "A" },
    A = { Enter: "CR", Backspace: "BS", Delete: "Del" },
    _ = /[\d]/,
    D = [
      v.isWordChar,
      function (e) {
        return e && !v.isWordChar(e) && !/\s/.test(e);
      },
    ],
    P = [
      function (e) {
        return /\S/.test(e);
      },
    ],
    B = H(65, 26),
    j = H(97, 26),
    F = H(48, 10),
    I = [].concat(B, j, F, ["<", ">"]),
    q = [].concat(B, j, F, ["-", '"', ".", ":", "/"]),
    J = {};
  K("filetype", undefined, "string", ["ft"], function (e, t) {
    if (t === undefined) return;
    if (e === undefined) {
      var n = t.getOption("mode");
      return n == "null" ? "" : n;
    }
    var n = e == "" ? "null" : e;
    t.setOption("mode", n);
  });
  var Y = function () {
      function s(s, o, u) {
        function l(n) {
          var r = ++t % e,
            o = i[r];
          o && o.clear(), (i[r] = s.setBookmark(n));
        }
        var a = t % e,
          f = i[a];
        if (f) {
          var c = f.find();
          c && !At(c, o) && l(o);
        } else l(o);
        l(u), (n = t), (r = t - e + 1), r < 0 && (r = 0);
      }
      function o(s, o) {
        (t += o), t > n ? (t = n) : t < r && (t = r);
        var u = i[(e + t) % e];
        if (u && !u.find()) {
          var a = o > 0 ? 1 : -1,
            f,
            l = s.getCursor();
          do {
            (t += a), (u = i[(e + t) % e]);
            if (u && (f = u.find()) && !At(l, f)) break;
          } while (t < n && t > r);
        }
        return u;
      }
      var e = 100,
        t = -1,
        n = 0,
        r = 0,
        i = new Array(e);
      return { cachedCursor: undefined, add: s, move: o };
    },
    Z = function (e) {
      return e
        ? {
            changes: e.changes,
            expectCursorActivityForChange: e.expectCursorActivityForChange,
          }
        : { changes: [], expectCursorActivityForChange: !1 };
    };
  et.prototype = {
    exitMacroRecordMode: function () {
      var e = nt.macroModeState;
      e.onRecordingDone && e.onRecordingDone(),
        (e.onRecordingDone = undefined),
        (e.isRecording = !1);
    },
    enterMacroRecordMode: function (e, t) {
      var n = nt.registerController.getRegister(t);
      n &&
        (n.clear(),
        (this.latestRegister = t),
        e.openDialog &&
          (this.onRecordingDone = e.openDialog("(recording)[" + t + "]", null, {
            bottom: !0,
          })),
        (this.isRecording = !0));
    },
  };
  var nt,
    it,
    st = {
      buildKeyMap: function () {},
      getRegisterController: function () {
        return nt.registerController;
      },
      resetVimGlobalState_: rt,
      getVimGlobalState_: function () {
        return nt;
      },
      maybeInitVimState_: tt,
      suppressErrorLogging: !1,
      InsertModeKey: Gn,
      map: function (e, t, n) {
        Fn.map(e, t, n);
      },
      unmap: function (e, t) {
        Fn.unmap(e, t);
      },
      setOption: Q,
      getOption: G,
      defineOption: K,
      defineEx: function (e, t, n) {
        if (!t) t = e;
        else if (e.indexOf(t) !== 0)
          throw new Error(
            '(Vim.defineEx) "' +
              t +
              '" is not a prefix of "' +
              e +
              '", command not registered'
          );
        (jn[e] = n),
          (Fn.commandMap_[t] = { name: e, shortName: t, type: "api" });
      },
      handleKey: function (e, t, n) {
        var r = this.findKey(e, t, n);
        if (typeof r == "function") return r();
      },
      findKey: function (e, t, n) {
        function i() {
          var r = nt.macroModeState;
          if (r.isRecording) {
            if (t == "q") return r.exitMacroRecordMode(), ut(e), !0;
            n != "mapping" && Wn(r, t);
          }
        }
        function s() {
          if (t == "<Esc>")
            return ut(e), r.visualMode ? $t(e) : r.insertMode && qn(e), !0;
        }
        function o(n) {
          var r;
          while (n)
            (r = /<\w+-.+?>|<\w+>|./.exec(n)),
              (t = r[0]),
              (n = n.substring(r.index + t.length)),
              v.Vim.handleKey(e, t, "mapping");
        }
        function u() {
          if (s()) return !0;
          var n = (r.inputState.keyBuffer = r.inputState.keyBuffer + t),
            i = t.length == 1,
            o = ht.matchCommand(n, b, r.inputState, "insert");
          while (n.length > 1 && o.type != "full") {
            var n = (r.inputState.keyBuffer = n.slice(1)),
              u = ht.matchCommand(n, b, r.inputState, "insert");
            u.type != "none" && (o = u);
          }
          if (o.type == "none") return ut(e), !1;
          if (o.type == "partial")
            return (
              it && window.clearTimeout(it),
              (it = window.setTimeout(function () {
                r.insertMode && r.inputState.keyBuffer && ut(e);
              }, G("insertModeEscKeysTimeout"))),
              !i
            );
          it && window.clearTimeout(it);
          if (i) {
            var a = e.listSelections();
            for (var f = 0; f < a.length; f++) {
              var l = a[f].head;
              e.replaceRange("", St(l, 0, -(n.length - 1)), l, "+input");
            }
            nt.macroModeState.lastInsertModeChanges.changes.pop();
          }
          return ut(e), o.command;
        }
        function a() {
          if (i() || s()) return !0;
          var n = (r.inputState.keyBuffer = r.inputState.keyBuffer + t);
          if (/^[1-9]\d*$/.test(n)) return !0;
          var o = /^(\d*)(.*)$/.exec(n);
          if (!o) return ut(e), !1;
          var u = r.visualMode ? "visual" : "normal",
            a = ht.matchCommand(o[2] || o[1], b, r.inputState, u);
          if (a.type == "none") return ut(e), !1;
          if (a.type == "partial") return !0;
          r.inputState.keyBuffer = "";
          var o = /^(\d*)(.*)$/.exec(n);
          return (
            o[1] && o[1] != "0" && r.inputState.pushRepeatDigit(o[1]), a.command
          );
        }
        var r = tt(e),
          f;
        return (
          r.insertMode ? (f = u()) : (f = a()),
          f === !1
            ? undefined
            : f === !0
            ? function () {
                return !0;
              }
            : function () {
                if ((f.operator || f.isEdit) && e.getOption("readOnly")) return;
                return e.operation(function () {
                  e.curOp.isVimOp = !0;
                  try {
                    f.type == "keyToKey"
                      ? o(f.toKeys)
                      : ht.processCommand(e, r, f);
                  } catch (t) {
                    throw (
                      ((e.state.vim = undefined),
                      tt(e),
                      v.Vim.suppressErrorLogging || console.log(t),
                      t)
                    );
                  }
                  return !0;
                });
              }
        );
      },
      handleEx: function (e, t) {
        Fn.processCommand(e, t);
      },
      defineMotion: dt,
      defineAction: bt,
      defineOperator: gt,
      mapCommand: Un,
      _mapCommand: Rn,
      defineRegister: ft,
      exitVisualMode: $t,
      exitInsertMode: qn,
    };
  (ot.prototype.pushRepeatDigit = function (e) {
    this.operator
      ? (this.motionRepeat = this.motionRepeat.concat(e))
      : (this.prefixRepeat = this.prefixRepeat.concat(e));
  }),
    (ot.prototype.getRepeat = function () {
      var e = 0;
      if (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0)
        (e = 1),
          this.prefixRepeat.length > 0 &&
            (e *= parseInt(this.prefixRepeat.join(""), 10)),
          this.motionRepeat.length > 0 &&
            (e *= parseInt(this.motionRepeat.join(""), 10));
      return e;
    }),
    (at.prototype = {
      setText: function (e, t, n) {
        (this.keyBuffer = [e || ""]),
          (this.linewise = !!t),
          (this.blockwise = !!n);
      },
      pushText: function (e, t) {
        t && (this.linewise || this.keyBuffer.push("\n"), (this.linewise = !0)),
          this.keyBuffer.push(e);
      },
      pushInsertModeChanges: function (e) {
        this.insertModeChanges.push(Z(e));
      },
      pushSearchQuery: function (e) {
        this.searchQueries.push(e);
      },
      clear: function () {
        (this.keyBuffer = []),
          (this.insertModeChanges = []),
          (this.searchQueries = []),
          (this.linewise = !1);
      },
      toString: function () {
        return this.keyBuffer.join("");
      },
    }),
    (lt.prototype = {
      pushText: function (e, t, n, r, i) {
        r && n.charAt(0) == "\n" && (n = n.slice(1) + "\n"),
          r && n.charAt(n.length - 1) !== "\n" && (n += "\n");
        var s = this.isValidRegister(e) ? this.getRegister(e) : null;
        if (!s) {
          switch (t) {
            case "yank":
              this.registers[0] = new at(n, r, i);
              break;
            case "delete":
            case "change":
              n.indexOf("\n") == -1
                ? (this.registers["-"] = new at(n, r))
                : (this.shiftNumericRegisters_(),
                  (this.registers[1] = new at(n, r)));
          }
          this.unnamedRegister.setText(n, r, i);
          return;
        }
        var o = X(e);
        o ? s.pushText(n, r) : s.setText(n, r, i),
          this.unnamedRegister.setText(s.toString(), r);
      },
      getRegister: function (e) {
        return this.isValidRegister(e)
          ? ((e = e.toLowerCase()),
            this.registers[e] || (this.registers[e] = new at()),
            this.registers[e])
          : this.unnamedRegister;
      },
      isValidRegister: function (e) {
        return e && $(e, q);
      },
      shiftNumericRegisters_: function () {
        for (var e = 9; e >= 2; e--)
          this.registers[e] = this.getRegister("" + (e - 1));
      },
    }),
    (ct.prototype = {
      nextMatch: function (e, t) {
        var n = this.historyBuffer,
          r = t ? -1 : 1;
        this.initialPrefix === null && (this.initialPrefix = e);
        for (var i = this.iterator + r; t ? i >= 0 : i < n.length; i += r) {
          var s = n[i];
          for (var o = 0; o <= s.length; o++)
            if (this.initialPrefix == s.substring(0, o))
              return (this.iterator = i), s;
        }
        if (i >= n.length)
          return (this.iterator = n.length), this.initialPrefix;
        if (i < 0) return e;
      },
      pushInput: function (e) {
        var t = this.historyBuffer.indexOf(e);
        t > -1 && this.historyBuffer.splice(t, 1),
          e.length && this.historyBuffer.push(e);
      },
      reset: function () {
        (this.initialPrefix = null),
          (this.iterator = this.historyBuffer.length);
      },
    });
  var ht = {
      matchCommand: function (e, t, n, r) {
        var i = Tt(e, t, r, n);
        if (!i.full && !i.partial) return { type: "none" };
        if (!i.full && i.partial) return { type: "partial" };
        var s;
        for (var o = 0; o < i.full.length; o++) {
          var u = i.full[o];
          s || (s = u);
        }
        return (
          s.keys.slice(-11) == "<character>" && (n.selectedCharacter = Ct(e)),
          { type: "full", command: s }
        );
      },
      processCommand: function (e, t, n) {
        t.inputState.repeatOverride = n.repeatOverride;
        switch (n.type) {
          case "motion":
            this.processMotion(e, t, n);
            break;
          case "operator":
            this.processOperator(e, t, n);
            break;
          case "operatorMotion":
            this.processOperatorMotion(e, t, n);
            break;
          case "action":
            this.processAction(e, t, n);
            break;
          case "search":
            this.processSearch(e, t, n);
            break;
          case "ex":
          case "keyToEx":
            this.processEx(e, t, n);
            break;
          default:
        }
      },
      processMotion: function (e, t, n) {
        (t.inputState.motion = n.motion),
          (t.inputState.motionArgs = Et(n.motionArgs)),
          this.evalInput(e, t);
      },
      processOperator: function (e, t, n) {
        var r = t.inputState;
        if (r.operator) {
          if (r.operator == n.operator) {
            (r.motion = "expandToLine"),
              (r.motionArgs = { linewise: !0 }),
              this.evalInput(e, t);
            return;
          }
          ut(e);
        }
        (r.operator = n.operator),
          (r.operatorArgs = Et(n.operatorArgs)),
          t.visualMode && this.evalInput(e, t);
      },
      processOperatorMotion: function (e, t, n) {
        var r = t.visualMode,
          i = Et(n.operatorMotionArgs);
        i && r && i.visualLine && (t.visualLine = !0),
          this.processOperator(e, t, n),
          r || this.processMotion(e, t, n);
      },
      processAction: function (e, t, n) {
        var r = t.inputState,
          i = r.getRepeat(),
          s = !!i,
          o = Et(n.actionArgs) || {};
        r.selectedCharacter && (o.selectedCharacter = r.selectedCharacter),
          n.operator && this.processOperator(e, t, n),
          n.motion && this.processMotion(e, t, n),
          (n.motion || n.operator) && this.evalInput(e, t),
          (o.repeat = i || 1),
          (o.repeatIsExplicit = s),
          (o.registerName = r.registerName),
          ut(e),
          (t.lastMotion = null),
          n.isEdit && this.recordLastEdit(t, r, n),
          yt[n.action](e, o, t);
      },
      processSearch: function (e, t, n) {
        function a(r, i, s) {
          nt.searchHistoryController.pushInput(r),
            nt.searchHistoryController.reset();
          try {
            An(e, r, i, s);
          } catch (o) {
            Tn(e, "Invalid regex: " + r), ut(e);
            return;
          }
          ht.processMotion(e, t, {
            type: "motion",
            motion: "findNext",
            motionArgs: { forward: !0, toJumplist: n.searchArgs.toJumplist },
          });
        }
        function f(t) {
          e.scrollTo(u.left, u.top), a(t, !0, !0);
          var n = nt.macroModeState;
          n.isRecording && Vn(n, t);
        }
        function l(t, n, i) {
          var s = v.keyName(t),
            o;
          s == "Up" || s == "Down"
            ? ((o = s == "Up" ? !0 : !1),
              (n = nt.searchHistoryController.nextMatch(n, o) || ""),
              i(n))
            : s != "Left" &&
              s != "Right" &&
              s != "Ctrl" &&
              s != "Alt" &&
              s != "Shift" &&
              nt.searchHistoryController.reset();
          var a;
          try {
            a = An(e, n, !0, !0);
          } catch (t) {}
          a
            ? e.scrollIntoView(_n(e, !r, a), 30)
            : (Dn(e), e.scrollTo(u.left, u.top));
        }
        function c(t, n, r) {
          var i = v.keyName(t);
          i == "Esc" ||
          i == "Ctrl-C" ||
          i == "Ctrl-[" ||
          (i == "Backspace" && n == "")
            ? (nt.searchHistoryController.pushInput(n),
              nt.searchHistoryController.reset(),
              An(e, o),
              Dn(e),
              e.scrollTo(u.left, u.top),
              v.e_stop(t),
              ut(e),
              r(),
              e.focus())
            : i == "Ctrl-U" && (v.e_stop(t), r(""));
        }
        if (!e.getSearchCursor) return;
        var r = n.searchArgs.forward,
          i = n.searchArgs.wholeWordOnly;
        dn(e).setReversed(!r);
        var s = r ? "/" : "?",
          o = dn(e).getQuery(),
          u = e.getScrollInfo();
        switch (n.searchArgs.querySrc) {
          case "prompt":
            var h = nt.macroModeState;
            if (h.isPlaying) {
              var p = h.replaySearchQueries.shift();
              a(p, !0, !1);
            } else
              kn(e, {
                onClose: f,
                prefix: s,
                desc: Cn,
                onKeyUp: l,
                onKeyDown: c,
              });
            break;
          case "wordUnderCursor":
            var d = Gt(e, !1, !0, !1, !0),
              m = !0;
            d || ((d = Gt(e, !1, !0, !1, !1)), (m = !1));
            if (!d) return;
            var p = e.getLine(d.start.line).substring(d.start.ch, d.end.ch);
            m && i ? (p = "\\b" + p + "\\b") : (p = Bt(p)),
              (nt.jumpList.cachedCursor = e.getCursor()),
              e.setCursor(d.start),
              a(p, !0, !1);
        }
      },
      processEx: function (e, t, n) {
        function r(t) {
          nt.exCommandHistoryController.pushInput(t),
            nt.exCommandHistoryController.reset(),
            Fn.processCommand(e, t);
        }
        function i(t, n, r) {
          var i = v.keyName(t),
            s;
          if (
            i == "Esc" ||
            i == "Ctrl-C" ||
            i == "Ctrl-[" ||
            (i == "Backspace" && n == "")
          )
            nt.exCommandHistoryController.pushInput(n),
              nt.exCommandHistoryController.reset(),
              v.e_stop(t),
              ut(e),
              r(),
              e.focus();
          i == "Up" || i == "Down"
            ? ((s = i == "Up" ? !0 : !1),
              (n = nt.exCommandHistoryController.nextMatch(n, s) || ""),
              r(n))
            : i == "Ctrl-U"
            ? (v.e_stop(t), r(""))
            : i != "Left" &&
              i != "Right" &&
              i != "Ctrl" &&
              i != "Alt" &&
              i != "Shift" &&
              nt.exCommandHistoryController.reset();
        }
        n.type == "keyToEx"
          ? Fn.processCommand(e, n.exArgs.input)
          : t.visualMode
          ? kn(e, { onClose: r, prefix: ":", value: "'<,'>", onKeyDown: i })
          : kn(e, { onClose: r, prefix: ":", onKeyDown: i });
      },
      evalInput: function (e, t) {
        var n = t.inputState,
          r = n.motion,
          i = n.motionArgs || {},
          s = n.operator,
          o = n.operatorArgs || {},
          u = n.registerName,
          a = t.sel,
          f = Lt(t.visualMode ? wt(e, a.head) : e.getCursor("head")),
          l = Lt(t.visualMode ? wt(e, a.anchor) : e.getCursor("anchor")),
          c = Lt(f),
          h = Lt(l),
          p,
          d,
          v;
        s && this.recordLastEdit(t, n),
          n.repeatOverride !== undefined
            ? (v = n.repeatOverride)
            : (v = n.getRepeat());
        if (v > 0 && i.explicitRepeat) i.repeatIsExplicit = !0;
        else if (i.noRepeat || (!i.explicitRepeat && v === 0))
          (v = 1), (i.repeatIsExplicit = !1);
        n.selectedCharacter &&
          (i.selectedCharacter = o.selectedCharacter = n.selectedCharacter),
          (i.repeat = v),
          ut(e);
        if (r) {
          var m = pt[r](e, f, i, t);
          t.lastMotion = pt[r];
          if (!m) return;
          if (i.toJumplist) {
            !s &&
              e.ace.curOp != null &&
              (e.ace.curOp.command.scrollIntoView = "center-animate");
            var g = nt.jumpList,
              y = g.cachedCursor;
            y ? (Yt(e, y, m), delete g.cachedCursor) : Yt(e, f, m);
          }
          m instanceof Array ? ((d = m[0]), (p = m[1])) : (p = m),
            p || (p = Lt(f));
          if (t.visualMode) {
            if (!t.visualBlock || p.ch !== Infinity)
              p = wt(e, p, t.visualBlock);
            d && (d = wt(e, d, !0)),
              (d = d || h),
              (a.anchor = d),
              (a.head = p),
              Wt(e),
              an(e, t, "<", Ot(d, p) ? d : p),
              an(e, t, ">", Ot(d, p) ? p : d);
          } else s || ((p = wt(e, p)), e.setCursor(p.line, p.ch));
        }
        if (s) {
          if (o.lastSel) {
            d = h;
            var b = o.lastSel,
              w = Math.abs(b.head.line - b.anchor.line),
              S = Math.abs(b.head.ch - b.anchor.ch);
            b.visualLine
              ? (p = E(h.line + w, h.ch))
              : b.visualBlock
              ? (p = E(h.line + w, h.ch + S))
              : b.head.line == b.anchor.line
              ? (p = E(h.line, h.ch + S))
              : (p = E(h.line + w, h.ch)),
              (t.visualMode = !0),
              (t.visualLine = b.visualLine),
              (t.visualBlock = b.visualBlock),
              (a = t.sel = { anchor: d, head: p }),
              Wt(e);
          } else
            t.visualMode &&
              (o.lastSel = {
                anchor: Lt(a.anchor),
                head: Lt(a.head),
                visualBlock: t.visualBlock,
                visualLine: t.visualLine,
              });
          var x, T, N, C, k;
          if (t.visualMode) {
            (x = Mt(a.head, a.anchor)),
              (T = _t(a.head, a.anchor)),
              (N = t.visualLine || o.linewise),
              (C = t.visualBlock ? "block" : N ? "line" : "char"),
              (k = Xt(e, { anchor: x, head: T }, C));
            if (N) {
              var L = k.ranges;
              if (C == "block")
                for (var A = 0; A < L.length; A++)
                  L[A].head.ch = Pt(e, L[A].head.line);
              else C == "line" && (L[0].head = E(L[0].head.line + 1, 0));
            }
          } else {
            (x = Lt(d || h)), (T = Lt(p || c));
            if (Ot(T, x)) {
              var O = x;
              (x = T), (T = O);
            }
            (N = i.linewise || o.linewise),
              N ? Kt(e, x, T) : i.forward && Jt(e, x, T),
              (C = "char");
            var M = !i.inclusive || N;
            k = Xt(e, { anchor: x, head: T }, C, M);
          }
          e.setSelections(k.ranges, k.primary),
            (t.lastMotion = null),
            (o.repeat = v),
            (o.registerName = u),
            (o.linewise = N);
          var _ = mt[s](e, o, k.ranges, h, p);
          t.visualMode && $t(e, _ != null), _ && e.setCursor(_);
        }
      },
      recordLastEdit: function (e, t, n) {
        var r = nt.macroModeState;
        if (r.isPlaying) return;
        (e.lastEditInputState = t),
          (e.lastEditActionCommand = n),
          (r.lastInsertModeChanges.changes = []),
          (r.lastInsertModeChanges.expectCursorActivityForChange = !1);
      },
    },
    pt = {
      moveToTopLine: function (e, t, n) {
        var r = Hn(e).top + n.repeat - 1;
        return E(r, Qt(e.getLine(r)));
      },
      moveToMiddleLine: function (e) {
        var t = Hn(e),
          n = Math.floor((t.top + t.bottom) * 0.5);
        return E(n, Qt(e.getLine(n)));
      },
      moveToBottomLine: function (e, t, n) {
        var r = Hn(e).bottom - n.repeat + 1;
        return E(r, Qt(e.getLine(r)));
      },
      expandToLine: function (e, t, n) {
        var r = t;
        return E(r.line + n.repeat - 1, Infinity);
      },
      findNext: function (e, t, n) {
        var r = dn(e),
          i = r.getQuery();
        if (!i) return;
        var s = !n.forward;
        return (s = r.isReversed() ? !s : s), Mn(e, i), _n(e, s, i, n.repeat);
      },
      goToMark: function (e, t, n, r) {
        var i = r.marks[n.selectedCharacter];
        if (i) {
          var s = i.find();
          return n.linewise ? { line: s.line, ch: Qt(e.getLine(s.line)) } : s;
        }
        return null;
      },
      moveToOtherHighlightedEnd: function (e, t, n, r) {
        if (r.visualBlock && n.sameLine) {
          var i = r.sel;
          return [
            wt(e, E(i.anchor.line, i.head.ch)),
            wt(e, E(i.head.line, i.anchor.ch)),
          ];
        }
        return [r.sel.head, r.sel.anchor];
      },
      jumpToMark: function (e, t, n, r) {
        var i = t;
        for (var s = 0; s < n.repeat; s++) {
          var o = i;
          for (var u in r.marks) {
            if (!U(u)) continue;
            var a = r.marks[u].find(),
              f = n.forward ? Ot(a, o) : Ot(o, a);
            if (f) continue;
            if (n.linewise && a.line == o.line) continue;
            var l = At(o, i),
              c = n.forward ? Dt(o, a, i) : Dt(i, a, o);
            if (l || c) i = a;
          }
        }
        return n.linewise && (i = E(i.line, Qt(e.getLine(i.line)))), i;
      },
      moveByCharacters: function (e, t, n) {
        var r = t,
          i = n.repeat,
          s = n.forward ? r.ch + i : r.ch - i;
        return E(r.line, s);
      },
      moveByLines: function (e, t, n, r) {
        var i = t,
          s = i.ch;
        switch (r.lastMotion) {
          case this.moveByLines:
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveToColumn:
          case this.moveToEol:
            s = r.lastHPos;
            break;
          default:
            r.lastHPos = s;
        }
        var o = n.repeat + (n.repeatOffset || 0),
          u = n.forward ? i.line + o : i.line - o,
          a = e.firstLine(),
          f = e.lastLine();
        if ((u < a && i.line == a) || (u > f && i.line == f)) return;
        var l = e.ace.session.getFoldLine(u);
        return (
          l &&
            (n.forward
              ? u > l.start.row && (u = l.end.row + 1)
              : (u = l.start.row)),
          n.toFirstChar && ((s = Qt(e.getLine(u))), (r.lastHPos = s)),
          (r.lastHSPos = e.charCoords(E(u, s), "div").left),
          E(u, s)
        );
      },
      moveByDisplayLines: function (e, t, n, r) {
        var i = t;
        switch (r.lastMotion) {
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveByLines:
          case this.moveToColumn:
          case this.moveToEol:
            break;
          default:
            r.lastHSPos = e.charCoords(i, "div").left;
        }
        var s = n.repeat,
          o = e.findPosV(i, n.forward ? s : -s, "line", r.lastHSPos);
        if (o.hitSide)
          if (n.forward)
            var u = e.charCoords(o, "div"),
              a = { top: u.top + 8, left: r.lastHSPos },
              o = e.coordsChar(a, "div");
          else {
            var f = e.charCoords(E(e.firstLine(), 0), "div");
            (f.left = r.lastHSPos), (o = e.coordsChar(f, "div"));
          }
        return (r.lastHPos = o.ch), o;
      },
      moveByPage: function (e, t, n) {
        var r = t,
          i = n.repeat;
        return e.findPosV(r, n.forward ? i : -i, "page");
      },
      moveByParagraph: function (e, t, n) {
        var r = n.forward ? 1 : -1;
        return ln(e, t, n.repeat, r);
      },
      moveByScroll: function (e, t, n, r) {
        var i = e.getScrollInfo(),
          s = null,
          o = n.repeat;
        o || (o = i.clientHeight / (2 * e.defaultTextHeight()));
        var u = e.charCoords(t, "local");
        n.repeat = o;
        var s = pt.moveByDisplayLines(e, t, n, r);
        if (!s) return null;
        var a = e.charCoords(s, "local");
        return e.scrollTo(null, i.top + a.top - u.top), s;
      },
      moveByWords: function (e, t, n) {
        return sn(e, t, n.repeat, !!n.forward, !!n.wordEnd, !!n.bigWord);
      },
      moveTillCharacter: function (e, t, n) {
        var r = n.repeat,
          i = on(e, r, n.forward, n.selectedCharacter),
          s = n.forward ? -1 : 1;
        return Zt(s, n), i ? ((i.ch += s), i) : null;
      },
      moveToCharacter: function (e, t, n) {
        var r = n.repeat;
        return Zt(0, n), on(e, r, n.forward, n.selectedCharacter) || t;
      },
      moveToSymbol: function (e, t, n) {
        var r = n.repeat;
        return nn(e, r, n.forward, n.selectedCharacter) || t;
      },
      moveToColumn: function (e, t, n, r) {
        var i = n.repeat;
        return (
          (r.lastHPos = i - 1),
          (r.lastHSPos = e.charCoords(t, "div").left),
          un(e, i)
        );
      },
      moveToEol: function (e, t, n, r) {
        var i = t;
        r.lastHPos = Infinity;
        var s = E(i.line + n.repeat - 1, Infinity),
          o = e.clipPos(s);
        return o.ch--, (r.lastHSPos = e.charCoords(o, "div").left), s;
      },
      moveToFirstNonWhiteSpaceCharacter: function (e, t) {
        var n = t;
        return E(n.line, Qt(e.getLine(n.line)));
      },
      moveToMatchedSymbol: function (e, t) {
        var n = t,
          r = n.line,
          i = n.ch,
          s = e.getLine(r),
          o;
        do {
          o = s.charAt(i++);
          if (o && z(o)) {
            var u = e.getTokenTypeAt(E(r, i));
            if (u !== "string" && u !== "comment") break;
          }
        } while (o);
        if (o) {
          var a = e.findMatchingBracket(E(r, i));
          return a.to;
        }
        return n;
      },
      moveToStartOfLine: function (e, t) {
        return E(t.line, 0);
      },
      moveToLineOrEdgeOfDocument: function (e, t, n) {
        var r = n.forward ? e.lastLine() : e.firstLine();
        return (
          n.repeatIsExplicit && (r = n.repeat - e.getOption("firstLineNumber")),
          E(r, Qt(e.getLine(r)))
        );
      },
      textObjectManipulation: function (e, t, n, r) {
        var i = { "(": ")", ")": "(", "{": "}", "}": "{", "[": "]", "]": "[" },
          s = { "'": !0, '"': !0 },
          o = n.selectedCharacter;
        o == "b" ? (o = "(") : o == "B" && (o = "{");
        var u = !n.textObjectInner,
          a;
        if (i[o]) a = cn(e, t, o, u);
        else if (s[o]) a = hn(e, t, o, u);
        else if (o === "W") a = Gt(e, u, !0, !0);
        else if (o === "w") a = Gt(e, u, !0, !1);
        else {
          if (o !== "p") return null;
          (a = ln(e, t, n.repeat, 0, u)), (n.linewise = !0);
          if (r.visualMode) r.visualLine || (r.visualLine = !0);
          else {
            var f = r.inputState.operatorArgs;
            f && (f.linewise = !0), a.end.line--;
          }
        }
        return e.state.vim.visualMode
          ? zt(e, a.start, a.end)
          : [a.start, a.end];
      },
      repeatLastCharacterSearch: function (e, t, n) {
        var r = nt.lastChararacterSearch,
          i = n.repeat,
          s = n.forward === r.forward,
          o = (r.increment ? 1 : 0) * (s ? -1 : 1);
        e.moveH(-o, "char"), (n.inclusive = s ? !0 : !1);
        var u = on(e, i, s, r.selectedCharacter);
        return u ? ((u.ch += o), u) : (e.moveH(o, "char"), t);
      },
    },
    mt = {
      change: function (e, t, n) {
        var r,
          i,
          s = e.state.vim;
        nt.macroModeState.lastInsertModeChanges.inVisualBlock = s.visualBlock;
        if (!s.visualMode) {
          var o = n[0].anchor,
            u = n[0].head;
          i = e.getRange(o, u);
          var a = s.lastEditInputState || {};
          if (a.motion == "moveByWords" && !V(i)) {
            var f = /\s+$/.exec(i);
            f &&
              a.motionArgs &&
              a.motionArgs.forward &&
              ((u = St(u, 0, -f[0].length)), (i = i.slice(0, -f[0].length)));
          }
          var l = new E(o.line - 1, Number.MAX_VALUE),
            c = e.firstLine() == e.lastLine();
          u.line > e.lastLine() && t.linewise && !c
            ? e.replaceRange("", l, u)
            : e.replaceRange("", o, u),
            t.linewise &&
              (c || (e.setCursor(l), v.commands.newlineAndIndent(e)),
              (o.ch = Number.MAX_VALUE)),
            (r = o);
        } else {
          i = e.getSelection();
          var h = vt("", n.length);
          e.replaceSelections(h), (r = Mt(n[0].head, n[0].anchor));
        }
        nt.registerController.pushText(
          t.registerName,
          "change",
          i,
          t.linewise,
          n.length > 1
        ),
          yt.enterInsertMode(e, { head: r }, e.state.vim);
      },
      delete: function (e, t, n) {
        var r,
          i,
          s = e.state.vim;
        if (!s.visualBlock) {
          var o = n[0].anchor,
            u = n[0].head;
          t.linewise &&
            u.line != e.firstLine() &&
            o.line == e.lastLine() &&
            o.line == u.line - 1 &&
            (o.line == e.firstLine()
              ? (o.ch = 0)
              : (o = E(o.line - 1, Pt(e, o.line - 1)))),
            (i = e.getRange(o, u)),
            e.replaceRange("", o, u),
            (r = o),
            t.linewise && (r = pt.moveToFirstNonWhiteSpaceCharacter(e, o));
        } else {
          i = e.getSelection();
          var a = vt("", n.length);
          e.replaceSelections(a), (r = n[0].anchor);
        }
        return (
          nt.registerController.pushText(
            t.registerName,
            "delete",
            i,
            t.linewise,
            s.visualBlock
          ),
          wt(e, r)
        );
      },
      indent: function (e, t, n) {
        var r = e.state.vim,
          i = n[0].anchor.line,
          s = r.visualBlock ? n[n.length - 1].anchor.line : n[0].head.line,
          o = r.visualMode ? t.repeat : 1;
        t.linewise && s--;
        for (var u = i; u <= s; u++)
          for (var a = 0; a < o; a++) e.indentLine(u, t.indentRight);
        return pt.moveToFirstNonWhiteSpaceCharacter(e, n[0].anchor);
      },
      changeCase: function (e, t, n, r, i) {
        var s = e.getSelections(),
          o = [],
          u = t.toLower;
        for (var a = 0; a < s.length; a++) {
          var f = s[a],
            l = "";
          if (u === !0) l = f.toLowerCase();
          else if (u === !1) l = f.toUpperCase();
          else
            for (var c = 0; c < f.length; c++) {
              var h = f.charAt(c);
              l += X(h) ? h.toLowerCase() : h.toUpperCase();
            }
          o.push(l);
        }
        return (
          e.replaceSelections(o),
          t.shouldMoveCursor
            ? i
            : !e.state.vim.visualMode &&
              t.linewise &&
              n[0].anchor.line + 1 == n[0].head.line
            ? pt.moveToFirstNonWhiteSpaceCharacter(e, r)
            : t.linewise
            ? r
            : Mt(n[0].anchor, n[0].head)
        );
      },
      yank: function (e, t, n, r) {
        var i = e.state.vim,
          s = e.getSelection(),
          o = i.visualMode
            ? Mt(i.sel.anchor, i.sel.head, n[0].head, n[0].anchor)
            : r;
        return (
          nt.registerController.pushText(
            t.registerName,
            "yank",
            s,
            t.linewise,
            i.visualBlock
          ),
          o
        );
      },
    },
    yt = {
      jumpListWalk: function (e, t, n) {
        if (n.visualMode) return;
        var r = t.repeat,
          i = t.forward,
          s = nt.jumpList,
          o = s.move(e, i ? r : -r),
          u = o ? o.find() : undefined;
        (u = u ? u : e.getCursor()),
          e.setCursor(u),
          (e.ace.curOp.command.scrollIntoView = "center-animate");
      },
      scroll: function (e, t, n) {
        if (n.visualMode) return;
        var r = t.repeat || 1,
          i = e.defaultTextHeight(),
          s = e.getScrollInfo().top,
          o = i * r,
          u = t.forward ? s + o : s - o,
          a = Lt(e.getCursor()),
          f = e.charCoords(a, "local");
        if (t.forward)
          u > f.top
            ? ((a.line += (u - f.top) / i),
              (a.line = Math.ceil(a.line)),
              e.setCursor(a),
              (f = e.charCoords(a, "local")),
              e.scrollTo(null, f.top))
            : e.scrollTo(null, u);
        else {
          var l = u + e.getScrollInfo().clientHeight;
          l < f.bottom
            ? ((a.line -= (f.bottom - l) / i),
              (a.line = Math.floor(a.line)),
              e.setCursor(a),
              (f = e.charCoords(a, "local")),
              e.scrollTo(null, f.bottom - e.getScrollInfo().clientHeight))
            : e.scrollTo(null, u);
        }
      },
      scrollToCursor: function (e, t) {
        var n = e.getCursor().line,
          r = e.charCoords(E(n, 0), "local"),
          i = e.getScrollInfo().clientHeight,
          s = r.top,
          o = r.bottom - s;
        switch (t.position) {
          case "center":
            s = s - i / 2 + o;
            break;
          case "bottom":
            s = s - i + o * 1.4;
            break;
          case "top":
            s += o * 0.4;
        }
        e.scrollTo(null, s);
      },
      replayMacro: function (e, t, n) {
        var r = t.selectedCharacter,
          i = t.repeat,
          s = nt.macroModeState;
        r == "@" && (r = s.latestRegister);
        while (i--) zn(e, n, s, r);
      },
      enterMacroRecordMode: function (e, t) {
        var n = nt.macroModeState,
          r = t.selectedCharacter;
        n.enterMacroRecordMode(e, r);
      },
      enterInsertMode: function (e, t, n) {
        if (e.getOption("readOnly")) return;
        (n.insertMode = !0), (n.insertModeRepeat = (t && t.repeat) || 1);
        var r = t ? t.insertAt : null,
          i = n.sel,
          s = t.head || e.getCursor("head"),
          o = e.listSelections().length;
        if (r == "eol") s = E(s.line, Pt(e, s.line));
        else if (r == "charAfter") s = St(s, 0, 1);
        else if (r == "firstNonBlank")
          s = pt.moveToFirstNonWhiteSpaceCharacter(e, s);
        else if (r == "startOfSelectedArea")
          n.visualBlock
            ? ((s = E(
                Math.min(i.head.line, i.anchor.line),
                Math.min(i.head.ch, i.anchor.ch)
              )),
              (o = Math.abs(i.head.line - i.anchor.line) + 1))
            : i.head.line < i.anchor.line
            ? (s = i.head)
            : (s = E(i.anchor.line, 0));
        else if (r == "endOfSelectedArea")
          n.visualBlock
            ? ((s = E(
                Math.min(i.head.line, i.anchor.line),
                Math.max(i.head.ch + 1, i.anchor.ch)
              )),
              (o = Math.abs(i.head.line - i.anchor.line) + 1))
            : i.head.line >= i.anchor.line
            ? (s = St(i.head, 0, 1))
            : (s = E(i.anchor.line, 0));
        else if (r == "inplace" && n.visualMode) return;
        e.setOption("keyMap", "vim-insert"),
          e.setOption("disableInput", !1),
          t && t.replace
            ? (e.toggleOverwrite(!0),
              e.setOption("keyMap", "vim-replace"),
              v.signal(e, "vim-mode-change", { mode: "replace" }))
            : (e.setOption("keyMap", "vim-insert"),
              v.signal(e, "vim-mode-change", { mode: "insert" })),
          nt.macroModeState.isPlaying ||
            (e.on("change", $n), v.on(e.getInputField(), "keydown", Yn)),
          n.visualMode && $t(e),
          It(e, s, o);
      },
      toggleVisualMode: function (e, t, n) {
        var r = t.repeat,
          i = e.getCursor(),
          s;
        n.visualMode
          ? n.visualLine ^ t.linewise || n.visualBlock ^ t.blockwise
            ? ((n.visualLine = !!t.linewise),
              (n.visualBlock = !!t.blockwise),
              v.signal(e, "vim-mode-change", {
                mode: "visual",
                subMode: n.visualLine
                  ? "linewise"
                  : n.visualBlock
                  ? "blockwise"
                  : "",
              }),
              Wt(e))
            : $t(e)
          : ((n.visualMode = !0),
            (n.visualLine = !!t.linewise),
            (n.visualBlock = !!t.blockwise),
            (s = wt(e, E(i.line, i.ch + r - 1), !0)),
            (n.sel = { anchor: i, head: s }),
            v.signal(e, "vim-mode-change", {
              mode: "visual",
              subMode: n.visualLine
                ? "linewise"
                : n.visualBlock
                ? "blockwise"
                : "",
            }),
            Wt(e),
            an(e, n, "<", Mt(i, s)),
            an(e, n, ">", _t(i, s)));
      },
      reselectLastSelection: function (e, t, n) {
        var r = n.lastSelection;
        n.visualMode && Ut(e, n);
        if (r) {
          var i = r.anchorMark.find(),
            s = r.headMark.find();
          if (!i || !s) return;
          (n.sel = { anchor: i, head: s }),
            (n.visualMode = !0),
            (n.visualLine = r.visualLine),
            (n.visualBlock = r.visualBlock),
            Wt(e),
            an(e, n, "<", Mt(i, s)),
            an(e, n, ">", _t(i, s)),
            v.signal(e, "vim-mode-change", {
              mode: "visual",
              subMode: n.visualLine
                ? "linewise"
                : n.visualBlock
                ? "blockwise"
                : "",
            });
        }
      },
      joinLines: function (e, t, n) {
        var r, i;
        if (n.visualMode) {
          (r = e.getCursor("anchor")), (i = e.getCursor("head"));
          if (Ot(i, r)) {
            var s = i;
            (i = r), (r = s);
          }
          i.ch = Pt(e, i.line) - 1;
        } else {
          var o = Math.max(t.repeat, 2);
          (r = e.getCursor()), (i = wt(e, E(r.line + o - 1, Infinity)));
        }
        var u = 0;
        for (var a = r.line; a < i.line; a++) {
          u = Pt(e, r.line);
          var s = E(r.line + 1, Pt(e, r.line + 1)),
            f = e.getRange(r, s);
          (f = f.replace(/\n\s*/g, " ")), e.replaceRange(f, r, s);
        }
        var l = E(r.line, u);
        n.visualMode && $t(e, !1), e.setCursor(l);
      },
      newLineAndEnterInsertMode: function (e, t, n) {
        n.insertMode = !0;
        var r = Lt(e.getCursor());
        if (r.line === e.firstLine() && !t.after)
          e.replaceRange("\n", E(e.firstLine(), 0)),
            e.setCursor(e.firstLine(), 0);
        else {
          (r.line = t.after ? r.line : r.line - 1),
            (r.ch = Pt(e, r.line)),
            e.setCursor(r);
          var i =
            v.commands.newlineAndIndentContinueComment ||
            v.commands.newlineAndIndent;
          i(e);
        }
        this.enterInsertMode(e, { repeat: t.repeat }, n);
      },
      paste: function (e, t, n) {
        var r = Lt(e.getCursor()),
          i = nt.registerController.getRegister(t.registerName),
          s = i.toString();
        if (!s) return;
        if (t.matchIndent) {
          var o = e.getOption("tabSize"),
            u = function (e) {
              var t = e.split("	").length - 1,
                n = e.split(" ").length - 1;
              return t * o + n * 1;
            },
            a = e.getLine(e.getCursor().line),
            f = u(a.match(/^\s*/)[0]),
            l = s.replace(/\n$/, ""),
            c = s !== l,
            h = u(s.match(/^\s*/)[0]),
            s = l.replace(/^\s*/gm, function (t) {
              var n = f + (u(t) - h);
              if (n < 0) return "";
              if (e.getOption("indentWithTabs")) {
                var r = Math.floor(n / o);
                return Array(r + 1).join("	");
              }
              return Array(n + 1).join(" ");
            });
          s += c ? "\n" : "";
        }
        if (t.repeat > 1) var s = Array(t.repeat + 1).join(s);
        var p = i.linewise,
          d = i.blockwise;
        if (p && !d)
          n.visualMode
            ? (s = n.visualLine
                ? s.slice(0, -1)
                : "\n" + s.slice(0, s.length - 1) + "\n")
            : t.after
            ? ((s = "\n" + s.slice(0, s.length - 1)), (r.ch = Pt(e, r.line)))
            : (r.ch = 0);
        else {
          if (d) {
            s = s.split("\n");
            for (var v = 0; v < s.length; v++) s[v] = s[v] == "" ? " " : s[v];
          }
          r.ch += t.after ? 1 : 0;
        }
        var m, g;
        if (n.visualMode) {
          n.lastPastedText = s;
          var y,
            b = Rt(e, n),
            w = b[0],
            S = b[1],
            x = e.getSelection(),
            T = e.listSelections(),
            N = new Array(T.length).join("1").split("1");
          n.lastSelection && (y = n.lastSelection.headMark.find()),
            nt.registerController.unnamedRegister.setText(x),
            d
              ? (e.replaceSelections(N),
                (S = E(w.line + s.length - 1, w.ch)),
                e.setCursor(w),
                Ft(e, S),
                e.replaceSelections(s),
                (m = w))
              : n.visualBlock
              ? (e.replaceSelections(N),
                e.setCursor(w),
                e.replaceRange(s, w, w),
                (m = w))
              : (e.replaceRange(s, w, S),
                (m = e.posFromIndex(e.indexFromPos(w) + s.length - 1))),
            y && (n.lastSelection.headMark = e.setBookmark(y)),
            p && (m.ch = 0);
        } else if (d) {
          e.setCursor(r);
          for (var v = 0; v < s.length; v++) {
            var C = r.line + v;
            C > e.lastLine() && e.replaceRange("\n", E(C, 0));
            var k = Pt(e, C);
            k < r.ch && jt(e, C, r.ch);
          }
          e.setCursor(r),
            Ft(e, E(r.line + s.length - 1, r.ch)),
            e.replaceSelections(s),
            (m = r);
        } else
          e.replaceRange(s, r),
            p && t.after
              ? (m = E(r.line + 1, Qt(e.getLine(r.line + 1))))
              : p && !t.after
              ? (m = E(r.line, Qt(e.getLine(r.line))))
              : !p && t.after
              ? ((g = e.indexFromPos(r)),
                (m = e.posFromIndex(g + s.length - 1)))
              : ((g = e.indexFromPos(r)), (m = e.posFromIndex(g + s.length)));
        n.visualMode && $t(e, !1), e.setCursor(m);
      },
      undo: function (e, t) {
        e.operation(function () {
          kt(e, v.commands.undo, t.repeat)(),
            e.setCursor(e.getCursor("anchor"));
        });
      },
      redo: function (e, t) {
        kt(e, v.commands.redo, t.repeat)();
      },
      setRegister: function (e, t, n) {
        n.inputState.registerName = t.selectedCharacter;
      },
      setMark: function (e, t, n) {
        var r = t.selectedCharacter;
        an(e, n, r, e.getCursor());
      },
      replace: function (e, t, n) {
        var r = t.selectedCharacter,
          i = e.getCursor(),
          s,
          o,
          u = e.listSelections();
        if (n.visualMode) (i = e.getCursor("start")), (o = e.getCursor("end"));
        else {
          var a = e.getLine(i.line);
          (s = i.ch + t.repeat),
            s > a.length && (s = a.length),
            (o = E(i.line, s));
        }
        if (r == "\n")
          n.visualMode || e.replaceRange("", i, o),
            (
              v.commands.newlineAndIndentContinueComment ||
              v.commands.newlineAndIndent
            )(e);
        else {
          var f = e.getRange(i, o);
          f = f.replace(/[^\n]/g, r);
          if (n.visualBlock) {
            var l = new Array(e.getOption("tabSize") + 1).join(" ");
            (f = e.getSelection()),
              (f = f.replace(/\t/g, l).replace(/[^\n]/g, r).split("\n")),
              e.replaceSelections(f);
          } else e.replaceRange(f, i, o);
          n.visualMode
            ? ((i = Ot(u[0].anchor, u[0].head) ? u[0].anchor : u[0].head),
              e.setCursor(i),
              $t(e, !1))
            : e.setCursor(St(o, 0, -1));
        }
      },
      incrementNumberToken: function (e, t) {
        var n = e.getCursor(),
          r = e.getLine(n.line),
          i = /-?\d+/g,
          s,
          o,
          u,
          a,
          f;
        while ((s = i.exec(r)) !== null) {
          (f = s[0]), (o = s.index), (u = o + f.length);
          if (n.ch < u) break;
        }
        if (!t.backtrack && u <= n.ch) return;
        if (!f) return;
        var l = t.increase ? 1 : -1,
          c = parseInt(f) + l * t.repeat,
          h = E(n.line, o),
          p = E(n.line, u);
        (a = c.toString()),
          e.replaceRange(a, h, p),
          e.setCursor(E(n.line, o + a.length - 1));
      },
      repeatLastEdit: function (e, t, n) {
        var r = n.lastEditInputState;
        if (!r) return;
        var i = t.repeat;
        i && t.repeatIsExplicit
          ? (n.lastEditInputState.repeatOverride = i)
          : (i = n.lastEditInputState.repeatOverride || i),
          Zn(e, n, i, !1);
      },
      exitInsertMode: qn,
    },
    en = {
      "(": "bracket",
      ")": "bracket",
      "{": "bracket",
      "}": "bracket",
      "[": "section",
      "]": "section",
      "*": "comment",
      "/": "comment",
      m: "method",
      M: "method",
      "#": "preprocess",
    },
    tn = {
      bracket: {
        isComplete: function (e) {
          if (e.nextCh === e.symb) {
            e.depth++;
            if (e.depth >= 1) return !0;
          } else e.nextCh === e.reverseSymb && e.depth--;
          return !1;
        },
      },
      section: {
        init: function (e) {
          (e.curMoveThrough = !0),
            (e.symb = (e.forward ? "]" : "[") === e.symb ? "{" : "}");
        },
        isComplete: function (e) {
          return e.index === 0 && e.nextCh === e.symb;
        },
      },
      comment: {
        isComplete: function (e) {
          var t = e.lastCh === "*" && e.nextCh === "/";
          return (e.lastCh = e.nextCh), t;
        },
      },
      method: {
        init: function (e) {
          (e.symb = e.symb === "m" ? "{" : "}"),
            (e.reverseSymb = e.symb === "{" ? "}" : "{");
        },
        isComplete: function (e) {
          return e.nextCh === e.symb ? !0 : !1;
        },
      },
      preprocess: {
        init: function (e) {
          e.index = 0;
        },
        isComplete: function (e) {
          if (e.nextCh === "#") {
            var t = e.lineText.match(/#(\w+)/)[1];
            if (t === "endif") {
              if (e.forward && e.depth === 0) return !0;
              e.depth++;
            } else if (t === "if") {
              if (!e.forward && e.depth === 0) return !0;
              e.depth--;
            }
            if (t === "else" && e.depth === 0) return !0;
          }
          return !1;
        },
      },
    };
  K("pcre", !0, "boolean"),
    (pn.prototype = {
      getQuery: function () {
        return nt.query;
      },
      setQuery: function (e) {
        nt.query = e;
      },
      getOverlay: function () {
        return this.searchOverlay;
      },
      setOverlay: function (e) {
        this.searchOverlay = e;
      },
      isReversed: function () {
        return nt.isReversed;
      },
      setReversed: function (e) {
        nt.isReversed = e;
      },
      getScrollbarAnnotate: function () {
        return this.annotate;
      },
      setScrollbarAnnotate: function (e) {
        this.annotate = e;
      },
    });
  var bn = { "\\n": "\n", "\\r": "\r", "\\t": "	" },
    En = { "\\/": "/", "\\\\": "\\", "\\n": "\n", "\\r": "\r", "\\t": "	" },
    Cn = "(Javascript regexp)",
    Bn = function () {
      this.buildCommandMap_();
    };
  Bn.prototype = {
    processCommand: function (e, t, n) {
      var r = this;
      e.operation(function () {
        (e.curOp.isVimOp = !0), r._processCommand(e, t, n);
      });
    },
    _processCommand: function (e, t, n) {
      var r = e.state.vim,
        i = nt.registerController.getRegister(":"),
        s = i.toString();
      r.visualMode && $t(e);
      var o = new v.StringStream(t);
      i.setText(t);
      var u = n || {};
      u.input = t;
      try {
        this.parseInput_(e, o, u);
      } catch (a) {
        throw (Tn(e, a), a);
      }
      var f, l;
      if (!u.commandName) u.line !== undefined && (l = "move");
      else {
        f = this.matchCommand_(u.commandName);
        if (f) {
          (l = f.name),
            f.excludeFromCommandHistory && i.setText(s),
            this.parseCommandArgs_(o, u, f);
          if (f.type == "exToKey") {
            for (var c = 0; c < f.toKeys.length; c++)
              v.Vim.handleKey(e, f.toKeys[c], "mapping");
            return;
          }
          if (f.type == "exToEx") {
            this.processCommand(e, f.toInput);
            return;
          }
        }
      }
      if (!l) {
        Tn(e, 'Not an editor command ":' + t + '"');
        return;
      }
      try {
        jn[l](e, u), (!f || !f.possiblyAsync) && u.callback && u.callback();
      } catch (a) {
        throw (Tn(e, a), a);
      }
    },
    parseInput_: function (e, t, n) {
      t.eatWhile(":"),
        t.eat("%")
          ? ((n.line = e.firstLine()), (n.lineEnd = e.lastLine()))
          : ((n.line = this.parseLineSpec_(e, t)),
            n.line !== undefined &&
              t.eat(",") &&
              (n.lineEnd = this.parseLineSpec_(e, t)));
      var r = t.match(/^(\w+)/);
      return r ? (n.commandName = r[1]) : (n.commandName = t.match(/.*/)[0]), n;
    },
    parseLineSpec_: function (e, t) {
      var n = t.match(/^(\d+)/);
      if (n) return parseInt(n[1], 10) - 1;
      switch (t.next()) {
        case ".":
          return e.getCursor().line;
        case "$":
          return e.lastLine();
        case "'":
          var r = e.state.vim.marks[t.next()];
          if (r && r.find()) return r.find().line;
          throw new Error("Mark not set");
        default:
          return t.backUp(1), undefined;
      }
    },
    parseCommandArgs_: function (e, t, n) {
      if (e.eol()) return;
      t.argString = e.match(/.*/)[0];
      var r = n.argDelimiter || /\s+/,
        i = Ht(t.argString).split(r);
      i.length && i[0] && (t.args = i);
    },
    matchCommand_: function (e) {
      for (var t = e.length; t > 0; t--) {
        var n = e.substring(0, t);
        if (this.commandMap_[n]) {
          var r = this.commandMap_[n];
          if (r.name.indexOf(e) === 0) return r;
        }
      }
      return null;
    },
    buildCommandMap_: function () {
      this.commandMap_ = {};
      for (var e = 0; e < w.length; e++) {
        var t = w[e],
          n = t.shortName || t.name;
        this.commandMap_[n] = t;
      }
    },
    map: function (e, t, n) {
      if (e != ":" && e.charAt(0) == ":") {
        if (n) throw Error("Mode not supported for ex mappings");
        var r = e.substring(1);
        t != ":" && t.charAt(0) == ":"
          ? (this.commandMap_[r] = {
              name: r,
              type: "exToEx",
              toInput: t.substring(1),
              user: !0,
            })
          : (this.commandMap_[r] = {
              name: r,
              type: "exToKey",
              toKeys: t,
              user: !0,
            });
      } else if (t != ":" && t.charAt(0) == ":") {
        var i = {
          keys: e,
          type: "keyToEx",
          exArgs: { input: t.substring(1) },
          user: !0,
        };
        n && (i.context = n), b.unshift(i);
      } else {
        var i = { keys: e, type: "keyToKey", toKeys: t, user: !0 };
        n && (i.context = n), b.unshift(i);
      }
    },
    unmap: function (e, t) {
      if (e != ":" && e.charAt(0) == ":") {
        if (t) throw Error("Mode not supported for ex mappings");
        var n = e.substring(1);
        if (this.commandMap_[n] && this.commandMap_[n].user) {
          delete this.commandMap_[n];
          return;
        }
      } else {
        var r = e;
        for (var i = 0; i < b.length; i++)
          if (r == b[i].keys && b[i].context === t && b[i].user) {
            b.splice(i, 1);
            return;
          }
      }
    },
  };
  var jn = {
      colorscheme: function (e, t) {
        if (!t.args || t.args.length < 1) {
          Tn(e, e.getOption("theme"));
          return;
        }
        e.setOption("theme", t.args[0]);
      },
      map: function (e, t, n) {
        var r = t.args;
        if (!r || r.length < 2) {
          e && Tn(e, "Invalid mapping: " + t.input);
          return;
        }
        Fn.map(r[0], r[1], n);
      },
      imap: function (e, t) {
        this.map(e, t, "insert");
      },
      nmap: function (e, t) {
        this.map(e, t, "normal");
      },
      vmap: function (e, t) {
        this.map(e, t, "visual");
      },
      unmap: function (e, t, n) {
        var r = t.args;
        if (!r || r.length < 1) {
          e && Tn(e, "No such mapping: " + t.input);
          return;
        }
        Fn.unmap(r[0], n);
      },
      move: function (e, t) {
        ht.processCommand(e, e.state.vim, {
          type: "motion",
          motion: "moveToLineOrEdgeOfDocument",
          motionArgs: { forward: !1, explicitRepeat: !0, linewise: !0 },
          repeatOverride: t.line + 1,
        });
      },
      set: function (e, t) {
        var n = t.args,
          r = t.setCfg || {};
        if (!n || n.length < 1) {
          e && Tn(e, "Invalid mapping: " + t.input);
          return;
        }
        var i = n[0].split("="),
          s = i[0],
          o = i[1],
          u = !1;
        if (s.charAt(s.length - 1) == "?") {
          if (o) throw Error("Trailing characters: " + t.argString);
          (s = s.substring(0, s.length - 1)), (u = !0);
        }
        o === undefined &&
          s.substring(0, 2) == "no" &&
          ((s = s.substring(2)), (o = !1));
        var a = J[s] && J[s].type == "boolean";
        a && o == undefined && (o = !0);
        if ((!a && o === undefined) || u) {
          var f = G(s, e, r);
          f === !0 || f === !1
            ? Tn(e, " " + (f ? "" : "no") + s)
            : Tn(e, "  " + s + "=" + f);
        } else Q(s, o, e, r);
      },
      setlocal: function (e, t) {
        (t.setCfg = { scope: "local" }), this.set(e, t);
      },
      setglobal: function (e, t) {
        (t.setCfg = { scope: "global" }), this.set(e, t);
      },
      registers: function (e, t) {
        var n = t.args,
          r = nt.registerController.registers,
          i = "----------Registers----------<br><br>";
        if (!n)
          for (var s in r) {
            var o = r[s].toString();
            o.length && (i += '"' + s + "    " + o + "<br>");
          }
        else {
          var s;
          n = n.join("");
          for (var u = 0; u < n.length; u++) {
            s = n.charAt(u);
            if (!nt.registerController.isValidRegister(s)) continue;
            var a = r[s] || new at();
            i += '"' + s + "    " + a.toString() + "<br>";
          }
        }
        Tn(e, i);
      },
      sort: function (e, t) {
        function o() {
          if (t.argString) {
            var e = new v.StringStream(t.argString);
            e.eat("!") && (n = !0);
            if (e.eol()) return;
            if (!e.eatSpace()) return "Invalid arguments";
            var o = e.match(/[a-z]+/);
            if (o) {
              (o = o[0]),
                (r = o.indexOf("i") != -1),
                (i = o.indexOf("u") != -1);
              var u = o.indexOf("d") != -1 && 1,
                a = o.indexOf("x") != -1 && 1,
                f = o.indexOf("o") != -1 && 1;
              if (u + a + f > 1) return "Invalid arguments";
              s = (u && "decimal") || (a && "hex") || (f && "octal");
            }
            if (e.match(/\/.*\//)) return "patterns not supported";
          }
        }
        function b(e, t) {
          if (n) {
            var i;
            (i = e), (e = t), (t = i);
          }
          r && ((e = e.toLowerCase()), (t = t.toLowerCase()));
          var o = s && p.exec(e),
            u = s && p.exec(t);
          return o
            ? ((o = parseInt((o[1] + o[2]).toLowerCase(), d)),
              (u = parseInt((u[1] + u[2]).toLowerCase(), d)),
              o - u)
            : e < t
            ? -1
            : 1;
        }
        var n,
          r,
          i,
          s,
          u = o();
        if (u) {
          Tn(e, u + ": " + t.argString);
          return;
        }
        var a = t.line || e.firstLine(),
          f = t.lineEnd || t.line || e.lastLine();
        if (a == f) return;
        var l = E(a, 0),
          c = E(f, Pt(e, f)),
          h = e.getRange(l, c).split("\n"),
          p =
            s == "decimal"
              ? /(-?)([\d]+)/
              : s == "hex"
              ? /(-?)(?:0x)?([0-9a-f]+)/i
              : s == "octal"
              ? /([0-7]+)/
              : null,
          d = s == "decimal" ? 10 : s == "hex" ? 16 : s == "octal" ? 8 : null,
          m = [],
          g = [];
        if (s)
          for (var y = 0; y < h.length; y++)
            p.exec(h[y]) ? m.push(h[y]) : g.push(h[y]);
        else g = h;
        m.sort(b), g.sort(b), (h = n ? m.concat(g) : g.concat(m));
        if (i) {
          var w = h,
            S;
          h = [];
          for (var y = 0; y < w.length; y++)
            w[y] != S && h.push(w[y]), (S = w[y]);
        }
        e.replaceRange(h.join("\n"), l, c);
      },
      global: function (e, t) {
        var n = t.argString;
        if (!n) {
          Tn(e, "Regular Expression missing from global");
          return;
        }
        var r = t.line !== undefined ? t.line : e.firstLine(),
          i = t.lineEnd || t.line || e.lastLine(),
          s = mn(n),
          o = n,
          u;
        s.length && ((o = s[0]), (u = s.slice(1, s.length).join("/")));
        if (o)
          try {
            An(e, o, !0, !0);
          } catch (a) {
            Tn(e, "Invalid regex: " + o);
            return;
          }
        var f = dn(e).getQuery(),
          l = [],
          c = "";
        for (var h = r; h <= i; h++) {
          var p = f.test(e.getLine(h));
          p && (l.push(h + 1), (c += e.getLine(h) + "<br>"));
        }
        if (!u) {
          Tn(e, c);
          return;
        }
        var d = 0,
          v = function () {
            if (d < l.length) {
              var t = l[d] + u;
              Fn.processCommand(e, t, { callback: v });
            }
            d++;
          };
        v();
      },
      substitute: function (e, t) {
        if (!e.getSearchCursor)
          throw new Error(
            "Search feature not available. Requires searchcursor.js or any other getSearchCursor implementation."
          );
        var n = t.argString,
          r = n ? mn(n) : [],
          i,
          s = "",
          o,
          u,
          a,
          f = !1,
          l = !1;
        if (r.length)
          (i = r[0]),
            (s = r[1]),
            s !== undefined &&
              (G("pcre") ? (s = Sn(s)) : (s = wn(s)),
              (nt.lastSubstituteReplacePart = s)),
            (o = r[2] ? r[2].split(" ") : []);
        else if (n && n.length) {
          Tn(e, "Substitutions should be of the form :s/pattern/replace/");
          return;
        }
        o &&
          ((u = o[0]),
          (a = parseInt(o[1])),
          u &&
            (u.indexOf("c") != -1 && ((f = !0), u.replace("c", "")),
            u.indexOf("g") != -1 && ((l = !0), u.replace("g", "")),
            (i = i + "/" + u)));
        if (i)
          try {
            An(e, i, !0, !0);
          } catch (c) {
            Tn(e, "Invalid regex: " + i);
            return;
          }
        s = s || nt.lastSubstituteReplacePart;
        if (s === undefined) {
          Tn(e, "No previous substitute regular expression");
          return;
        }
        var h = dn(e),
          p = h.getQuery(),
          d = t.line !== undefined ? t.line : e.getCursor().line,
          v = t.lineEnd || d;
        d == e.firstLine() && v == e.lastLine() && (v = Infinity),
          a && ((d = v), (v = d + a - 1));
        var m = wt(e, E(d, 0)),
          g = e.getSearchCursor(p, m);
        In(e, f, l, d, v, g, p, s, t.callback);
      },
      redo: v.commands.redo,
      undo: v.commands.undo,
      write: function (e) {
        v.commands.save ? v.commands.save(e) : e.save();
      },
      nohlsearch: function (e) {
        Dn(e);
      },
      delmarks: function (e, t) {
        if (!t.argString || !Ht(t.argString)) {
          Tn(e, "Argument required");
          return;
        }
        var n = e.state.vim,
          r = new v.StringStream(Ht(t.argString));
        while (!r.eol()) {
          r.eatSpace();
          var i = r.pos;
          if (!r.match(/[a-zA-Z]/, !1)) {
            Tn(e, "Invalid argument: " + t.argString.substring(i));
            return;
          }
          var s = r.next();
          if (r.match("-", !0)) {
            if (!r.match(/[a-zA-Z]/, !1)) {
              Tn(e, "Invalid argument: " + t.argString.substring(i));
              return;
            }
            var o = s,
              u = r.next();
            if (!((U(o) && U(u)) || (X(o) && X(u)))) {
              Tn(e, "Invalid argument: " + o + "-");
              return;
            }
            var a = o.charCodeAt(0),
              f = u.charCodeAt(0);
            if (a >= f) {
              Tn(e, "Invalid argument: " + t.argString.substring(i));
              return;
            }
            for (var l = 0; l <= f - a; l++) {
              var c = String.fromCharCode(a + l);
              delete n.marks[c];
            }
          } else delete n.marks[s];
        }
      },
    },
    Fn = new Bn();
  (v.keyMap.vim = { attach: C, detach: N, call: k }),
    K("insertModeEscKeysTimeout", 200, "number"),
    (v.keyMap["vim-insert"] = {
      "Ctrl-N": "autocomplete",
      "Ctrl-P": "autocomplete",
      Enter: function (e) {
        var t =
          v.commands.newlineAndIndentContinueComment ||
          v.commands.newlineAndIndent;
        t(e);
      },
      fallthrough: ["default"],
      attach: C,
      detach: N,
      call: k,
    }),
    (v.keyMap["vim-replace"] = {
      Backspace: "goCharLeft",
      fallthrough: ["vim-insert"],
      attach: C,
      detach: N,
      call: k,
    }),
    rt(),
    (v.Vim = S()),
    (S = v.Vim);
  var tr = {
      return: "CR",
      backspace: "BS",
      delete: "Del",
      esc: "Esc",
      left: "Left",
      right: "Right",
      up: "Up",
      down: "Down",
      space: "Space",
      home: "Home",
      end: "End",
      pageup: "PageUp",
      pagedown: "PageDown",
      enter: "CR",
    },
    rr = S.handleKey.bind(S);
  (S.handleKey = function (e, t, n) {
    return e.operation(function () {
      return rr(e, t, n);
    }, !0);
  }),
    (t.CodeMirror = v);
  var or = S.maybeInitVimState_;
  t.handler = {
    $id: "ace/keyboard/vim",
    drawCursor: function (e, t, n, r, s) {
      var o = this.state.vim || {},
        u = n.characterWidth,
        a = n.lineHeight,
        f = t.top,
        l = t.left;
      if (!o.insertMode) {
        var c = r.cursor
          ? i.comparePoints(r.cursor, r.start) <= 0
          : s.selection.isBackwards() || s.selection.isEmpty();
        !c && l > u && (l -= u);
      }
      !o.insertMode && o.status && ((a /= 2), (f += a)),
        (e.left = l + "px"),
        (e.top = f + "px"),
        (e.width = u + "px"),
        (e.height = a + "px");
    },
    handleKeyboard: function (e, t, n, r, i) {
      var s = e.editor,
        o = s.state.cm,
        u = or(o);
      if (r == -1) return;
      if (n == "c" && t == 1) {
        if (!c.isMac && s.getCopyText())
          return (
            s.once("copy", function () {
              s.selection.clearSelection();
            }),
            { command: "null", passEvent: !0 }
          );
      } else
        u.insertMode ||
          (c.isMac &&
            this.handleMacRepeat(e, t, n) &&
            ((t = -1), (n = e.inputChar)));
      if (t == -1 || t & 1 || (t === 0 && n.length > 1)) {
        var a = u.insertMode,
          f = nr(t, n, i || {});
        u.status == null && (u.status = "");
        var l = sr(o, f, "user");
        (u = or(o)),
          l && u.status != null
            ? (u.status += f)
            : u.status == null && (u.status = ""),
          o._signal("changeStatus");
        if (!l && (t != -1 || a)) return;
        return { command: "null", passEvent: !l };
      }
    },
    attach: function (e) {
      e.state || (e.state = {});
      var t = new v(e);
      (e.state.cm = t),
        (e.$vimModeHandler = this),
        v.keyMap.vim.attach(t),
        (or(t).status = null),
        t.on("vim-command-done", function () {
          if (t.virtualSelectionMode()) return;
          (or(t).status = null),
            t.ace._signal("changeStatus"),
            t.ace.session.markUndoGroup();
        }),
        t.on("changeStatus", function () {
          t.ace.renderer.updateCursor(), t.ace._signal("changeStatus");
        }),
        t.on("vim-mode-change", function () {
          if (t.virtualSelectionMode()) return;
          t.ace.renderer.setStyle("normal-mode", !or(t).insertMode),
            t._signal("changeStatus");
        }),
        t.ace.renderer.setStyle("normal-mode", !or(t).insertMode),
        (e.renderer.$cursorLayer.drawCursor = this.drawCursor.bind(t)),
        this.updateMacCompositionHandlers(e, !0);
    },
    detach: function (e) {
      var t = e.state.cm;
      v.keyMap.vim.detach(t),
        t.destroy(),
        (e.state.cm = null),
        (e.$vimModeHandler = null),
        (e.renderer.$cursorLayer.drawCursor = null),
        e.renderer.setStyle("normal-mode", !1),
        this.updateMacCompositionHandlers(e, !1);
    },
    getStatusText: function (e) {
      var t = e.state.cm,
        n = or(t);
      if (n.insertMode) return "INSERT";
      var r = "";
      return (
        n.visualMode &&
          ((r += "VISUAL"),
          n.visualLine && (r += " LINE"),
          n.visualBlock && (r += " BLOCK")),
        n.status && (r += (r ? " " : "") + n.status),
        r
      );
    },
    handleMacRepeat: function (e, t, n) {
      if (t == -1) (e.inputChar = n), (e.lastEvent = "input");
      else if (e.inputChar && e.$lastHash == t && e.$lastKey == n) {
        if (e.lastEvent == "input") e.lastEvent = "input1";
        else if (e.lastEvent == "input1") return !0;
      } else (e.$lastHash = t), (e.$lastKey = n), (e.lastEvent = "keypress");
    },
    updateMacCompositionHandlers: function (e, t) {
      var n = function (t) {
          var n = e.state.cm,
            r = or(n);
          if (!r.insertMode) {
            var i = this.textInput.getElement();
            i.blur(), i.focus(), (i.value = t);
          } else this.onCompositionUpdateOrig(t);
        },
        r = function (t) {
          var n = e.state.cm,
            r = or(n);
          r.insertMode || this.onCompositionStartOrig(t);
        };
      t
        ? e.onCompositionUpdateOrig ||
          ((e.onCompositionUpdateOrig = e.onCompositionUpdate),
          (e.onCompositionUpdate = n),
          (e.onCompositionStartOrig = e.onCompositionStart),
          (e.onCompositionStart = r))
        : e.onCompositionUpdateOrig &&
          ((e.onCompositionUpdate = e.onCompositionUpdateOrig),
          (e.onCompositionUpdateOrig = null),
          (e.onCompositionStart = e.onCompositionStartOrig),
          (e.onCompositionStartOrig = null));
    },
  };
  var ur = {
    getText: function (e, t) {
      return (
        (Math.abs(e.selection.lead.row - t) ||
          t + 1 + (t < 9 ? "\u00b7" : "")) + ""
      );
    },
    getWidth: function (e, t, n) {
      return e.getLength().toString().length * n.characterWidth;
    },
    update: function (e, t) {
      t.renderer.$loop.schedule(t.renderer.CHANGE_GUTTER);
    },
    attach: function (e) {
      (e.renderer.$gutterLayer.$renderer = this),
        e.on("changeSelection", this.update);
    },
    detach: function (e) {
      (e.renderer.$gutterLayer.$renderer = null),
        e.off("changeSelection", this.update);
    },
  };
  S.defineOption(
    {
      name: "wrap",
      set: function (e, t) {
        t && t.ace.setOption("wrap", e);
      },
      type: "boolean",
    },
    !1
  ),
    S.defineEx("write", "w", function () {
      console.log(":write is not implemented");
    }),
    b.push(
      { keys: "zc", type: "action", action: "fold", actionArgs: { open: !1 } },
      {
        keys: "zC",
        type: "action",
        action: "fold",
        actionArgs: { open: !1, all: !0 },
      },
      { keys: "zo", type: "action", action: "fold", actionArgs: { open: !0 } },
      {
        keys: "zO",
        type: "action",
        action: "fold",
        actionArgs: { open: !0, all: !0 },
      },
      {
        keys: "za",
        type: "action",
        action: "fold",
        actionArgs: { toggle: !0 },
      },
      {
        keys: "zA",
        type: "action",
        action: "fold",
        actionArgs: { toggle: !0, all: !0 },
      },
      {
        keys: "zf",
        type: "action",
        action: "fold",
        actionArgs: { open: !0, all: !0 },
      },
      {
        keys: "zd",
        type: "action",
        action: "fold",
        actionArgs: { open: !0, all: !0 },
      },
      {
        keys: "<C-A-k>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "addCursorAbove" },
      },
      {
        keys: "<C-A-j>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "addCursorBelow" },
      },
      {
        keys: "<C-A-S-k>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "addCursorAboveSkipCurrent" },
      },
      {
        keys: "<C-A-S-j>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "addCursorBelowSkipCurrent" },
      },
      {
        keys: "<C-A-h>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "selectMoreBefore" },
      },
      {
        keys: "<C-A-l>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "selectMoreAfter" },
      },
      {
        keys: "<C-A-S-h>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "selectNextBefore" },
      },
      {
        keys: "<C-A-S-l>",
        type: "action",
        action: "aceCommand",
        actionArgs: { name: "selectNextAfter" },
      }
    ),
    (yt.aceCommand = function (e, t, n) {
      (e.vimCmd = t),
        e.ace.inVirtualSelectionMode
          ? e.ace.on("beforeEndOperation", ar)
          : ar(null, e.ace);
    }),
    (yt.fold = function (e, t, n) {
      e.ace.execCommand(
        ["toggleFoldWidget", "toggleFoldWidget", "foldOther", "unfoldall"][
          (t.all ? 2 : 0) + (t.open ? 1 : 0)
        ]
      );
    }),
    (t.handler.defaultKeymap = b),
    (t.handler.actions = yt),
    (t.Vim = S),
    S.map("Y", "yy", "normal");
});

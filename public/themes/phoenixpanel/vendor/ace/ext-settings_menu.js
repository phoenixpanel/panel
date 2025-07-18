define(
  "ace/ext/menu_tools/element_generator",
  ["require", "exports", "module"],
  function (e, t, n) {
    "use strict";
    (n.exports.createOption = function (t) {
      var n,
        r = document.createElement("option");
      for (n in t)
        t.hasOwnProperty(n) &&
          (n === "selected" ? r.setAttribute(n, t[n]) : (r[n] = t[n]));
      return r;
    }),
      (n.exports.createCheckbox = function (t, n, r) {
        var i = document.createElement("input");
        return (
          i.setAttribute("type", "checkbox"),
          i.setAttribute("id", t),
          i.setAttribute("name", t),
          i.setAttribute("value", n),
          i.setAttribute("class", r),
          n && i.setAttribute("checked", "checked"),
          i
        );
      }),
      (n.exports.createInput = function (t, n, r) {
        var i = document.createElement("input");
        return (
          i.setAttribute("type", "text"),
          i.setAttribute("id", t),
          i.setAttribute("name", t),
          i.setAttribute("value", n),
          i.setAttribute("class", r),
          i
        );
      }),
      (n.exports.createLabel = function (t, n) {
        var r = document.createElement("label");
        return r.setAttribute("for", n), (r.textContent = t), r;
      }),
      (n.exports.createSelection = function (t, r, i) {
        var s = document.createElement("select");
        return (
          s.setAttribute("id", t),
          s.setAttribute("name", t),
          s.setAttribute("class", i),
          r.forEach(function (e) {
            s.appendChild(n.exports.createOption(e));
          }),
          s
        );
      });
  }
),
  define(
    "ace/ext/modelist",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      function i(e) {
        var t = a.text,
          n = e.split(/[\/\\]/).pop();
        for (var i = 0; i < r.length; i++)
          if (r[i].supportsFile(n)) {
            t = r[i];
            break;
          }
        return t;
      }
      var r = [],
        s = function (e, t, n) {
          (this.name = e),
            (this.caption = t),
            (this.mode = "ace/mode/" + e),
            (this.extensions = n);
          var r;
          /\^/.test(n)
            ? (r =
                n.replace(/\|(\^)?/g, function (e, t) {
                  return "$|" + (t ? "^" : "^.*\\.");
                }) + "$")
            : (r = "^.*\\.(" + n + ")$"),
            (this.extRe = new RegExp(r, "gi"));
        };
      s.prototype.supportsFile = function (e) {
        return e.match(this.extRe);
      };
      var o = {
          ABAP: ["abap"],
          ABC: ["abc"],
          ActionScript: ["as"],
          ADA: ["ada|adb"],
          Apache_Conf: [
            "^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd",
          ],
          AsciiDoc: ["asciidoc|adoc"],
          Assembly_x86: ["asm|a"],
          AutoHotKey: ["ahk"],
          BatchFile: ["bat|cmd"],
          Bro: ["bro"],
          C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
          C9Search: ["c9search_results"],
          Cirru: ["cirru|cr"],
          Clojure: ["clj|cljs"],
          Cobol: ["CBL|COB"],
          coffee: ["coffee|cf|cson|^Cakefile"],
          ColdFusion: ["cfm"],
          CSharp: ["cs"],
          CSS: ["css"],
          Curly: ["curly"],
          D: ["d|di"],
          Dart: ["dart"],
          Diff: ["diff|patch"],
          Dockerfile: ["^Dockerfile"],
          Dot: ["dot"],
          Drools: ["drl"],
          Dummy: ["dummy"],
          DummySyntax: ["dummy"],
          Eiffel: ["e|ge"],
          EJS: ["ejs"],
          Elixir: ["ex|exs"],
          Elm: ["elm"],
          Erlang: ["erl|hrl"],
          Forth: ["frt|fs|ldr|fth|4th"],
          Fortran: ["f|f90"],
          FTL: ["ftl"],
          Gcode: ["gcode"],
          Gherkin: ["feature"],
          Gitignore: ["^.gitignore"],
          Glsl: ["glsl|frag|vert"],
          Gobstones: ["gbs"],
          golang: ["go"],
          Groovy: ["groovy"],
          HAML: ["haml"],
          Handlebars: ["hbs|handlebars|tpl|mustache"],
          Haskell: ["hs"],
          Haskell_Cabal: ["cabal"],
          haXe: ["hx"],
          Hjson: ["hjson"],
          HTML: ["html|htm|xhtml"],
          HTML_Elixir: ["eex|html.eex"],
          HTML_Ruby: ["erb|rhtml|html.erb"],
          INI: ["ini|conf|cfg|prefs"],
          Io: ["io"],
          Jack: ["jack"],
          Jade: ["jade|pug"],
          Java: ["java"],
          JavaScript: ["js|jsm|jsx"],
          JSON: ["json"],
          JSONiq: ["jq"],
          JSP: ["jsp"],
          JSX: ["jsx"],
          Julia: ["jl"],
          Kotlin: ["kt|kts"],
          LaTeX: ["tex|latex|ltx|bib"],
          LESS: ["less"],
          Liquid: ["liquid"],
          Lisp: ["lisp"],
          LiveScript: ["ls"],
          LogiQL: ["logic|lql"],
          LSL: ["lsl"],
          Lua: ["lua"],
          LuaPage: ["lp"],
          Lucene: ["lucene"],
          Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
          Markdown: ["md|markdown"],
          Mask: ["mask"],
          MATLAB: ["matlab"],
          Maze: ["mz"],
          MEL: ["mel"],
          MUSHCode: ["mc|mush"],
          MySQL: ["mysql"],
          Nix: ["nix"],
          NSIS: ["nsi|nsh"],
          ObjectiveC: ["m|mm"],
          OCaml: ["ml|mli"],
          Pascal: ["pas|p"],
          Perl: ["pl|pm"],
          pgSQL: ["pgsql"],
          PHP: ["php|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
          Powershell: ["ps1"],
          Praat: ["praat|praatscript|psc|proc"],
          Prolog: ["plg|prolog"],
          Properties: ["properties"],
          Protobuf: ["proto"],
          Python: ["py"],
          R: ["r"],
          Razor: ["cshtml|asp"],
          RDoc: ["Rd"],
          RHTML: ["Rhtml"],
          RST: ["rst"],
          Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
          Rust: ["rs"],
          SASS: ["sass"],
          SCAD: ["scad"],
          Scala: ["scala"],
          Scheme: ["scm|sm|rkt|oak|scheme"],
          SCSS: ["scss"],
          SH: ["sh|bash|^.bashrc"],
          SJS: ["sjs"],
          Smarty: ["smarty|tpl"],
          snippets: ["snippets"],
          Soy_Template: ["soy"],
          Space: ["space"],
          SQL: ["sql"],
          SQLServer: ["sqlserver"],
          Stylus: ["styl|stylus"],
          SVG: ["svg"],
          Swift: ["swift"],
          Tcl: ["tcl"],
          Tex: ["tex"],
          Text: ["txt"],
          Textile: ["textile"],
          Toml: ["toml"],
          TSX: ["tsx"],
          Twig: ["twig|swig"],
          Typescript: ["ts|typescript|str"],
          Vala: ["vala"],
          VBScript: ["vbs|vb"],
          Velocity: ["vm"],
          Verilog: ["v|vh|sv|svh"],
          VHDL: ["vhd|vhdl"],
          Wollok: ["wlk|wpgm|wtest"],
          XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
          XQuery: ["xq"],
          YAML: ["yaml|yml"],
          Django: ["html"],
        },
        u = {
          ObjectiveC: "Objective-C",
          CSharp: "C#",
          golang: "Go",
          C_Cpp: "C and C++",
          coffee: "CoffeeScript",
          HTML_Ruby: "HTML (Ruby)",
          HTML_Elixir: "HTML (Elixir)",
          FTL: "FreeMarker",
        },
        a = {};
      for (var f in o) {
        var l = o[f],
          c = (u[f] || f).replace(/_/g, " "),
          h = f.toLowerCase(),
          p = new s(h, c, l[0]);
        (a[h] = p), r.push(p);
      }
      n.exports = { getModeForPath: i, modes: r, modesByName: a };
    }
  ),
  define(
    "ace/ext/themelist",
    ["require", "exports", "module", "ace/lib/fixoldbrowsers"],
    function (e, t, n) {
      "use strict";
      e("ace/lib/fixoldbrowsers");
      var r = [
        ["Chrome"],
        ["Clouds"],
        ["Crimson Editor"],
        ["Dawn"],
        ["Dreamweaver"],
        ["Eclipse"],
        ["GitHub"],
        ["IPlastic"],
        ["Solarized Light"],
        ["TextMate"],
        ["Tomorrow"],
        ["XCode"],
        ["Kuroir"],
        ["KatzenMilch"],
        ["SQL Server", "sqlserver", "light"],
        ["Ambiance", "ambiance", "dark"],
        ["Chaos", "chaos", "dark"],
        ["Clouds Midnight", "clouds_midnight", "dark"],
        ["Cobalt", "cobalt", "dark"],
        ["Gruvbox", "gruvbox", "dark"],
        ["idle Fingers", "idle_fingers", "dark"],
        ["krTheme", "kr_theme", "dark"],
        ["Merbivore", "merbivore", "dark"],
        ["Merbivore Soft", "merbivore_soft", "dark"],
        ["Mono Industrial", "mono_industrial", "dark"],
        ["Monokai", "monokai", "dark"],
        ["Pastel on dark", "pastel_on_dark", "dark"],
        ["Solarized Dark", "solarized_dark", "dark"],
        ["Terminal", "terminal", "dark"],
        ["Tomorrow Night", "tomorrow_night", "dark"],
        ["Tomorrow Night Blue", "tomorrow_night_blue", "dark"],
        ["Tomorrow Night Bright", "tomorrow_night_bright", "dark"],
        ["Tomorrow Night 80s", "tomorrow_night_eighties", "dark"],
        ["Twilight", "twilight", "dark"],
        ["Vibrant Ink", "vibrant_ink", "dark"],
      ];
      (t.themesByName = {}),
        (t.themes = r.map(function (e) {
          var n = e[1] || e[0].replace(/ /g, "_").toLowerCase(),
            r = {
              caption: e[0],
              theme: "ace/theme/" + n,
              isDark: e[2] == "dark",
              name: n,
            };
          return (t.themesByName[n] = r), r;
        }));
    }
  ),
  define(
    "ace/ext/menu_tools/add_editor_menu_options",
    ["require", "exports", "module", "ace/ext/modelist", "ace/ext/themelist"],
    function (e, t, n) {
      "use strict";
      n.exports.addEditorMenuOptions = function (n) {
        var r = e("../modelist"),
          i = e("../themelist");
        (n.menuOptions = {
          setNewLineMode: [
            { textContent: "unix", value: "unix" },
            { textContent: "windows", value: "windows" },
            { textContent: "auto", value: "auto" },
          ],
          setTheme: [],
          setMode: [],
          setKeyboardHandler: [
            { textContent: "ace", value: "" },
            { textContent: "vim", value: "ace/keyboard/vim" },
            { textContent: "emacs", value: "ace/keyboard/emacs" },
            { textContent: "textarea", value: "ace/keyboard/textarea" },
            { textContent: "sublime", value: "ace/keyboard/sublime" },
          ],
        }),
          (n.menuOptions.setTheme = i.themes.map(function (e) {
            return { textContent: e.caption, value: e.theme };
          })),
          (n.menuOptions.setMode = r.modes.map(function (e) {
            return { textContent: e.name, value: e.mode };
          }));
      };
    }
  ),
  define(
    "ace/ext/menu_tools/get_set_functions",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      n.exports.getSetFunctions = function (t) {
        var n = [],
          r = { editor: t, session: t.session, renderer: t.renderer },
          i = [],
          s = [
            "setOption",
            "setUndoManager",
            "setDocument",
            "setValue",
            "setBreakpoints",
            "setScrollTop",
            "setScrollLeft",
            "setSelectionStyle",
            "setWrapLimitRange",
          ];
        return (
          ["renderer", "session", "editor"].forEach(function (e) {
            var t = r[e],
              o = e;
            for (var u in t)
              s.indexOf(u) === -1 &&
                /^set/.test(u) &&
                i.indexOf(u) === -1 &&
                (i.push(u),
                n.push({ functionName: u, parentObj: t, parentName: o }));
          }),
          n
        );
      };
    }
  ),
  define(
    "ace/ext/menu_tools/generate_settings_menu",
    [
      "require",
      "exports",
      "module",
      "ace/ext/menu_tools/element_generator",
      "ace/ext/menu_tools/add_editor_menu_options",
      "ace/ext/menu_tools/get_set_functions",
      "ace/ace",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("./element_generator"),
        i = e("./add_editor_menu_options").addEditorMenuOptions,
        s = e("./get_set_functions").getSetFunctions;
      n.exports.generateSettingsMenu = function (n) {
        function u() {
          o.sort(function (e, t) {
            var n = e.getAttribute("contains"),
              r = t.getAttribute("contains");
            return n.localeCompare(r);
          });
        }
        function a() {
          var t = document.createElement("div");
          t.setAttribute("id", "ace_settingsmenu"),
            o.forEach(function (e) {
              t.appendChild(e);
            });
          var n = t.appendChild(document.createElement("div")),
            r = e("../../ace").version;
          return (
            (n.style.padding = "1em"), (n.textContent = "Ace version " + r), t
          );
        }
        function f(e, t, i, s) {
          var o,
            u = document.createElement("div");
          return (
            u.setAttribute("contains", i),
            u.setAttribute("class", "ace_optionsMenuEntry"),
            u.setAttribute("style", "clear: both;"),
            u.appendChild(
              r.createLabel(
                i
                  .replace(/^set/, "")
                  .replace(/([A-Z])/g, " $1")
                  .trim(),
                i
              )
            ),
            Array.isArray(s)
              ? ((o = r.createSelection(i, s, t)),
                o.addEventListener("change", function (t) {
                  try {
                    n.menuOptions[t.target.id].forEach(function (e) {
                      e.textContent !== t.target.textContent &&
                        delete e.selected;
                    }),
                      e[t.target.id](t.target.value);
                  } catch (r) {
                    throw new Error(r);
                  }
                }))
              : typeof s == "boolean"
              ? ((o = r.createCheckbox(i, s, t)),
                o.addEventListener("change", function (t) {
                  try {
                    e[t.target.id](!!t.target.checked);
                  } catch (n) {
                    throw new Error(n);
                  }
                }))
              : ((o = r.createInput(i, s, t)),
                o.addEventListener("change", function (t) {
                  try {
                    t.target.value === "true"
                      ? e[t.target.id](!0)
                      : t.target.value === "false"
                      ? e[t.target.id](!1)
                      : e[t.target.id](t.target.value);
                  } catch (n) {
                    throw new Error(n);
                  }
                })),
            (o.style.cssText = "float:right;"),
            u.appendChild(o),
            u
          );
        }
        function l(e, t, r, i) {
          var s = n.menuOptions[e],
            o = t[i]();
          return (
            typeof o == "object" && (o = o.$id),
            s.forEach(function (e) {
              e.value === o && (e.selected = "selected");
            }),
            f(t, r, e, s)
          );
        }
        function c(e) {
          var t = e.functionName,
            r = e.parentObj,
            i = e.parentName,
            s,
            u = t.replace(/^set/, "get");
          if (n.menuOptions[t] !== undefined) o.push(l(t, r, i, u));
          else if (typeof r[u] == "function")
            try {
              (s = r[u]()),
                typeof s == "object" && (s = s.$id),
                o.push(f(r, i, t, s));
            } catch (a) {}
        }
        var o = [];
        return (
          i(n),
          s(n).forEach(function (e) {
            c(e);
          }),
          u(),
          a()
        );
      };
    }
  ),
  define(
    "ace/ext/menu_tools/overlay_page",
    ["require", "exports", "module", "ace/lib/dom"],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/dom"),
        i =
          "#ace_settingsmenu, #kbshortcutmenu {background-color: #F7F7F7;color: black;box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);padding: 1em 0.5em 2em 1em;overflow: auto;position: absolute;margin: 0;bottom: 0;right: 0;top: 0;z-index: 9991;cursor: default;}.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);background-color: rgba(255, 255, 255, 0.6);color: black;}.ace_optionsMenuEntry:hover {background-color: rgba(100, 100, 100, 0.1);-webkit-transition: all 0.5s;transition: all 0.3s}.ace_closeButton {background: rgba(245, 146, 146, 0.5);border: 1px solid #F48A8A;border-radius: 50%;padding: 7px;position: absolute;right: -8px;top: -8px;z-index: 1000;}.ace_closeButton{background: rgba(245, 146, 146, 0.9);}.ace_optionsMenuKey {color: darkslateblue;font-weight: bold;}.ace_optionsMenuCommand {color: darkcyan;font-weight: normal;}";
      r.importCssString(i),
        (n.exports.overlayPage = function (t, n, i, s, o, u) {
          function l(e) {
            e.keyCode === 27 && a.click();
          }
          (i = i ? "top: " + i + ";" : ""),
            (o = o ? "bottom: " + o + ";" : ""),
            (s = s ? "right: " + s + ";" : ""),
            (u = u ? "left: " + u + ";" : "");
          var a = document.createElement("div"),
            f = document.createElement("div");
          (a.style.cssText =
            "margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; background-color: rgba(0, 0, 0, 0.3);"),
            a.addEventListener("click", function () {
              document.removeEventListener("keydown", l),
                a.parentNode.removeChild(a),
                t.focus(),
                (a = null);
            }),
            document.addEventListener("keydown", l),
            (f.style.cssText = i + s + o + u),
            f.addEventListener("click", function (e) {
              e.stopPropagation();
            });
          var c = r.createElement("div");
          c.style.position = "relative";
          var h = r.createElement("div");
          (h.className = "ace_closeButton"),
            h.addEventListener("click", function () {
              a.click();
            }),
            c.appendChild(h),
            f.appendChild(c),
            f.appendChild(n),
            a.appendChild(f),
            document.body.appendChild(a),
            t.blur();
        });
    }
  ),
  define(
    "ace/ext/settings_menu",
    [
      "require",
      "exports",
      "module",
      "ace/ext/menu_tools/generate_settings_menu",
      "ace/ext/menu_tools/overlay_page",
      "ace/editor",
    ],
    function (e, t, n) {
      "use strict";
      function s(e) {
        var t = document.getElementById("ace_settingsmenu");
        t || i(e, r(e), "0", "0", "0");
      }
      var r = e("./menu_tools/generate_settings_menu").generateSettingsMenu,
        i = e("./menu_tools/overlay_page").overlayPage;
      n.exports.init = function (t) {
        var n = e("ace/editor").Editor;
        n.prototype.showSettingsMenu = function () {
          s(this);
        };
      };
    }
  );
(function () {
  window.require(["ace/ext/settings_menu"], function () {});
})();

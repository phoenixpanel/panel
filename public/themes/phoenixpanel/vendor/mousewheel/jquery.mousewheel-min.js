(function (c) {
    function g(a) {
        var b = a || window.event,
            i = [].slice.call(arguments, 1),
            e = 0,
            h = 0,
            f = 0;
        a = c.event.fix(b);
        a.type = 'mousewheel';
        if (b.wheelDelta) e = b.wheelDelta / 120;
        if (b.detail) e = -b.detail / 3;
        f = e;
        if (b.axis !== undefined && b.axis === b.HORIZONTAL_AXIS) {
            f = 0;
            h = -1 * e;
        }
        if (b.wheelDeltaY !== undefined) f = b.wheelDeltaY / 120;
        if (b.wheelDeltaX !== undefined) h = (-1 * b.wheelDeltaX) / 120;
        i.unshift(a, e, h, f);
        return (c.event.dispatch || c.event.handle).apply(this, i);
    }
    var d = ['DOMMouseScroll', 'mousewheel'];
    if (c.event.fixHooks) for (var j = d.length; j; ) c.event.fixHooks[d[--j]] = c.event.mouseHooks;
    c.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) for (var a = d.length; a; ) this.addEventListener(d[--a], g, false);
            else this.onmousewheel = g;
        },
        teardown: function () {
            if (this.removeEventListener) for (var a = d.length; a; ) this.removeEventListener(d[--a], g, false);
            else this.onmousewheel = null;
        },
    };
    c.fn.extend({
        mousewheel: function (a) {
            return a ? this.bind('mousewheel', a) : this.trigger('mousewheel');
        },
        unmousewheel: function (a) {
            return this.unbind('mousewheel', a);
        },
    });
})(jQuery);

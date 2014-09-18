function foo() {
    alert("From inside foo");
}

function foo2() {
    alert("inside foo2");
}

function isReadyToSubmitForm() {
    console.log(document.getElementById("userFname").value);
}

function RainyDay(a, b) {
    if (this === window) return new RainyDay(a);
    this.img = a.image;
    var c = {
        opacity: 1,
        blur: 10,
        crop: [ 0, 0, this.img.naturalWidth, this.img.naturalHeight ],
        enableSizeChange: !0,
        parentElement: document.getElementsByTagName("body")[0],
        fps: 30,
        fillStyle: "#8ED6FF",
        enableCollisions: !0,
        gravityThreshold: 3,
        gravityAngle: Math.PI / 2,
        gravityAngleVariance: 0,
        reflectionScaledownFactor: 5,
        reflectionDropMappingWidth: 200,
        reflectionDropMappingHeight: 200,
        width: this.img.clientWidth,
        height: this.img.clientHeight,
        position: "absolute",
        top: 0,
        left: 0
    };
    for (var d in c) "undefined" == typeof a[d] && (a[d] = c[d]);
    this.options = a, this.drops = [], this.canvas = b || this.prepareCanvas(), this.prepareBackground(), 
    this.prepareGlass(), this.reflection = this.REFLECTION_MINIATURE, this.trail = this.TRAIL_DROPS, 
    this.gravity = this.GRAVITY_NON_LINEAR, this.collision = this.COLLISION_SIMPLE, 
    this.setRequestAnimFrame();
}

function Drop(a, b, c, d, e) {
    this.x = Math.floor(b), this.y = Math.floor(c), this.r = Math.random() * e + d, 
    this.rainyday = a, this.context = a.context, this.reflection = a.reflected;
}

function BlurStack() {
    this.r = 0, this.g = 0, this.b = 0, this.next = null;
}

function CollisionMatrix(a, b, c) {
    this.resolution = c, this.xc = a, this.yc = b, this.matrix = new Array(a);
    for (var d = 0; a + 5 >= d; d++) {
        this.matrix[d] = new Array(b);
        for (var e = 0; b + 5 >= e; ++e) this.matrix[d][e] = new DropItem(null);
    }
}

function DropItem(a) {
    this.drop = a, this.next = null;
}

RainyDay.prototype.prepareCanvas = function() {
    var a = document.createElement("canvas");
    return a.style.position = this.options.position, a.style.top = this.options.top, 
    a.style.left = this.options.left, a.width = this.options.width, a.height = this.options.height, 
    this.options.parentElement.appendChild(a), this.options.enableSizeChange && this.setResizeHandler(), 
    a;
}, RainyDay.prototype.setResizeHandler = function() {
    null !== window.onresize ? window.setInterval(this.checkSize.bind(this), 100) : (window.onresize = this.checkSize.bind(this), 
    window.onorientationchange = this.checkSize.bind(this));
}, RainyDay.prototype.checkSize = function() {
    var a = this.img.clientWidth, b = this.img.clientHeight, c = this.img.offsetLeft, d = this.img.offsetTop, e = this.canvas.width, f = this.canvas.height, g = this.canvas.offsetLeft, h = this.canvas.offsetTop;
    (e !== a || f !== b) && (this.canvas.width = a, this.canvas.height = b, this.prepareBackground(), 
    this.glass.width = this.canvas.width, this.glass.height = this.canvas.height, this.prepareReflections()), 
    (g !== c || h !== d) && (this.canvas.offsetLeft = c, this.canvas.offsetTop = d);
}, RainyDay.prototype.animateDrops = function() {
    this.addDropCallback && this.addDropCallback();
    for (var a = this.drops.slice(), b = [], c = 0; c < a.length; ++c) a[c].animate() && b.push(a[c]);
    this.drops = b, window.requestAnimFrame(this.animateDrops.bind(this));
}, RainyDay.prototype.setRequestAnimFrame = function() {
    var a = this.options.fps;
    window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(b) {
            window.setTimeout(b, 1e3 / a);
        };
    }();
}, RainyDay.prototype.prepareReflections = function() {
    this.reflected = document.createElement("canvas"), this.reflected.width = this.canvas.width / this.options.reflectionScaledownFactor, 
    this.reflected.height = this.canvas.height / this.options.reflectionScaledownFactor;
    var a = this.reflected.getContext("2d");
    a.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.reflected.width, this.reflected.height);
}, RainyDay.prototype.prepareGlass = function() {
    this.glass = document.createElement("canvas"), this.glass.width = this.canvas.width, 
    this.glass.height = this.canvas.height, this.context = this.glass.getContext("2d");
}, RainyDay.prototype.rain = function(a, b) {
    if (this.reflection !== this.REFLECTION_NONE && this.prepareReflections(), this.animateDrops(), 
    this.presets = a, this.PRIVATE_GRAVITY_FORCE_FACTOR_Y = .001 * this.options.fps / 25, 
    this.PRIVATE_GRAVITY_FORCE_FACTOR_X = .001 * (Math.PI / 2 - this.options.gravityAngle) * this.options.fps / 50, 
    this.options.enableCollisions) {
        for (var c = 0, d = 0; d < a.length; d++) a[d][0] + a[d][1] > c && (c = Math.floor(a[d][0] + a[d][1]));
        if (c > 0) {
            var e = Math.ceil(this.canvas.width / c), f = Math.ceil(this.canvas.height / c);
            this.matrix = new CollisionMatrix(e, f, c);
        } else this.options.enableCollisions = !1;
    }
    for (var d = 0; d < a.length; d++) a[d][3] || (a[d][3] = -1);
    var g = 0;
    this.addDropCallback = function() {
        var c = new Date().getTime();
        if (!(b > c - g)) {
            g = c;
            var d = this.canvas.getContext("2d");
            d.clearRect(0, 0, this.canvas.width, this.canvas.height), d.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
            for (var e, f = 0; f < a.length; f++) if (a[f][2] > 1 || -1 === a[f][3]) {
                if (0 !== a[f][3]) {
                    a[f][3]--;
                    for (var h = 0; h < a[f][2]; ++h) this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, a[f][0], a[f][1]));
                }
            } else if (Math.random() < a[f][2]) {
                e = a[f];
                break;
            }
            e && this.putDrop(new Drop(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, e[0], e[1])), 
            d.save(), d.globalAlpha = this.opacity, d.drawImage(this.glass, 0, 0, this.canvas.width, this.canvas.height), 
            d.restore();
        }
    }.bind(this);
}, RainyDay.prototype.putDrop = function(a) {
    a.draw(), this.gravity && a.r > this.options.gravityThreshold && (this.options.enableCollisions && this.matrix.update(a), 
    this.drops.push(a));
}, RainyDay.prototype.clearDrop = function(a, b) {
    var c = a.clear(b);
    if (c) {
        var d = this.drops.indexOf(a);
        d >= 0 && this.drops.splice(d, 1);
    }
    return c;
}, Drop.prototype.draw = function() {
    this.context.save(), this.context.beginPath();
    var a = this.r;
    if (this.r = .95 * this.r, this.r < 3) this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, !0), 
    this.context.closePath(); else if (this.colliding || this.yspeed > 2) {
        if (this.colliding) {
            var b = this.colliding;
            this.r = 1.001 * (this.r > b.r ? this.r : b.r), this.x += b.x - this.x, this.colliding = null;
        }
        var c = 1 + .1 * this.yspeed;
        this.context.moveTo(this.x - this.r / c, this.y), this.context.bezierCurveTo(this.x - this.r, this.y - 2 * this.r, this.x + this.r, this.y - 2 * this.r, this.x + this.r / c, this.y), 
        this.context.bezierCurveTo(this.x + this.r, this.y + c * this.r, this.x - this.r, this.y + c * this.r, this.x - this.r / c, this.y);
    } else this.context.arc(this.x, this.y, .9 * this.r, 0, 2 * Math.PI, !0), this.context.closePath();
    this.context.clip(), this.r = a, this.rainyday.reflection && this.rainyday.reflection(this), 
    this.context.restore();
}, Drop.prototype.clear = function(a) {
    return this.context.clearRect(this.x - this.r - 1, this.y - this.r - 2, 2 * this.r + 2, 2 * this.r + 2), 
    a ? (this.terminate = !0, !0) : this.y - this.r > this.rainyday.h || this.x - this.r > this.rainyday.w || this.x + this.r < 0 ? !0 : !1;
}, Drop.prototype.animate = function() {
    if (this.terminate) return !1;
    var a = this.rainyday.gravity(this);
    if (!a && this.rainyday.trail && this.rainyday.trail(this), this.rainyday.options.enableCollisions) {
        var b = this.rainyday.matrix.update(this, a);
        b && this.rainyday.collision(this, b);
    }
    return !a || this.terminate;
}, RainyDay.prototype.TRAIL_NONE = function() {}, RainyDay.prototype.TRAIL_DROPS = function(a) {
    (!a.trailY || a.y - a.trailY >= 100 * Math.random() * a.r) && (a.trailY = a.y, this.putDrop(new Drop(this, a.x + (2 * Math.random() - 1) * Math.random(), a.y - a.r - 5, Math.ceil(a.r / 5), 0)));
}, RainyDay.prototype.TRAIL_SMUDGE = function(a) {
    var b = a.y - a.r - 3, c = a.x - a.r / 2 + 2 * Math.random();
    0 > b || 0 > c || this.context.drawImage(this.clearbackground, c, b, a.r, 2, c, b, a.r, 2);
}, RainyDay.prototype.GRAVITY_NONE = function() {
    return !0;
}, RainyDay.prototype.GRAVITY_LINEAR = function(a) {
    return this.clearDrop(a) ? !0 : (a.yspeed ? (a.yspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(a.r), 
    a.xspeed += this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(a.r)) : (a.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y, 
    a.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X), a.y += a.yspeed, a.draw(), !1);
}, RainyDay.prototype.GRAVITY_NON_LINEAR = function(a) {
    return this.clearDrop(a) ? !0 : (a.collided ? (a.collided = !1, a.seed = Math.floor(a.r * Math.random() * this.options.fps), 
    a.skipping = !1, a.slowing = !1) : (!a.seed || a.seed < 0) && (a.seed = Math.floor(a.r * Math.random() * this.options.fps), 
    a.skipping = a.skipping === !1 ? !0 : !1, a.slowing = !0), a.seed--, a.yspeed ? a.slowing ? (a.yspeed /= 1.1, 
    a.xspeed /= 1.1, a.yspeed < this.PRIVATE_GRAVITY_FORCE_FACTOR_Y && (a.slowing = !1)) : a.skipping ? (a.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y, 
    a.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X) : (a.yspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_Y * Math.floor(a.r), 
    a.xspeed += 1 * this.PRIVATE_GRAVITY_FORCE_FACTOR_X * Math.floor(a.r)) : (a.yspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_Y, 
    a.xspeed = this.PRIVATE_GRAVITY_FORCE_FACTOR_X), 0 !== this.options.gravityAngleVariance && (a.xspeed += (2 * Math.random() - 1) * a.yspeed * this.options.gravityAngleVariance), 
    a.y += a.yspeed, a.x += a.xspeed, a.draw(), !1);
}, RainyDay.prototype.positiveMin = function(a, b) {
    var c = 0;
    return c = b > a ? 0 >= a ? b : a : 0 >= b ? a : b, 0 >= c ? 1 : c;
}, RainyDay.prototype.REFLECTION_NONE = function() {
    this.context.fillStyle = this.options.fillStyle, this.context.fill();
}, RainyDay.prototype.REFLECTION_MINIATURE = function(a) {
    var b = Math.max((a.x - this.options.reflectionDropMappingWidth) / this.options.reflectionScaledownFactor, 0), c = Math.max((a.y - this.options.reflectionDropMappingHeight) / this.options.reflectionScaledownFactor, 0), d = this.positiveMin(2 * this.options.reflectionDropMappingWidth / this.options.reflectionScaledownFactor, this.reflected.width - b), e = this.positiveMin(2 * this.options.reflectionDropMappingHeight / this.options.reflectionScaledownFactor, this.reflected.height - c), f = Math.max(a.x - 1.1 * a.r, 0), g = Math.max(a.y - 1.1 * a.r, 0);
    this.context.drawImage(this.reflected, b, c, d, e, f, g, 2 * a.r, 2 * a.r);
}, RainyDay.prototype.COLLISION_SIMPLE = function(a, b) {
    for (var c, d = b; null != d; ) {
        var e = d.drop;
        if (Math.sqrt(Math.pow(a.x - e.x, 2) + Math.pow(a.y - e.y, 2)) < a.r + e.r) {
            c = e;
            break;
        }
        d = d.next;
    }
    if (c) {
        var f, g;
        a.y > c.y ? (f = a, g = c) : (f = c, g = a), this.clearDrop(g), this.clearDrop(f, !0), 
        this.matrix.remove(f), g.draw(), g.colliding = f, g.collided = !0;
    }
}, RainyDay.prototype.prepareBackground = function() {
    this.background = document.createElement("canvas"), this.background.width = this.canvas.width, 
    this.background.height = this.canvas.height, this.clearbackground = document.createElement("canvas"), 
    this.clearbackground.width = this.canvas.width, this.clearbackground.height = this.canvas.height;
    var a = this.background.getContext("2d");
    a.clearRect(0, 0, this.canvas.width, this.canvas.height), a.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height), 
    a = this.clearbackground.getContext("2d"), a.clearRect(0, 0, this.canvas.width, this.canvas.height), 
    a.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height), 
    !isNaN(this.options.blur) && this.options.blur >= 1 && this.stackBlurCanvasRGB(this.canvas.width, this.canvas.height, this.options.blur);
}, RainyDay.prototype.stackBlurCanvasRGB = function(a, b, c) {
    var d = [ [ 0, 9 ], [ 1, 11 ], [ 2, 12 ], [ 3, 13 ], [ 5, 14 ], [ 7, 15 ], [ 11, 16 ], [ 15, 17 ], [ 22, 18 ], [ 31, 19 ], [ 45, 20 ], [ 63, 21 ], [ 90, 22 ], [ 127, 23 ], [ 181, 24 ] ], e = [ 512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259 ];
    c |= 0;
    var f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z = this.background.getContext("2d"), A = z.getImageData(0, 0, a, b), B = A.data, C = c + 1, D = C * (C + 1) / 2, E = new BlurStack(), F = new BlurStack(), G = E;
    for (h = 1; 2 * c + 1 > h; h++) G = G.next = new BlurStack(), h === C && (F = G);
    G.next = E;
    var H = null, I = null;
    l = k = 0;
    for (var J, K = e[c], L = 0; L < d.length; ++L) if (c <= d[L][0]) {
        J = d[L - 1][1];
        break;
    }
    for (g = 0; b > g; g++) {
        for (s = t = u = m = n = o = 0, p = C * (v = B[k]), q = C * (w = B[k + 1]), r = C * (x = B[k + 2]), 
        m += D * v, n += D * w, o += D * x, G = E, h = 0; C > h; h++) G.r = v, G.g = w, 
        G.b = x, G = G.next;
        for (h = 1; C > h; h++) i = k + ((h > a - 1 ? a - 1 : h) << 2), m += (G.r = v = B[i]) * (y = C - h), 
        n += (G.g = w = B[i + 1]) * y, o += (G.b = x = B[i + 2]) * y, s += v, t += w, u += x, 
        G = G.next;
        for (H = E, I = F, f = 0; a > f; f++) B[k] = m * K >> J, B[k + 1] = n * K >> J, 
        B[k + 2] = o * K >> J, m -= p, n -= q, o -= r, p -= H.r, q -= H.g, r -= H.b, i = l + ((i = f + c + 1) < a - 1 ? i : a - 1) << 2, 
        s += H.r = B[i], t += H.g = B[i + 1], u += H.b = B[i + 2], m += s, n += t, o += u, 
        H = H.next, p += v = I.r, q += w = I.g, r += x = I.b, s -= v, t -= w, u -= x, I = I.next, 
        k += 4;
        l += a;
    }
    for (f = 0; a > f; f++) {
        for (t = u = s = n = o = m = 0, k = f << 2, p = C * (v = B[k]), q = C * (w = B[k + 1]), 
        r = C * (x = B[k + 2]), m += D * v, n += D * w, o += D * x, G = E, h = 0; C > h; h++) G.r = v, 
        G.g = w, G.b = x, G = G.next;
        for (j = a, h = 1; C > h; h++) k = j + f << 2, m += (G.r = v = B[k]) * (y = C - h), 
        n += (G.g = w = B[k + 1]) * y, o += (G.b = x = B[k + 2]) * y, s += v, t += w, u += x, 
        G = G.next, b - 1 > h && (j += a);
        for (k = f, H = E, I = F, g = 0; b > g; g++) i = k << 2, B[i] = m * K >> J, B[i + 1] = n * K >> J, 
        B[i + 2] = o * K >> J, m -= p, n -= q, o -= r, p -= H.r, q -= H.g, r -= H.b, i = f + ((i = g + C) < b - 1 ? i : b - 1) * a << 2, 
        m += s += H.r = B[i], n += t += H.g = B[i + 1], o += u += H.b = B[i + 2], H = H.next, 
        p += v = I.r, q += w = I.g, r += x = I.b, s -= v, t -= w, u -= x, I = I.next, k += a;
    }
    z.putImageData(A, 0, 0);
}, CollisionMatrix.prototype.update = function(a, b) {
    if (a.gid) {
        if (!this.matrix[a.gmx] || !this.matrix[a.gmx][a.gmy]) return null;
        if (this.matrix[a.gmx][a.gmy].remove(a), b) return null;
        if (a.gmx = Math.floor(a.x / this.resolution), a.gmy = Math.floor(a.y / this.resolution), 
        !this.matrix[a.gmx] || !this.matrix[a.gmx][a.gmy]) return null;
        this.matrix[a.gmx][a.gmy].add(a);
        var c = this.collisions(a);
        if (c && null != c.next) return c.next;
    } else {
        if (a.gid = Math.random().toString(36).substr(2, 9), a.gmx = Math.floor(a.x / this.resolution), 
        a.gmy = Math.floor(a.y / this.resolution), !this.matrix[a.gmx] || !this.matrix[a.gmx][a.gmy]) return null;
        this.matrix[a.gmx][a.gmy].add(a);
    }
    return null;
}, CollisionMatrix.prototype.collisions = function(a) {
    var b = new DropItem(null), c = b;
    return b = this.addAll(b, a.gmx - 1, a.gmy + 1), b = this.addAll(b, a.gmx, a.gmy + 1), 
    b = this.addAll(b, a.gmx + 1, a.gmy + 1), c;
}, CollisionMatrix.prototype.addAll = function(a, b, c) {
    if (b > 0 && c > 0 && b < this.xc && c < this.yc) for (var d = this.matrix[b][c]; null != d.next; ) d = d.next, 
    a.next = new DropItem(d.drop), a = a.next;
    return a;
}, CollisionMatrix.prototype.remove = function(a) {
    this.matrix[a.gmx][a.gmy].remove(a);
}, DropItem.prototype.add = function(a) {
    for (var b = this; null != b.next; ) b = b.next;
    b.next = new DropItem(a);
}, DropItem.prototype.remove = function(a) {
    for (var b = this, c = null; null != b.next; ) c = b, b = b.next, b.drop.gid === a.gid && (c.next = b.next);
};
var wSize = "width=600,height=460",
    loc = encodeURIComponent(window.location.href),
    title = "share",
    // Sharer URLs
    wpp = "whatsapp://send?text="
    fb = "https://www.facebook.com/sharer/sharer.php?u=", // 0. Facebook
    tw = "https://twitter.com/share?url=", // Twitter (separate function)
    gp = "https://plus.google.com/share?url=", // 1. Google+
    tb = "http://www.tumblr.com/share?v=3&u=", // 2. Tumblr
    rd = "http://reddit.com/submit?url=", // 3. Reddit
    li = "http://www.linkedin.com/shareArticle?mini=true&url=", // 4. LinkedIn
    su = "http://www.stumbleupon.com/submit?url=", // 5. StumbleUpon
    digg = "http://www.digg.com/submit?url=", // 6. Digg
    pt = "http://pinterest.com/pin/create/button/?url=", // 7. Pinterest
    // Twitter custom texts
    text = $(this).attr('data-title'),
    hashtag = "hashtags=" + $(this).attr('data-tags'),
    via = "via=qawithexperts",
    // URLs array
    url = [fb, gp, tb, rd, li, su, digg, pt];
function share(i) {
    "use strict";
    window.open(url[i] + loc, title, wSize);
}
function twitter() {
    "use strict";
    window.open(tw + loc + "&" + text + "&" + hashtag + "&" + via, title, wSize);
}

function whatsapp() {
    "use strict";
    window.open(wpp + text + " " + loc, title, wSize);
}
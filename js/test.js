function setBannnerScroll(id) {
  var selector = document.getElementById(id);
  var numBanner = selector.querySelectorAll('.slide > li').length;
  var scrollBoxMaxWidth = 0;
  var scrollBarWidth = 0;
  var bannerWidth = 0;
  var startX = 0;
  var delX = 0;
  var offsetX = 0;
  var offsetLeftScroll = 0;
  var offsetLeftScrollMax = 0;

  setScrollBar();

  window.addEventListener('resize', function() {
    if (window.innerWidth > scrollBoxMaxWidth) {
      selector.querySelector('.scroll-bar').setAttribute('style', 'visibility: hidden;');
    } else {
      selector.querySelector('.scroll-bar').setAttribute('style', 'visibility: visible;');
    }
  });

  selector.querySelector('.scroll-bar a').addEventListener('mousedown', function(e) {
    e.preventDefault();
    startX = e.clientX;
    offsetX = this.offsetLeft;

    document.addEventListener('mousemove', function(e) {
      delX = e.clientX - startX;
      offsetLeftScroll = offsetX + delX;
      if (offsetLeftScroll < 0) offsetLeftScroll = 0;
      if (offsetLeftScroll > offsetLeftScrollMax) offsetLeftScroll = offsetLeftScrollMax;
      // console.log((offsetLeftScrollMax / 100) * scrollBoxMaxWidth);
      selector.querySelector('.scroll-bar a').style.left = offsetLeftScroll + 'px';
    })

  })


  function setScrollBar() {
    scrollBarWidth = 0;
    scrollBarWidth = 100 / numBanner;
    bannerWidth = 0;

    selector.querySelectorAll('.slide > li').forEach(function(el, i) {
      // console.log(el, i);
      var style = el.currentStyle || window.getComputedStyle(el);
      var marginLeftValue = parseInt(style.marginLeft);
      // console.log('marginRight:' + marginLeftValue);
      // console.log('offsetWidth:' + el.offsetWidth);

      if (numBanner > i) {
        bannerWidth += (el.offsetWidth + marginLeftValue);
        // console.log('bannerWidth:' + bannerWidth);
      }
    });

    scrollBoxMaxWidth = bannerWidth;
    console.log('scrollBoxMaxWidth:' + scrollBoxMaxWidth, scrollBarWidth);
    offsetLeftScrollMax = 100 - scrollBarWidth;
    // offsetLeftScrollMax = (offsetLeftScrollMax / 100) * scrollBoxMaxWidth;



    selector.querySelector('.scroll-bar a').setAttribute('style', 'width: ' + scrollBarWidth + '%;');
    selector.querySelector('.scroll-bar').setAttribute('style', 'max-width: ' + scrollBoxMaxWidth + 'px');
  }

}

/*
ISSUES:

1. offsetLeftScrollMax is 80% but need to convert to equivalent px. meaning I cannot use scrollBarWidth as % and find using forEach li => offsetWidth;

*/
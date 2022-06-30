// common script
document.addEventListener('DOMContentLoaded',function() {
  preventDefaultAnchor();
  setMonthlyUI();
  setGNB();
  setSlide('image-slide-01', 'image', true);
  setSlide('banner-slide-01', 'banner', true, 4);
  setBannerScroll('banner-slide-01');
  setBannerScroll('banner-scroll');
  // setBannerScroll();
});

var isMaskOn = '';

function preventDefaultAnchor() {
  document.onclick = function(e) {
    var target = e.target.getAttribute('href');
    // console.log(e.target);
    if (target === '#' || target === null) {
      e.preventDefault();
    }
  }
}

document.addEventListener('scroll', function() {
  setActiveScroll('break');
  setActiveScroll('find');
});

window.addEventListener('resize', function() {
  setGNB();
});


function setMonthlyUI() {
  var el = document.getElementById('monthly');
  var timerIdFocus = '';

  el.querySelector('.pull-down > a').addEventListener('click', function() {
    el.classList.toggle('show');
  });
  el.querySelector('.box').addEventListener('focusin', function() {
    clearTimeout(timerIdFocus);
    // console.log('in')
    el.classList.add('show');
  });
  el.querySelector('.box').addEventListener('focusout', function() {
    timerIdFocus = setTimeout(function() {
      {el.classList.remove('show');}
      // console.log('out');
    }, 100)
  });
}

function setGNB() {
  
  //#header search
  document.querySelector('#header .top-menu ul > li.search label').addEventListener('click', function() {
    this.parentNode.classList.toggle('on');
  });

  // mobile GNB
  var header = document.getElementById('header');
  header.querySelector('a.menu-o').addEventListener('click', function() {
    header.querySelector('.btm-menu').classList.add('on');
    document.querySelector('body').classList.add('no-scroll');
    document.getElementById('layer-mask').classList.add('on');
    isMaskOn = true;
  });
  header.querySelector('a.menu-x').addEventListener('click', function() {
    header.querySelector('.btm-menu').classList.remove('on');
    if (isMaskOn === true) {
      closeMask();
    }
  });

  if (window.innerWidth > 1024) {
    header.querySelector('.btm-menu').classList.remove('on');
    if (isMaskOn === true) {
      closeMask();
    }
  }

  function closeMask() {
    document.querySelector('body').classList.remove('no-scroll');
    document.getElementById('layer-mask').classList.remove('on');
    isMaskOn = false;
  }

  //PC & Mobile GNB
  document.querySelectorAll('#gnb > ul > li').forEach(function(el, i) {
    // console.log(el);
    el.classList.remove('on');
    el.addEventListener('mouseenter', function(el) {
      if (window.innerWidth < 1024) return false;
      for (let sibling of this.parentNode.children) {
        sibling.classList.remove('on');
      }
      this.classList.add('on');  
    });
    el.addEventListener('focusin', function(el) {
      for (let sibling of this.parentNode.children) {
        sibling.classList.remove('on');
      }
      this.classList.add('on');  
    });
    document.querySelector('#gnb').addEventListener('mouseleave', function() {
      if (window.innerWidth < 1024) return false;
      el.classList.remove('on');
    });
    document.querySelector('#gnb').addEventListener('focusout', function() {
      el.classList.remove('on');
    });
  });
}

function setActiveScroll(selector) {
  var scrollAmt = window.pageYOffset;
  var el = document.getElementById(selector);
  // var el = document.getElementById('break');
  var elTop = (el.offsetTop + 176) - window.innerHeight;
  var windowHeight = window.innerHeight;
  // console.log(el, scrollAmt, elTop, windowHeight);
  var activeAmt = 100;

  if (scrollAmt < elTop + activeAmt) {
    el.classList.remove('active');
  } else {
    el.classList.add('active');
  }
}

function setSlide(id, type, timerStatus, show) {
  var selector = document.getElementById(id);
  console.log(id);
  var numSlide = selector.querySelectorAll('.slide > li').length;
  var slideNow = 0;
  var slidePrev = 0;
  var slideNext = 0;
  var slideFirst = 1;
  var timerId = '';
  var timerSpeed = 2000;
  var isTimerOn = timerStatus;
  var bounceTimerId = '';
  var throttleCounter = 0;
  var slideType = type;
  var leftValue = 0;
  var offsetWidth = 0;
  var numtoShow = (show === undefined ? 1 : show);
  var numtoSlide = Math.ceil(numSlide / numtoShow);

  if (slideType === 'image') {
    selector.querySelectorAll('.slide > li').forEach(function(el, i) {
      el.setAttribute('style', 'left: ' + (i * 100) + '%; display: block;');
      selector.querySelector('.indicator').innerHTML += '<li><a href="#">' + (i + 1) + '번 슬라이드</a></li>\n';
    });
  } else if (slideType === 'banner') {
    setStatus();
    // console.log(numtoSlide);

    window.addEventListener('resize', function() {
      //throttle
      throttleCounter++;
      if (throttleCounter === 10) {
        setStatus();
        throttleCounter = 0;
      }
      //debounce
      clearTimeout(bounceTimerId);
      bounceTimerId = setTimeout(function() {
        setStatus();
      }, 100)

      if (window.innerWidth > 1024) {
        showSlide(1);
      }
    });
  }

  if (isTimerOn === true) {
    selector.querySelector('.control a.play').classList.add('on');
  } else {
    selector.querySelector('.control a.play').classList.remove('on');
  }

  showSlide(slideFirst);

  if (selector.querySelectorAll('.indicator li a') !== null) {
    selector.querySelectorAll('.indicator li a').forEach(function(el, i) {
      el.addEventListener('click', function() {
        showSlide(i + 1);
      }, false);
    });
  };
  
  selector.querySelectorAll('.slide li a').forEach(function(el, i) {
    el.addEventListener('focus', function() {
      showSlide(i + 1);
    }, false);
  });
  

  if (selector.querySelector('.control a.prev') !== null) {
    selector.querySelector('.control a.prev').addEventListener('click', function() {
      showSlide(slidePrev);
    }, false);
    
    selector.querySelector('.control a.next').addEventListener('click', function() {
      showSlide(slideNext);
    }, false);
  }
  
  selector.querySelector('.control a.play').addEventListener('click', function(e) {
    // alert('test');
    // console.log(e.currentTarget);
    if (isTimerOn === true) {
      stopTimer();
    } else {
      startTimer();
    }
  }, false);

  function startTimer() {
    timerId = setTimeout(function() {showSlide(slideNext);}, timerSpeed);
    selector.querySelector('.control a.play').classList.add('on');
    isTimerOn = true;
  }
  
  function stopTimer() {
    clearTimeout(timerId);
    selector.querySelector('.control a.play').classList.remove('on');
    isTimerOn = false;
  }
  
  function resetTimer() {
    clearTimeout(timerId);
    if (isTimerOn === true) {
      timerId = setTimeout(function() {showSlide(slideNext);}, timerSpeed);
    }
  }

  function showSlide(n) {
    resetTimer();
    if (slideType === 'image') {
      selector.querySelector('.slide').setAttribute('style', 'transition: left 0.3s; left:' + (-(n - 1) * 100) + '%');
      selector.querySelectorAll('.indicator > li').forEach(function(el, i) {
        el.classList.remove('on');
      });
      selector.querySelector('.indicator > li:nth-child(' + n + ')').classList.add('on');
      slideNow = n;
      slidePrev = (n === 1) ? numSlide : (n - 1);
      slideNext = (n === numSlide) ? 1 : (n + 1);
    } else if (slideType === 'banner' && window.innerWidth > 1024) {
      if (n >= numtoSlide) n = numtoSlide;
      selector.querySelector('.slide').setAttribute('style', 'transition: left 0.3s; left:' + (-(n -1) * leftValue) + 'px');
      selector.querySelectorAll('.indicator > li').forEach(function(el, i) {
        el.classList.remove('on');
      });
      selector.querySelector('.indicator > li:nth-child(' + n + ')').classList.add('on');
      slideNow = n;
      slidePrev = (n === 1) ? numtoSlide : (n - 1);
      slideNext = (n === numtoSlide) ? 1 : (n + 1);
    } else {return false};
  } 


  function setStatus() {
    offsetWidth = 0;
    selector.querySelectorAll('.slide > li').forEach(function(el, i) {
      //get li margin-right value
      var style = el.currentStyle || window.getComputedStyle(el);
      var marginRightValue = parseInt(style.marginRight);

      if (numtoShow > i) {
        offsetWidth += (el.offsetWidth + marginRightValue);
        // console.log(offsetWidth);
      }
    });
    //adjusted for rounding
    leftValue = offsetWidth - 1;
    // console.log(leftValue);
  }
};

function setBannerScroll(id) {
  var selector = document.getElementById(id);
  console.log(selector);
  var numBanner = selector.querySelectorAll('.slide > li').length;
  var scrollBarWidth = selector.querySelector('.scroll-bar a').offsetWidth;
  var offsetLeft = 0;
  var offsetLeftScroll = 0;
  var scrollMax = selector.querySelector('.scroll-bar').offsetWidth;
  var bannerWidth = 0;
  var bannerBox = selector.querySelector('.banner-box').offsetWidth;
  console.log(bannerBox);
  var startX = 0;
  var offsetX = 0;
  var deltaX = 0;
  
  selector.querySelectorAll('.slide > li').forEach(function(el, i) {
    var style = el.currentStyle || window.getComputedStyle(el);
    var marginLeftValue = parseInt(style.marginLeft);

    if (numBanner > i) {
      bannerWidth += (el.offsetWidth + marginLeftValue);
      console.log('bannerWidth: ' + bannerWidth);
    }
  });

  selector.querySelector('.scroll-bar a').addEventListener('mousedown', function(e) {
    e.preventDefault();
    startX = e.clientX;
    offsetX = this.offsetLeft;

    document.addEventListener('mousemove', moveFunction);
    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', moveFunction);
    })

    function moveFunction(e) {
      deltaX = e.clientX - startX;
      offsetLeft = offsetX + deltaX;
      if (offsetLeft < 0) offsetLeft = 0;
      if (offsetLeft > (scrollMax - scrollBarWidth)) offsetLeft = (scrollMax - scrollBarWidth);
      selector.querySelector('.scroll-bar a').style.left = offsetLeft + 'px';
      offsetLeftScroll = (-offsetLeft) * (bannerWidth / bannerBox)
      selector.querySelector('.slide').style.left = offsetLeftScroll + 'px';
    }
  })
  
}
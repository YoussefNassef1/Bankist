'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const taps = document.querySelectorAll('.operations__tab');
const tapsContainer = document.querySelector('.operations__tab-container');
const tapsContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');
const message = document.createElement('div');

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

// const closeModal = function () {
//   modal.classList.add('hidden');
//   overlay.classList.add('hidden');
// };

btnsOpenModal.forEach(btns => btns.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', openModal);
overlay.addEventListener('click', openModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    openModal();
  }
});

// add cookies message

// message.classList.add('cookie-message');

// message.innerHTML = `we use cookie for improve functionality and analytics <button class="btn btn--close-cookie">Got it!</button>`;

// header.append(message);

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   // message.remove();
//   message.parentElement.removeChild(message);
// });

// add scroll

btnScroll.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// add smooth scroll for link

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// create taps

// add active in tap
tapsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  taps.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // add active in content
  tapsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// add hover in nav

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// add sticky

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// revelling element scroll
const sections = document.querySelectorAll('.section');

const revellingEl = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revellingEl, {
  root: null,
  threshold: 0.15,
});

sections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

// lazy img

const allLazyImg = document.querySelectorAll('img[data-src]');

const lazyImgOb = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserve = new IntersectionObserver(lazyImgOb, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

allLazyImg.forEach(img => imgObserve.observe(img));

// slider
const sliders = document.querySelectorAll('.slide');
const arrowLef = document.querySelector('.slider__btn--left');
const arrowRig = document.querySelector('.slider__btn--right');
let currSlide = 0;
const maxSlide = sliders.length;
const containerDots = document.querySelector('.dots');

// create bots
const createDot = function () {
  sliders.forEach((_, i) => {
    containerDots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const goToSlide = function (slide) {
  sliders.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const addActiveDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToRight = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  addActiveDot(currSlide);
};

const goToLeft = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  addActiveDot(currSlide);
};

arrowRig.addEventListener('click', goToRight);
arrowLef.addEventListener('click', goToLeft);

// key slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    goToLeft();
  }
  if (e.key === 'ArrowRight') {
    goToRight();
  }
});

// add event in bots
containerDots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    addActiveDot(slide);
  }
});

function init() {
  goToSlide(0);
  createDot();
  addActiveDot(0);
}

init();

(function ($) {
    "use strict";
    var gladia = {
        dynamic_year: function () {
            var yearEl = $('#yearText');
            if (yearEl.length) {
                yearEl.text(new Date().getFullYear());
            }
        },
        
        lenis_scroll: function () {
            if (typeof Lenis === "undefined") return;
            if (window._lenis) {
                window._lenis.destroy();
            }
            const lenis = new Lenis({
                smooth: true,
                lerp: 0.05
            });
            window._lenis = lenis;
            lenis.on('scroll', ScrollTrigger.update);

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        },

        svg_inline: function () {
            const selector = '.svg-icon > img[src$=".svg"], .video-popup-btn a > img[src$=".svg"]';
            if (!$(selector).length) return;
            let svgCache = {};
            $(selector).each(function () {
                let $img = $(this);
                let imgURL = $img.attr("src");
                if (!imgURL) return;
                if (svgCache[imgURL]) {
                    let $svg = svgCache[imgURL].clone();
                    applyAttributes($img, $svg);
                    $img.replaceWith($svg);
                    return;
                }
                $.get(imgURL, function (data) {
                    let $svg = $(data).find("svg");
                    if (!$svg.length) return;
                    $svg = $svg.removeAttr("xmlns:a");
                    svgCache[imgURL] = $svg;
                    let $clone = $svg.clone();
                    applyAttributes($img, $clone);
                    $img.replaceWith($clone);
                }, "xml").fail(function () {
                    console.warn("SVG load failed:", imgURL);
                });

            });
            function applyAttributes($img, $svg) {
                $.each($img.prop("attributes"), function () {
                    $svg.attr(this.name, this.value);
                });
            }
        },

        bootstrap_menu: function () {
            if (window.innerWidth >= 992) {
                $('.navbar .dropdown-menu')
                    .removeAttr('style')
                    .removeClass('show');
                return;
            }
            $('.has-children').removeAttr('data-bs-toggle');
            $(document)
                .off('click.mobileMenu', '.has-children')
                .on('click.mobileMenu', '.has-children', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $this = $(this);
                    var $submenu = $this.closest('li').children('.dropdown-menu');
                    var isOpen = $submenu.hasClass('show');
                    $('.dropdown-menu.show')
                        .not($submenu.parents('.dropdown-menu'))
                        .slideUp(200)
                        .removeClass('show');
                    $('.has-children.active')
                        .not($this.parents().children('.has-children'))
                        .removeClass('active');
                    if (isOpen) {
                        $submenu.find('.dropdown-menu.show')
                            .slideUp(200)
                            .removeClass('show');
                        $submenu.slideUp(200, function () {
                            $(this)
                                .removeClass('show')
                                .removeAttr('style');
                        });
                        $this.removeClass('active');
                        $this.parents('li').each(function () {
                            var $parent = $(this);
                            var $parentSubmenu = $parent.children('.dropdown-menu');
                            if (
                                $parentSubmenu.length &&
                                !$parentSubmenu.hasClass('show')
                            ) {
                                $parent.children('.has-children')
                                    .removeClass('active');
                            }
                        });
                    } else {
                        $submenu.stop(true, true).slideDown(200, function () {
                            $(this).addClass('show');
                        });
                        $this.addClass('active');
                        $this.parents('li')
                            .children('.has-children')
                            .addClass('active');
                    }

                });

            $('.dropdown').off('hide.bs.dropdown');
        },

        navbar_toggler: function () {
            if ($('.navbar-toggler').length) {
                $(".navbar-toggler, .close-nav").on("click", function (e) {
                    $('html').toggleClass("sidenav-open");
                });
            }
        },

        header_anim: function () {
            if (!$('.site-header').length) return;
            let lastScroll = 0;
            let header = $('.site-header');
            let stickyPoint = 100;
            let threshold = 10;
            let scrollTolerance = 5;
            let isHidden = false;
            function handleScroll(currentScroll) {
                let diff = currentScroll - lastScroll;
                if (Math.abs(diff) < scrollTolerance) return;
                if (currentScroll > stickyPoint) {
                    header.addClass('sticky');
                } else {
                    header.removeClass('sticky');
                }
                if (currentScroll <= threshold) {
                    header.removeClass('hide').addClass('show');
                    isHidden = false;
                    lastScroll = currentScroll;
                    return;
                }
                if (diff > 0 && !isHidden) {
                    header.removeClass('show').addClass('hide');
                    isHidden = true;
                }
                if (diff < 0 && isHidden) {
                    header.removeClass('hide').addClass('show');
                    isHidden = false;
                }
                lastScroll = currentScroll;
            }
            if (window._lenis) {
                window._lenis.on('scroll', function (e) {
                    handleScroll(e.scroll);
                });
            } else {
                $(window).on('scroll', function () {
                    handleScroll($(this).scrollTop());
                });
            }
        },

        nice_select: function () {
            if (typeof $.fn.niceSelect === "undefined") return;
            $('select').niceSelect('destroy');
            $('select').not('.no-nice-select').each(function () {
                var $this = $(this);
                if (!$this.is(':visible')) return;

                $this.niceSelect();
            });
        },

        parallax_image: function () {
            if (!$('.parallax-section').length) return;
            gsap.registerPlugin(ScrollTrigger);
            $('.parallax-section').each(function (index) {
                var section = $(this);
                var image = section.find('img');
                if (!image.length) return;
                var speed = section.data('speed') || 1;
                gsap.set(image[0], { clearProps: "transform" });
                if (index === 0) {
                    gsap.set(image[0], { y: "0%" });
                    gsap.to(image[0], {
                        y: "8%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: section[0],
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: true
                        }
                    });
                    return;
                }
                gsap.fromTo(
                    image[0],
                    { y: (-10 * speed) + "%" },
                    {
                        y: (10 * speed) + "%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: section[0],
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: true
                        }
                    }
                );
            });
        },

        back_to_top: function () {
            var btn = $('#back-to-top');
            if (!btn.length) return;
            if (!btn.find('svg').length) {
                btn.append(`
                    <svg class="progress-circle" width="40" height="40">
                        <circle cx="20" cy="20" r="18"></circle>
                    </svg>
                `);
            }
            var circle = btn.find('circle')[0];
            var radius = circle.r.baseVal.value;
            var circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;

            function update(scroll) {
                var height = document.documentElement.scrollHeight - window.innerHeight;
                var progress = scroll / height;
                var offset = circumference - progress * circumference;
                circle.style.strokeDashoffset = offset;
                if (scroll > 100) {
                    gsap.to(btn, { autoAlpha: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to(btn, { autoAlpha: 0, y: 20, duration: 0.3 });
                }
            }
            if (window._lenis) {
                window._lenis.on('scroll', function (e) {
                    update(e.scroll);
                });
            } else {
                $(window).on('scroll', function () {
                    update($(this).scrollTop());
                });
            }
            btn.off('click').on('click', function (e) {
                e.preventDefault();

                if (window._lenis) {
                    window._lenis.scrollTo(0);
                } else {
                    $('html, body').animate({ scrollTop: 0 }, 800);
                }
            });
        },

        aos_anim: function () {
            jQuery(function () {
                AOS.init({
                    once: true,
                    duration: 1200,
                });
            });
        },

        date_picker: function () {
            if (typeof flatpickr === "undefined") return;
            $('.datepicker').each(function () {
                flatpickr(this, {
                    dateFormat: "d M, Y",
                    minDate: "today",
                    disableMobile: true,
                    animate: true
                });
            });
        },

        text_reveal: function () {
            if (!$('.split-text').length) return;
            gsap.registerPlugin(ScrollTrigger, SplitText);
            $('.split-text').each(function () {
                var el = this;
                if ($(el).hasClass('split-done')) return;
                var split = new SplitText(el, {
                    type: "words",
                    wordsClass: "split-word"
                });
                $(el).addClass('split-done');
                $(split.words).each(function () {
                    if (!$(this).parent().hasClass('word-wrap')) {
                        $(this).wrap('<span class="word-wrap"></span>');
                    }
                });
                gsap.set(split.words, { yPercent: 100, opacity: 0 });
                gsap.set(el, { visibility: "visible" });
                gsap.to(split.words, {
                    yPercent: 0,
                    opacity: 1,
                    stagger: 0.06,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        once: true,
                        invalidateOnRefresh: true
                    }
                });
            });
        },

        button_explode: function () {
            if (!$('.btn-explode').length) return;
            $('.btn-explode').each(function () {
                let btn = $(this);
                let circle = btn.find('.btn-circle');
                let tl = null;
                btn.on('mouseenter', function (e) {
                    let offset = btn.offset();
                    let x = Math.round(e.pageX - offset.left);
                    let y = Math.round(e.pageY - offset.top);
                    let size = Math.max(btn.outerWidth(), btn.outerHeight()) * 2.5;
                    gsap.killTweensOf(circle);
                    if (tl) tl.kill();
                    gsap.set(circle, {
                        left: x,
                        top: y,
                        width: size,
                        height: size,
                        xPercent: -50,
                        yPercent: -50,
                        scale: 0,
                        opacity: 1,
                        force3D: true
                    });
                    tl = gsap.to(circle, {
                        scale: 1,
                        duration: 0.5,
                        delay: 0.07,
                        ease: "power2.out"
                    });
                });

                btn.on('mouseleave', function () {
                    gsap.killTweensOf(circle);
                    if (tl) tl.kill();
                    gsap.to(circle, {
                        opacity: 0,
                        duration: 0.5,
                        delay: 0.07,
                        ease: "power1.out",
                        onComplete: function () {
                            gsap.set(circle, { clearProps: "all" });
                        }
                    });

                });
            });
        },

        scroll_to_section: function () {

            $(document)
                .off('click', '.scroll-link')
                .on('click', '.scroll-link', function (e) {

                    e.preventDefault();

                    let target = $(this).data('target');

                    if (!target || !$(target).length) return;

                    let headerHeight = $('.site-header').outerHeight() || 0;

                    // Close Bootstrap Offcanvas if open
                    const offcanvasEl = document.getElementById('navbarCollapse');

                    if (offcanvasEl && offcanvasEl.classList.contains('show')) {

                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl)
                            || new bootstrap.Offcanvas(offcanvasEl);

                        bsOffcanvas.hide();
                    }

                    // Delay scroll slightly so offcanvas closes smoothly
                    setTimeout(() => {

                        if (window._lenis) {

                            window._lenis.scrollTo(target, {
                                offset: -headerHeight,
                                duration: 1.2,
                                easing: (t) => 1 - Math.pow(1 - t, 3)
                            });

                        } else {

                            $('html, body').animate({
                                scrollTop: $(target).offset().top - headerHeight
                            }, 800);

                        }

                    }, 300);

                });
        },

        parallax_dual: function () {

            if (!$('.parallax-dual').length) return;

            gsap.registerPlugin(ScrollTrigger);

            $('.parallax-dual').each(function () {

                let section = $(this);
                let box1 = section.find('.img_1'); // 👈 moving container
                let box2 = section.find('.img_2');

                // reset
                gsap.set([box1, box2], { clearProps: "transform" });

                // Left → right
                gsap.from(box1, {
                    x: 60,
                    scrollTrigger: {
                        trigger: section[0],
                        start: "top 70%",
                        end: "bottom top",
                        scrub: 1
                    }
                });

                // Right → left
                gsap.from(box2, {
                    x: -60,
                    scrollTrigger: {
                        trigger: section[0],
                        start: "top 40%",
                        end: "bottom top",
                        scrub: 1
                    }
                });

            });
        },

        counter_anim: function () {

            if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

            gsap.registerPlugin(ScrollTrigger);

            let blocks = document.querySelectorAll('.stats_content');
            // 👈 each left/right group triggers separately

            if (!blocks.length) return;

            blocks.forEach((block) => {

                ScrollTrigger.create({
                    trigger: block,
                    start: "top 90%",
                    once: true,
                    // markers: true,

                    onEnter: () => {

                        let counters = block.querySelectorAll('.count-digit');

                        counters.forEach((el, index) => {

                            let target = parseFloat(el.dataset.target || el.textContent);

                            let obj = { val: 0 };

                            gsap.to(obj, {
                                val: target,
                                duration: 1.8,
                                ease: "power2.out",
                                delay: index * 0.12,

                                onUpdate: () => {
                                    el.textContent = Math.ceil(obj.val);
                                },

                                onComplete: () => {
                                    el.textContent = target;
                                }
                            });

                        });

                    }
                });

            });

            // ✅ Lenis sync
            if (window._lenis) {
                window._lenis.on('scroll', ScrollTrigger.update);
            }
        },

        key_highlights_hover: function () {
            const section = document.querySelector('.key_highlights_wrap');
            if (!section) return;
            const items = section.querySelectorAll('.key_highlights_listing li');
            const images = section.querySelectorAll('.key_highlights_bg_wrap img');
            if (!items.length || !images.length) return;
            let current = 0;
            let interval = null;
            const duration = 8000;
            const activate = (index) => {
                items.forEach(i => {
                    i.classList.remove('active');

                    const prog = i.querySelector('.progress');
                    if (prog) {
                        prog.style.strokeDashoffset = 113;
                        prog.style.transition = 'opacity 0.3s ease';
                        prog.style.opacity = 0;
                    }
                });
                images.forEach(img => img.classList.remove('active'));
                let item = items[index];
                let key = item.getAttribute('data-key-text');
                item.classList.add('active');
                const targetImg = section.querySelector(
                    `.key_highlights_bg_wrap img[data-img-bg="${key}"]`
                );
                if (targetImg) targetImg.classList.add('active');
                const progress = item.querySelector('.progress');
                progress.style.transition = 'none';
                progress.style.strokeDashoffset = 113;
                progress.style.opacity = 1;

                setTimeout(() => {
                    progress.style.transition = `stroke-dashoffset ${duration}ms linear`;
                    progress.style.strokeDashoffset = 0;
                }, 50);
            };
            const startAuto = () => {
                interval = setInterval(() => {
                    current = (current + 1) % items.length;
                    activate(current);
                }, duration);
            };

            const stopAuto = () => {
                clearInterval(interval);
            };
            items.forEach((item, index) => {
                item.addEventListener('mouseenter', () => {
                    stopAuto();
                    current = index;
                    activate(current);
                });
                item.addEventListener('mouseleave', () => {
                    startAuto();
                });
            });
            activate(current);
            startAuto();
        },

        tabs_indicator: function () {
            const tabsWrap = document.querySelectorAll('.living_tabs');
            if (!tabsWrap.length) return;
            tabsWrap.forEach((nav) => {
                const indicator = nav.querySelector('.tab-indicator');
                const links = nav.querySelectorAll('.nav-link');

                if (!indicator || !links.length) return;

                const moveIndicator = (el) => {
                    const rect = el.getBoundingClientRect();
                    const parentRect = nav.getBoundingClientRect();

                    indicator.style.width = rect.width + 'px';
                    indicator.style.left = (rect.left - parentRect.left) + 'px';
                };
                const active = nav.querySelector('.nav-link.active');
                if (active) {
                    setTimeout(() => moveIndicator(active), 50);
                }
                links.forEach(link => {
                    link.addEventListener('click', function () {
                        setTimeout(() => moveIndicator(this), 50);
                    });
                });
                window.addEventListener('resize', () => {
                    const active = nav.querySelector('.nav-link.active');
                    if (active) moveIndicator(active);
                });
            });

        },

        neighborhood_slider: function () {

            var $slider = document.querySelector('.neighborhood_carousel');
            if (!$slider) return;

            var $slider = new Swiper('.neighborhood_carousel', {
                spaceBetween: 30,
                speed: 700,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                effect: 'coverflow',
                loop: true,
                centeredSlides: true,
                slidesPerView: 2,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1.2,
                    slideShadows: false,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1.15,
                        spaceBetween: 15,
                        coverflowEffect: {
                            depth: 60,
                            modifier: 1
                        }
                    },
                    576: {
                        slidesPerView: 1.25,
                        spaceBetween: 15
                    },
                    768: {
                        slidesPerView: 1.5,
                        spaceBetween: 25
                    },
                    1440: {
                        slidesPerView: 1.75,
                    },
                    1601: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    }

                }
            });

        },

        amenitiesReveal: function () {
            gsap.registerPlugin(ScrollTrigger);
            const mm = gsap.matchMedia();

            mm.add("(min-width: 992px)", () => {
                const items = gsap.utils.toArray('.amenities_item');
                if (!items.length) return;
                
                gsap.set('.amenities_item img', {
                    clipPath: "inset(0 0 100%)",
                    scale: 1.1,
                });

                items.forEach((item) => {
                    const img = item.querySelector('img');
                    gsap.fromTo(img,
                        { y: 0 },
                        {
                            y: 0,
                            clipPath: "inset(0 0 0%)",
                            scale: 1,
                            ease: "power3.out",
                            once: true,
                            scrollTrigger: {
                                trigger: item,
                                start: "top 80%",
                                end: "top 20%",
                            }
                        }
                    );
                });
            });
        },

        gallerySlider: function () {
            const swipers = [];
            document.querySelectorAll('.gallery-slider-wrap').forEach((wrap) => {
                const el = wrap.querySelector('.gallery_carousel');
                const nextBtn = wrap.querySelector('.swiper-button-next');
                const prevBtn = wrap.querySelector('.swiper-button-prev');
                const scrollbarEl = wrap.querySelector('.gallery-scrollbar');

                let swiper = new Swiper(el, {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    freeMode: true,
                    grabCursor: true,

                    navigation: {
                        nextEl: nextBtn,
                        prevEl: prevBtn,
                    },

                    scrollbar: {
                        el: scrollbarEl,
                        draggable: true,
                        hide: true
                    },

                    breakpoints: {
                        0: {
                            slidesPerView: 1.1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 1.8,
                            spaceBetween: 20,
                        },
                        992: {
                            slidesPerView: 2.1
                        },
                        1200: {
                            slidesPerView: 3.2
                        }
                    },

                    on: {
                        init: function () {
                            toggleArrows(this);
                        },
                        resize: function () {
                            toggleArrows(this);
                        },
                        update: function () {
                            toggleArrows(this);
                        }
                    }
                });

                swipers.push(swiper);
                
                function toggleArrows(swiperInstance) {
                    if (!nextBtn || !prevBtn) return;

                    if (swiperInstance.isLocked) {
                        nextBtn.style.display = 'none';
                        prevBtn.style.display = 'none';
                    } else {
                        nextBtn.style.display = '';
                        prevBtn.style.display = '';
                    }
                }

            });
            document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
                tab.addEventListener('shown.bs.tab', function () {
                    setTimeout(() => {
                        swipers.forEach(swiper => swiper.update());
                    }, 100);
                });
            });
        },

        galleryLightbox: function () {
            const lightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: false,
                zoomable: false,
                draggable: false
            });
            lightbox.on('open', () => {
                if (window._lenis) {
                    window._lenis.stop();
                }
            });
            lightbox.on('close', () => {
                if (window._lenis) {
                    window._lenis.start();
                }
            });
        },

        testimonialSlider: function () {

            const sliderEl = document.querySelector('.testimonial_slider');
            if (!sliderEl) return;

            new Swiper(sliderEl, {
                slidesPerView: 1,
                spaceBetween: 30,
                speed: 1000,
                loop: false,
                autoHeight: false,
                navigation: {
                    nextEl: sliderEl.querySelector('.swiper-button-next'),
                    prevEl: sliderEl.querySelector('.swiper-button-prev'),
                },
                effect: 'slide',
                allowTouchMove: false,
                simulateTouch: false,
                touchRatio: 0,
                touchAngle: 0,
                on: {
                    init: function () {
                        this.update();
                    }
                }
            });
        },

        videoLightbox: function () {
            const items = document.querySelectorAll('.glightbox-video');
            const lightbox = GLightbox({
                selector: '.glightbox-video',
                touchNavigation: items.length > 1,
                loop: items.length > 1,
                zoomable: false,
                draggable: false
            });
            lightbox.on('open', () => {
                if (items.length <= 1) {
                    document.querySelectorAll('.gprev, .gnext').forEach(el => {
                        el.style.display = 'none';
                    });
                }
                if (window._lenis) window._lenis.stop();
            });
            lightbox.on('close', () => {
                if (window._lenis) window._lenis.start();
            });
        },

        floorSorting: function () {

            const section = document.querySelector('.floor_plan_cards');
            if (!section) return;

            const ctx = gsap.context(() => {
                const nav = section.querySelector('.floor-filter');
                const buttons = nav.querySelectorAll('.nav-link');
                const indicator = nav.querySelector('.tab-indicator');
                const items = section.querySelectorAll('.plans_cards_row .col');
                const loader = section.querySelector('.plans_loader');

                if (!buttons.length || !items.length || !loader) return;

                const moveIndicator = (el) => {
                    const rect = el.getBoundingClientRect();
                    const parentRect = nav.getBoundingClientRect();

                    indicator.style.width = rect.width + 'px';
                    indicator.style.left = (rect.left - parentRect.left) + 'px';
                };

                const active = nav.querySelector('.nav-link.active');
                if (active) setTimeout(() => moveIndicator(active), 50);

                buttons.forEach(btn => {

                    btn.addEventListener('click', function () {

                        if (loader.classList.contains('active')) return;

                        const filter = this.dataset.filter;
                        buttons.forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        moveIndicator(this);
                        loader.classList.add('active');
                        const currentVisible = Array.from(items).filter(i => i.style.display !== 'none');
                        gsap.killTweensOf(currentVisible);
                        gsap.to(currentVisible, {
                            opacity: 0,
                            scale: 1,
                            duration: 0.25,
                            stagger: 0.04,
                            ease: "power2.out",
                            overwrite: 'auto',
                            onComplete: () => {
                                items.forEach(item => {
                                    const cat = item.dataset.category;
                                    item.style.display = (filter === 'all' || filter === cat) ? 'block' : 'none';
                                });
                                const nextVisible = Array.from(items).filter(i => i.style.display !== 'none');
                                gsap.fromTo(nextVisible,
                                    {
                                        opacity: 0,
                                        y: 30
                                    },
                                    {
                                        opacity: 1,
                                        y: 0,
                                        duration: 0.45,
                                        stagger: 0.06,
                                        ease: "power3.out",
                                        overwrite: 'auto',
                                        onComplete: () => {
                                            loader.classList.remove('active');
                                            ScrollTrigger.refresh();
                                        }
                                    }
                                );

                            }
                        });
                    });
                });
                window.addEventListener('resize', () => {
                    const active = nav.querySelector('.nav-link.active');
                    if (active) moveIndicator(active);
                });
            }, section);
        },

        contact_form: function () {
            $("#contact_form").validate({
                submitHandler: function (form) {

                    let formData = $(form).serialize();
                    $.ajax({
                        type: "POST",
                        url: "contact_process.php",
                        data: formData,
                        beforeSend: function () {
                            $("#sucessmessage").html("Sending...");
                        },
                        success: function (response) {
                            $("#sucessmessage").html(response);
                            $("#contact_form")[0].reset();
                        },
                        error: function () {
                            $("#sucessmessage").html("Something went wrong.");
                        }
                    });
                    return false;
                }
            });
        },

        initializ: function () {
            this.dynamic_year();
            this.lenis_scroll();
            this.svg_inline();
            this.bootstrap_menu();
            this.navbar_toggler();
            this.header_anim();
            this.back_to_top();
            this.aos_anim();
            this.nice_select();
            this.parallax_image();
            this.text_reveal();
            this.date_picker();
            this.button_explode();
            this.scroll_to_section();
            this.parallax_dual();
            this.counter_anim();
            this.key_highlights_hover();
            this.tabs_indicator();
            this.neighborhood_slider();
            this.amenitiesReveal();
            this.gallerySlider();
            this.galleryLightbox();
            this.testimonialSlider();
            this.videoLightbox();
            this.floorSorting();
            this.contact_form();

            setTimeout(function () {
                ScrollTrigger.refresh();
            }, 100);            
        },
        reinit_on_resize: function () {
            this.bootstrap_menu();
            this.parallax_image();

            ScrollTrigger.refresh();
        }
    };

    /* ---------------------------------------------
       Document ready function
    --------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        gladia.initializ();
    });
    window.addEventListener('resize', function () {
        clearTimeout(window._bmr);
        window._bmr = setTimeout(function () {
            gladia.reinit_on_resize();
        }, 200);
    });

    setTimeout(function () {
        $('.nice-select .list, .dropdown-menu, .offcanvas-body')
            .attr('data-lenis-prevent', '');
    }, 100);

    $(document).on('change', 'select.form-select', function () {
        var $select = $(this);
        if ($select.val()) {
            $select.addClass('has-value');
            $select.next('.nice-select').addClass('has-value');
        } else {
            $select.removeClass('has-value');
            $select.next('.nice-select').removeClass('has-value');
        }
    });
})(jQuery);

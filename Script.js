const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const header = document.querySelector("header");
const hero = document.querySelector(".hero");

let currentSlide = 0;

const slideInterval = 4000; // 3 seconds
let slideTimer;


/* ========================================
   HERO SLIDESHOW
======================================== */

function showSlide(index) {

    if (!slides.length) return;

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");

    if (dots[index]) {
        dots[index].classList.add("active");
    }

    currentSlide = index;


    /* Header brightness detection
       If it fails, slideshow continues normally */

    try {
        updateHeaderColor();
    } catch (error) {
        console.warn(
            "Header color detection failed:",
            error
        );
    }
}


/* ========================================
   AUTO SLIDESHOW
======================================== */

function startSlideshow() {

    clearInterval(slideTimer);

    console.log("Slideshow started");

    slideTimer = setInterval(() => {

        const nextSlide =
            (currentSlide + 1) % slides.length;

        console.log(
            "Changing to slide:",
            nextSlide + 1
        );

        showSlide(nextSlide);

    }, slideInterval);
}


/* ========================================
   DOT CONTROLS
======================================== */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        // Restart countdown after manual selection
        startSlideshow();

    });

});


/* ========================================
   AUTO HEADER COLOR
======================================== */

function updateHeaderColor() {

    const activeSlide =
        document.querySelector(".slide.active");

    if (!activeSlide || !header || !hero) return;

    const img =
        activeSlide.querySelector("img");

    if (!img) return;


    /* Wait until image is loaded */

    if (!img.complete || !img.naturalWidth) {

        img.addEventListener(
            "load",
            updateHeaderColor,
            { once: true }
        );

        return;
    }


    /* ========================================
       CALCULATE OBJECT-FIT: COVER
    ======================================== */

    const heroWidth =
        hero.clientWidth;

    const heroHeight =
        hero.clientHeight;

    const imageWidth =
        img.naturalWidth;

    const imageHeight =
        img.naturalHeight;

    const imageRatio =
        imageWidth / imageHeight;

    const heroRatio =
        heroWidth / heroHeight;


    let sourceX = 0;
    let sourceY = 0;

    let sourceWidth =
        imageWidth;

    let sourceHeight =
        imageHeight;


    if (imageRatio > heroRatio) {

        /* Image wider than viewport:
           crop left and right */

        sourceWidth =
            imageHeight * heroRatio;

        sourceX =
            (imageWidth - sourceWidth) / 2;

    } else {

        /* Image taller than viewport:
           crop top and bottom */

        sourceHeight =
            imageWidth / heroRatio;

        sourceY =
            (imageHeight - sourceHeight) / 2;
    }


    /* ========================================
       BRIGHTNESS SAMPLER
    ======================================== */

    function getBrightness(
        x,
        y,
        width,
        height
    ) {

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext(
                "2d",
                { willReadFrequently: true }
            );

        canvas.width = 60;
        canvas.height = 30;


        ctx.drawImage(

            img,

            sourceX + sourceWidth * x,
            sourceY + sourceHeight * y,

            sourceWidth * width,
            sourceHeight * height,

            0,
            0,

            canvas.width,
            canvas.height
        );


        const pixels =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            ).data;


        let total = 0;
        let count = 0;


        for (
            let i = 0;
            i < pixels.length;
            i += 4
        ) {

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];


            const luminance =
                0.2126 * r +
                0.7152 * g +
                0.0722 * b;


            total += luminance;
            count++;
        }


        return total / count;
    }


    /* ========================================
       SAMPLE HEADER AREAS
    ======================================== */

    const leftBrightness =
        getBrightness(
            0.00,
            0.02,
            0.18,
            0.18
        );


    const rightBrightness =
        getBrightness(
            0.72,
            0.02,
            0.28,
            0.18
        );


    /* ========================================
       DECIDE HEADER COLOR
    ======================================== */

    const darkestArea =
        Math.min(
            leftBrightness,
            rightBrightness
        );


    const threshold = 150;


    const useWhiteHeader =
        darkestArea < threshold;


    header.classList.toggle(
        "hero-header-light",
        useWhiteHeader
    );


    console.log(
        "Hero:",
        currentSlide + 1,
        "| Left:",
        Math.round(leftBrightness),
        "| Right:",
        Math.round(rightBrightness),
        "| Header:",
        useWhiteHeader
            ? "WHITE"
            : "BLACK"
    );
}


/* ========================================
   INITIAL LOAD
======================================== */

window.addEventListener("load", () => {

    if (!slides.length) return;

    /*
       Always start from the first slide
    */

    currentSlide = 0;

    showSlide(currentSlide);

    startSlideshow();

});


/* ========================================
   WINDOW RESIZE
======================================== */

window.addEventListener("resize", () => {

    try {
        updateHeaderColor();
    } catch (error) {
        console.warn(
            "Header color detection failed:",
            error
        );
    }

});
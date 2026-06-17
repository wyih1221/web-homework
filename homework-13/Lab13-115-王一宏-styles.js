(function () {
    const CONFIG = {
        magnifierSize: 180,
        initialZoom: 3,
        minZoom: 1.5,              
        maxZoom: 6,               
        zoomStep: 0.5,            
    };

    let currentZoom = CONFIG.initialZoom;

    const wrapper   = document.getElementById('imageWrapper');
    const previewImg = document.getElementById('previewImg');
    const magnifier = document.getElementById('magnifier');
    const zoomValue = document.getElementById('zoomValue');


    function initMagnifier() {
        const imgRect = previewImg.getBoundingClientRect();

        magnifier.style.backgroundImage = `url("${previewImg.src}")`;
        magnifier.style.backgroundSize =
            `${imgRect.width * currentZoom}px ${imgRect.height * currentZoom}px`;
    }

    if (previewImg.complete) {
        initMagnifier();  
    } else {
        previewImg.addEventListener('load', initMagnifier);
    }

    window.addEventListener('resize', () => {
        const imgRect = previewImg.getBoundingClientRect();
        magnifier.style.backgroundSize =
            `${imgRect.width * currentZoom}px ${imgRect.height * currentZoom}px`;
    });

    wrapper.addEventListener('mouseenter', () => {
         magnifier.classList.add('visible');
    });

    wrapper.addEventListener('mouseleave', () => {
         magnifier.classList.remove('visible');
    });

    wrapper.addEventListener('mousemove', (e) => {
        const imgRect = previewImg.getBoundingClientRect();
        const half    = CONFIG.magnifierSize / 2;

        const relX = e.clientX - imgRect.left;
        const relY = e.clientY - imgRect.top;

        let magLeft = relX - half;
        let magTop  = relY - half;

        magLeft = Math.max(0, Math.min(magLeft, imgRect.width  - CONFIG.magnifierSize));
        magTop  = Math.max(0, Math.min(magTop,  imgRect.height - CONFIG.magnifierSize));

        magnifier.style.left = `${magLeft}px`;
        magnifier.style.top  = `${magTop}px`;

        const bgX = half - relX * currentZoom;
        const bgY = half - relY * currentZoom;

        magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
    });

    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();

        const imgRect = previewImg.getBoundingClientRect();

        if (e.deltaY < 0) {
            currentZoom = Math.min(CONFIG.maxZoom, currentZoom + CONFIG.zoomStep);
        } else {
            currentZoom = Math.max(CONFIG.minZoom, currentZoom - CONFIG.zoomStep);
        }

        magnifier.style.backgroundSize =
            `${imgRect.width * currentZoom}px ${imgRect.height * currentZoom}px`;

        const half = CONFIG.magnifierSize / 2;
        const relX = e.clientX - imgRect.left;
        const relY = e.clientY - imgRect.top;
        magnifier.style.backgroundPosition =
            `${half - relX * currentZoom}px ${half - relY * currentZoom}px`;

        zoomValue.textContent = `${currentZoom}×`;
    }, { passive: false });

})();
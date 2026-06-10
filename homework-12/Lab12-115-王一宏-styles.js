(function() {
    const ball = document.getElementById('ball');
    const speedSelect = document.getElementById('speedSelect');
    const speedBadge = document.getElementById('speedBadge');

    const SCENE_WIDTH  = 550;
    const SCENE_HEIGHT = 350;
    const RAMP_CX      = 275;
    const RAMP_CY      = 175;
    const RAMP_LENGTH  = 400;
    const RAMP_ANGLE   = 14;
    const BALL_SIZE    = 46;
    const RAMP_HEIGHT  = 14;

    const TRAVEL_DIST  = RAMP_LENGTH - BALL_SIZE;
    const HALF_TRAVEL  = TRAVEL_DIST / 2;

    const ANGLE_RAD    = RAMP_ANGLE * Math.PI / 180;
    const COS_A        = Math.cos(ANGLE_RAD);
    const SIN_A        = Math.sin(ANGLE_RAD);

    const PERP_DIST    = (BALL_SIZE + RAMP_HEIGHT) / 2;
    const OFFSET_X     = PERP_DIST * SIN_A;
    const OFFSET_Y     = -PERP_DIST * COS_A;

    const BALL_CIRCUMFERENCE = Math.PI * BALL_SIZE;

    const SPEED_MAP = {
        'slow':   150,
        'medium': 320,
        'fast':   650
    };

    const SPEED_LABELS = {
        'slow':   '慢速',
        'medium': '中速',
        'fast':   '快速'
    };

    const SPEED_CLASSES = {
        'slow':   'slow',
        'medium': 'medium',
        'fast':   'fast'
    };

    const STORAGE_KEY = 'ball-ramp-speed';

    let currentSpeed   = SPEED_MAP['medium'];
    let ballOffset     = -HALF_TRAVEL;
    let rollAngle      = 0;
    let lastTimestamp  = null;
    let animationId    = null;

    function calcBallPosition(offset) {
        const x = RAMP_CX + offset * COS_A + OFFSET_X;
        const y = RAMP_CY + offset * SIN_A + OFFSET_Y;
        return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
    }

    function updateBallDOM() {
        const { x, y } = calcBallPosition(ballOffset);
        ball.style.left = x + 'px';
        ball.style.top  = y + 'px';
        ball.style.transform =
            `translate(-50%, -50%) rotate(${Math.round(rollAngle * 100) / 100}deg)`;
    }

    function animate(timestamp) {
        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const rawDt = (timestamp - lastTimestamp) / 1000;
        const dt = Math.min(rawDt, 0.1);
        lastTimestamp = timestamp;

        const delta = currentSpeed * dt;
        ballOffset += delta;

        if (ballOffset >= HALF_TRAVEL) {
            ballOffset = -HALF_TRAVEL;
        }

        rollAngle += (delta / BALL_CIRCUMFERENCE) * 360;

        updateBallDOM();

        animationId = requestAnimationFrame(animate);
    }

    function setSpeed(speedKey) {
        currentSpeed = SPEED_MAP[speedKey];

        speedSelect.value = speedKey;

        speedBadge.textContent = SPEED_LABELS[speedKey];
        speedBadge.className = 'speed-badge ' + SPEED_CLASSES[speedKey];

        try {
            localStorage.setItem(STORAGE_KEY, speedKey);
        } catch (e) {
            console.warn('localStorage 存储失败:', e.message);
        }
    }

    function loadSavedSpeed() {
        let savedSpeed = null;
        try {
            savedSpeed = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.warn('localStorage 读取失败:', e.message);
        }

        if (savedSpeed && SPEED_MAP.hasOwnProperty(savedSpeed)) {
            return savedSpeed;
        }
        return 'medium';
    }

    speedSelect.addEventListener('change', function() {
        const selected = speedSelect.value;
        if (SPEED_MAP.hasOwnProperty(selected)) {
            setSpeed(selected);
        }
    });

    function init() {
        const savedSpeed = loadSavedSpeed();

        setSpeed(savedSpeed);

        updateBallDOM();

        lastTimestamp = null;
        animationId = requestAnimationFrame(animate);
    }

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            lastTimestamp = null;
        }
    });

    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });

    init();
})();
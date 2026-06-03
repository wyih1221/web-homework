const ball = document.getElementById('ball');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');

const ballRadius = 20;
const slopeStartY = 100;
const slopeAngleRadian = 45 * Math.PI / 180;
const gravity = 0.25;

let velocity = 0;
let distance = 50; 
let timer = null;

function updateBallPosition() {
    const contactX = distance * Math.cos(slopeAngleRadian);
    const contactY = slopeStartY + distance * Math.sin(slopeAngleRadian);
    const centerX = contactX - ballRadius * Math.sin(slopeAngleRadian);
    const centerY = contactY - ballRadius * Math.cos(slopeAngleRadian);

    ball.style.left = (centerX - ballRadius) + 'px';
    ball.style.top = (centerY - ballRadius) + 'px';
}

updateBallPosition();

startBtn.addEventListener('click', () => {
    if (timer !== null) return;
    
    startBtn.disabled = true;
    endBtn.disabled = false;

    timer = setInterval(() => {
        velocity += gravity;
        distance += velocity;
        updateBallPosition();

        if (distance > 1200) {
            distance = 50;
            velocity = 0;
        }
    }, 16);
});

endBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;

    distance = 50;
    velocity = 0;
    
    updateBallPosition();

    startBtn.disabled = false;
    endBtn.disabled = true;
});
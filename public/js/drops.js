
////////////////////////////////////////////////////////////////////////
// Drops
////////////////////////////////////////////////////////////////////////

/*!
 * bubbles.js
 * Orignally Written by Tara Mathers, 2010
 * ---------------------------------------------------------------------
 * Modifications by Infocinc, 2014
 */

function Bubble() {
    this.x = Math.floor(Math.random() * CANVAS_WIDTH);
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT));
    this.radius = 5 + Math.floor(Math.random() * 5);

    this.direction;
    if (Math.random() * 2 >= 1)
        this.direction = 0;
    else this.direction = 1;

    //this.amplitude = Math.round(this.radius / 9 * 5 + 2 * Math.random());
    this.velocity = (4 / (this.radius + 0.1));
    this.amplitude = 20 + Math.round(this.velocity * 20);

}

/******************************************************
 * draw()
 * draws each bubble at every frame
 ******************************************************/

function drawDrops() {
    var paint = $('#bubbles-wrapper').isOnScreen();
    if (!paint) {
        return;
    }

    for (var i = 0; i < bubbles.length; i++) {
        // Create a new bubble if one has gone off the screen
        if (bubbles[i].y - bubbles[i].radius > CANVAS_HEIGHT) {
            bubbles[i].x = Math.floor(Math.random() * CANVAS_WIDTH);
            bubbles[i].y = -Math.floor(Math.random() * CANVAS_HEIGHT * 0.1);
            bubbles[i].radius = 5 + Math.floor(Math.random() * 5);
            bubbles[i].velocity = (4 / (bubbles[i].radius + 0.1));
            bubbles[i].amplitude = 20 + Math.round(bubbles[i].velocity * 10);
        }
        if (t % bubbles[i].amplitude == 0) {

            if (bubbles[i].direction == 0)
                bubbles[i].direction = 1;
            else
                bubbles[i].direction = 0;
        }
        if (bubbles[i].direction == 0)
            bubbles[i].x -= 0.01;
        else
            bubbles[i].x += 0.01;
        bubbles[i].y += bubbles[i].velocity;
    }

    // Clear the previous canvas state
    context.drawImage(background, 0, 0);
    // Draw bubbles
    for (var i = 0; i < bubbles.length; i++) {

        context.lineWidth = 1;

        gradObj = context.createRadialGradient(bubbles[i].x,
            bubbles[i].y + bubbles[i].radius / 2.5, bubbles[i].radius / 1.8,
            bubbles[i].x, bubbles[i].y,
            bubbles[i].radius);

        gradObj.addColorStop(0, "rgba(255, 255, 255, .7)");
        gradObj.addColorStop(1, "rgba(220, 225, 223, .7)");

        context.fillStyle = gradObj;
        context.beginPath();
        context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, Math.PI * 2, true);
        context.fill();
        context.strokeStyle = "rgba(200,205,203,.2)";
        context.stroke();
    }
    t++;
}
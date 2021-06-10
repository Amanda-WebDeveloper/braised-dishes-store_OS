window.onload = function () {
    setTimeout(wellcome, 0);
};

function wellcome () {

    const canvas = document.querySelector('.canvas');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000040';
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width/2, height/2);

    let image = new Image();
    image.src = '../images/logo.png';
    image.onload = draw;


    let dX = 0;
    let dW = 0;
    
    function draw () {
        let imgWidth = 418;
        let imgHeight = imgWidth*(282/418);
    
        ctx.fillRect(-(imgWidth/2), -(imgHeight/2), imgWidth, imgHeight);
    

        let dY = dX*(282/418);
        let dH = dW*(282/418);
    
        ctx.drawImage(image, 0, 0, dX, dY, -(imgWidth/2), -(imgHeight/2), dW, dH);
    
        if (dX >= imgWidth) {
            dX = imgWidth;
            dW = imgWidth;
        
        } else {
            dX += 10;
            dW += 10;
        }
    
        setTimeout(draw, 40);
    }

}
    

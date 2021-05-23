var l = (text) => {
    console.log(text);
}; //easier to output things
window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    let md = false; //md == mousedown;

    let sizeSlider = document.getElementById('line-size'); //fetch the pen size slider

    let difference = 0.05; //basically the size of the "tools" div.0.05 == 5% of screen height

    function resize() {
        canvas.height = window.innerHeight * (1 - difference);
        canvas.width = window.innerWidth;
    }
    window.addEventListener('resize', () => {
        resize(); //resize on resize
    });
    resize();

    function draw(event) {
        if (window.innerWidth < 901) {
            difference = 0.1;
            //adjust difference to account for certain aspect ratios.
        }
        ctx.lineWidth = sizeSlider.value;
        ctx.lineCap = 'round';

        ctx.lineTo(
            event.clientX,
            event.clientY -
                window.innerHeight *
                    difference /*moving canvas down breaks drawing*/
        );
        ctx.stroke();
    }

    canvas.addEventListener('mousedown', (e) => {
        md = true;
        draw(e);
    });
    canvas.addEventListener('mouseup', () => {
        md = false;
        ctx.beginPath(); //allow single clicks without mouse movement
    });
    canvas.addEventListener('mousemove', (e) => {
        if (md) {
            draw(e);
        }
    });

    document.getElementById('clear').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    let colorList = document.getElementsByClassName('color');
    let colors = [];
    //convert into array
    for (var i = 0; i < colorList.length; i++) {
        colors.push(colorList[i]);
    }
    colors.push(document.getElementById('rgb-input-text'));

    for (var i = 0; i < colors.length; i++) {
        let color = colors[i];
        color.addEventListener('click', () => {
            //go through all color divs and delete all borders
            for (var i = 0; i < colors.length; i++) {
                let curcolor = colors[i];
                curcolor.style.border = 'none';
            }
            //add new border to selected color div
            color.style.border = '2px solid red';
            //change the line color
            if (color.id != 'rgb-input-text')
                ctx.strokeStyle = color.style.backgroundColor;
            else {
                ctx.strokeStyle = document.getElementById('rgb-input').value;
            }
        });
    }
    //download drawing
    document.getElementById('download').addEventListener('click', () => {
        var link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

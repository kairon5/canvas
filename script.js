window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    let md = false; //md == mousedown;
    let sizeSlider = document.getElementById('line-size'); //fetch the pen size slider
    let difference = 0.025; //basically the size of the "tools" div.0.05 == 5% of screen height
    let paths = [];

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
        ctx.lineJoin = 'round';
        ctx.lineTo(
            event.clientX,
            event.clientY - window.innerWidth * difference
        );
        ctx.stroke();
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths = [];
    }

    canvas.addEventListener('mousedown', (e) => {
        md = true;
        draw(e);
    });
    canvas.addEventListener('mouseup', () => {
        md = false;
        ctx.beginPath(); //allow single clicks without mouse movement

        paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });
    canvas.addEventListener('mousemove', (e) => {
        if (md) {
            draw(e);
        }
    });
    canvas.addEventListener('mouseout', () => {
        md = false;
        ctx.beginPath();
    });
    document.getElementById('clear').addEventListener('click', () => {
        clear();
    });
    //download drawing
    document.getElementById('download').addEventListener('click', () => {
        var link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        //download the drawing
        link.click();
    });
    document.getElementById('rgb-input').addEventListener('change', () => {
        if (customActive) {
            ctx.strokeStyle = document.getElementById('rgb-input').value;
        }
    });
    document.getElementById('undo').addEventListener('click', () => {
        undo();
    });

    let colorList = document.getElementsByClassName('color');
    let colors = [];
    //convert into array
    for (var i = 0; i < colorList.length; i++) {
        colors.push(colorList[i]);
    }
    colors.push(document.getElementById('eraser'));
    colors.push(document.getElementById('rgb-input-text'));

    let customActive = false;
    for (var i = 0; i < colors.length; i++) {
        let color = colors[i];
        color.addEventListener('click', () => {
            //go through all color divs and delete all borders
            for (var i = 0; i < colors.length; i++) {
                let curcolor = colors[i];
                curcolor.style.border = 'none';
            }
            //add new border to selected color div
            color.style.border = '2px solid black';
            //change the line color
            if (color.id != 'rgb-input-text' && color.id != 'eraser') {
                customActive = false;
                ctx.strokeStyle = color.style.backgroundColor;
            } else if (color.id == 'rgb-input-text') {
                customActive = true;
                ctx.strokeStyle = document.getElementById('rgb-input').value;
            } else if (color.id == 'eraser') {
                ctx.strokeStyle = 'white';
            }
        });
    }
    function undo() {
        if (paths.length <= 1) {
            clear();
        } else {
            paths.pop();
            ctx.putImageData(paths[paths.length - 1], 0, 0);
        }
    }

    //some button styling
    let buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        let cur = buttons[i];
        cur.addEventListener('mouseover', () => {
            cur.style.backgroundColor = 'rgb(200, 30, 30)';
        });
        cur.addEventListener('mouseout', () => {
            cur.style.backgroundColor = 'white';
        });
    }
});

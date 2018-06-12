var vertices = [];
var sideSlider;
var sizeSlider;
var iterationSlider;
var xoff = 0;
var chosenColor;
var seedDisplayCenter;
var customShape = false;
var xoff = 0;
var seedCoords = [];
var borderConst;
function setup() {
    createCanvas(windowWidth,windowHeight);
    textAlign(CENTER);
    borderConst = width/192;
    seedDisplayCenter = [height/5,height/5];
    sideSlider = createSlider(3,10,10,1);
    sideSlider.position(borderConst,(height/20)*9);
    sizeSlider = createSlider(0,height,height/3,.1);
    sizeSlider.position(borderConst,(height/20)*11);
    iterationSlider = createSlider(1,5,2,1);
    iterationSlider.position(borderConst,(height/20)*13);
    console.log(width)
}

function draw() {
  background(51);
  if (hexToRgb(getColorValue())) {
      chosenColor = hexToRgb(getColorValue());
  }
  drawUI();
  drawPolygon();
  fractal((width/20)*12,height/2,sizeSlider.value(),5);
  xoff += .005;
}

function drawUI() {
  noFill();
  stroke(175);
  strokeWeight(3);
  noStroke();
  fill(80);
  //custom seed window
  rect(borderConst,borderConst,(width/20)*4,(height/20)*8);
  //fractal display window
  rect(borderConst*2+(width/20)*4,borderConst,(width/20)*16-(borderConst*3),height-borderConst*2);
  fill(chosenColor.r,chosenColor.g,chosenColor.b);
  noStroke();
  //generate button
  rect((width/20)*.5,(height/20)*17+borderConst,(width/20)*3,(height/20)*2);
  //clear button
  rect((width/20)*3,(height/20)*8.5,(width/20)*1+borderConst,(height/20)*1);
  fill(255);
  textSize(20);
  //clear text
  text("CLEAR",(width/20)*3.6,(height/20)*9.15);
  stroke(chosenColor.r,chosenColor.g,chosenColor.b);
  //divider line
  line(borderConst,(height/20)*16,(width/20)*4,(height/20)*16);
  fill(chosenColor.r,chosenColor.g,chosenColor.b);
  strokeWeight(1);
  textSize(20);
  if (sideSlider.value() == 10) {
      var sideSymbol = "∞";
  } else {
      var sideSymbol = str(sideSlider.value());
  }
  //slider text
  text('Number of Sides: ' + sideSymbol,(width/20)*1.1,(height/20)*9);
  text('Size: ' + str(sizeSlider.value()),(width/20)*1.1,(height/20)*11);
  text('Recursion Directions: ' + str(iterationSlider.value()),(width/20)*1.1,(height/20)*13);
  textSize(30);
  fill(255);
  if (customShape === false) {
      text('Custom Shape',(width/20)*2,(height/20)*18.5);
  } else {
      text('Regular Polygon',(width/20)*2,(height/20)*18.5);
  }
  textSize(20);
  fill(chosenColor.r,chosenColor.g,chosenColor.b);
}

function ifClicked() {
    if(mouseX < borderConst+(width/20)*4 && mouseX > borderConst && mouseY < borderConst+(height/20)*8 && mouseY > borderConst) {
      return('customShapeWindow');
    }
    if(mouseX < (width/20)*3.5 && mouseX > (width/20)*.5 && mouseY < (height/20)*19+borderConst && mouseY > (height/20)*17+borderConst) {
      return('generateButton');
    }
    if (mouseX < (width/20)*4+borderConst && mouseX > (width/20)*3 && mouseY < (height/20)*9.5 && mouseY > (height/20)*8.5) {
        vertices = [];
        seedCoords = [];
    }
}

function mousePressed() {
  if(ifClicked() === 'customShapeWindow') {
    vertices.push([mouseX,mouseY]);
  }
  if(ifClicked() === 'generateButton') {
      if (customShape === true) {
          customShape = false;
      } else {
          customShape = true;
          genSeedShape(vertices);
      }
  }
}
function drawPolygon() {
  noFill();
  stroke(chosenColor.r,chosenColor.g,chosenColor.b);
  strokeWeight(1);
  beginShape();
  for(var i = 0; i < vertices.length; i++) {
    vertex(vertices[i][0],vertices[i][1]);
  }
  endShape(CLOSE);
}


function regularPolygon(x,y,r) {
    var angle = TWO_PI/sideSlider.value();
    beginShape();
    for (var theta = 0; theta < sideSlider.value(); theta++) {
        vertex(r*cos(theta*angle)+x,r*sin(theta*angle)+y);
    }
    endShape(CLOSE);
}
function genSeedShape(list) {
    for(var i = 0; i < vertices.length; i ++) {
        var r = sqrt(Math.pow((height/5-list[i][0]),2)+Math.pow((height/5-list[i][1]),2));
        var theta = (Math.atan2(list[i][0]-height/5,list[i][1]-height/5))+(3*PI)/2;
        seedCoords.push([r,theta]);
    }
}

function drawSeed(x,y,r) {
    beginShape();
    for (var i = 0; i < seedCoords.length; i++) {
        var xpos = ((seedCoords[i][0]*r)*cos(seedCoords[i][1]));
        var ypos = ((seedCoords[i][0]*r)*sin(seedCoords[i][1]))*-1;
        xpos += x;
        ypos += y;
        vertex(xpos,ypos);
    }
    endShape(CLOSE);
}

function fractal(x,y,r,i) {
    var rgb = hexToRgb(getColorValue());
    var ratio = 1.5/(height/5);
    noFill();
    stroke(rgb.r,rgb.g,rgb.b);
    if (customShape === true) {
        drawSeed(x,y,r*ratio);
    } else if (sideSlider.value() == 10) {
        ellipse(x,y,r*2);
    } else {
        regularPolygon(x,y,r);
    }
    if (i > 0) {
        var angle = TWO_PI/iterationSlider.value();
        for (var theta = 0; theta < iterationSlider.value(); theta++) {
            fractal(r*cos(theta*angle)+x,r*sin(theta*angle)+y,r/2,i-1);
        }
    }
}

function getColorValue() {
    return document.getElementById('color-input').value;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

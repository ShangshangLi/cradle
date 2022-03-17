let data;
let vectors;

let pos;

function preload(){
  data=loadJSON('xkcd.json');
}

function setup(){
  noCanvas();
  // console.log(data);
  vectors=processData(data);
  console.log(vectors);
  
  //pos=createVector(random(255),random(255),random(255));//create a random color and to find the color close to this color;
  // findNearest(pos);
  pos=createVector(0,0,255);
  //need to make sure there won't be negative number
  
}

function draw(){
  let colorName = findNearest(pos);
  
  //change the background color;
  let div = createDiv(colorName);
  let v = vectors[colorName];
  console.log(v.x);
  div.style('color','rgb(${v.x},${v.y},${v.z})');//i don't know why the color function don't work here;
  
  let r = p5.Vector.random3D();//random3D will give a random vector;
  r.mult(50);//since the original step is to small, make r be bigger to make larger change in color;
  pos.add(r);//make it add random value and walk, and create new div for new color;
  
  //avoid negative value;
  pos.x = constrain(pos.x,0,255);//make it stay positive;
  pos.y = constrain(pos.y,0,255);//make it stay positive;
  pos.z = constrain(pos.z,0,255);//make it stay positive;
  
  frameRate(1); //operate once per second;
}

function processData(data){
  let vectors={};//object;
  let colors=data.colors;
  for(let i =0; i<colors.length;i++){//go through everything in the data;
    let label=colors[i].color;
    let rgb=color(colors[i].hex);//color(...) - is p5js's color function;
    vectors[label]=createVector(red(rgb),green(rgb),blue(rgb));//make rgb value into vectors, and they are objects not array; 
  }
  return vectors;
}

function findNearest(v){
  let keys=Object.keys(vectors);//make objects into array;

  keys.sort((a,b)=>{
    //use arrow syntax to write a function comparing a & b;
    let d1=distance(v,vectors[a]);
    let d2=distance(v,vectors[b]);
    //to tell the array which one is closer to v;
    return d1-d2;//if use d2-d1, will get the most furthest one;
  });
  
  console.log(v);
  console.log(vectors[keys[0]]);//the first one in the list;
  //to see whether sort the list in the correct oder;
  //v and vectors[keys[0]] should be similar value;
  
  console.log(keys);//get a list of colors from the order of the closeness;
  
  return keys[0];//only get the cloest one;
}

function distance(v1,v2){
  return p5.Vector.dist(v1,v2);//p5's distance function;
}
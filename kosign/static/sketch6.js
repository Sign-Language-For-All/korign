let handpose;
let video;
let predictions = [];
let canvas;
let answer;



const scoreText = document.getElementById('score');
const answerImage = document.getElementById('answer2');
let data_json = document.getElementById('data_json');
let username = document.getElementById('username').innerText;

function setup() {

  String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
  }
  
  canvas = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  canvas.parent('wrapper')
  handpose = ml5.handpose(video, modelReady);
  // d3.json("dataset/ja-eum/k.json").then(function(data_json) {
  //   //do your stuff
  //   answer = data_json[0].landmarks;
  //   console.log("answer is loaded",answer);
    
  // })
  console.log("original data_json",data_json);
  data_json = JSON.parse(data_json.innerHTML.replaceAll("'",'"'))
  console.log("parsed data_json",data_json);
  answer = data_json.landmarks;
  console.log("answer is loaded",answer);

  // if(answerImage) {
  //     answerImage.setAttribute('src', 'dataset/ja-eum/pic/k.png')
  // }

  
  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
  
}
let idx = 0
function draw() {
  image(video, 0, 0, width, height);

  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  //draw video capture feed as image inside p5 canvas
  image(video, 0, 0);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();

  evaluate();
  // idx += 1;
  // console.log("idx",idx," / timeTaken",timeTaken);
  // saveCanvas(canvas, 'myCanvas', 'jpg');
  // console.log(predictions);
  
}

let cur = document.getElementById("cur");
let sec = parseInt(document.getElementById("sec").innerText);
console.log("sec",sec)

var jauem_prev2cur = {
  "g":"n","n":"fin_ja","d":"r","r":"m","m":"b","b":"s","s":"ng",
    "ng":"j","j":"ch","ch":"k","k":"t","t":"p","p":"h","h":"fin_ja"
};

var moeum_prev2cur = {
  "a":"ya","ya":"eo","eo":"yeo","yeo":"fin_mo"
};

let scoreValue = 0;
let timeleft = 10;
let timeTaken = 0;

let downloadTimer = setInterval(function(){
  timeTaken += 1;
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Finished";
    console.log("[USERNAME]",username)

    if(cur.innerText in jauem_prev2cur){
      if (jauem_prev2cur[cur.innerText] == "fin_ja"){
        location.href = 'http://127.0.0.1:5000/sign_detail'+"?sec="+(timeTaken+sec)+"&username="+username+"&mode=update"+"&what_update=ja"; 
      }else{
        location.href = 'http://127.0.0.1:5000/korign/'+jauem_prev2cur[cur.innerText]+"/"+username+"?sec="+(timeTaken+sec);
      }
    }else if(cur.innerText in moeum_prev2cur){
      if (moeum_prev2cur[cur.innerText] == "fin_mo"){
        location.href = 'http://127.0.0.1:5000/sign_detail'+"?sec="+(timeTaken+sec)+"&username="+username+"&mode=update"+"&what_update=mo";
      }else{
        location.href = 'http://127.0.0.1:5000/korign/'+moeum_prev2cur[cur.innerText]+"/"+username+"?sec="+(timeTaken+sec);
      }
    }
    timeleft = 10;
    // window.location.href = '/korign/1/';
  } else {
    console.log(scoreValue);  
    if (scoreValue <= 0.7) {
      timeleft = 10;
      document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
      setInterval(downloadTimer, 1000);
    } else {
      document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
    }
  }
  timeleft -= 1;

}, 1000);

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];

    for (let j=0; j< prediction.annotations.thumb.length; j++) {
      const keypoint = prediction.annotations.thumb[j];
      fill(0, 128, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

    for (let j=0; j< prediction.annotations.indexFinger.length; j++) {
      const keypoint = prediction.annotations.indexFinger[j];
      fill(0, 0, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

    for (let j=0; j< prediction.annotations.middleFinger.length; j++) {
      const keypoint = prediction.annotations.middleFinger[j];
      fill(127, 0, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

    for (let j=0; j< prediction.annotations.ringFinger.length; j++) {
      const keypoint = prediction.annotations.ringFinger[j];
      fill(255, 0, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

    for (let j=0; j< prediction.annotations.pinky.length; j++) {
      const keypoint = prediction.annotations.pinky[j];
      fill(0, 255, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }

    for (let j=0; j< prediction.annotations.thumb.palmBase; j++) {
      const keypoint = prediction.annotations.thumb[j];
      fill(255, 0, 127);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
    // for (let j = 0; j < prediction.landmarks.length; j += 1) {
    //   const keypoint = prediction.landmarks[j];
    //   fill(0, 255, 0);
    //   noStroke();
    //   ellipse(keypoint[0], keypoint[1], 10, 10);
    // }
  }
}

function vectorize(a, b) {
  const x = a[0] - b[0]
  const y = a[1] - b[1]

  return {x, y}
}

function unit_vectorize(x, y) {
  const length = Math.sqrt(x*x + y*y);
  return { x: x/length, y: y/length};
}

function cosinesim(A,B){
  var dotproduct=0;
  var mA=0;
  var mB=0;
  for(i = 0; i < A.length; i++){ // here you missed the i++
      dotproduct += (A[i] * B[i]);
      mA += (A[i]*A[i]);
      mB += (B[i]*B[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = (dotproduct)/((mA)*(mB)) // here you needed extra brackets
  return similarity;
}

function score(x) {
  if (x < 0.5) {
    x = 0
  } else {
    x -= 0.5
    x = x * 2
  }
  return x
}

function evaluate() {
  for (let i = 0; i < predictions.length; i += 1) {
    const pred = predictions[i];

    const ids = [
      [4, 8],
      [8, 12],
      [12, 16],
      [16, 20],
      [0, 4],
      [0, 8],
      [0, 12],
      [0, 16],
      [0, 20]
    ]

    let similarity = 0;
    for (let j = 0; j < ids.length; j += 1) {
      const pred_keypoints = pred.landmarks;
      pred_vector = vectorize(pred_keypoints[ids[j][0]], pred_keypoints[ids[j][1]]);
      pred_unit_vector = unit_vectorize(pred_vector.x, pred_vector.y);
      // console.log(pred_unit_vector)
      const answer_keypoints = answer;
      answer_vector = vectorize(answer_keypoints[ids[j][0]], answer_keypoints[ids[j][1]]);
      answer_unit_vector = unit_vectorize(answer_vector.x, answer_vector.y);

      similarity += cosinesim(
        [pred_unit_vector.x, pred_unit_vector.y], 
        [answer_unit_vector.x, answer_unit_vector.y])
    }
    
    scoreValue = score(((similarity / 9) + 1) / 2);
    // scoreText.innerHTML = scoreValue;
    // console.log(answer_unit_vector)
    // similarity([pred_unit_vector.x, pred_unit_vector.y], [pred_unit_vector.x, pred_unit_vector.y])
    
  }

}
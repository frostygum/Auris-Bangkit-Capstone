let mobilenet;
let model;
let mymodel;
const webcam = new Webcam(document.getElementById('videoElement'));
//const dataset = new RPSDataset();
//var rockSamples=0, paperSamples=0, scissorsSamples=0;
let isPredicting = false;
const letter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

init();

async function loadModel(){
  console.log("this is inside loadModel()");
  var timer = 0;
  setInterval(function(){timer = timer+1;}, 1000);
  const mymodel = await tf.loadLayersModel('model.json');
  const layer = mymodel.getLayer('dense_1');
  console.log("loadModel() done, time needed : "+ timer + " s");
  //console.log(tf.model({inputs: mymodel.inputs, outputs: layer.output}));
  return tf.model({inputs: mymodel.inputs, outputs: layer.output});
}

async function predict() {
  //const mymodel = await tf.loadLayersModel('model.json');

  while (isPredicting) {     

    const predictedClass = tf.tidy(() => {
        const img = webcam.capture();
        console.log(img);
        const result = mymodel.predict(img);
        const idx = result.as1D().argMax().data()[0];

	      document.getElementById("result").innerText = result;

        //letter = result[idx];
        //document.getElementById("letter").innerText = letter;
        return result.as1D().argMax();
      //const activation = mymodel.predict(img);
      //console.log("activation : ");
      //console.log(activation);
      //const predictions = model.predict(activation);
      //console.log(predictions);
      //return predictions.as1D().argMax();
    });
    const classId = (await predictedClass.data())[0];
    //console.log(classId);
    var predictionLetter = "";
    predictionLetter = letter[classId];
	  document.getElementById("letter").innerText = predictionLetter;
			
    
    predictedClass.dispose();
    await tf.nextFrame();
  }
}

function startPredicting(){
	isPredicting = true;
	predict();
}

function stopPredicting(){
	isPredicting = false;
	predict();
}


async function init(){
	await webcam.setup();
	mymodel = await loadModel();
	tf.tidy(() => mymodel.predict(webcam.capture()));
		
}



let round = 1;
let model;

document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('video').style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            document.getElementById('video').srcObject = stream;
            document.getElementById('cakeSelection').style.display = 'flex';
            document.getElementById('instructions').style.display = 'block'; // Show instructions
            document.getElementById('cake-header').style.display = 'none'; // hide cake header
            document.getElementById('startButton').style.display = 'none'; // hide start button
            main_function();
        })
        .catch(function(error) {
            console.log("Something went wrong!");
        });
});


function selectCake(cake) {



    document.getElementById('instructions').style.display = 'none';
    // Display feedback after 2 seconds
    setTimeout(() => {
        
        let feedbackImage = ""
        console.log('round:', round);
        if (round == 1) {
            console.log("HERE ROUND 1")
            feedbackImage = document.getElementById('feedbackImageBad');
            document.getElementById('feedbackBad').style.display = 'block';
            document.getElementById('feedbackmessageBad').style.display = 'block'; 
            

        } else if (round == 2) {
            //console.log("HERE ROUND 2")
            feedbackImage = document.getElementById('feedbackImageBad');
            document.getElementById('feedbackBad').style.display = 'block';
            //document.getElementById('feedbackmessage').style.display = 'block'; 
            document.getElementById('feedbackmessageBad').style.display = 'block'; 
            console.log("Feedback message printed:", document.getElementById('feedbackmessageBad').textContent);

        } else if (round == 3) {
            feedbackImage = document.getElementById('feedbackImageGood');
            document.getElementById('feedbackGood').style.display = 'block';
            
            document.getElementById('feedbackmessageGood').style.display = 'block'; 
            //document.getElementById('feedbackmessage').style.innerText = 'Nice!'; 



        } else if (round == 4) {
            feedbackImage = document.getElementById('feedbackImageBad');
            document.getElementById('feedbackBad').style.display = 'block';

            //document.getElementById('feedbackmessage').style.display = 'block'; 
            document.getElementById('feedbackmessageBad').style.display = 'block';

        } else if (round == 5) {
            feedbackImage = document.getElementById('feedbackImageBad');
            document.getElementById('feedbackBad').style.display = 'block';

            //document.getElementById('feedbackmessage').style.display = 'block';
            document.getElementById('feedbackmessageBad').style.display = 'block'; 

        } 
        
        

        document.getElementById('instructions').style.display = 'none'; 
        document.getElementById('cakeSelection').style.display = 'none';
        
        
       


        // This is where you'd add logic to choose thumbs up or down
        // For now, it randomly selects one
        //feedbackImage.src = Math.random() > 0.5 ? 'thumbs-up.jpg' : 'thumbs-down.jpg';
        setTimeout(() => {
            const image_data = captureFrameToTensor();
            const prediction = make_prediction(image_data);
            prediction.then((result) => {
                console.log(result); // Output: "sad"
            });
            prediction.then(result => {
                document.getElementById('predictionMessage').innerText = "Your emotion state appears to be " + result;
                if (round == 6) {
                    document.getElementById('predictionScreen').style.display = 'block';
                } 
                
                document.getElementById('feedbackBad').style.display = 'none';
                document.getElementById('feedbackGood').style.display = 'none';
                //document.getElementById('feedbackmessage').style.display = 'none';

                document.getElementById('feedbackmessageBad').style.display = 'none'; 
                document.getElementById('feedbackmessageGood').style.display = 'none'; 

                main_function();
            });

        }, 4000);
    }, 2000);
    
    image_data = captureFrameToTensor();
    console.log("image data captured")
    


}

async function loadModel() {
    try {
        // Load the model
        const model = await tf.loadLayersModel('emotion_model_tfjs/model.json');
        console.log('Model loaded successfully:', model);
        return model;
    } catch (error) {
        // Handle any errors that occur during model loading
        console.error('Error loading model:', error);
    }
}

// Call the loadModel function to load and use the model


function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


function captureFrameToTensor() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    //const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const imageData = tf.browser.fromPixels(canvas).mean(2).expandDims(2); // Convert to grayscale and add a singleton dimension


    // Directly convert the canvas pixels to a tensor
    //var imageData = tf.browser.fromPixels(canvas);

    const tensor = imageData.toFloat().div(tf.scalar(255.0)).resizeNearestNeighbor([48, 48]).expandDims();


    const imageDataUrl = canvas.toDataURL('image/png');


    console.log("frame captured")
    // You might need to preprocess the tensor here depending on your model's needs

    /*
    // Convert the canvas to a data URL
    const imageDataUrl = canvas.toDataURL('image/png');

    // Create a temporary link element and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataUrl;
    downloadLink.download = 'captured-frame.png';
    document.body.appendChild(downloadLink);
    downloadLink.clixck();
    document.body.removeChild(downloadLink);
    */
   
    return tensor;
}



async function make_prediction(image_data) {
      // Once the model is loaded, perform facial expression recognition using the loaded model
      //const image_data = captureFrameToTensor(); // Assuming captureFrameToTensor() returns a tensor
      const model = await loadModel();

      // Check if the model is loaded
      if (!model) {
          throw new Error('Model not loaded.');
      }

      const prediction = model.predict(image_data);
       // Process the prediction results
      console.log('Prediction:', prediction.dataSync());

      const predictionArray = Array.from(prediction.dataSync());

      const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
      const maxProbabilityIndex = predictionArray.indexOf(Math.max(...predictionArray));
      const predictedEmotion = emotions[maxProbabilityIndex];
      
      return predictedEmotion;
      

}

function main_function() {

    
    let newContent = ""
    setTimeout(function() {
        console.log('round', round);
        if (round == 2) {

            newContent = `
            <img src="images/cake4.jpeg" alt="New Cake 1" id="cake" onclick="selectCake('newCake1')">
            <img src="images/cake5.jpeg" alt="New Cake 2" id="cake" onclick="selectCake('newCake2')">
            <img src="images/cake6.jpeg" alt="New Cake 3" id="cake" onclick="selectCake('newCake3')">
                `;

        } else if (round == 3) {

            newContent = `
            <img src="images/cake7.jpeg" alt="New Cake 1" id="cake" onclick="selectCake('newCake1')">
            <img src="images/cake8.jpeg" alt="New Cake 2" id="cake" onclick="selectCake('newCake2')">
            <img src="images/cake9.jpeg" alt="New Cake 3" id="cake" onclick="selectCake('newCake3')">
                `;
        } else if (round == 4) {

            newContent = `
            <img src="images/cake10.jpeg" alt="New Cake 1" id="cake" onclick="selectCake('newCake1')">
            <img src="images/cake11.jpeg" alt="New Cake 2" id="cake" onclick="selectCake('newCake2')">
            <img src="images/cake12.jpeg" alt="New Cake 3" id="cake" onclick="selectCake('newCake3')">
                `;

        } else if (round == 5) {

            newContent = `
            <img src="images/cake3.jpeg" alt="New Cake 1" id="cake" onclick="selectCake('newCake1')">
            <img src="images/cake7.jpeg" alt="New Cake 2" id="cake" onclick="selectCake('newCake2')">
            <img src="images/cake2.jpeg" alt="New Cake 3" id="cake" onclick="selectCake('newCake3')">
                `;

        } else if (round == 6) {

            console.log('hi');
            document.getElementById('instructions').innerText = "All done!!";
            document.getElementById('instructions').style.display = 'block';
            document.getElementById('instructions').style.fontSize = '60px';

            // Set font weight to bold
            document.getElementById('instructions').style.fontWeight = 'bold';


        }

        document.getElementById('predictionMessage').innerText = "";
        // Get the element by ID and replace its content
        var cakeSelectionDiv = document.getElementById("cakeSelection");
        cakeSelectionDiv.innerHTML = newContent;

        // Make sure the cakeSelection div is visible
        cakeSelectionDiv.style.display = "block";
        
        round += 1;
        
        //document.getElementById('instructions').style.display = 'none'; 
    }, 1000);

    

}
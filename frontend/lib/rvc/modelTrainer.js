import * as tf from '@tensorflow/tfjs-node';

export async function trainGenreModel(genreType, trainingData) {
  try {
    // Create a simple neural network for audio processing
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 256,
      activation: 'relu',
      inputShape: [1024], // Adjust based on your FFT size
    }));
    
    model.add(tf.layers.dense({
      units: 512,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: 1024,
      activation: 'tanh',
    }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(),
      loss: 'meanSquaredError',
    });

    // Train the model
    await model.fit(trainingData.inputs, trainingData.outputs, {
      epochs: 100,
      batchSize: 32,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        },
      },
    });

    // Save the model
    await model.save(`file://./models/${genreType}`);
    
    return true;
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
} 
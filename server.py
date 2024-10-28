from flask import Flask, jsonify
from flask_cors import CORS
import json
from flask import request
import requests
import numpy as np
import cv2
import tensorflow as tf
import keras
import base64
import io
import os
from skimage.transform import resize

app = Flask(__name__)
CORS(app)

#API Route
@app.route("/data", methods=['POST'])
def classify():
    data = request.data     #load the data  
    data = json.loads(data)
    data = data['image'].split(',')[1]

    with open('output.png', 'wb') as f:     #decode base64 data
        f.write(base64.b64decode(data))         
    image = cv2.imread('output.png')        #use CV library to read the file
    image = resize(image, (28, 28, 1))      #process the data to be able to feed into NN

    url = 'https://raw.githubusercontent.com/adtang00/Digit_Keras_Model/main/model.keras'   #retreive model from my github
    response = requests.get(url)
    print("Hello")
    #Save the model temporarily
    with open('my_model.keras', 'wb') as f:
        f.write(response.content)
    model = keras.models.load_model('my_model.keras')   
    prediction = model.predict(np.expand_dims(image,0))
    prediction = np.argmax(prediction) 

    #clean up files
    os.remove('my_model.keras')
    os.remove('output.png')
    return jsonify({"value": int(prediction)})

if __name__ == "__main__":  
    #serve(app, host='0.0.0.0', port=8000)
    app.run(debug = True)

#NN training
'''
    mnist = tf.keras.datasets.mnist
    (X_train, y_train), (x_test, y_test) = mnist.load_data()

    X_train = keras.utils.normalize(X_train, axis = 1)
    x_test = keras.utils.normalize(x_test, axis = 1)

    model = keras.models.Sequential()
    model.add(keras.layers.Flatten(input_shape = (28, 28)))
    model.add(keras.layers.Dense(128, activation = 'relu'))
    model.add(keras.layers.Dense(128, activation = 'relu'))
    model.add(keras.layers.Dense(10, activation = 'softmax'))

    model.compile(optimizer='adam', loss = 'sparse_categorical_crossentropy', metrics = ['accuracy'])

    model.fit(X_train, y_train, epochs=3)
    model.save('model.keras')
'''
from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
from flask_cors import CORS
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model("model.h5")
classes = [
    "Brazil",
    "Canada",
    "Finland",
    "Japan",
    "United Kingdom",
    "United States"
]

@app.route("/", methods=["GET"])
def testing():
    return jsonify({
        "message": "hello"
    }), 200

@app.route("/predict", methods=["POST"])
def predict_image():
    
    if "file" not in request.files:
        return jsonify({
            "message": "no file found"
        }), 404
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({
            "message": "no selected file"
        }), 404
    
    if file:
        try:
            img = Image.open(file.stream)
            img = img.resize((224, 224))
            img = np.array(img)
            img = img / 255.0
            img = np.expand_dims(img, axis=0)
            img = img.reshape(1, 224, 224, 3)
            
            predicted = model.predict(img)
            
            # output, list of probabilities
            predicted = np.argmax(predicted, axis=1)
            return jsonify({
                "result": classes[predicted[0]]
            }), 200
        except:
            return jsonify({
                "message": "error"
            }), 500
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("crop_yield_model.pkl")
label_encoder_state = joblib.load("state_encoder.pkl")
label_encoder_season = joblib.load("season_encoder.pkl")
label_encoder_crop = joblib.load("crop_encoder.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    state = data["state"]
    season = data["season"]
    crop = data["crop"]
    area = float(data["area"])

    try:
        state_encoded = label_encoder_state.transform([state])[0]
        season_encoded = label_encoder_season.transform([season])[0]
        crop_encoded = label_encoder_crop.transform([crop])[0]
        input_data = np.array([[state_encoded, season_encoded, crop_encoded, area]])
        predicted_yield = model.predict(input_data)[0]
        return jsonify({"predicted_yield": f"{predicted_yield:.2f} tons"})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=3000)

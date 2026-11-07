from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from pmdarima import auto_arima # <- Library AI baru untuk Time Series

app = Flask(__name__)
CORS(app)

@app.route('/api/predict/<coin_id>', methods=['GET'])
def predict_price(coin_id):
    try:
        predict_days = request.args.get('days', default=7, type=int)
        
        # Aturan data historis tetap sama
        if predict_days <= 7:
            history_days = 60
        elif predict_days <= 30:
            history_days = 180
        else:
            history_days = 730
            
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days={history_days}&interval=daily"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers)
        data = response.json()
        
        used_simulation = False 
        
        # Sistem Fallback / Mock Data
        if 'prices' not in data:
            print("⚠️ API Rate Limit Terkena! Mengaktifkan Data Simulasi untuk ML...")
            used_simulation = True
            
            prices = []
            base_price = 50000 if coin_id == 'bitcoin' else 100
            now = datetime.now()
            
            for i in range(history_days):
                past_date = now - timedelta(days=history_days - i)
                timestamp = int(past_date.timestamp() * 1000)
                base_price = base_price * (1 + random.uniform(-0.04, 0.04))
                prices.append([timestamp, base_price])
        else:
            prices = data['prices']
        
        # --- IMPLEMENTASI AUTO-ARIMA ---
        df = pd.DataFrame(prices, columns=['timestamp', 'price'])
        
        # ARIMA tidak butuh Sumbu X (waktu), ia hanya butuh urutan Sumbu Y (harga)
        y = df['price'].values 
        
        print(f"⏳ Melatih ARIMA untuk {coin_id} dengan {len(y)} titik data...")
        
        # Mesin akan mencari parameter terbaik secara otomatis
        model = auto_arima(y, 
                           start_p=1, start_q=1,
                           max_p=3, max_q=3, 
                           seasonal=False, # Dinonaktifkan agar komputasi tidak terlalu lama
                           trace=False,
                           error_action='ignore',  
                           suppress_warnings=True, 
                           stepwise=True)
        
        # Memprediksi harga ke depan sesuai target hari
        predictions = model.predict(n_periods=predict_days)
        # -------------------------------
        
        last_date = datetime.fromtimestamp(df['timestamp'].iloc[-1] / 1000)
        
        forecast_data = []
        for i, pred_price in enumerate(predictions):
            future_date = last_date + timedelta(days=i+1)
            forecast_data.append({
                "date": future_date.strftime('%b %d, %Y') if predict_days > 30 else future_date.strftime('%b %d'),
                "predicted_price": max(0, pred_price) # Mencegah prediksi minus
            })
            
        print("✅ Prediksi Selesai!")
        
        return jsonify({
            "status": "success",
            "coin": coin_id,
            "predict_days": predict_days,
            "forecast": forecast_data,
            "is_simulated": used_simulation 
        })

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
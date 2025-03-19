import pandas as pd
import sys
import json

def recommend_crop(state, season, file_path):
    try:
        df = pd.read_csv(file_path)
        
        filtered_df = df[(df['State'] == state) & (df['Season'] == season)]
        
        if filtered_df.empty:
            return json.dumps({"message": f"No crop data available for {state} in {season}."})
        
        best_crop = filtered_df.groupby('Crop')['Yield'].mean().idxmax()
        
        return json.dumps({"state": state, "season": season, "recommendedCrop": best_crop})
    
    except Exception as e:
        return json.dumps({"error": "Error processing data", "details": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Invalid input", "details": "State, season, and file path are required"}))
        sys.exit(1)

    state = sys.argv[1]
    season = sys.argv[2]
    file_path = sys.argv[3]
    
    result = recommend_crop(state, season, file_path)
    print(result)

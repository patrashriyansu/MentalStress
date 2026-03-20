from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# IMPORTANT: frontend folder MUST be in same folder where app.py exists
app.mount("/static", StaticFiles(directory="frontend"), name="static")

class StressInput(BaseModel):
    message: str

# Home route -> returns frontend page
@app.get("/", response_class=HTMLResponse)
def home():
    with open("frontend/index.html","r",encoding="utf-8") as f:
        return f.read()

@app.post("/predict")
def predict(data: StressInput):
    msg = data.message.lower()
    stress_words = ["sad", "stress", "tension", "angry", "depressed", "upset"]

    result = "Stressed" if any(w in msg for w in stress_words) else "Relaxed"
    return {"result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9000)   # <--- PORT UPDATED

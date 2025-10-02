from fastapi import FastAPI, UploadFile, File
import whisper
app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_path = f"/tmp/{file.filename}"
    print("audio_path=", audio_path)
    with open(audio_path, "wb") as f:
        f.write(await file.read())
    result = model.transcribe(audio_path)
    return {"text": result["text"]}

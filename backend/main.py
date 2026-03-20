from fastapi import FastAPI
from backend.database import engine, Base
import backend.models.user
import backend.models.group
import backend.models.expense
import backend.models.split

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Splitbill API is running"}
from fastapi import FastAPI
from backend.database import engine, Base
import backend.models.user
import backend.models.group
import backend.models.expense
import backend.models.split
from backend.routers import user

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "Splitbill API is running"}
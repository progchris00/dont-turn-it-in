from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine
from app.routes.prediction import router as prediction_router

app = FastAPI()


@app.on_event("startup")
def on_startup():

    SQLModel.metadata.create_all(engine)


app.include_router(prediction_router)
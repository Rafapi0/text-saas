from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import boto3
import os
from dotenv import load_dotenv
import stripe
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="Document Processing API")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração AWS
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['USER_TABLE'])

# Configuração Stripe
stripe.api_key = os.environ['STRIPE_SECRET_KEY']

@app.post("/api/process")
async def process_document(file: UploadFile = File(...)):
    try:
        # Aqui implementaremos a lógica de processamento do documento
        return {"message": "Documento processado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/subscribe")
async def create_subscription(plan_id: str):
    try:
        # Criar sessão de checkout do Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': plan_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
        )
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 
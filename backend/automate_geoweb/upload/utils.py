from django.core.cache import cache
import json
from datetime import datetime, timedelta
import jwt
from asgiref.sync import sync_to_async
import pickle
import logging
import torch
logger = logging.getLogger(__name__)
import asyncio
from sentence_transformers import SentenceTransformer

# Initialize global variable
_sentence_transformer_model = None

async def save_to_cache(key, data,timeout = 86400):
    print("saving to cache")
    try:
        pickled_data = pickle.dumps(data)
        await cache.aset(key, pickled_data, timeout)  # 24 hours
        logger.info(f"Saved {key} to cache")
    except Exception as e:
        logger.error(f"Error saving to cache: {e}")
        raise

async def get_from_cache(key):
    try:
        cached_data = await cache.aget(key)
        if cached_data:
            print("Using data from cache")
            return pickle.loads(cached_data)
        return None
    except Exception as e:
        logger.error(f"Error retrieving from cache: {e}")
        return None

async def compare_password(request_password, model_password):
    return request_password == model_password

async def encode_token(payload, secret):
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

async def decode_token(token, secret):
    decoded_payload = jwt.decode(token, secret, algorithms=['HS256'])
    return decoded_payload

async def create_access_token(payload, secret):
    start_time = (
        datetime.fromisoformat(payload["start_time"])
        if isinstance(payload["start_time"], str)
        else payload["start_time"]
    )
    access_expiry_time = start_time + timedelta(minutes=1)
    payload["access_expiry_time"] = access_expiry_time.isoformat()
    token = await encode_token(payload, secret)
    return token

async def create_refresh_token(payload, secret):
    start_time = (
        datetime.fromisoformat(payload["start_time"])
        if isinstance(payload["start_time"], str)
        else payload["start_time"]
    )
    refresh_expiry_time = start_time + timedelta(minutes=30)
    payload["refresh_expiry_time"] = refresh_expiry_time.isoformat()  # Fixed typo
    token = await encode_token(payload, secret)  # Fixed syntax
    return token

async def set_session_data(session, access_token, refresh_token):
   
    await sync_to_async(_set_session_data)(session, access_token, refresh_token)

def _set_session_data(session, access_token, refresh_token):
    session['access_token'] = access_token
    session['refresh_token'] = refresh_token
    session.save()

async def get_from_session(session, item):
    data = await sync_to_async(session.get)(item)
    return data



async def get_sentence_transformer_model():
    global _sentence_transformer_model
    if _sentence_transformer_model is None:
        _sentence_transformer_model = await get_from_cache("sentence_transformer_model")
        if _sentence_transformer_model is None:
            loop = asyncio.get_event_loop()
            try:
                device = 'cuda' if torch.cuda.is_available() else 'cpu'
                logger.info(f"Loading SentenceTransformer on device: {device}")
                _sentence_transformer_model = await loop.run_in_executor(
                    None, lambda: SentenceTransformer('all-MiniLM-L6-v2', device=device)
                )
            except Exception as e:
                logger.warning(f"Failed to load model on CUDA, falling back to CPU: {e}")
                _sentence_transformer_model = await loop.run_in_executor(
                    None, lambda: SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
                )
            await save_to_cache("sentence_transformer_model", _sentence_transformer_model)
    return _sentence_transformer_model

def get_sentence_transformer_model_sync():
    """
    Synchronous wrapper for get_sentence_transformer_model to use in Celery tasks.
    """
    try:
        return asyncio.run(get_sentence_transformer_model())
    except Exception as e:
        logger.error(f"Error in get_sentence_transformer_model_sync: {e}")
        raise
from django.core.cache import cache
import json

def get_from_cache(key):
    cached_data = cache.get(key)
    if cached_data:
        print("Using data from cache")
        return json.loads(cached_data)
    return None


#Cache data to redis immemory storage
def save_to_cache(key, data):
    print("saving to cache")
    cache.set(key, json.dumps(data), timeout=3600)

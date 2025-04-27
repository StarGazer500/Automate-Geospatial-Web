# upload/middleware.py
from corsheaders.middleware import CorsMiddleware as BaseCorsMiddleware

class DebugCorsMiddleware(BaseCorsMiddleware):
    async def __call__(self, request):
        origin = request.META.get('HTTP_ORIGIN')
        print(f"CorsMiddleware: Processing origin {origin}")
        response = await super().__call__(request)  # Await the response
        print(f"CorsMiddleware: Set Access-Control-Allow-Origin to {response.get('Access-Control-Allow-Origin')}")
        return response
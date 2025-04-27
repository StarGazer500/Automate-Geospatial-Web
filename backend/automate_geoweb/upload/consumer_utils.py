from .custom_jwt_auth import CustomJWTAuthentication

async def consumer_authenticate(session):
    auth = CustomJWTAuthentication()
    user, _ = await auth.authenticate(session)
    if user:
        return True
    return False
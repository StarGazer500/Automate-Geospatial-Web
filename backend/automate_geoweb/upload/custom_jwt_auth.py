import jwt
from datetime import datetime, timezone
from asgiref.sync import sync_to_async
# from django.http import JsonResponse
from .models import DepartmentStaff
# import asyncio
from .utils import decode_token, create_access_token,get_from_session,set_session_data

class CustomJWTAuthentication:
    """
    Custom authentication class that checks for access and refresh tokens
    in session. Refreshes access token if expired using a valid refresh token.
    """

    async def authenticate(self, session):
        user, new_access_token = None, None

        # Check for access token
        access_token = await get_from_session(session,'access_token')
        # access_token = request.session.get('access_token')
        secret = "This is a secret"

        if access_token:
            decoded_access_payload = await decode_token(access_token, secret)
            if decoded_access_payload:
                access_expiry_time = datetime.fromisoformat(decoded_access_payload.get("access_expiry_time"))
                current_time = datetime.now(timezone.utc)
                if current_time < access_expiry_time:
                    try:
                        user = await DepartmentStaff.objects.aget(id=decoded_access_payload['user_id'])
                        return user, access_token
                    except DepartmentStaff.DoesNotExist:
                        print("User not found")
                        return None, None

        # If access token fails, check refresh token
        refresh_token = await get_from_session(session,'refresh_token')
         
        if refresh_token:
            decoded_refresh_payload = await decode_token(refresh_token, secret)
            print("decoded access",decoded_refresh_payload)
            if decoded_refresh_payload:
                refresh_expiry_time = datetime.fromisoformat(decoded_refresh_payload.get("refresh_expiry_time"))
                current_time = datetime.now(timezone.utc)
                if current_time < refresh_expiry_time:
                    # Generate new access token
                    new_payload = {
                        'user_id': decoded_refresh_payload['user_id'],
                        'username': decoded_refresh_payload['username'],
                        'start_time': datetime.now(timezone.utc).isoformat()
                    }
                    new_access_token = await create_access_token(new_payload, secret)
                    # request.session['access_token'] = new_access_token
                    # request.session.save()
                    await set_session_data(session, access_token, refresh_token)
                    print("access expired, regenerated new")

                    try:
                        user = await DepartmentStaff.objects.aget(id=decoded_refresh_payload['user_id'])
                        return user, new_access_token
                    except DepartmentStaff.DoesNotExist:
                        print("User not found after token refresh")
                        return None, None
                else:
                    print("Refresh token has expired, log in again.")
            else:
                print("Invalid refresh token")

        # Return None if no valid tokens found
        return None, None
    
# # May come back to this
# class CustomJWTAuthentication(BaseBackend):
#     """
#     Custom authentication backend for Django that checks for access and refresh tokens
#     in session. Refreshes access token if expired using a valid refresh token.
#     """

#     async def authenticate(self, request, **credentials):
#         user, new_access_token = None, None
#         secret = "This is a secret"

#         # Check for access token
#         access_token = request.session.get('access_token')

#         if access_token:
#             decoded_access_payload = await decode_token(access_token, secret)
#             if decoded_access_payload:
#                 access_expiry_time = datetime.fromisoformat(decoded_access_payload["access_expiry_time"])
#                 current_time = datetime.now(timezone.utc)
#                 if current_time < access_expiry_time:
#                     try:
#                         user = await DepartmentStaff.objects.aget(id=decoded_access_payload['user_id'])
#                         return user
#                     except DepartmentStaff.DoesNotExist:
#                         print("User not found")
#                         return None

#         # If access token fails, check refresh token
#         refresh_token = request.session.get('refresh_token')
#         if refresh_token:
#             decoded_refresh_payload = await decode_token(refresh_token, secret)
#             if decoded_refresh_payload:
#                 refresh_expiry_time = datetime.fromisoformat(decoded_refresh_payload["referesh_expiry_time"])
#                 current_time = datetime.now(timezone.utc)
#                 if current_time < refresh_expiry_time:
#                     # Generate new access token
#                     new_payload = {
#                         'user_id': decoded_refresh_payload['user_id'],
#                         'username': decoded_refresh_payload['username'],
#                         'current_time': datetime.now(timezone.utc).isoformat()
#                     }
#                     new_access_token = await create_access_token(new_payload, secret)
#                     request.session['access_token'] = new_access_token
#                     request.session.save()

#                     try:
#                         user = await DepartmentStaff.objects.aget(id=decoded_refresh_payload['user_id'])
#                         return user
#                     except DepartmentStaff.DoesNotExist:
#                         print("User not found after token refresh")
#                         return None
#                 else:
#                     print("Refresh token has expired, log in again.")
#             else:
#                 print("Invalid refresh token")

#         # Return None if no valid tokens found
#         return None

#     async def get_user(self, user_id):
#         try:
#             return await DepartmentStaff.objects.aget(id=user_id)
#         except DepartmentStaff.DoesNotExist:
#             return None
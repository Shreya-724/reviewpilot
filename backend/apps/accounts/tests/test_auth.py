import pytest
from django.conf import settings
from django.core.cache import cache
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db

REGISTER = "/api/v1/auth/register/"
LOGIN = "/api/v1/auth/login/"
REFRESH = "/api/v1/auth/refresh/"
LOGOUT = "/api/v1/auth/logout/"
ME = "/api/v1/users/me/"
PASSWORD = "S3cure-pass-123"


@pytest.fixture(autouse=True)
def _clear_throttle_cache():
    cache.clear()


@pytest.fixture
def client():
    return APIClient()


def register(client, email="dev@example.com", password=PASSWORD):
    return client.post(
        REGISTER,
        {"email": email, "display_name": "Dev", "password": password},
        format="json",
    )


def test_register_returns_access_token_and_sets_httponly_refresh_cookie(client):
    res = register(client)
    assert res.status_code == 201
    assert "access" in res.data
    assert "refresh" not in res.data  # refresh must only travel in the cookie
    assert res.cookies[settings.REFRESH_COOKIE_NAME]["httponly"]


def test_register_rejects_duplicate_email_case_insensitively(client):
    register(client, email="dev@example.com")
    res = register(client, email="DEV@example.com")
    assert res.status_code == 400


def test_register_rejects_weak_password(client):
    res = register(client, password="12345678")
    assert res.status_code == 400


def test_login_success(client):
    register(client)
    res = client.post(LOGIN, {"email": "dev@example.com", "password": PASSWORD}, format="json")
    assert res.status_code == 200
    assert "access" in res.data


def test_login_wrong_password_returns_401(client):
    register(client)
    res = client.post(LOGIN, {"email": "dev@example.com", "password": "wrong"}, format="json")
    assert res.status_code == 401


def test_me_requires_authentication(client):
    assert client.get(ME).status_code == 401


def test_me_returns_current_user(client):
    access = register(client).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    res = client.get(ME)
    assert res.status_code == 200
    assert res.data["email"] == "dev@example.com"


def test_refresh_uses_cookie_and_returns_new_access_token(client):
    register(client)  # APIClient keeps the refresh cookie
    res = client.post(REFRESH)
    assert res.status_code == 200
    assert "access" in res.data


def test_refresh_without_cookie_returns_401(client):
    assert client.post(REFRESH).status_code == 401


def test_logout_blacklists_refresh_token(client):
    register(client)
    old_cookie = client.cookies[settings.REFRESH_COOKIE_NAME].value
    assert client.post(LOGOUT).status_code == 204

    # Replay the old token: it must be rejected because it was blacklisted.
    client.cookies[settings.REFRESH_COOKIE_NAME] = old_cookie
    assert client.post(REFRESH).status_code == 401
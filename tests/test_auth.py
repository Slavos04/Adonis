import pytest
from django.test import Client
from apps.authentication.security import generate_jwt_token, decode_jwt_token, COOKIE_NAME

@pytest.mark.django_db
def test_generate_and_decode_jwt_token(db_users):
    """Weryfikuje poprawność generowania i deszyfrowania tokenu JWT."""
    patient = db_users['patient']
    token = generate_jwt_token(patient)
    assert token is not None and isinstance(token, str)

    payload = decode_jwt_token(token)
    assert payload is not None
    assert payload['sub'] == str(patient.id)
    assert payload['email'] == patient.email
    assert payload['role'] == 'patient'

@pytest.mark.django_db
def test_login_web_cookie_layer(db_users):
    """
    Test warstwy przeglądarkowej (Web):
    Weryfikuje, czy po logowaniu serwer ustawia ciasteczko HttpOnly i SameSite=Lax,
    a kolejne zapytanie z tym ciasteczkiem jest poprawnie autoryzowane.
    """
    client = Client()
    login_data = {
        "email": "testpatient@adonis.app",
        "password": "TestPassword123!"
    }
    response = client.post("/api/auth/login", data=login_data, content_type="application/json")
    assert response.status_code == 200

    # Sprawdzenie obecności ciasteczka w odpowiedzi
    assert COOKIE_NAME in response.cookies
    cookie = response.cookies[COOKIE_NAME]
    assert cookie['httponly'] is True
    assert cookie['samesite'] == 'Lax'

    # Zapytanie do chronionego endpointu /api/auth/me z ciasteczkiem
    client.cookies[COOKIE_NAME] = cookie.value
    me_response = client.get("/api/auth/me")
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["user"]["email"] == "testpatient@adonis.app"
    assert me_data["user"]["role"] == "patient"

@pytest.mark.django_db
def test_login_android_bearer_header_layer(db_users):
    """
    Test warstwy mobilnej (Android):
    Weryfikuje, czy serwer zwraca token w ciele JSON i czy zapytanie
    z nagłówkiem Authorization: Bearer <token> jest poprawnie autoryzowane.
    """
    client = Client()
    login_data = {
        "email": "testdietitian@adonis.app",
        "password": "TestPassword123!"
    }
    response = client.post("/api/auth/login", data=login_data, content_type="application/json")
    assert response.status_code == 200

    body = response.json()
    assert "token" in body
    token = body["token"]

    # Bez ciasteczek, wyłącznie z nagłówkiem HTTP Bearer
    bearer_client = Client()
    auth_header = f"Bearer {token}"
    me_response = bearer_client.get("/api/auth/me", HTTP_AUTHORIZATION=auth_header)
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["user"]["email"] == "testdietitian@adonis.app"
    assert me_data["user"]["role"] == "dietitian"

@pytest.mark.django_db
def test_unauthenticated_request_rejected():
    """Weryfikuje odrzucenie zapytania bez uwierzytelnienia (brak ciasteczka i brak nagłówka)."""
    client = Client()
    response = client.get("/api/auth/me")
    assert response.status_code in [401, 403]

@pytest.mark.django_db
def test_invalid_bearer_token_rejected():
    """Weryfikuje odrzucenie sfałszowanego tokenu Bearer."""
    client = Client()
    response = client.get("/api/auth/me", HTTP_AUTHORIZATION="Bearer invalid-fake-token-123")
    assert response.status_code in [401, 403]

@pytest.mark.django_db
def test_role_based_access_control(db_users):
    """Weryfikuje, że pacjent nie może przeglądać listy pacjentów innych osób."""
    patient = db_users['patient']
    token = generate_jwt_token(patient)
    client = Client()
    response = client.get("/api/auth/patients", HTTP_AUTHORIZATION=f"Bearer {token}")
    assert response.status_code == 403

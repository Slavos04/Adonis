# syntax=docker/dockerfile:1.4
# Multi-stage Multi-arch Dockerfile for Adonis Diet App
# Supports both linux/amd64 (Windows x86_64 dev) and linux/arm64 (Ubuntu ARM64 prod)

# ==========================================
# STAGE 1: Builder
# ==========================================
FROM --platform=$BUILDPLATFORM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM python:3.12-slim AS runner

# Metadane
LABEL maintainer="Adonis Team"
LABEL description="Adonis Diet Multiplatform Backend API"

# Bezpieczne środowisko Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    APP_HOME=/app

WORKDIR ${APP_HOME}

# Zależności systemowe dla PostgreSQL i curl do healthchecka
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Utworzenie nieuprzywilejowanego użytkownika adonis
RUN groupadd -r adonis && useradd -r -g adonis -d ${APP_HOME} -s /sbin/nologin adonis

# Kopiowanie i instalacja pakietów z etapu buildera
COPY --from=builder /build/wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir /wheels/* && \
    rm -rf /wheels

# Kopiowanie kodu aplikacji
COPY --chown=adonis:adonis . ${APP_HOME}

# Utworzenie katalogów na pliki statyczne i media z prawami dla adonis
RUN mkdir -p ${APP_HOME}/staticfiles ${APP_HOME}/media && \
    chown -R adonis:adonis ${APP_HOME}/staticfiles ${APP_HOME}/media

# Przełączenie na bezpiecznego użytkownika
USER adonis

# Port serwera ASGI
EXPOSE 8000

# Healthcheck sprawdzający endpoint API
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Uruchomienie asynchronicznego serwera Daphne (Django Channels / ASGI)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "adonis_backend.asgi:application"]

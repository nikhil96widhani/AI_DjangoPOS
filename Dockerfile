FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Copy project and Install dependencies
COPY app/ /code/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN chmod +x /code/runapp.sh

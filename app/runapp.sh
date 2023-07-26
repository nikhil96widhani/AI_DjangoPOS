#!/bin/bash
# cd cfg

#echo "[LOADING] ENV variables"
#if [ -f .env ]
#then
#  export $(cat .env | sed 's/#.*//g' | xargs)
#fi

echo "[RUNNING] migrations"
python manage.py makemigrations
python manage.py migrate --no-input

echo "[COPYING] Collecting Static Files"
python manage.py collectstatic --noinput

echo "[RUNNING] app on port 8000"
python manage.py runserver 0.0.0.0:8000
#echo "[RUNNING] app on port $WEBAPP_PORT"
#if [ $WEBAPP_DEBUG_MODE == "True" ]
#then
#  python manage.py runserver 0.0.0.0:8000
#else
#  gunicorn webapp.webapp.wsgi -b 0.0.0.0:8000 --log-level debug
#fi

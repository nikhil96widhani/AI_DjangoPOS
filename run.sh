#!/bin/sh

pkill -f runserver
source venv/bin/activate
python manage.py runserver
#echo "Starting app..."
#echo "Launching app in 5 seconds"
#
#sleep 5s
#open http://localhost:8989

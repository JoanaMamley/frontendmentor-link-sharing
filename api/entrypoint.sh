#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL..."

while ! nc -z db 3306; do
  sleep 1
done

echo "MySQL is up. Starting Flask app..."

flask run --host=0.0.0.0 --port=5000

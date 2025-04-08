# Use an official Python image
FROM python:3.12

# Set the working directory
WORKDIR /app

# Copy all files into the container
COPY . /app

# Install system dependencies (optional but useful)
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask runs on
EXPOSE 5000

# Entrypoint script to wait for DB and start the app
ENTRYPOINT ["sh", "entrypoint.sh"]
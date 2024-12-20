@echo off
echo Starting Docker container...
docker build -t int511/doraidee-backend:1.0 .  
docker save -o doraideebackend.tar int511/doraidee-backend:1.0
echo create  Docker image successfully!
pause
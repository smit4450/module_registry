ECE 461 Project Phase 1: Module Rating System

Phase 2 Group Members: Sam Johnson, Harrison Smith, Sydney Chang, Doha Hafez, Jana Gamal

Original Phase 1 Group Members: Ruth Sugiarto, Yingchen Jin, Varun Venkatesh, Ethan Hunt, Areej Mirani 

Environment Variables:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET_NAME
GITHUB_TOKEN
LOG_LEVEL
LOG_FILE

Dev testing:
Front End:
    npm run build
    npm start

Database:
    npx tsc
    npm test

Backend API Endpoint:
    npx tsc
    node dist/server.js

Production startup:
Frontend: 
    pm2 start npm --name "frontend" -- run start
    Frontend runs on port 8080 and NGINX is used to reverse proxy port 80
Backend:


# build the frontend
FROM node as frontend
COPY ./www /app
WORKDIR app
RUN npm install
RUN npm run dist

# build final
FROM python:3.6-alpine3.7
# install youtube-dl
RUN pip install --upgrade youtube-dl
# install deps
COPY requirements.txt .
RUN pip install -r requirements.txt
# copy frontend final build
COPY . /app
RUN rm -rf /app/www
COPY --from=frontend /app/dist /app/www/dist
# star the app
ENTRYPOINT [ "python" ]
CMD [ "app/app.py" ]


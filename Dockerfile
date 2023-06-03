FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

# Remove after we move database to a managed online service
RUN echo "DATABASE_URL=postgres://user:password@host.docker.internal:5432" >> .env

RUN npm run db:generate

RUN npm run build

EXPOSE 3000

CMD npm start

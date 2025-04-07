FROM node:18

WORKDIR /freshfarm

COPY package*.json ./

RUN npm install  # Install all dependencies, including devDependencies

COPY . .

EXPOSE 3001

CMD ["npx", "babel-node", "--presets", "@babel/preset-env", "./index.js"]

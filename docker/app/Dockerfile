FROM node:18-bullseye

WORKDIR /app/

COPY . .

RUN npm install

RUN node ./scripts/reldens-commands.js installSkeleton custom-game-theme-test &&\
      node ./scripts/reldens-commands.js buildCss custom-game-theme-test &&\
      node ./scripts/reldens-commands.js buildClient custom-game-theme-test &&\
      node ./scripts/reldens-commands.js copyCustomAssets custom-game-theme-test



EXPOSE 8080

CMD RELDENS_LOG_LEVEL=9 npm start

FROM node:20

WORKDIR kevin_site/
#to be modified


COPY kprist/* ./

RUN npm install

EXPOSE 5173

ENTRYPOINT ["npm", "run", "dev", "--", "--host"]

FROM mcr.microsoft.com/playwright:v1.46.0-jammy
RUN mkdir playwright-tests
WORKDIR /playwright-tests
COPY . /playwright-tests
RUN npm i
CMD ["npm", "test"]
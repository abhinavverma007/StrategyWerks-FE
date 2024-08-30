const {writeFile} = require('fs');
const {argv} = require('yargs');

//reading env variables from .env file
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
//we can access the env variables
//in the process.env object

const environmentFileContent = `export const environment = {
    production: false,
    apiUrl: "${process.env['API_URL']}"
}`;

// writing content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`environment variables written to ${targetPath}`);
});

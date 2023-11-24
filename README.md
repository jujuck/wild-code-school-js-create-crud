## Crud Maker for the Wild Code School pedagogical JS fullstack template

Warning : this package is made to integrate the Wild Code School JS Template, that include a Frontend Folder with vite React and a backend folder, working with express. (https://github.com/WildCodeSchool/js-template-fullstack);

To integrate it to the template, run `npm install wild-js-crud` in your backend folder. Then, add the `"crud:maker": "node ./node_modules/wild-js-crud/index.js"` in the script of the `package.json` on your backend Folder;

### USer input

- Table name, check if already exists
- Field:
  - name
  - type
  - not null
- validation system (Joy / Express-validation / none)
- Number of fake row insert in the database

### Automatic file works

- Create automatically the controller file;
- Create automatically the manager file;
- Update your route (`router.js`);
- Update your table (`tables.js`)
- Create a middleware to check the data on the POST and PUT route based on user choice (Joy or Express-validation packages)
- Update the `schema.sql` (Migration), creating the table and inserting data if needed (Option);

### Warning

- Middleware are not actually stable. The work is on progress and any feedback would be welcome.
- To be cautious about API, route POST, PUT and DELETE are comment when files are generated.

### Version

1.1.0 : Launch in Beta mode for testing;
1.1.1 : add the insert of the data in the `schema.sql` with the faker libriairy ('https://fakerjs.dev/api/');
1.1.2 : Correction and testing on all available type of data for the automatic insertion
1.1.3 : Update of the joi validation file to integrate optional or required field
1.1.4 : Update for Eslint

### BackLog

- Adding automatic testing file for all the route
- Adding Error management and rollback
- Adding UX on the terminal, for user information

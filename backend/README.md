*This project has been created as part of the 42 curriculum by Dbajeux, Agaland, Bertrmar, Kprist, Stempels*
<pre align=center>
<font color=blue>

 █████   █████                              █████                   ███████████                     █████                              █████
▒▒███   ▒▒███                              ▒▒███                   ▒▒███▒▒▒▒▒███                   ▒▒███                              ▒▒███ 
 ▒███    ▒███   ██████  █████ ███ █████    ███████    ██████  ██    ▒███    ▒███  ██████    ██████  ▒███ █████  ██████  ████████    ███████ 
 ▒███████████  ███▒▒███▒▒███ ▒███▒▒███    ▒▒▒███▒    ███▒▒███▒▒     ▒██████████  ▒▒▒▒▒███  ███▒▒███ ▒███▒▒███  ███▒▒███▒▒███▒▒███  ███▒▒███ 
 ▒███▒▒▒▒▒███ ▒███ ▒███ ▒███ ▒███ ▒███      ▒███    ▒███ ▒███       ▒███▒▒▒▒▒███  ███████ ▒███ ▒▒▒  ▒██████▒  ▒███████  ▒███ ▒███ ▒███ ▒███ 
 ▒███    ▒███ ▒███ ▒███ ▒▒███████████       ▒███ ███▒███ ▒███       ▒███    ▒███ ███▒▒███ ▒███  ███ ▒███▒▒███ ▒███▒▒▒   ▒███ ▒███ ▒███ ▒███ 
 █████   █████▒▒██████   ▒▒████▒████        ▒▒█████ ▒▒██████  ██    ███████████ ▒▒████████▒▒██████  ████ █████▒▒██████  ████ █████▒▒████████
▒▒▒▒▒   ▒▒▒▒▒  ▒▒▒▒▒▒     ▒▒▒▒ ▒▒▒▒          ▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒    ▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒▒▒ 
                                                                                                                                            
                                                                                                                                            
</font>
</pre>                                                                                                                                 

⚠️ Project is under development and is changing fast. Information in this readme might not be completly updated to the current workflow.

# 🗂️ Architecture

```bash
BackEnd/
│
│
├── src/                      # Sources files  
│    ├── auth/                    # Contains all the features related to authentication
│    │
│    ├── users/                   # Contains all the features related to user
│    │
│    ├── app.*.ts/                # Files that regroup global feature for the whole application.
│    │
│    └── main.ts/                 # Entry point of the application
│  
├── test/                         # Tests - Not implemented yet.
│
└── ...                         # config files for NestJS

```

# 📋 Instructions
This backend is meant to be used with a frontend and a postgresql database. Before running it you need to setup env variables.

### 1. Setup environment variable
A .env.template file is given with the variables that should be defined. For obvious reasons, only non-sensitive value are kept in that template. Rename it .env and complete the missing fields:

|Variable| Value| Development|
|--|--|--|
|VITE_API_BASE_URL|The adress of the backend| http://localhost:3000|
|VITE_42_OAUTH_API|https://api.intra.42.fr/oauth/||
|VITE_42_OAUTH_CLIENT_ID|Your client ID||
|VITE_42_OAUTH_REDIRECT_URI|The callback URL you defined for the 42 API|http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fcallback&response_type=code|
|VITE_42_OAUTH_API_LINK|You should leave it as is|\${VITE_42_OAUTH_API}authorize?client_id=\$\{VITE_42_OAUTH_CLIENT_ID}&redirect_uri=\${VITE_42_OAUTH_REDIRECT_URI}|

### 2. Install dependencies
To install dependencies just run the following:
```bash
$ npm install
```

### 3. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Description
This project is divided into modules. Each module contains different "tools" that will execute specific steps in the handling of an incoming request. The different type of tools you can find are listed as follow:
- **Pipes** for data validations
- **Guards** for authentication verification
- **Controllers** for handling incoming request
- **Services** for data access and business logic
- **Repositories** for database management
- **Filters** for error handling during requests
- **Interceptors** for adding extra logic to incoming requests or outgoing responses
- **Modules** for grouping every service related to a specific topic (user handling, authentication handling, stats handling)

At this moment there are three modules:
- App module: groups the whole application into one module and definies tools that can be applied globally.
- users module: handles user logic like creating a user in a database, retrieve users information, and so on.
- auth: handles request related to authentication, like signing up or logout.

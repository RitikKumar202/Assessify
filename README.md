<h1 align="center">Assessify - Online Examination Platform</h1>
<h3 align="center">
  <span>System for assessment administrators and students, offering distinct account features.</span> <br>
  <span> Group management, assessment creation, scheduling, automated/manual evaluation.</span> <br>
  <span>Access records, view marks, and provide feedback.</span>
</h3>



## About
Assessify i.e an online examination platform is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to provides a virtual environment for conducting exams. Offers various types of assessments such as MCQ, Fill Up, Assignment Type etc., catering to different learning styles and subjects.
## Features

- **User Roles:** The system supports two user roles: Admin, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can create group and test, manage groups, users, tests, and and oversee system settings.

- **Student Dashboard:** Student can join the group, attempt the test and can view test summary.


## Technologies Used

- **Frontend:** React.js, HTML, CSS, Bootstrap, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB


## Installation

```bash
  git clone https://github.com/RitikKumar202/Assessify.git
```
Open 2 terminals in separate windows/tabs.

Terminal 1: Setting Up Backend
```bash
  cd server
  npm install
  npm run app
```
Create a file called .env in the server folder. Inside it write this :
```bash
  PORT = YOUR_PORT_NUMBER
  mongoURL = YOUR_MONGO_URL
  secretKey = YOUR_SECRET_KEY
```
Terminal 2: Setting Up Frontend
```bash
  cd client
  npm install
  npm start
```

    
## License

[MIT](https://choosealicense.com/licenses/mit/)


## Developers

- [@Ritik Kumar](https://www.linkedin.com/in/ritikkumar202/)
- [@Amandeep Kaur](https://www.linkedin.com/in/amandeep-kaur-a89a17212/)
- Arpita Kumari Singh
- Vratika Tyagi

## Deployment
- ***Render*** - Server side
- ***Netlify*** - Client side

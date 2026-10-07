\# LocalLens



\*\*Discover local. Rate honestly. Choose better.\*\*



LocalLens is a full-stack store rating web application that helps users discover local businesses, share ratings, and make better decisions based on community feedback.



\## Technologies Used



LocalLens is built using ReactJS and Vite for the frontend, ExpressJS and Node.js for the backend, and MySQL for the database. Axios is used for frontend-backend communication, while JWT and bcryptjs are used for authentication and password security. Git and GitHub are used for version control.



\## Features



\### Normal User



Normal users can register and log in, view available stores, search stores by name and address, view overall ratings, submit ratings from 1 to 5, modify their submitted ratings, change their password, and log out.



\### Store Owner



Store owners can log in, view their store's average rating, view rating distribution, see users who submitted ratings, change their password, and log out.



\### System Administrator



Administrators can view platform statistics, add users and stores, assign store owners, view user and store information, search users and stores, and log out.



\## Validation and Security



The application validates names between 20 and 60 characters, addresses up to 400 characters, passwords between 8 and 16 characters with at least one uppercase letter and one special character, valid email addresses, and ratings between 1 and 5.



JWT-based authentication and role-based authorization are used to protect application features. Passwords are hashed using bcryptjs before being stored.



\## Database Setup



Create a MySQL database named `locallens`.



The application uses three main tables:



\- `users`

\- `stores`

\- `ratings`



Configure the database connection in `backend/.env` using `.env.example` as a reference.



\## How to Run



\### Backend



Open a terminal and run:



```powershell

cd backend

npm install

npm run dev


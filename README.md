
# School Management API

A simple Node.js + Express.js API to manage schools with MySQL database.  
Features:  
- Add new schools with name, address, latitude, and longitude  
- List schools sorted by proximity to a user-specified location

---

## 🚀 Features

- Add School (`POST /addSchool`)  
- List Schools by proximity (`GET /listSchools?latitude=&longitude=`)  
- Uses MySQL to store school data  
- Validates input data  
- Calculates distance using latitude and longitude

---

## 📁 Project Structure

```
/
├── index.js         # Main Express server file
├── package.json     # Project dependencies and scripts
├── .env             # Environment variables (not committed)
└── README.md        # This file
```

---

## ⚙️ Setup & Installation

1. **Clone the repo**

```bash
git clone https://github.com/your-username/school-api.git
cd school-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup MySQL database**

- Create a MySQL database named `school_db` (or any name)
- Create a `schools` table with this schema:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

4. **Create `.env` file in root directory**

Add your MySQL credentials:

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
PORT=5000
```

---

## 🔥 Running Locally

```bash
node index.js
```

The server will run on http://localhost:5000

---

## 📬 API Endpoints

### Add School

- **URL:** `/addSchool`
- **Method:** POST
- **Payload:**

```json
{
  "name": "Springfield High",
  "address": "123 Elm Street",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

- **Response:**

```json
{
  "message": "School added successfully"
}
```

---

### List Schools by Proximity

- **URL:** `/listSchools`
- **Method:** GET
- **Query Parameters:**

| Parameter | Description              | Required |
| --------- | ------------------------| -------- |
| latitude  | User's latitude (float) | Yes      |
| longitude | User's longitude (float)| Yes      |

- **Example:**  
`/listSchools?latitude=40.7128&longitude=-74.0060`

- **Response:**  
An array of schools sorted by distance from the given coordinates.

---


## 🙋‍♂️ Author

Aryaman Singh — [GitHub](https://github.com/Aryaman006)

---


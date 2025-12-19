# Financial Ledger API – Double Entry Bookkeeping

A backend REST API that implements **double-entry bookkeeping** with strong **ACID guarantees**, **immutable ledger entries**, and **strict balance integrity**.

Built using **Node.js**, **Express.js**, **PostgreSQL**, **Sequelize ORM**, and **Docker**.

---

## Objective

The goal of this project is to design and implement a reliable backend system that accurately tracks financial transactions using a **double-entry bookkeeping model**.  
The system ensures correctness, auditability, and consistency even under failure or concurrent access.

---

## Features Implemented

- Account creation and retrieval
- Deposit, withdrawal, and transfer transactions
- Double-entry bookkeeping (debit & credit)
- Immutable ledger entries (append-only)
- Accurate balance calculation derived from ledger entries
- Prevention of negative balances (422 Unprocessable Entity)
- Atomic database transactions (ACID compliant)
- Dockerized application and database

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Docker & Docker Compose
- Postman (API testing)

---

## Project Structure

```
financial-ledger-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   └── ledgerEntry.model.js
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── transaction.controller.js
│   │   └── ledgerEntry.controller.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── transaction.routes.js
│   │   └── ledgerEntry.routes.js
│   ├── services/
│   │   ├── balance.service.js
│   │   └── ledger.service.js
│
├── Dockerfile
├── docker-compose.yml
├── index.js
├── .env
├── package.json
├── README.md
├── Architecture_Financial_Ledger.drawio
└── ER_Diagram_Financial_Ledger.png
```

---

## Design Decisions

### Double-Entry Bookkeeping Model
- Every financial operation affects the ledger
- Transfers generate **one debit and one credit**
- Ledger entries are immutable to ensure auditability

### ACID Compliance
- All financial operations are wrapped in database transactions
- If any step fails, the entire transaction is rolled back

### Balance Calculation
- Account balance is **not stored**
- Balance is calculated dynamically as:
  ```
  SUM(credits) - SUM(debits)
  ```
- This guarantees consistency with ledger history

### Negative Balance Prevention
- Before withdrawals and transfers, balance is checked
- If insufficient funds exist, the transaction fails with HTTP 422

---

## Database Schema (ER Diagram)

The ER diagram shows the following entities and relationships:

- **Account**
  - id (PK)
  - user_id
  - type
  - currency
  - status
  - createdAt
  - updatedAt

- **Transaction**
  - id (PK)
  - type
  - amount
  - status
  - createdAt
  - updatedAt

- **LedgerEntry**
  - id (PK)
  - account_id (FK)
  - transaction_id (FK)
  - entry_type (credit/debit)
  - amount
  - createdAt
  - updatedAt

Relationships:
- One Account → Many LedgerEntries
- One Transaction → Many LedgerEntries

Diagram file included:
```
ER_Diagram_Financial_Ledger.png
```

---

## Architecture Diagram

The architecture diagram illustrates the flow of a transfer transaction:

Client (Postman)  
→ Express API  
→ Controllers (validation & orchestration)  
→ Services (business logic & transactions)  
→ PostgreSQL (persistent storage)

Diagram file included:
```
Architecture_Financial_Ledger.drawio
```

---

## Environment Configuration

Create a `.env` file in the project root:

```
PORT=5000
DB_HOST=localhost        # use "db" when running with Docker
DB_NAME=ledger_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## Run Locally (Without Docker)

### Install dependencies
```
npm install
```

### Start server
```
node index.js
```

Expected output:
```
Database connected successfully
Server running on port 5000
```

---

## Docker Setup (Recommended)

Docker ensures the application runs consistently without local setup issues.

### Build and Run Containers
```
docker compose up --build
```

Expected output:
```
Database connected successfully
Server running on port 5000
```

### Access API
```
http://localhost:5000
```

PostgreSQL runs in a container and data is persisted using Docker volumes.

---

## API Endpoints

### Accounts

#### Create Account
```
POST /accounts
```
```
{
  "user_id": 1,
  "type": "savings"
}
```

#### Get Account with Balance
```
GET /accounts/:id
```

#### Get Ledger Entries for Account
```
GET /accounts/:id/ledger
```

---

### Transactions

#### Deposit
```
POST /transactions
```
```
{
  "type": "deposit",
  "amount": 5000,
  "to_account_id": 1
}
```

#### Withdrawal
```
POST /transactions
```
```
{
  "type": "withdrawal",
  "amount": 500,
  "from_account_id": 1
}
```

If insufficient balance:
```
422 Unprocessable Entity
{
  "message": "Insufficient balance"
}
```

#### Transfer (Double Entry)
```
POST /transactions
```
```
{
  "type": "transfer",
  "amount": 500,
  "from_account_id": 1,
  "to_account_id": 2
}
```

Creates:
- One debit ledger entry
- One credit ledger entry

---

## Postman Collection

- All endpoints were tested using Postman
- A Postman collection is included for easy verification
- The same collection works for both local and Docker runs

---

## Final Notes

- Ledger is the single source of truth
- No ledger entry can be updated or deleted
- System is designed for correctness, reliability, and auditability
- Fully compliant with the provided project instructions

---

## Submission Checklist

- Source code pushed to GitHub
- README.md completed
- Docker setup verified
- ER Diagram included
- Architecture diagram included
- Postman collection available

Project is **ready for evaluation**.

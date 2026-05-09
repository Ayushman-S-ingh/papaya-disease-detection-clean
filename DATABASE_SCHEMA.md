# Database Schema — Papaya Disease Detection System
# PostgreSQL 15

## Entity Relationship

```
users (1) ──────< predictions (many)
diseases (reference table, not FK to predictions — matched by name)
```

---

## Table: users

| Column         | Type         | Constraints              | Notes                   |
|----------------|--------------|--------------------------|-------------------------|
| id             | SERIAL       | PRIMARY KEY              | Auto-increment          |
| name           | VARCHAR(120) | NOT NULL                 | Full name               |
| email          | VARCHAR(255) | UNIQUE, NOT NULL, INDEX  | Login identifier        |
| password_hash  | VARCHAR(255) | NOT NULL                 | Werkzeug bcrypt hash    |
| role           | VARCHAR(20)  | NOT NULL, DEFAULT farmer | farmer \| admin         |
| is_active      | BOOLEAN      | DEFAULT TRUE             | Soft disable            |
| phone          | VARCHAR(20)  |                          | Optional                |
| location       | VARCHAR(120) |                          | Farm location           |
| created_at     | TIMESTAMP    | DEFAULT now()            |                         |
| updated_at     | TIMESTAMP    | DEFAULT now()            | Auto-updated            |

```sql
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'farmer',
    is_active     BOOLEAN DEFAULT TRUE,
    phone         VARCHAR(20),
    location      VARCHAR(120),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
```

---

## Table: predictions

| Column         | Type         | Constraints              | Notes                          |
|----------------|--------------|--------------------------|--------------------------------|
| id             | SERIAL       | PRIMARY KEY              |                                |
| user_id        | INTEGER      | FK → users.id, INDEX     | Owner of prediction            |
| image_filename | VARCHAR(255) | NOT NULL                 | UUID-based filename            |
| image_url      | VARCHAR(500) |                          | Relative URL to serve image    |
| disease_name   | VARCHAR(120) | NOT NULL                 | Predicted class name           |
| confidence     | FLOAT        | NOT NULL                 | 0.0 – 1.0                      |
| severity       | VARCHAR(20)  |                          | none/low/medium/high/critical  |
| all_scores     | JSONB        |                          | {class: probability} dict      |
| treatment      | TEXT         |                          | AI-generated recommendation    |
| notes          | TEXT         |                          | Farmer notes                   |
| leaf_area      | FLOAT        |                          | Optional pixel-based metric    |
| created_at     | TIMESTAMP    | DEFAULT now()            |                                |

```sql
CREATE TABLE predictions (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_filename VARCHAR(255) NOT NULL,
    image_url      VARCHAR(500),
    disease_name   VARCHAR(120) NOT NULL,
    confidence     FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    severity       VARCHAR(20),
    all_scores     JSONB,
    treatment      TEXT,
    notes          TEXT,
    leaf_area      FLOAT,
    created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_predictions_user_id   ON predictions(user_id);
CREATE INDEX idx_predictions_disease   ON predictions(disease_name);
CREATE INDEX idx_predictions_created   ON predictions(created_at DESC);
```

---

## Table: diseases (reference / seed data)

| Column           | Type         | Notes                          |
|------------------|--------------|--------------------------------|
| id               | SERIAL       | PRIMARY KEY                    |
| name             | VARCHAR(120) | UNIQUE — matches prediction    |
| category         | VARCHAR(60)  | fungal/bacterial/viral/etc     |
| description      | TEXT         |                                |
| symptoms         | TEXT         |                                |
| causes           | TEXT         |                                |
| severity_level   | VARCHAR(20)  | Default severity               |
| treatment_steps  | JSONB        | Ordered step list              |
| prevention       | TEXT         |                                |
| chemical_control | TEXT         |                                |
| organic_control  | TEXT         |                                |
| image_url        | VARCHAR(500) | Reference image                |

```sql
CREATE TABLE diseases (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(120) UNIQUE NOT NULL,
    category         VARCHAR(60),
    description      TEXT,
    symptoms         TEXT,
    causes           TEXT,
    severity_level   VARCHAR(20),
    treatment_steps  JSONB,
    prevention       TEXT,
    chemical_control TEXT,
    organic_control  TEXT,
    image_url        VARCHAR(500)
);
```

---

## Useful Queries

```sql
-- Disease distribution for a user
SELECT disease_name, COUNT(*) as count
FROM predictions
WHERE user_id = :user_id
GROUP BY disease_name ORDER BY count DESC;

-- Monthly trend
SELECT DATE_TRUNC('month', created_at) as month,
       COUNT(*) as scans,
       AVG(confidence) as avg_confidence
FROM predictions
WHERE user_id = :user_id
GROUP BY month ORDER BY month;

-- High-severity recent predictions (all users, admin view)
SELECT p.*, u.name, u.email
FROM predictions p JOIN users u ON u.id = p.user_id
WHERE p.severity IN ('high','critical')
  AND p.created_at > NOW() - INTERVAL '7 days'
ORDER BY p.created_at DESC;
```
# Cloud-X

See it live

- [Link 1 (Vercel)](https://cloud-x.vercel.app/)

Routes

- /api/v1/files

  - authenticateUser - Validates JWT in cookie, passes userId to req.user
  - GET - gets all file of current user
  - POST
    - validateFileInput - Checks if file name exists
  - /:id
    - GET
      - validateId - Allows if public and to owner
    - DELETE
      - validateIdOwner - Allows only if owner
    - PATCH
      - validateIdOwner - Allows only if owner
    - /download
      - GET
        - validateId - Allows if public and to owner

- /api/v1/user

  - authenticateUser - Validates JWT in cookie, passes userId to req.user
  - GET - returns current user

- /api/v1/auth
  - /login
    - validateLoginInput - checks for email and password
  - /register
    - validateRegisterInput - checks for name, password, and email if already registered
  - /logout - sends empty invalid token

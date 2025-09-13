# AirDrive Frontend Implementation Plan

## Phase 1: Project Setup and Authentication

### 1.1 Initial Setup

- [ ] Create React project using Vite
- [ ] Configure project structure and dependencies
- [ ] Set up routing with react-router-dom
- [ ] Configure Axios with interceptors
- [ ] Set up React Query for data fetching
- [ ] Implement basic layout components

### 1.2 Authentication Implementation

- [ ] Create AuthContext for global state management
- [ ] Implement Login page with form validation
- [ ] Implement Register page with form validation
- [ ] Set up JWT token management (memory storage)
- [ ] Configure HTTP-only cookie handling for refresh token
- [ ] Implement automatic token refresh mechanism
- [ ] Add protected route wrapper
- [ ] Create loading and error states

## Phase 2: Core File Management

### 2.1 File List Implementation

- [ ] Create FileContext for file-related state
- [ ] Implement main dashboard layout
- [ ] Create file list view with grid/list toggle
- [ ] Add file/folder icons based on type
- [ ] Implement pagination
- [ ] Add sorting functionality
- [ ] Create file action buttons (preview, download, delete)
- [ ] Implement loading states and error handling

### 2.2 File Upload System

- [ ] Create upload modal/component
- [ ] Implement drag and drop functionality
- [ ] Add file type validation
- [ ] Create upload progress indicator
- [ ] Handle multiple file uploads
- [ ] Add folder selection during upload
- [ ] Implement error handling for uploads

## Phase 3: Advanced Features

### 3.1 Folder Management

- [ ] Implement folder creation
- [ ] Create folder navigation system
- [ ] Add breadcrumb navigation
- [ ] Implement folder view filtering
- [ ] Add drag and drop between folders
- [ ] Create folder tree view in sidebar

### 3.2 Search and Share

- [ ] Implement search functionality
- [ ] Create search results view
- [ ] Add file sharing mechanism
- [ ] Create share link generation
- [ ] Implement share link copying
- [ ] Add share management UI

## Phase 4: Profile and Polish

### 4.1 Profile Management

- [ ] Create profile page
- [ ] Implement profile editing
- [ ] Add avatar upload/update
- [ ] Create storage usage display
- [ ] Implement settings page

### 4.2 UI/UX Enhancement

- [ ] Add responsive design improvements
- [ ] Implement dark/light theme
- [ ] Add loading animations
- [ ] Create toast notifications system
- [ ] Implement confirmation dialogs
- [ ] Add keyboard shortcuts
- [ ] Optimize performance
- [ ] Cross-browser testing

## Component Structure

\`\`\`
src/
├── assets/
│ └── icons/
├── components/
│ ├── auth/
│ │ ├── LoginForm.jsx
│ │ ├── RegisterForm.jsx
│ │ └── ProtectedRoute.jsx
│ ├── layout/
│ │ ├── Navbar.jsx
│ │ ├── Sidebar.jsx
│ │ └── Footer.jsx
│ ├── files/
│ │ ├── FileGrid.jsx
│ │ ├── FileList.jsx
│ │ ├── FileCard.jsx
│ │ ├── FileActions.jsx
│ │ └── UploadModal.jsx
│ └── shared/
│ ├── Button.jsx
│ ├── Input.jsx
│ └── Modal.jsx
├── context/
│ ├── AuthContext.jsx
│ └── FileContext.jsx
├── hooks/
│ ├── useAuth.js
│ ├── useFiles.js
│ └── useUpload.js
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ ├── Files.jsx
│ └── Profile.jsx
├── services/
│ ├── api.js
│ ├── auth.service.js
│ └── file.service.js
└── utils/
├── constants.js
└── helpers.js
\`\`\`

## Dependencies

\`\`\`json
{
"dependencies": {
"@tanstack/react-query": "^4.x",
"axios": "^1.x",
"react": "^18.x",
"react-dom": "^18.x",
"react-router-dom": "^6.x",
"react-dropzone": "^14.x",
"react-hot-toast": "^2.x",
"@headlessui/react": "^1.x",
"tailwindcss": "^3.x",
"@heroicons/react": "^2.x"
}
}
\`\`\`

## API Integration Points

### Authentication

\`\`\`javascript
// auth.service.js
export const login = async (credentials) => {
const { data } = await api.post('/auth/login', credentials);
return data;
};

export const register = async (userData) => {
const { data } = await api.post('/auth/register', userData);
return data;
};
\`\`\`

### File Management

\`\`\`javascript
// file.service.js
export const uploadFile = async (file, folder) => {
const formData = new FormData();
formData.append('file', file);
if (folder) formData.append('folder', folder);

const { data } = await api.post('/files/upload', formData, {
headers: { 'Content-Type': 'multipart/form-data' },
onUploadProgress: (progress) => {
const percentage = Math.round((progress.loaded \* 100) / progress.total);
// Update upload progress
}
});
return data;
};

export const getFiles = async (params) => {
const { data } = await api.get('/files', { params });
return data;
};
\`\`\`

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Create .env file with backend URL
4. Start development server: \`npm run dev\`

## Testing Plan

1. Unit tests for utilities and hooks
2. Component tests for reusable components
3. Integration tests for main features
4. End-to-end tests for critical flows

## Performance Considerations

1. Implement lazy loading for routes
2. Use React.memo for heavy components
3. Optimize file uploads with chunks
4. Cache API responses with React Query
5. Implement virtual scrolling for large lists

## Complete API Documentation

### Authentication APIs

1. **Register User**

   ```http
   POST /api/auth/register
   ```

   - Body:
     ```json
     {
       "name": "string",
       "email": "string",
       "password": "string",
       "avatar": "file (optional)"
     }
     ```
   - Response:
     ```json
     {
       "user": {
         "_id": "string",
         "name": "string",
         "email": "string",
         "avatar": "string",
         "role": "string"
       },
       "accessToken": "string"
     }
     ```

2. **Login User**

   ```http
   POST /api/auth/login
   ```

   - Body:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - Response: Same as register

3. **Logout**

   ```http
   POST /api/auth/logout
   ```

   - No body required
   - Clears refresh token cookie

4. **Refresh Token**
   ```http
   POST /api/auth/refresh-token
   ```
   - Uses HTTP-only cookie
   - Response:
     ```json
     {
       "accessToken": "string"
     }
     ```

### File Management APIs

1. **Upload File**

   ```http
   POST /api/files/upload
   ```

   - Headers:
     ```
     Authorization: Bearer <token>
     Content-Type: multipart/form-data
     ```
   - Body:
     ```
     file: File
     folder: string (optional)
     ```
   - Response:
     ```json
     {
       "message": "File uploaded successfully",
       "file": {
         "_id": "string",
         "name": "string",
         "type": "string",
         "size": "number",
         "url": "string",
         "fileId": "string",
         "owner": "string",
         "folder": "string",
         "createdAt": "string"
       }
     }
     ```

2. **Get User Files**

   ```http
   GET /api/files
   ```

   - Query Parameters:
     ```
     page: number
     limit: number
     folder: string
     sort: string
     search: string
     ```
   - Response:
     ```json
     {
       "files": [
         {
           "_id": "string",
           "name": "string",
           "type": "string",
           "size": "number",
           "url": "string",
           "folder": "string",
           "createdAt": "string"
         }
       ],
       "total": "number",
       "page": "number",
       "pages": "number"
     }
     ```

3. **Preview File**

   ```http
   GET /api/files/preview/:id
   ```

   - Response: File preview URL

4. **Download File**

   ```http
   GET /api/files/download/:id
   ```

   - Response: File download stream

5. **Delete File**

   ```http
   DELETE /api/files/:id
   ```

   - Response:
     ```json
     {
       "message": "File deleted successfully"
     }
     ```

6. **Create Folder**

   ```http
   POST /api/files/folder
   ```

   - Body:
     ```json
     {
       "name": "string",
       "parentFolder": "string (optional)"
     }
     ```
   - Response:
     ```json
     {
       "message": "Folder created successfully",
       "folder": {
         "_id": "string",
         "name": "string",
         "path": "string"
       }
     }
     ```

7. **Share File**

   ```http
   POST /api/files/share/:id
   ```

   - Response:
     ```json
     {
       "shareId": "string",
       "url": "string"
     }
     ```

8. **Search Files**
   ```http
   GET /api/files/search
   ```
   - Query Parameters:
     ```
     query: string
     type: string (optional)
     folder: string (optional)
     ```
   - Response: Same as Get User Files

### Profile Management APIs

1. **Get Profile**

   ```http
   GET /api/profile/me
   ```

   - Response:
     ```json
     {
       "_id": "string",
       "name": "string",
       "email": "string",
       "avatar": "string",
       "role": "string"
     }
     ```

2. **Update Profile**
   ```http
   PATCH /api/profile/update
   ```
   - Body (multipart/form-data):
     ```
     name: string
     avatar: File (optional)
     ```
   - Response: Updated user object

### API Error Responses

All APIs may return these error structures:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "stack": "Error stack (development only)"
  }
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

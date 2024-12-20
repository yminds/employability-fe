# API-DOCS.md

## Introduction

This document provides simple examples for creating new API endpoints using Redux Toolkit's RTK Query. Follow these examples to add GET, POST, PUT, and DELETE endpoints to your `apiSlice`.

## Prerequisites

- **Redux Toolkit (RTK)** installed
- **TypeScript** configured
- Basic understanding of **RTK Query**

## Setting Up the Base API Slice

Ensure you have a base `apiSlice` configured where all endpoints will be injected.

```typescript
// src/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}), // Initial empty endpoints
});
```

## Creating New Endpoints

### 1. GET Request

Use `builder.query` to fetch data.

```typescript
// src/api/exampleApiSlice.ts
import { apiSlice } from './apiSlice';

export const exampleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExample: builder.query<ExampleType[], void>({
      query: () => ({
        url: '/example',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetExampleQuery } = exampleApiSlice;
```

**Usage in a Component:**

```typescript
import React from 'react';
import { useGetExampleQuery } from '../api/exampleApiSlice';

const ExampleComponent = () => {
  const { data, error, isLoading } = useGetExampleQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred.</div>;

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default ExampleComponent;
```

### 2. POST Request

Use `builder.mutation` to create new data.

```typescript
// src/api/exampleApiSlice.ts
import { apiSlice } from './apiSlice';

interface CreateExamplePayload {
  name: string;
  description: string;
}

export const exampleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExample: builder.mutation<ExampleType, CreateExamplePayload>({
      query: (newItem) => ({
        url: '/example',
        method: 'POST',
        body: newItem,
      }),
    }),
  }),
});

export const { useCreateExampleMutation } = exampleApiSlice;
```

**Usage in a Component:**

```typescript
import React, { useState } from 'react';
import { useCreateExampleMutation } from '../api/exampleApiSlice';

const CreateExampleComponent = () => {
  const [createExample, { isLoading, error }] = useCreateExampleMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      await createExample({ name, description }).unwrap();
      // Handle success (e.g., reset form, show message)
    } catch (err) {
      // Handle error
      console.error('Failed to create:', err);
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={handleSubmit} disabled={isLoading}>
        Create
      </button>
      {error && <div>Error occurred.</div>}
    </div>
  );
};

export default CreateExampleComponent;
```

### 3. PUT Request

Use `builder.mutation` to update existing data.

```typescript
// src/api/exampleApiSlice.ts
import { apiSlice } from './apiSlice';

interface UpdateExamplePayload {
  id: string;
  name: string;
  description: string;
}

export const exampleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateExample: builder.mutation<ExampleType, UpdateExamplePayload>({
      query: (updatedItem) => ({
        url: `/example/${updatedItem.id}`,
        method: 'PUT',
        body: updatedItem,
      }),
    }),
  }),
});

export const { useUpdateExampleMutation } = exampleApiSlice;
```

**Usage in a Component:**

```typescript
import React from 'react';
import { useUpdateExampleMutation } from '../api/exampleApiSlice';

const UpdateExampleComponent = ({ item }) => {
  const [updateExample, { isLoading, error }] = useUpdateExampleMutation();

  const handleUpdate = async () => {
    try {
      await updateExample({ id: item.id, name: 'New Name', description: 'New Description' }).unwrap();
      // Handle success (e.g., show message)
    } catch (err) {
      // Handle error
      console.error('Failed to update:', err);
    }
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={isLoading}>
        Update
      </button>
      {error && <div>Error occurred.</div>}
    </div>
  );
};

export default UpdateExampleComponent;
```

### 4. DELETE Request

Use `builder.mutation` to delete data.

```typescript
// src/api/exampleApiSlice.ts
import { apiSlice } from './apiSlice';

export const exampleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteExample: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/example/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useDeleteExampleMutation } = exampleApiSlice;
```

**Usage in a Component:**

```typescript
import React from 'react';
import { useDeleteExampleMutation } from '../api/exampleApiSlice';

const DeleteExampleComponent = ({ id }) => {
  const [deleteExample, { isLoading, error }] = useDeleteExampleMutation();

  const handleDelete = async () => {
    try {
      await deleteExample(id).unwrap();
      // Handle success (e.g., remove item from list)
    } catch (err) {
      // Handle error
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isLoading}>
        Delete
      </button>
      {error && <div>Error occurred.</div>}
    </div>
  );
};

export default DeleteExampleComponent;
```

## Conclusion

Use the above dummy examples as templates to create your own API endpoints. Replace the URLs, request methods, and data types as needed for your specific use cases.

For further assistance, refer to the [Redux Toolkit Query Documentation](https://redux-toolkit.js.org/rtk-query/overview).
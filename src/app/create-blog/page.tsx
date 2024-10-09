"use client";
import React from 'react';
import axios from 'axios';
import { BlogEditor, Blog } from '@/components/Editor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CreateBlogPage() {
  const router = useRouter();

  const handleCreateBlog = async (data: Blog) => {
    try {
        const res = await axios.post("https://server.57ajay-u.workers.dev/api/v1/blog/create", data, {
            headers: {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiOWU3NmFjLTJlNzktNGUwOS1iMjE4LThhOGY3OGYzY2Y4YSIsImV4cCI6MTcyODg3Nzg2OX0.Wu97EphsOKyB3Vkt-WxwJupWVqFXhmqiXdsF0QRdyao",
            }
        });
        console.log("created blog: \n", res.data);
    } catch (error) {
      console.error("Error creating blog:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Blog</h1>
        <Button variant="outline" onClick={() => router.push('/blogs')}>
          Cancel
        </Button>
      </div>

      <BlogEditor
        onSubmit={handleCreateBlog}
        submitButtonText="Create Blog"
      />
    </div>
  );
}
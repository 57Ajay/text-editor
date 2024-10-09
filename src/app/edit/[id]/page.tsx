"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogEditor, Blog, ContentBlock } from '@/components/Editor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Author {
  id: string;
  name: string;
}

interface FetchedBlog extends Blog {
  id: any;
  title: any;
  content: any;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export default function UpdateBlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<FetchedBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get<FetchedBlog>(`https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`);
        setBlog(response.data.post);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to fetch blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleUpdateBlog = async (data: Blog) => {
    if (!blog) return;

    try {
      const updateData = {
        ...data,
        published: blog.published,
      };
      
      const res = await axios.post(`https://server.57ajay-u.workers.dev/api/v1/blog/update?id=${params.id}`, updateData, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiOWU3NmFjLTJlNzktNGUwOS1iMjE4LThhOGY3OGYzY2Y4YSIsImV4cCI6MTcyODg3Nzg2OX0.Wu97EphsOKyB3Vkt-WxwJupWVqFXhmqiXdsF0QRdyao",
        }
      });
      console.log("Updated blogs:\n", res.data)
    } catch (error) {
      console.error("Error updating blog:", error);
      setError("Failed to update blog. Please try again.");
    }
  };

  const togglePublishStatus = async () => {
    if (!blog) return;
    
    try {
      const response = await axios.patch(
        `/api/v1/blog/${params.id}/toggle-publish`,
        {},
        {
          headers: {
            "Authorization": "Bearer qwdqewfced23ed1e2dqwwqd2dqdsqd32",
          }
        }
      );
      setBlog(response.data);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError("Failed to update publish status.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/blogs')}>Back to Blogs</Button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4">Blog not found</p>
        <Button onClick={() => router.push('/blogs')}>Back to Blogs</Button>
      </div>
    );
  }

  // Create the initial data object from the fetched blog
  const editorInitialData: Blog = {
    id: blog.id,
    title: blog.title,
    content: blog.content.map((block: { id: any; type: any; text: any; style: { fontWeight: any; textSize: any; color: any; }; }) => ({
      id: block.id,
      type: block.type,
      text: block.text || "",
      style: {
        fontWeight: block.style.fontWeight || "normal",
        textSize: block.style.textSize || "text-md",
        color: block.style.color || "text-black"
      }
    }))
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Update Blog</h1>
        <div className="flex gap-4">
          <Button 
            onClick={togglePublishStatus}
            variant={blog.published ? "destructive" : "default"}
          >
            {blog.published ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" onClick={() => router.push('/blogs')}>
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6">
        <p><strong>Author:</strong> {blog.author.name}</p>
        <p><strong>Last Updated:</strong> {new Date(blog.updatedAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {blog.published ? 'Published' : 'Draft'}</p>
      </div>

      <BlogEditor
        initialData={editorInitialData}
        onSubmit={handleUpdateBlog}
        submitButtonText="Update Blog"
      />
    </div>
  );
}
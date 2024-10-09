"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { Trash, ChevronDown } from "lucide-react";
import axios from "axios";

const tailwindColors = [
  "text-black", "text-white", "text-red-500", "text-blue-500", "text-green-500",
  "text-yellow-500", "text-purple-500", "text-pink-500", "text-indigo-500",
  "text-gray-500", "text-orange-500",
];

interface Style {
  fontWeight?: "bold" | "semibold" | "normal";
  textSize?: "text-sm" | "text-md" | "text-lg";
  color?: string;
}

type ContentType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

interface ContentBlock {
  id: number;
  type: ContentType;
  style: Style;
  text?: string;
}

interface Blog {
  title: string;
  content: ContentBlock[];
}

interface EditorProps {
  editorType: "create" | "update";
}

const Editor = ({ editorType }: EditorProps) => {
  const { control, handleSubmit, watch, setValue } = useForm<Blog>({
    defaultValues: {
      title: "",
      content: [],
    },
  });

  const blogContent = watch("content"); // This will keep track of the current content blocks
  const [colorSearch, setColorSearch] = useState<string>("");

  const handleAddBlock = (type: ContentType) => {
    const newBlock: ContentBlock = {
      id: blogContent.length,
      type,
      style: {
        fontWeight: "normal",
        textSize: "text-md",
        color: "text-black",
      },
      text: "",
    };

    // Add new block to content
    setValue("content", [...blogContent, newBlock]);
  };

  const handleChange = (id: number, field: keyof ContentBlock, value: any) => {
    const updatedContent = blogContent.map((block) =>
      block.id === id ? { ...block, [field]: value } : block
    );
    setValue("content", updatedContent); // Only update content state, no submission
  };

  const handleDeleteBlock = (id: number) => {
    setValue("content", blogContent.filter((block) => block.id !== id)); // Remove block without submission
  };

  const onSubmit = async (data: Blog) => {
    console.log("Form Data Submitted: ", data);

    try {
      if (editorType === "create") {
        await axios.post("baseUrl/api/v1/blog/create", data, {
          headers: {
            "Authorization": "Bearer qwdqewfced23ed1e2dqwwqd2dqdsqd32",
          }
        });
      } else {
        await axios.put("/api/update-blog", data);
      }
      console.log("Success!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredColors = tailwindColors.filter((color) =>
    color.includes(colorSearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Blog Title */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Blog title is required" }}
          render={({ field, fieldState }) => (
            <>
              <Input
                placeholder="Blog Title"
                className={`mb-4 w-full text-xl font-bold ${fieldState.invalid ? 'border-red-500' : ''}`}
                {...field}
              />
              {fieldState.error && (
                <p className="text-red-500">{fieldState.error.message}</p>
              )}
            </>
          )}
        />

        {blogContent.map((block) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              {block.type !== "p" && (
                <Select onValueChange={(value: ContentType) => handleChange(block.id, "type", value)}>
                  <SelectTrigger className="w-48">
                    <ChevronDown className="ml-2" />
                    <span>Change Heading Type</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="h4">Heading 4</SelectItem>
                    <SelectItem value="h5">Heading 5</SelectItem>
                    <SelectItem value="h6">Heading 6</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="destructive" onClick={() => handleDeleteBlock(block.id)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            {block.type === "p" ? (
              <Textarea
                placeholder="Enter paragraph text..."
                className={`w-full ${block.style.textSize} ${block.style.color}`}
                value={block.text}
                onChange={(e) => handleChange(block.id, "text", e.target.value)}
              />
            ) : (
              <Input
                placeholder={`Enter ${block.type} text...`}
                className={`w-full font-${block.style.fontWeight} ${block.style.textSize} ${block.style.color}`}
                value={block.text}
                onChange={(e) => handleChange(block.id, "text", e.target.value)}
              />
            )}

            <div className="flex gap-4 mt-2">
              <Button
                type="button" // Ensure this is a button, not a submit button
                onClick={() =>
                  handleChange(block.id, "style", {
                    ...block.style,
                    fontWeight: block.style.fontWeight === "bold" ? "normal" : "bold",
                  })
                }
              >
                Toggle Bold
              </Button>
              <Button
                type="button" // Ensure this is a button, not a submit button
                onClick={() =>
                  handleChange(block.id, "style", {
                    ...block.style,
                    textSize: block.style.textSize === "text-md" ? "text-lg" : "text-md",
                  })
                }
              >
                Toggle Text Size
              </Button>
            </div>

            {/* Color Picker with Search */}
            <div className="mt-2">
              <Input
                placeholder="Search color"
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2 overflow-auto">
                {filteredColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border border-gray-300 ${color}`}
                    onClick={() => handleChange(block.id, "style", { ...block.style, color })}
                    aria-label={color}
                  ></button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button type="button" onClick={() => handleAddBlock("h1")}>Add Heading</Button>
          <Button type="button" onClick={() => handleAddBlock("p")}>Add Paragraph</Button>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button type="submit" variant="default">
            {editorType === "create" ? "Create Blog" : "Update Blog"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Editor;

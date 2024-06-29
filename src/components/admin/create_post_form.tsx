"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryBadge from "@/components/badges/category";
import TagBadge from "@/components/badges/tag";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean(),
  categoryId: z.number().min(1, "Category is required"),
  tagIds: z.array(z.number()).min(1, "At least one tag is required"),
});

type PostFormValues = z.infer<typeof postSchema>;

type Category = { id: number; name: string };
type Tag = { id: number; name: string };

export function CreatePostForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      published: false,
      categoryId: 0,
      tagIds: [],
    },
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    // Fetch categories from your API
    // const response = await fetch("/api/categories");
    // const data = await response.json();
    // setCategories(data);

    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Optionally, you can set an error state here and display it to the user
    }
  };

  const fetchTags = async () => {
    const response = await fetch("/api/tags");
    const data = await response.json();
    setTags(data);
  };

  const createCategory = async (name: string) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newCategory = await response.json();
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const createTag = async (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const response = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    const newTag = await response.json();
    setTags([...tags, newTag]);
    return newTag;
  };

  async function onSubmit(data: PostFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Post content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="post-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.id === field.value
                          )?.name
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          value={category.name}
                          key={category.id}
                          onSelect={() => {
                            form.setValue("categoryId", category.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                  <div className="p-2">
                    <Input
                      placeholder="Create new category"
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          const newCategory = await createCategory(
                            e.currentTarget.value
                          );
                          form.setValue("categoryId", newCategory.id);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <TagBadge key={tag.id} name={tag.name} />
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} selected`
                        : "Select tags"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {tags.map((tag) => (
                        <CommandItem
                          value={tag.name}
                          key={tag.id}
                          onSelect={() => {
                            const updatedTags = field.value.includes(tag.id)
                              ? field.value.filter((id) => id !== tag.id)
                              : [...field.value, tag.id];
                            form.setValue("tagIds", updatedTags);
                            setSelectedTags(
                              tags.filter((t) => updatedTags.includes(t.id))
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(tag.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                  <div className="p-2">
                    <Input
                      placeholder="Create new tag"
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          const newTag = await createTag(e.currentTarget.value);
                          const updatedTags = [...field.value, newTag.id];
                          form.setValue("tagIds", updatedTags);
                          setSelectedTags([...selectedTags, newTag]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const seriesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  createdAt: z.date(),
  postIds: z.array(z.number()).optional(),
});

type SeriesFormValues = z.infer<typeof seriesSchema>;

const CreateSeriesForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availablePosts, setAvailablePosts] = useState<
    { id: number; title: string }[]
  >([]);
  const [selectedPosts, setSelectedPosts] = useState<
    { id: number; title: string }[]
  >([]);

  const form = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();
        setAvailablePosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive",
        });
      }
    };

    fetchPosts();
  }, []);

  async function onSubmit(data: SeriesFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, postIds: data.postIds || [] }),
      });

      if (!response.ok) {
        throw new Error("Failed to create series");
      }

      toast({
        title: "Success",
        description: "Series created successfully",
      });
      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create series",
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
                <Input placeholder="Series title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Series description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Posts</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedPosts.map((post) => (
                  <Badge key={post.id} variant="secondary">
                    {post.title}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => {
                        setSelectedPosts(
                          selectedPosts.filter((p) => p.id !== post.id)
                        );
                        form.setValue(
                          "postIds",
                          field.value?.filter((id) => id !== post.id) || []
                        );
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length > 0
                        ? `${field.value?.length} posts selected`
                        : "Select posts"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search posts..." />
                    <CommandEmpty>No posts found.</CommandEmpty>
                    <CommandGroup>
                      {availablePosts.map((post) => (
                        <CommandItem
                          key={post.id}
                          onSelect={() => {
                            const currentIds = field.value || [];
                            const updatedIds = currentIds.includes(post.id)
                              ? currentIds.filter((id) => id !== post.id)
                              : [...currentIds, post.id];
                            form.setValue("postIds", updatedIds);
                            setSelectedPosts(
                              availablePosts.filter((p) =>
                                updatedIds.includes(p.id)
                              )
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (field.value || []).includes(post.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {post.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
                <Input placeholder="series-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Created At</FormLabel>
              <div className="flex">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => form.setValue("createdAt", new Date())}
                  title="Reset to current date"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Series"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateSeriesForm;

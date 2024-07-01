"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { serialize } from "next-mdx-remote/serialize";

// Dynamic import for the MDXContent component to avoid the following error:
// async/await is not yet supported in client-side components.
const MDXContent = dynamic(() => import("@/components/mdx_content"), {
  ssr: false,
  loading: () => <p>Loading preview...</p>,
});

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  HeadingIcon,
  ListIcon,
  LinkIcon,
  TextIcon,
  EyeIcon,
  CodeIcon,
  MaximizeIcon,
  SettingsIcon,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MarkdownEditor({
  value,
  onChange,
  onSubmit,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"plain" | "preview" | "markdown">("plain");
  const [serializedContent, setSerializedContent] = useState<any>(null);

  useEffect(() => {
    const serializeContent = async () => {
      if (mode === "preview") {
        const serialized = await serialize(value);
        setSerializedContent(serialized);
      }
    };

    serializeContent();
  }, [value, mode]);

  const handleInsert = (syntax: string) => {
    onChange(value + syntax);
  };

  return (
    <div className="flex flex-col h-full border rounded-md">
      <div className="bg-background border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("**bold**")}
          >
            <BoldIcon className="h-4 w-4" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("*italic*")}
          >
            <ItalicIcon className="h-4 w-4" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("~~strikethrough~~")}
          >
            <StrikethroughIcon className="h-4 w-4" />
            <span className="sr-only">Strikethrough</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("\n# Heading\n")}
          >
            <HeadingIcon className="h-4 w-4" />
            <span className="sr-only">Heading</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("\n- List item\n")}
          >
            <ListIcon className="h-4 w-4" />
            <span className="sr-only">List</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleInsert("[Link text](url)")}
          >
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Link</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center justify-center">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value: any) => setMode(value)}
            >
              <ToggleGroupItem value="plain" aria-label="Plain Text">
                <TextIcon className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="preview" aria-label="Preview">
                <EyeIcon className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="markdown" aria-label="Markdown">
                <CodeIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MaximizeIcon className="h-4 w-4" />
            <span className="sr-only">Maximize</span>
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {mode === "preview" ? (
          <div className="prose prose-lg p-4">
            <Suspense fallback={<div>Loading preview...</div>}>
              {/* <MDXContent source={value} /> */}
              {serializedContent && <MDXContent source={serializedContent} />}
            </Suspense>
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing..."
            className="h-full w-full resize-none border-0 bg-background p-4 focus:outline-none"
          />
        )}
      </div>
      <div className="bg-background border-t px-4 py-2">
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
}

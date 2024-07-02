"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { serialize } from "next-mdx-remote/serialize";
// import MDXContent from "@/components/mdx_content";
import debounce from "lodash.debounce";

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
  MaximizeIcon,
  SettingsIcon,
  SquareSplitHorizontalIcon,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface MarkdownEditorProps {
  value: string;
  initialMode?: "plain" | "preview" | "hybrid";
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const debouncedSerialize = debounce(
  async (content: string, callback: (serialized: any) => void) => {
    const serialized = await serialize(content);
    callback(serialized);
  },
  300
);

export function MarkdownEditor({
  value,
  initialMode = "plain",
  onChange,
  onSubmit,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"plain" | "preview" | "hybrid">(initialMode);
  const [serializedContent, setSerializedContent] = useState<any>(null);

  const updateSerializedContent = useCallback((content: string) => {
    debouncedSerialize(content, setSerializedContent);
  }, []);

  useEffect(() => {
    if (mode === "preview" || mode === "hybrid") {
      updateSerializedContent(value);
    }
  }, [value, mode, updateSerializedContent]);

  const handleInsert = useCallback(
    (syntax: string) => {
      onChange(value + syntax);
    },
    [onChange, value]
  );

  const handleModeChange = useCallback(
    (newMode: "plain" | "preview" | "hybrid") => {
      setMode(newMode);
      if (newMode === "preview" || newMode === "hybrid") {
        updateSerializedContent(value);
      }
    },
    [value, updateSerializedContent]
  );

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
              <ToggleGroupItem value="hybrid" aria-label="Hybrid">
                <SquareSplitHorizontalIcon className="h-4 w-4" />
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
              {serializedContent && <MDXContent source={serializedContent} />}
            </Suspense>
          </div>
        ) : mode === "hybrid" ? (
          <div className="flex h-full">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                <Textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Start typing..."
                  className="h-full w-full resize-none border-0 bg-background p-4 focus:outline-none"
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="overflow-auto prose prose-lg p-4">
                  <Suspense fallback={<div>Loading preview...</div>}>
                    {serializedContent && (
                      <MDXContent source={serializedContent} />
                    )}
                  </Suspense>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
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

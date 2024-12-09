"use client";

import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";

import { type LucideProps, Bot, Image, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useTheme } from "next-themes";
import { Chat } from "@/constants/Models";
import { Label } from "@/components/ui/label";

const config: Array<{
  name: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  route: string;
  elements: {
    input: "input" | "textarea";
    placeholder: string;
    submit: string;
  };
  advanced?: Array<
    {
      label: string;
      value: string;
    } & (
      | {
          type: "input" | "textarea";
          defaultValue?: string;
        }
      | {
          type: "checkbox";
          defaultValue?: boolean;
        }
      | {
          type: "select";
          defaultValue?: string;
          options: Array<{
            label: string;
            value: string;
          }>;
        }
    )
  >;
}> = [
  {
    name: "Chat",
    description: "Interact with our AI chatbot model.",
    icon: Bot,
    route: "/api/chat",
    elements: {
      input: "textarea",
      placeholder: "Ask a question...",
      submit: "Submit",
    },
    advanced: [
      {
        label: "AI Model",
        value: "chat-ai-model",
        type: "select",
        defaultValue: "@cf/meta/llama-3-8b-instruct",
        options: Chat.map((chat) => ({ label: chat, value: chat })),
      },
    ],
  },
  {
    name: "Image Generation",
    description:
      "Generate AI image where the limit is your imagination (and Cloudflare AI billing)",
    icon: Image,
    route: "/api/image",
    elements: {
      input: "textarea",
      placeholder: "Describe your image...",
      submit: "Generate",
    },
  },
  {
    name: "Summarize",
    description: "Summarize your long long text into a short summary",
    icon: Bot,
    route: "/api/summarize",
    elements: {
      input: "textarea",
      placeholder: "Describe your text...",
      submit: "Summarize",
    },
  },
];

export default function AIDashboard() {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});
  const [params, setParams] = useState<
    Array<{
      name: string;
      value: string;
    }>
  >([]);

  const { setTheme, resolvedTheme } = useTheme();

  const addParams = (name: string, value: string) => {
    setParams((prev) => [
      ...prev,
      {
        name,
        value,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent, modelName: string) => {
    e.preventDefault();
    setLoading(true);
    console.log(`${modelName} prompt submitted:`, prompts[modelName]);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 pt-4 text-3xl font-bold">Cloudflare AI</h1>
      <Tabs defaultValue={config[0].name.toLowerCase()} className="space-y-4">
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${config.length}, minmax(0, 1fr))`,
          }}
        >
          {config.map((model) => (
            <TabsTrigger
              key={model.name}
              value={model.name.toLowerCase()}
              disabled={loading}
            >
              <model.icon className="mr-2 h-4 w-4" />
              {model.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.map((model) => (
          <TabsContent key={model.name} value={model.name.toLowerCase()}>
            <Card>
              <CardHeader>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleSubmit(e, model.name)}
                  className="space-y-4"
                >
                  {model.elements.input === "textarea" && (
                    <Textarea
                      className="max-h-[50dvh] text-xs md:text-sm"
                      value={prompts[model.name]}
                      onChange={(e) =>
                        setPrompts((prev) => ({
                          ...prev,
                          [model.name]: e.target.value,
                        }))
                      }
                      placeholder={model.elements.placeholder}
                      disabled={loading}
                    />
                  )}
                  {model.elements.input === "input" && (
                    <Input
                      value={prompts[model.name]}
                      onChange={(e) =>
                        setPrompts((prev) => ({
                          ...prev,
                          [model.name]: e.target.value,
                        }))
                      }
                      placeholder={model.elements.placeholder}
                      disabled={loading}
                    />
                  )}
                  <Collapsible>
                    <CollapsibleTrigger className="text-sm text-slate-500">
                      View advanced
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      {(model.advanced || []).map((advanced) => (
                        <div
                          key={advanced.value}
                          className="flex flex-col gap-2"
                        >
                          <Label>{advanced.label}</Label>
                          {advanced.type === "checkbox" && (
                            <Checkbox
                              checked={
                                params.find(
                                  (param) =>
                                    param.name === advanced.value &&
                                    param.value === "true",
                                )
                                  ? true
                                  : false
                              }
                              onChange={() => addParams(advanced.value, "true")}
                              disabled={loading}
                            />
                          )}
                          {advanced.type === "input" && (
                            <Input
                              value={
                                params.find(
                                  (param) => param.name === advanced.value,
                                )?.value ||
                                advanced.defaultValue ||
                                ""
                              }
                              onChange={(e) =>
                                addParams(advanced.value, e.target.value)
                              }
                              disabled={loading}
                            />
                          )}
                          {advanced.type === "textarea" && (
                            <Textarea
                              value={
                                params.find(
                                  (param) => param.name === advanced.value,
                                )?.value ||
                                advanced.defaultValue ||
                                ""
                              }
                              onChange={(e) =>
                                addParams(advanced.value, e.target.value)
                              }
                              disabled={loading}
                            />
                          )}
                          {advanced.type === "select" && (
                            <Select
                              value={
                                params.find(
                                  (param) => param.name === advanced.value,
                                )
                                  ? params.find(
                                      (param) => param.name === advanced.value,
                                    )?.value
                                  : advanced.defaultValue
                              }
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    advanced.defaultValue ?? "Default"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {advanced.options.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    onClick={() =>
                                      addParams(advanced.value, option.value)
                                    }
                                    className="text-white"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    onClick={() =>
                      resolvedTheme === "dark"
                        ? setTheme("light")
                        : setTheme("dark")
                    }
                  >
                    <Sparkles />
                    {model.elements.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

"use client";

import useSWR from "swr";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";

import {
  type LucideProps,
  Bot,
  Image,
  Sparkles,
  ChevronsUpDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Label } from "@/components/ui/label";
import { Settings } from "@/components/Settings";
import Markdown from "react-markdown";

import { useTheme } from "next-themes";
import { Chat } from "@/constants/Models";

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
    loadingSubmit: string;
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
      loadingSubmit: "Generating...",
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
    name: "Summarize",
    description: "Summarize your long long text into a short summary",
    icon: Bot,
    route: "/api/summarize",
    elements: {
      input: "textarea",
      placeholder: "Describe your text...",
      submit: "Summarize",
      loadingSubmit: "Generating...",
    },
  },
  // TODO
  // {
  //   name: "Image Generation",
  //   description:
  //     "Generate AI image where the limit is your imagination (and Cloudflare AI billing)",
  //   icon: Image,
  //   route: "/api/image",
  //   elements: {
  //     input: "textarea",
  //     placeholder: "Describe your image...",
  //     submit: "Generate",
  //     loadingSubmit: "Generating...",
  //   },
  // },
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
  const [result, setResult] = useState("");
  const [completedTime, setCompletedTime] = useState(0);

  const addParams = (name: string, value: string) => {
    setParams((prev) => prev.filter((data) => data.name !== name));
    setParams((prev) => [
      ...prev,
      {
        name,
        value,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent, modelName: string) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const start = Date.now();
    console.log(`${modelName} prompt submitted:`, prompts[modelName]);

    const response = (await (
      await fetch(config.find((c) => c.name === modelName)!.route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompts[modelName],
          params: params.map((param) => ({
            name: param.name,
            value: param.value,
          })),
        }),
      })
    ).json()) as {
      result: string;
    };

    console.log(response.result);
    const end = Date.now();

    setCompletedTime(end - start);
    setResult(response.result);
    setLoading(false);
  };

  return (
    <>
      <Settings />
      <main className="container mx-auto max-w-2xl p-4">
        <h1 className="mb-6 pt-4 text-3xl font-bold">Cloudflare AI</h1>
        <Tabs
          defaultValue={config[0].name.toLowerCase()}
          className="w-full space-y-4"
        >
          <ScrollArea>
            <TabsList
              className="grid w-max min-w-full"
              style={{
                gridTemplateColumns: `repeat(${config.length}, minmax(0, 1fr))`,
              }}
            >
              {config.map((model) => (
                <TabsTrigger
                  key={model.name}
                  value={model.name.toLowerCase()}
                  disabled={loading}
                  onClick={(e) => {
                    setResult("");
                  }}
                  className="text-xs md:text-sm"
                >
                  <model.icon className="mr-2 h-4 w-4" />
                  {model.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar className="pt-2" orientation="horizontal" />
          </ScrollArea>
          {config.map((model) => (
            <TabsContent key={model.name} value={model.name.toLowerCase()}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <model.icon />
                    {model.name}
                  </CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => handleSubmit(e, model.name)}
                    className="space-y-4"
                  >
                    {model.elements.input === "textarea" && (
                      <Textarea
                        className="h-[10vh] max-h-[50vh] text-xs md:text-sm"
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
                    {(model.advanced || []).length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ChevronsUpDown size={12} />
                            View advanced
                          </Button>
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
                                  onChange={() =>
                                    addParams(advanced.value, "true")
                                  }
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
                                          (param) =>
                                            param.name === advanced.value,
                                        )?.value
                                      : advanced.defaultValue
                                  }
                                  onValueChange={(value) =>
                                    addParams(advanced.value, value)
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
                                          addParams(
                                            advanced.value,
                                            option.value,
                                          )
                                        }
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
                    )}

                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={loading}
                    >
                      <Sparkles />
                      {loading
                        ? model.elements.loadingSubmit
                        : model.elements.submit}
                    </Button>
                  </form>
                  {result !== "" && (
                    <div className="mt-4 rounded-md bg-secondary p-4">
                      <h3 className="mb-2 font-semibold">Response:</h3>
                      <Markdown className="flex flex-col text-justify text-sm">{`${result}`}</Markdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  );
}

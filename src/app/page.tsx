"use client";

import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";

import {
  type LucideProps,
  Bot,
  Text,
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
import BlurFade from "@/components/ui/blur-fade";
import { Label } from "@/components/ui/label";
import { Settings } from "@/components/Settings";
import Markdown from "react-markdown";

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
      {
        label: "What the AI should know?",
        value: "chat-ai-context",
        type: "textarea",
        defaultValue: "You are a helpful assistant.",
      },
    ],
  },
  {
    name: "Summarize",
    description: "Summarize your long long text into a short summary",
    icon: Text,
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

    if (modelName === "Chat") {
      const response = (await (
        await fetch(config.find((c) => c.name === modelName)!.route, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompts[modelName],
          }),
        })
      ).json()) as {
        result: string;
      };

      setResult(response.result);
    } else if (modelName === "Summarize") {
      const response = (await (
        await fetch(config.find((c) => c.name === modelName)!.route, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompts[modelName],
          }),
        })
      ).json()) as {
        result: string;
      };

      setResult(response.result);
    }

    const end = Date.now();

    setCompletedTime(end - start);
    setLoading(false);
  };

  return (
    <>
      <Settings />
      <main className="container mx-auto max-w-2xl p-4">
        <header className="mb-6 pt-6">
          <BlurFade delay={0.25 * 1} inView>
            <h1 className="text-2xl font-bold md:text-3xl">
              Simple AI Chatbot
            </h1>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-xs md:text-sm">
              Just a simple AI Chatbot for sure. Powered by Cloudflare AI.
            </p>
          </BlurFade>
        </header>
        <Tabs
          defaultValue={config[0].name.toLowerCase()}
          className="w-full space-y-4"
        >
          <BlurFade delay={0.25 * 3} inView>
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
          </BlurFade>

          <BlurFade delay={0.25 * 4} inView>
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
                              variant="secondary"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <ChevronsUpDown size={12} />
                              View advanced
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="flex flex-col gap-4 pt-4">
                            {(model.advanced || []).map((advanced) => (
                              <div
                                key={advanced.value}
                                className="flex flex-col gap-2"
                              >
                                <Label className="leading-3">
                                  {advanced.label}
                                </Label>
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
                                        (param) =>
                                          param.name === advanced.value,
                                      )?.value ??
                                      advanced.defaultValue ??
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
                                        (param) =>
                                          param.name === advanced.value,
                                      )?.value ??
                                      advanced.defaultValue ??
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
                                        (param) =>
                                          param.name === advanced.value,
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
                      <div className="mt-4 flex flex-col gap-2 rounded-md bg-secondary p-4">
                        <span>
                          <h3 className="font-semibold leading-4">Response:</h3>
                          <p className="text-xs">{completedTime}ms</p>
                        </span>
                        <Markdown className="flex flex-col text-justify text-sm">{`${result}`}</Markdown>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </BlurFade>
        </Tabs>
      </main>
    </>
  );
}

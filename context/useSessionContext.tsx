 "use client";
import React, { createContext, useEffect, useContext, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Repo } from "@/app/types/prompts";
import { Message } from "@/app/types/chat";
import createContextMessages from "@/utils/addContextMessages";
import { checkIfPro } from "@/utils/checkIfPro";

const defaultContext: any = {
  repoWindowOpen: false,
  session: null,
  user: null,
  isPro: false,
  repo: { owner: null, repo: null },
  lofaf: [],
  techStack: [],
  context: "",
  branch: "",
  messages: [{ role: null, content: null }],
  methods: {
    setRepoWindowOpen: () => {},
    signOut: () => {},
    setRepo: () => {},
    setLofaf: () => {},
    setTechStack: () => {},
    setContext: () => {},
    setBranch: () => {},
    setMessages: () => {},
  },
};

const SessionContext = createContext(defaultContext);

const MOCK_DATA = {
  repoWindowOpen: false,
  session: {
    user: {
      id: "mockUserId",
      email: "mockEmail@example.com",
    },
  },
  user: {
    id: "mockUserId",
    email: "mockEmail@example.com",
    identities: [
      { id: "mock", provider: "mock", identity_data: { name: "Mock User", email: "mockEmail@example.com" } },
    ],
  },
  isPro: true,
  repo: {
    owner: "",
    repo: "",
  },
  lofaf: ["mockLofaf1", "mockLofaf2"],
  techStack: ["mockTech1", "mockTech2"],
  context: "mockContext",
  branch: "mockBranch",
  messages: [
    {
      role: "mockRole",
      content: "mockContent",
    },
  ],
};

export const SessionProvider: React.FC = ({ children }) => {
  const [repoWindowOpen, setRepoWindowOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [repo, setRepo] = useState<Repo>({ owner: "", repo: "" });
  const [lofaf, setLofaf] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [context, setContext] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUsedTrainingSettings, setLastUsedTrainingSettings] = useState<any>(null);

  // Load data from supabase
  const setupContextMessages = () => {
    // Set default messages
    if (messages.length === 0) {
      createContextMessages(
        [],
        String(lofaf),
        String(repo?.owner),
        String(repo?.repo),
        String(session?.provider_token),
        String(user?.email)
      ).then((newMessages: any) => {
        setLastUsedTrainingSettings({
          repo: repo?.repo,
          owner: repo?.owner,
          lofaf: lofaf,
        });
        setMessages(newMessages);
      });
    }
  };

  useEffect(() => {
    if (
      lastUsedTrainingSettings?.repo !== repo?.repo ||
      lastUsedTrainingSettings?.owner !== repo?.owner ||
      lastUsedTrainingSettings?.lofaf.length !== lofaf.length
    ) {
      setMessages([]); // Reset messages
      setupContextMessages();
    }
  }, [lofaf, repo, session, user, repo?.repo]);

  useEffect(() => {
    // Set user and session
    if (supabase) {
      const setData = async () => {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        setUser(session?.user);
      };

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user);
      });

      setData();

      return () => {
        listener?.subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    setMessages([]);
    if (process.env.NODE_ENV !== 'development') {
      if (messages.length === 0) {
        createContextMessages(
          [],
          String(lofaf),
          String(repo?.owner),
          String(repo?.repo),
          String(session?.provider_token),
          String(user?.email)
        ).then(setMessages);
      }
    }
  }, [repo, user, session]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      const loadPaymentStatus = async () => {
        const githubIdentity: any = user?.identities?.find(
          (identity) => identity?.provider === "github"
        )?.identity_data;
        const pro = await checkIfPro(githubIdentity?.email);
        setIsPro(pro);
      };
      loadPaymentStatus();
    }
  }, [user]);

  const value = {
    repoWindowOpen,
    session,
    user,
    isPro,
    repo,
    lofaf,
    techStack,
    context,
    branch,
    messages,
    methods: {
      setRepoWindowOpen,
      signOut: () => {
        if (process.env.NODE_ENV !== 'development' && supabase) {
          supabase.auth.signOut();
          setUser(null);
          setSession(null);
        }
      },
      setIsPro,
      setRepo,
      setLofaf,
      setTechStack,
      setContext,
      setBranch,
      setMessages,
    },
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};

import React, { createContext, useEffect, useContext, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Repo } from "@/app/types/prompts";
import { Message } from "@/app/types/chat";
import createContextMessages from "@/utils/addContextMessages";
import { checkIfPro } from "@/utils/checkIfPro";
import { mockManager } from "@/app/configs/mockManager";
import { SessionOptions } from "http2";

interface SessionProviderProps {
  children: React.ReactNode;
}

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
const isMockEnabled = mockManager.isMockIntegrationsEnabled();


export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
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

  const setupContextMessages = () => {
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
    if (isMockEnabled) {
      setUser(mockManager.mockData().user as unknown as User);
      setSession(mockManager.mockData().session as unknown as Session);
      setIsPro(mockManager.mockData().isPro);
      setRepo(mockManager.mockData().repo);
      setLofaf(mockManager.mockData().lofaf);
      setTechStack(mockManager.mockData().techStack);
      setContext(mockManager.mockData().context);
      setBranch(mockManager.mockData().branch);
      setMessages(mockManager.mockData().messages);
    } else {
  
      if (supabase) {
        const setData = async () => {
          const {
            data: { session },
            error,
            // @ts-ignore
          } = await supabase.auth.getSession();
          if (error) throw error;
          setSession(session);
          // @ts-ignore
          setUser(session?.user);
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          // @ts-ignore
          setUser(session?.user);
        });

        setData();

        return () => {
          listener?.subscription.unsubscribe();
        };
      }
    }
  }, [isMockEnabled]);

  useEffect(() => {
    if (!mockManager.isMockIntegrationsEnabled()) {
      if (
        messages.length === 0 ||
        lastUsedTrainingSettings?.repo !== repo?.repo ||
        lastUsedTrainingSettings?.owner !== repo?.owner ||
        lastUsedTrainingSettings?.lofaf.length !== lofaf.length
      ) {
        setMessages([]);
        setupContextMessages();
      }
    }
  }, [lofaf, session, user, repo]);

  useEffect(() => {
    if (!mockManager.isMockIntegrationsEnabled()) {
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
        if (supabase) {
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

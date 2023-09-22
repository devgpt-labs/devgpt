"use client";
import React from "react";
import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "@/utils/supabase";

//types
import { Repo } from "@/app/types/prompts";
import { Message } from "@/app/types/chat";

//utils
import { checkIfPro } from "@/utils/checkIfPro";

//prompts
import { system } from "@/app/prompts/system";
import addContextMessages from "@/utils/addContextMessages";

const defaultContext: any = {
  repoWindowOpen: null,
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

const SessionContext = createContext<{
  repoWindowOpen: boolean;
  session: Session | null | undefined;
  user: User | null | undefined;
  isPro: boolean;
  repo: Repo;
  lofaf: string[];
  techStack: string[];
  context: string;
  branch: string;
  messages: Message[];
  methods: {
    setRepoWindowOpen: (repoWindowOpen: boolean) => void;
    signOut: () => void;
    setRepo: (repo: Repo) => void;
    setLofaf: (lofaf: string[]) => void;
    setTechStack: (techStack: string[]) => void;
    setContext: (context: string) => void;
    setBranch: (branch: string) => void;
    setMessages: (messages: Message[]) => void;
  };
}>(defaultContext);

export const SessionProvider = ({ children }: any) => {
  const [repoWindowOpen, setRepoWindowOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [isPro, setIsPro] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>();
  const [repo, setRepo] = useState<Repo>({ owner: "", repo: "" });
  const [lofaf, setLofaf] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [context, setContext] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  //load data from supabase

  useEffect(() => {
    //set default messages
    addContextMessages(messages, String(lofaf), String(user?.email)).then((newMessages: any) => {
      setMessages(newMessages);
    });
  }, [lofaf]);

  useEffect(() => {
    //set user and session
    if (supabase) {
      const setData = async () => {
        if (supabase) {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;
          setSession(session);
          setUser(session?.user);
        }
      };

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user);
        }
      );

      setData();

      return () => {
        listener?.subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    const loadPaymentStatus = async () => {
      //check if user is pro
      const githubIdentity: any = user?.identities?.find(
        (identity) => identity?.provider === "github"
      )?.identity_data;
      const pro = await checkIfPro(githubIdentity?.email);
      setIsPro(pro);
    };
    loadPaymentStatus();
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

"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
} from "react";

export const SearchContext = createContext<
  [any, Dispatch<SetStateAction<any>>] | undefined
>(undefined);
export const UserContext = createContext<
  [any, Dispatch<SetStateAction<any>>] | undefined
>(undefined);
export const CurrentLanguageContext = createContext<any>(undefined);
export const demandSearchContext = createContext<
  [any, Dispatch<SetStateAction<any>>] | undefined
>(undefined);
export const messageInfoContext = createContext<
  [any, Dispatch<SetStateAction<any>>] | undefined
>(undefined);
export const SearchEngineContext = createContext<
  [string, Dispatch<SetStateAction<string>>] | undefined
>(undefined);

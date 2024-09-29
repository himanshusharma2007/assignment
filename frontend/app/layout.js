// app/layout.js
"use client"; // Add this if using hooks or rendering client components

import { Provider } from "react-redux";
import { store } from "../redux/store";
import Head from "next/head";

import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head> <title>ShopSquire</title></head>
      <body>
   
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}

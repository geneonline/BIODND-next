import React from "react";

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-interface-background">
      {/* 
        In the future, if we need a specific sidebar or top bar for Database section, 
        we can add it here. For now, it inherits the global Navbar from root layout.
      */}
      {children}
    </div>
  );
}

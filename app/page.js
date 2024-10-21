"use client";
import React from "react";
import { useUser } from "./components/UserContext";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading, error } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Profile</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>IP Address: {user.ipaddr}</p>
      </main>
    </div>
  );
}

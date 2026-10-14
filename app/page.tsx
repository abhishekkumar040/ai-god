import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <h2> hello </h2>
      <UserButton />
    </div>
  );
}
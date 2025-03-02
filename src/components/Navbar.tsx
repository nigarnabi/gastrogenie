"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars as Menu, FaTimes as X } from "react-icons/fa";

export default function Navbar() {
    return (
      <nav className="bg-yellow-300 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* App Name / Logo */}
          <Link href="/" className="text-lg font-semibold">
            GastroGenie
          </Link>
  
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/favorites" className="hover:underline">Favorites</Link>
          </div>
        </div>
      </nav>
    );
  }




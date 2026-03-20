'use client';

import React from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';

const navLinks = [
  { label: 'FEATURE', href: '#' },
  { label: 'PRICING', href: '#' },
  { label: 'CONTACT', href: '#' },

];

export default function Hero() {
  return (
    <MinimalistHero
      logoText="mu8ic."
      navLinks={navLinks}
      mainText="Generate royalty-free BGM for your YouTube videos in seconds."
      readMoreLink="#"
      imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
      imageAlt="AI-generated music for YouTube creators."
      overlayText={{
        part1: 'Create',
        part2: 'Your Sound',
      }}
    />
  );
}

import React from 'react';
import { Beer } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-gray-600">
        <Beer size={18} className="mr-2" />
        <span>Tapped by Crafty Brothas</span>
      </div>
    </footer>
  );
}
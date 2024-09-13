'use client';

import clsx from 'clsx';
import React from 'react';

import Button from '@/components/buttons/Button';
import ArrowLink from '@/components/links/ArrowLink';



export default function ComponentPage() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('light');
  function toggleMode() {
    return mode === 'dark' ? setMode('light') : setMode('dark');
  }

  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <main>
      <section
        className={clsx(mode === 'dark' ? 'bg-dark' : 'bg-white', color)}
      >
        <div
          className={clsx(
            'layout min-h-screen py-20',
            mode === 'dark' ? 'text-white' : 'text-black'
          )}
        >
          <h1>Built-in Components</h1>
          <ArrowLink direction='left' className='mt-2' href='/'>
            Back to Home
          </ArrowLink>

          <div className='mt-8 flex flex-wrap gap-2'>
            <Button
              onClick={toggleMode}
              variant={mode === 'dark' ? 'light' : 'dark'}
            >
              Set to {mode === 'dark' ? 'light' : 'dark'}
            </Button>
            {/* <Button onClick={randomize}>Randomize CSS Variable</Button> */}
          </div>

        
        </div>
      </section>
    </main>
  );
}


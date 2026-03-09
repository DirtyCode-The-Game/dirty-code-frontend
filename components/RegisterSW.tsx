'use client';

import { useEffect } from 'react';

export function RegisterSW() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW Registered: ', registration.scope);
                })
                .catch((err) => {
                    console.error('SW Registration Failed: ', err);
                });
        }
    }, []);

    return null;
}

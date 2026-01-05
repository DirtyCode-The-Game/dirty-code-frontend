'use client';

import { Card, CardBody, Divider } from "@heroui/react";

export function DefaultPage() {
    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    Dirty<span className="text-primary">Code</span>
                </h1>
                <p className="text-gray-400 border-l-2 border-primary pl-3">
                    Bem-vindo ao submundo do desenvolvimento.
                </p>
            </div>

            <Divider className="bg-white/10" />

            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-sm text-gray-400">
                    Torne-se o maior programador do mundo.
                </p>
            </div>
        </div>
    );
}

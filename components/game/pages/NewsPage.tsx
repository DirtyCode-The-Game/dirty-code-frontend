'use client';

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { CHANGELOG_DATA } from "@/data/changelog";

export function NewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold uppercase text-white mb-2">Notícias</h1>
                    <p className="text-gray-400 text-lg border-l-2 border-primary pl-4">
                        O que mudou no sistema. Fique atento.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {CHANGELOG_DATA.map((log, index) => (
                    <Card key={log.version} className="bg-black/40 border border-white/5 hover:border-primary/30 transition-colors">
                        <CardHeader className="flex justify-between items-center px-6 pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white">{log.title}</h3>
                                <Chip size="sm" variant="flat" color={index === 0 ? "success" : "default"}>
                                    v{log.version}
                                </Chip>
                                {index === 0 && (
                                    <Chip size="sm" variant="shadow" color="primary" className="animate-pulse">
                                        Novo
                                    </Chip>
                                )}
                            </div>
                            <span className="text-xs font-mono text-gray-500">{log.date}</span>
                        </CardHeader>
                        <CardBody className="px-6 pb-6 pt-2">
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                {log.items.map((item, idx) => (
                                    <li key={idx} className="marker:text-primary">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

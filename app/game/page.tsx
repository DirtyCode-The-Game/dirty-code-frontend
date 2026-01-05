'use client'
import { useState } from "react";

import { UserProfileCard } from "@/components/game/UserProfileCard";
import { GameMenuCarousel, MenuItem } from "@/components/game/GameMenuCarousel";
import { GlobalChat } from "@/components/game/pages/GlobalChat";
import { WorkPage } from "@/components/game/pages/WorkPage";
import { HackingPage } from "@/components/game/pages/HackingPage";
import { TrainingPage } from "@/components/game/pages/TrainingPage";
import { NightlifePage } from "@/components/game/pages/NightlifePage";
import { DefaultPage } from "@/components/game/pages/DefaultPage";

// Define Menu Items
const MENU_ITEMS: MenuItem[] = [
    {
        title: "Helldit",
        id: "Helldit",
        desc: "Chat Global. Onde os bits se encontram.",
        color: "text-primary",
        border: "border-primary/50",
        path: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
        component: <GlobalChat />
    },
    {
        title: "Trabalhar",
        id: "trabalhar",
        desc: "Ganhe dinheiro honesto. Pouco, mas honesto.",
        color: "text-blue-400",
        border: "border-blue-500/50",
        path: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.675.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.675-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
        component: <WorkPage />
    },
    {
        title: "Hackear",
        id: "hackear",
        desc: "Invada sistemas. O risco é alto, o lucro também.",
        color: "text-green-400",
        border: "border-green-500/50",
        path: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
        component: <HackingPage />
    },
    {
        title: "Treinar",
        id: "treinar",
        desc: "Aprenda novos frameworks JS que morrerão amanhã.",
        color: "text-orange-400",
        border: "border-orange-500/50",
        path: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
        component: <TrainingPage />
    },
    {
        title: "Vida Noturna",
        id: "vida-noturna",
        desc: "Balada, Energético e ... mais código?",
        color: "text-pink-400",
        border: "border-pink-500/50",
        path: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
        component: <NightlifePage />
    },
];

export default function GameDashboard() {
    const [activeTab, setActiveTab] = useState("bludiit");

    const content = MENU_ITEMS.find(item => item.id === activeTab);

    return (
        <div className="flex flex-col gap-2 min-h-screen pb-10">
            <div className="container mx-auto lg:px-8 space-y-8">
                {/* 1. Profile Card */}
                <UserProfileCard />

                {/* 2. Menu Carousel */}
                <GameMenuCarousel
                    items={MENU_ITEMS}
                    activeId={activeTab}
                    onSelect={setActiveTab}
                />

                {/* 3. Dynamic Content Area */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    {content ? (
                        content.component
                    ) : (
                        <DefaultPage />
                    )}
                </div>
            </div>
        </div>
    )
}

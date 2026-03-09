'use client'

import { useState, useEffect, useRef } from 'react'
import { Tooltip } from '@heroui/react'
import { ActionCard } from '@/components/game/ActionCard'
import { GameActionType } from '@/services/api'
import { useGame } from '@/context/GameContext'

export function DrStrange() {
    const { cachedActions, fetchActions, user } = useGame();
    const drActions = cachedActions[GameActionType.SPECIAL_STATUS_SELLER] || [];
    const isVisible = user?.activeAvatar?.drStrangeVisible;
    const isInHospital = user?.activeAvatar?.timeoutType === 'HOSPITAL' && user?.activeAvatar?.timeout;
    const isActuallyVisible = isVisible && !isInHospital;

    const [position, setPosition] = useState({ top: '50%', left: '50%' })
    const [isLocked, setIsLocked] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isActuallyVisible) {
            const loadActions = async () => {
                await fetchActions(GameActionType.SPECIAL_STATUS_SELLER);
            };
            loadActions();
        }
    }, [isActuallyVisible]);

    const moveBall = (force = false) => {
        if (!containerRef.current || (isLocked && !force) || showModal || !isActuallyVisible) return

        const container = containerRef.current
        const ballSize = 64

        const maxTop = container.clientHeight - ballSize
        const maxLeft = container.clientWidth - ballSize

        const randomTop = Math.floor(Math.random() * (maxTop > 0 ? maxTop : 0))
        const randomLeft = Math.floor(Math.random() * (maxLeft > 0 ? maxLeft : 0))

        setPosition({
            top: `${randomTop}px`,
            left: `${randomLeft}px`
        })
    }

    useEffect(() => {
        if (!isActuallyVisible) return;
        
        setTimeout(() => moveBall(true), 100);

        const interval = setInterval(() => moveBall(), 60000)

        const handleResize = () => moveBall(true)
        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [isLocked, isActuallyVisible])

    if (!isActuallyVisible) return null;

    return (
        <div 
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden z-40"
        >
            <div 
                className={`absolute transition-all duration-1000 ease-in-out pointer-events-auto cursor-pointer ${isLocked ? 'ring-4 ring-yellow-400 rounded-full' : ''}`}
                style={{
                    top: position.top,
                    left: position.left,
                }}
                onClick={() => setShowModal(true)}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsLocked(!isLocked);
                }}
            >
                <Tooltip 
                    content={isLocked ? "Promoção fixada! Dr. Hoo Lee Sheet não vai a lugar nenhum." : "Dr. Hoo Lee Sheet, aproveite a promoção é por tempo limitado..."}
                    delay={0}
                    closeDelay={0}
                    placement="top"
                    offset={10}
                >
                    <div className="w-16 h-16 rounded-full border-4 border-[#00ff9d] overflow-hidden bg-black shadow-[0_0_15px_rgba(0,255,157,0.5)] transition-transform hover:scale-110">
                        <img 
                            src="/avatars/dr_hoo_lee_sheet.webp" 
                            alt="Dr. Hoo Lee Sheet" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=DrStrange"
                            }}
                        />
                    </div>
                </Tooltip>
            </div>

            {showModal && (
                <div 
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-[#1a1a1a] border border-[#00ff9d]/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-[#00ff9d]/10 p-3 border-b border-[#00ff9d]/30 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border-2 border-[#00ff9d] overflow-hidden bg-black">
                                    <img 
                                        src="/avatars/dr_hoo_lee_sheet.webp" 
                                        alt="Dr. Hoo Lee Sheet"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=DrStrange"
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm leading-none">Dr. Hoo Lee Sheet</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            <p className="text-gray-300 text-xs italic border-l-2 border-[#00ff9d] pl-3">
                                Olá! Sou o Dr. Hoo Lee Sheet. Tenho umas paradinhas que podem te ajudar...<br />
                                A, 30% de chance de tu se fuder e sei la quem é RC, deve ser o fabricante.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                {drActions.length > 0 ? (
                                    drActions.map(action => (
                                        <ActionCard key={action.id} action={action} actionCount={1} hideRequirements={true} isSmall={true} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4 italic text-xs">
                                        Nenhuma promoção disponível no momento.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-2 bg-black/40 text-center">
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                                Promoção por tempo limitado
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

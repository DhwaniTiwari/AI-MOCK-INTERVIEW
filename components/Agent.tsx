"use client";

import Image from "next/image";
import {cn} from "@/lib/utils";

type CallStatus = 'INACTIVE' | 'CONNECTING' | 'ACTIVE' | 'FINISHED';

interface AgentProps {
    userName: string;
}

const Agent = ({userName}: AgentProps) => {
    const callStatus: CallStatus = 'FINISHED';
    const isSpeaking = true;
    const messages = [
        'Whats your name?',
        'My name is John Doe, nice to meet you!'
    ];

    const lastMessage = messages[messages.length - 1];

    // Use type predicates to handle status checks
    const isCallButtonVisible = (status: CallStatus): status is 'INACTIVE' | 'FINISHED' => 
        status === 'INACTIVE' || status === 'FINISHED';
    
    const isConnecting = (status: CallStatus): status is 'CONNECTING' => 
        status === 'CONNECTING';
    
    const isActive = (status: CallStatus): status is 'ACTIVE' => 
        status === 'ACTIVE';

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image 
                            src="/ai-avatar.png" 
                            alt="vapi" 
                            width={65} 
                            height={54} 
                            className="object-cover"
                            priority
                            loading="eager"
                        />
                        {isSpeaking && <span className="animate-speak"/>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image 
                            src="/user-avatar.png" 
                            alt="user-avatar" 
                            width={540} 
                            height={540} 
                            className="rounded-full object-cover size-[120px]"
                            priority
                            loading="eager"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {!isActive(callStatus) ? (
                    <button className="relative btn-call">
                        <span className={cn(
                            'absolute animate-ping rounded-full opacity-75',
                            !isConnecting(callStatus) && 'hidden'
                        )}/>
                        <span>
                            {isCallButtonVisible(callStatus) ? 'Call' : '...'}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect">
                        End
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;

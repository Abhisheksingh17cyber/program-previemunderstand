"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { GoHome } from "@/components/GoHome";
import { Play, LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

export function DashboardClient({ user }: { user: any }) {
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const [crashTrigger, setCrashTrigger] = useState(false);

    const handleRun = () => {
        // Mock "Crash" on syntax error simulation
        if (code.includes("error") || code.trim() === "") {
            setCrashTrigger(true);
        } else {
            console.log("Running code...");
        }
    };

    const handleExplain = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/explain", {
                method: "POST",
                body: JSON.stringify({ code, language })
            });
            const data = await res.json();
            setExplanation(data.explanation);
        } catch (e) {
            setCrashTrigger(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
            <GoHome trigger={crashTrigger} onReset={() => setCrashTrigger(false)} />

            {/* Navbar */}
            <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6">
                <div className="font-bold text-xl tracking-tighter">INTERNITY-CODES</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">
                        {user.email} {user.role === 'ADMIN' && <span className="text-xs border border-white px-1 rounded ml-2">ADMIN</span>}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className="flex-1 flex flex-col p-4 gap-4">
                    <div className="flex justify-between items-center">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-white"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>

                        <div className="flex gap-2">
                            <Button onClick={handleRun} disabled={loading} className="gap-2">
                                <Play className="h-4 w-4" /> Run
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleExplain}
                                disabled={loading}
                                className="gap-2"
                            >
                                <Sparkles className="h-4 w-4" /> Explain
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <CodeEditor
                            code={code}
                            onChange={(val) => setCode(val || "")}
                            language={language}
                        />
                    </div>
                </div>

                {/* Info Panel */}
                <div className="w-1/3 border-l border-neutral-800 p-6 flex flex-col bg-neutral-950/50">
                    <h2 className="font-semibold mb-4 text-neutral-400 uppercase tracking-widest text-xs">Code Understanding</h2>

                    <div className="flex-1 overflow-auto text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-mono">
                        {loading ? (
                            <span className="animate-pulse">Analyzing logic...</span>
                        ) : explanation ? (
                            explanation
                        ) : (
                            <span className="text-neutral-600">Click "Explain" to get an AI analysis of your code logic.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

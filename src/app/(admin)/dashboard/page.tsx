"use client";

import { useEffect, useState } from 'react';
import type { Interview, User } from '@/types';
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  Plus,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
import { LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import FadeIn from "@/components/motion/FadeIn";

type InterviewLocal = Interview;

function DashboardPage() {
  const { status } = useSession();
  const [users, setUsers] = useState<User[] | null>(null);
  const [interviews, setInterviews] = useState<InterviewLocal[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [codingQuestions, setCodingQuestions] = useState(() => {
    // Load from localStorage or use default from constants
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codingQuestions');
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "two-sum",
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`.",
      },
      {
        id: "reverse-string",
        title: "Reverse String",
        description: "Write a function that reverses a string. The input string is given as an array of characters.",
      },
      {
        id: "palindrome-number",
        title: "Palindrome Number",
        description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
      },
    ];
  });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ id: "", title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, interviewsRes] = await Promise.all([
          fetch('/api/users').catch(() => null),
          fetch('/api/interviews')
        ]);
        if (!cancelled) {
          if (usersRes && usersRes.ok) {
            setUsers(await usersRes.json());
          } else {
            setUsers([]);
          }
          if (interviewsRes.ok) {
            setInterviews(await interviewsRes.json());
          } else {
            setInterviews([]);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setUsers([]); setInterviews([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleStatusUpdate = async (interviewId: number | string, status: string) => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Interview marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    const newQ = { 
      id: newQuestion.id || newQuestion.title.toLowerCase().replace(/\s+/g, '-'),
      title: newQuestion.title,
      description: newQuestion.description,
    };
    const updated = [...codingQuestions, newQ];
    setCodingQuestions(updated);
    localStorage.setItem('codingQuestions', JSON.stringify(updated));
    setNewQuestion({ id: "", title: "", description: "" });
    setShowQuestionForm(false);
    toast.success('Coding question added successfully');
  };

  const handleEditQuestion = (id: string) => {
    const q = codingQuestions.find((q: any) => q.id === id);
    if (q) {
      setNewQuestion({ id: q.id, title: q.title, description: q.description });
      setEditingId(id);
      setShowQuestionForm(true);
    }
  };

  const handleUpdateQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    const updated = codingQuestions.map((q: any) => 
      q.id === editingId ? { ...q, title: newQuestion.title, description: newQuestion.description } : q
    );
    setCodingQuestions(updated);
    localStorage.setItem('codingQuestions', JSON.stringify(updated));
    setNewQuestion({ id: "", title: "", description: "" });
    setEditingId(null);
    setShowQuestionForm(false);
    toast.success('Coding question updated successfully');
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = codingQuestions.filter((q: any) => q.id !== id);
    setCodingQuestions(updated);
    localStorage.setItem('codingQuestions', JSON.stringify(updated));
    toast.success('Coding question deleted');
  };

  if (status === "loading") {
    return <LoaderUI />;
  }

  if (status !== "authenticated") {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Sign in to access the admin dashboard and manage interview
            schedules, candidates, and assessments.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!interviews || !users || loading) {
    return <LoaderUI />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <Link href="/schedule">
          <Button>Schedule New Interview</Button>
        </Link>
      </div>

      {/* QUESTION MANAGEMENT CARD */}
      <FadeIn delay={0} duration={0.5}>
        <Card className="mb-8 glass-surface border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Coding Challenge Questions</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Manage coding problems for interviews</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setShowQuestionForm(!showQuestionForm);
                  setEditingId(null);
                  setNewQuestion({ id: "", title: "", description: "" });
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ADD/EDIT FORM */}
            {showQuestionForm && (
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    placeholder="e.g., Two Sum, Reverse String..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none"
                    rows={4}
                    placeholder="Describe the coding problem..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdateQuestion : handleAddQuestion}>
                    {editingId ? 'Update' : 'Add'} Question
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowQuestionForm(false);
                      setEditingId(null);
                      setNewQuestion({ id: "", title: "", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* QUESTIONS LIST */}
            <div className="space-y-2">
              {codingQuestions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No coding questions added yet</p>
              ) : (
                codingQuestions.map((q: any, idx: number) => (
                  <div 
                    key={q.id} 
                    className="flex items-start justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground bg-blue-500/10 px-2 py-0.5 rounded">#{idx + 1}</span>
                        <h4 className="font-semibold text-sm">{q.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{q.description}</p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditQuestion(q.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupInterviews(interviews)[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* CATEGORY TITLE */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant={category.variant}>
                    {groupInterviews(interviews)[category.id].length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupInterviews(interviews)[category.id].map(
                    (interview: InterviewLocal, idx: number) => {
                      const candidateInfo = getCandidateInfo(
                        users,
                        interview.candidateId || ''
                      );
                      const startTime = new Date(Number(interview.startTime));

                      return (
                        <FadeIn key={interview.id} delay={idx * 0.08} duration={0.4} y={12}>
                        <Card
                          className="hover:shadow-md transition-all glass-surface"
                        >
                          {/* CANDIDATE INFO */}
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback>
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {candidateInfo.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {interview.title}
                                </p>
                              </div>
                            </div>
                          </CardHeader>

                          {/* DATE &  TIME */}
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {format(startTime, "MMM dd")}
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {format(startTime, "hh:mm a")}
                              </div>
                            </div>
                          </CardContent>

                          {/* PASS & FAIL BUTTONS */}
                          <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  className="flex-1"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      interview.id,
                                      "succeeded"
                                    )
                                  }
                                >
                                  <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                  Pass
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() =>
                                    handleStatusUpdate(interview.id, "failed")
                                  }
                                >
                                  <XCircleIcon className="h-4 w-4 mr-2" />
                                  Fail
                                </Button>
                              </div>
                            )}
                            <CommentDialog interviewId={interview.id} />
                          </CardFooter>
                        </Card>
                        </FadeIn>
                      );
                    }
                  )}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

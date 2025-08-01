"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code, Trophy, Star, Lock, Play, Globe } from "lucide-react"
import LearningLevel from "@/components/LearningLevel"
import { useLanguage } from "@/hooks/useLanguage"

interface Level {
  id: string
  title: string
  titleKo: string
  description: string
  descriptionKo: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: "react" | "typescript"
  completed: boolean
  locked: boolean
  points: number
  prerequisites?: string[]
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "react" | "typescript">("all")
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [userProgress, setUserProgress] = useState<{
    totalPoints: number;
    completedLevels: number;
    currentStreak: number;
    completedLevelIds: string[];
  }>({
    totalPoints: 0,
    completedLevels: 0,
    currentStreak: 0,
    completedLevelIds: []
  })
  const { language, changeLanguage, t, isKorean } = useLanguage()

  const levels: Level[] = [
    {
      id: "react-1",
      title: "Hello World Component",
      titleKo: "Hello World 컴포넌트",
      description: "Learn the basics of React components and JSX",
      descriptionKo: "React 컴포넌트와 JSX의 기초를 배워보세요",
      difficulty: "beginner",
      category: "react",
      completed: false,
      locked: false,
      points: 100
    },
    {
      id: "react-2",
      title: "Props and State",
      titleKo: "Props와 State",
      description: "Understand how to pass data and manage component state",
      descriptionKo: "데이터 전달과 컴포넌트 상태 관리를 이해해보세요",
      difficulty: "beginner",
      category: "react",
      completed: false,
      locked: true,
      points: 150,
      prerequisites: ["react-1"]
    },
    {
      id: "react-3",
      title: "Event Handling",
      titleKo: "이벤트 처리",
      description: "Learn how to handle user interactions in React",
      descriptionKo: "React에서 사용자 상호작용을 처리하는 방법을 배워보세요",
      difficulty: "beginner",
      category: "react",
      completed: false,
      locked: true,
      points: 150,
      prerequisites: ["react-2"]
    },
    {
      id: "react-4",
      title: "Conditional Rendering",
      titleKo: "조건부 렌더링",
      description: "Master rendering components based on conditions",
      descriptionKo: "조건에 따른 컴포넌트 렌더링을 마스터하세요",
      difficulty: "intermediate",
      category: "react",
      completed: false,
      locked: true,
      points: 200,
      prerequisites: ["react-3"]
    },
    {
      id: "react-5",
      title: "Hooks Deep Dive",
      titleKo: "Hooks 심화 학습",
      description: "Explore useState, useEffect, and custom hooks",
      descriptionKo: "useState, useEffect, 커스텀 훅을 탐색해보세요",
      difficulty: "intermediate",
      category: "react",
      completed: false,
      locked: true,
      points: 250,
      prerequisites: ["react-4"]
    },
    {
      id: "typescript-1",
      title: "TypeScript Basics",
      titleKo: "TypeScript 기초",
      description: "Introduction to types and interfaces",
      descriptionKo: "타입과 인터페이스 소개",
      difficulty: "beginner",
      category: "typescript",
      completed: false,
      locked: false,
      points: 100
    },
    {
      id: "typescript-2",
      title: "Interfaces and Types",
      titleKo: "인터페이스와 타입",
      description: "Learn to define custom types and interfaces",
      descriptionKo: "커스텀 타입과 인터페이스 정의를 배워보세요",
      difficulty: "beginner",
      category: "typescript",
      completed: false,
      locked: true,
      points: 150,
      prerequisites: ["typescript-1"]
    },
    {
      id: "typescript-3",
      title: "Generics",
      titleKo: "제네릭",
      description: "Understand generic types and functions",
      descriptionKo: "제네릭 타입과 함수를 이해해보세요",
      difficulty: "intermediate",
      category: "typescript",
      completed: false,
      locked: true,
      points: 200,
      prerequisites: ["typescript-2"]
    },
    {
      id: "typescript-4",
      title: "Advanced Types",
      titleKo: "고급 타입",
      description: "Master utility types and advanced type patterns",
      descriptionKo: "유틸리티 타입과 고급 타입 패턴을 마스터하세요",
      difficulty: "advanced",
      category: "typescript",
      completed: false,
      locked: true,
      points: 300,
      prerequisites: ["typescript-3"]
    }
  ]

  const updatedLevels = levels.map(level => ({
    ...level,
    completed: userProgress.completedLevelIds.includes(level.id),
    locked: level.prerequisites ? !level.prerequisites.every(prereq => userProgress.completedLevelIds.includes(prereq)) : false
  }))

  // 디버깅 로그
  console.log("User Progress:", userProgress)
  console.log("Updated Levels:", updatedLevels.map(l => ({ id: l.id, locked: l.locked, completed: l.completed, prerequisites: l.prerequisites })))

  const filteredLevels = updatedLevels.filter(level => 
    selectedCategory === "all" || level.category === selectedCategory
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const startLevel = (levelId: string) => {
    const level = updatedLevels.find(l => l.id === levelId)
    if (level && !level.locked) {
      setCurrentLevel(level)
    }
  }

  const completeLevel = (points: number) => {
    if (currentLevel) {
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points,
        completedLevels: prev.completedLevels + 1,
        completedLevelIds: [...prev.completedLevelIds, currentLevel.id]
      }))
      setCurrentLevel(null)
    }
  }

  const backToLevels = () => {
    setCurrentLevel(null)
  }

  if (currentLevel) {
    return (
      <LearningLevel
        level={currentLevel}
        onBack={backToLevels}
        onComplete={completeLevel}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLanguage(language === "en" ? "ko" : "en")}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "한국어" : "English"}
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <BookOpen className="inline-block mr-2 h-8 w-8" />
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t("subtitle")}
          </p>
          
          {/* Progress Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{userProgress.totalPoints} {t("points")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">{userProgress.completedLevels} {t("levelsCompleted")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              <span className="font-semibold">{userProgress.currentStreak} {t("dayStreak")}</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">{t("allLevels")}</TabsTrigger>
            <TabsTrigger value="react">{t("react")}</TabsTrigger>
            <TabsTrigger value="typescript">{t("typescript")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLevels.map((level) => (
            <Card key={level.id} className={`relative overflow-hidden transition-all hover:shadow-lg ${
              level.completed ? 'border-green-500 bg-green-50 dark:bg-green-950' : 
              level.locked ? 'opacity-60' : 'hover:scale-105'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getDifficultyColor(level.difficulty)} text-white`}>
                    {t(level.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{level.points}</span>
                  </div>
                </div>
                <CardTitle className="flex items-center gap-2">
                  {level.completed && <Trophy className="h-5 w-5 text-green-500" />}
                  {level.locked && <Lock className="h-5 w-5 text-gray-400" />}
                  {isKorean ? level.titleKo : level.title}
                </CardTitle>
                <CardDescription>{isKorean ? level.descriptionKo : level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="capitalize">
                      {t(level.category)}
                    </Badge>
                    {level.completed ? (
                      <Badge className="bg-green-500">{t("completed")}</Badge>
                    ) : level.locked ? (
                      <Badge variant="secondary">{t("locked")}</Badge>
                    ) : (
                      <Badge className="bg-blue-500">{t("available")}</Badge>
                    )}
                  </div>
                  
                  {level.prerequisites && level.locked && (
                    <div className="text-sm text-gray-500">
                      Requires: {level.prerequisites.join(", ")}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={() => startLevel(level.id)}
                    disabled={level.locked}
                  >
                    {level.completed ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        {t("review")}
                      </>
                    ) : level.locked ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        {t("locked")}
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        {t("startLevel")}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Progress */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t("yourLearningJourney")}</CardTitle>
            <CardDescription>{t("trackProgress")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>{t("overallProgress")}</span>
                  <span>{Math.round((userProgress.completedLevels / levels.length) * 100)}%</span>
                </div>
                <Progress value={(userProgress.completedLevels / levels.length) * 100} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t("reactProgress")}</span>
                    <span>{Math.round((updatedLevels.filter(l => l.category === "react" && l.completed).length / updatedLevels.filter(l => l.category === "react").length) * 100)}%</span>
                  </div>
                  <Progress value={(updatedLevels.filter(l => l.category === "react" && l.completed).length / updatedLevels.filter(l => l.category === "react").length) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{t("typescriptProgress")}</span>
                    <span>{Math.round((updatedLevels.filter(l => l.category === "typescript" && l.completed).length / updatedLevels.filter(l => l.category === "typescript").length) * 100)}%</span>
                  </div>
                  <Progress value={(updatedLevels.filter(l => l.category === "typescript" && l.completed).length / updatedLevels.filter(l => l.category === "typescript").length) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
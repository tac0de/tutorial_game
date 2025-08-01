"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Play, CheckCircle, XCircle, Trophy, Star, Lightbulb, BookOpen, Eye } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

interface Lesson {
  id: string
  title: string
  titleKo: string
  description: string
  descriptionKo: string
  content: string
  contentKo: string
  examples: string[]
  examplesKo: string[]
  exercise: {
    description: string
    descriptionKo: string
    initialCode: string
    solution: string
    hints: string[]
    hintsKo: string[]
  }
}

interface LearningLevelProps {
  level: {
    id: string
    title: string
    titleKo: string
    description: string
    descriptionKo: string
    difficulty: "beginner" | "intermediate" | "advanced"
    category: "react" | "typescript"
    points: number
  }
  onBack: () => void
  onComplete: (points: number) => void
}

export default function LearningLevel({ level, onBack, onComplete }: LearningLevelProps) {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [userCode, setUserCode] = useState(() => {
    const lessons = {
      "react-1": [
        {
          exercise: {
            initialCode: `function RoyalAnnouncement() {
  
}`
          }
        }
      ]
    }
    const currentLevelLessons = lessons[level.id] || []
    const currentLessonData = currentLevelLessons[0]
    return currentLessonData ? currentLessonData.exercise.initialCode : ""
  })
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewOutput, setPreviewOutput] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const { t, isKorean } = useLanguage()

  const lessons = useMemo(() => ({
    "react-1": [
      {
        id: "react-1-1",
        title: "Welcome to React Kingdom",
        titleKo: "React 왕국에 오신 것을 환영합니다",
        description: "Begin your journey as a React apprentice in the magical Component Kingdom",
        descriptionKo: "마법적인 컴포넌트 왕국에서 React 견습생으로서의 여정을 시작하세요",
        content: `🏰 Welcome, brave developer, to the React Kingdom!

You are about to embark on an epic journey through the Component Kingdom, where magical UI elements come to life through the power of React.

📖 Your Quest:
You are a young apprentice in the ancient Guild of Components. Your first task is to master the fundamental spell of React: creating your very first component.

🎯 The Ancient Wisdom:
React is a JavaScript library that allows you to build user interfaces using reusable components. Think of components as magical building blocks that can be combined to create magnificent digital castles and villages.

Key magical concepts you'll learn:
• 🔮 Components: The magical building blocks of React
• ✨ JSX: The mystical language that bridges JavaScript and HTML
• 🌟 Virtual DOM: React's powerful illusion that makes updates instant
• 🔄 Unidirectional Flow: The sacred law that governs data movement

Your first spell will create a simple greeting that will appear in the kingdom's central square!`,
        contentKo: `🏰 용감한 개발자여, React 왕국에 오신 것을 환영합니다!

당신은 이제 컴포넌트 왕국을 통과하는 서사적인 여정을 시작하게 될 것입니다. 여기서 마법적인 UI 요소들이 React의 힘으로 살아납니다.

📖 당신의 퀘스트:
당신은 고대 컴포넌트 길드의 어린 견습생입니다. 당신의 첫 번째 임무는 React의 기본 주문을 마스터하는 것입니다: 바로 당신의 첫 번째 컴포넌트를 만드는 것입니다.

🎯 고대의 지혜:
React는 재사용 가능한 컴포넌트를 사용하여 사용자 인터페이스를 구축할 수 있는 JavaScript 라이브러리입니다. 컴포넌트를 장대한 디지털 성과 마을을 만들기 위해 결합할 수 있는 마법적인 건축 블록으로 생각하세요.

배우게 될 핵심 마법 개념:
• 🔮 컴포넌트: React의 마법적인 건축 블록
• ✨ JSX: JavaScript와 HTML을 연결하는 신비한 언어
• 🌟 가상 DOM: 업데이트를 즉시 만드는 React의 강력한 환상
• 🔄 단방향 흐름: 데이터 이동을 지배하는 신성한 법칙

당신의 첫 번째 주문은 왕국의 중앙 광장에 나타날 간단한 인사말을 만들 것입니다!`,
        examples: [
          `// Your first magical component spell
function WelcomeSpell() {
  return <h1>✨ Welcome to React Kingdom! ✨</h1>
}

// This spell creates a magical greeting that appears in the kingdom!`,
          `// A component that accepts magical props
function GreetingSpell(props) {
  return <h1>🌟 Hello, {props.name}! 🌟</h1>
}

// Usage: <GreetingSpell name="Apprentice" />
// This creates a personalized greeting for any traveler!`
        ],
        examplesKo: [
          `// 당신의 첫 번째 마법적인 컴포넌트 주문
function WelcomeSpell() {
  return <h1>✨ React 왕국에 오신 것을 환영합니다! ✨</h1>
}

// 이 주문은 왕국에 나타나는 마법적인 인사말을 만듭니다!`,
          `// 마법적인 props를 받는 컴포넌트
function GreetingSpell(props) {
  return <h1>🌟 안녕하세요, {props.name}님! 🌟</h1>
}

// 사용법: <GreetingSpell name="견습생" />
// 이것은 모든 여행자를 위한 개인화된 인사말을 만듭니다!`
        ],
        exercise: {
          description: "Create your first magical component that displays '🎉 Hello, React! 🎉' to announce your arrival in the React Kingdom",
          descriptionKo: "React 왕국에 당신의 도착을 알리는 '🎉 Hello, React! 🎉'를 표시하는 당신의 첫 번째 마법적인 컴포넌트를 만드세요",
          initialCode: `function RoyalAnnouncement() {
  
}`,
          solution: `function RoyalAnnouncement() {
  return <h1>🎉 Hello, React! 🎉</h1>
}`,
          hints: [
            "Use JSX syntax to return a magical heading element",
            "Remember the sacred return statement in your spell",
            "You can create a simple h1 element with your royal announcement"
          ],
          hintsKo: [
            "JSX 구문을 사용하여 마법적인 heading 요소를 반환하세요",
            "주문에서 신성한 return 문을 잊지 마세요",
            "당신의 왕실 발표를 담은 간단한 h1 요소를 만들 수 있습니다"
          ]
        }
      }
    ],
    "react-2": [
      {
        id: "react-2-1",
        title: "The Magic of Props and State",
        titleKo: "Props와 State의 마법",
        description: "Master the ancient arts of data communication and state management in the Component Kingdom",
        descriptionKo: "컴포넌트 왕국에서 데이터 통신과 상태 관리의 고대 기술을 마스터하세요",
        content: `🧙‍♂️ Congratulations, apprentice! You've mastered your first component spell. Now, you must learn the twin magical forces that govern all components: Props and State.

📜 The Ancient Scrolls of Data Flow:

In the mystical realm of React, two powerful forces control how information flows between components:

🔮 PROPS (Properties):
• Magical gifts passed from parent components to child components
• Once given, props cannot be changed by the recipient (immutable)
• Like a sealed scroll containing wisdom from above
• Used to customize and configure components
• Flow downward in the sacred unidirectional current

⚡ STATE:
• Personal magical energy that each component possesses
• Can be changed and manipulated by the component itself
• Like a wizard's spellbook that can be updated with new knowledge
• When state changes, the component re-renders (magical transformation!)
• Used for data that changes over time or through user interaction

🎯 Your Training Mission:
You'll learn to create components that can receive magical props and maintain their own internal state. This is essential for building interactive magical interfaces in the React Kingdom!

🏆 The Grand Challenge:
Create a magical character profile component that receives information through props and maintains its own state for interactive features!`,
        contentKo: `🧙‍♂️ 축하합니다, 견습생! 당신은 첫 번째 컴포넌트 주문을 마스터했습니다. 이제 모든 컴포넌트를 지배하는 두 개의 강력한 마법 힘을 배워야 합니다: Props와 State.

📜 데이터 흐름의 고대 두루마리:

신비한 React 영역에서, 두 개의 강력한 힘이 컴포넌트 간의 정보 흐름을 제어합니다:

🔮 PROPS (속성):
• 부모 컴포넌트에서 자식 컴포넌트로 전달되는 마법적인 선물
• 한번 주어진 props는 받는 사람이 변경할 수 없음 (불변성)
• 위에서 내려오는 지혜가 담긴 봉인된 두루마리와 같음
• 컴포넌트를 사용자 정의하고 구성하는 데 사용됨
• 신성한 단방향 흐름으로 아래로 흐름

⚡ STATE:
• 각 컴포넌트가 가진 개인적인 마법 에너지
• 컴포넌트 자체가 변경하고 조작할 수 있음
• 새로운 지식으로 업데이트할 수 있는 마법사의 주문서와 같음
• state가 변경되면 컴포넌트가 재렌더링됨 (마법적 변형!)
• 시간이 지남에 따라 변하거나 사용자 상호작용을 통해 변하는 데이터에 사용됨

🎯 당신의 훈련 임무:
마법적인 props를 받고 자체 내부 상태를 유지할 수 있는 컴포넌트를 만드는 법을 배우게 됩니다. 이것은 React 왕국에서 상호작용하는 마법적 인터페이스를 구축하는 데 필수적입니다!

🏆 위대한 도전:
props를 통해 정보를 받고 상호작용 기능을 위해 자체 상태를 유지하는 마법적인 캐릭터 프로필 컴포넌트를 만드세요!`,
        examples: [
          `// Magical props example - receiving character data
function CharacterProfile(props) {
  return (
    <div className="character-card">
      <h2>⚔️ {props.name}</h2>
      <p>🏹 Class: {props.class}</p>
      <p>❤️ Level: {props.level}</p>
    </div>
  )
}

// Usage: <CharacterProfile name="Aria" class="Archer" level={5} />
// This creates a magical character card with custom data!`,
          `// Powerful state example - magical counter
import { useState } from 'react'

function MagicCounter() {
  const [magicPower, setMagicPower] = useState(0)
  
  const castSpell = () => {
    setMagicPower(magicPower + 1)
  }
  
  return (
    <div className="magic-counter">
      <p>✨ Magic Power: {magicPower}</p>
      <button onClick={castSpell}>
        🪄 Cast Spell
      </button>
    </div>
  )
}

// Each spell cast increases the magical power!`
        ],
        examplesKo: [
          `// 마법적인 props 예제 - 캐릭터 데이터 받기
function CharacterProfile(props) {
  return (
    <div className="character-card">
      <h2>⚔️ {props.name}</h2>
      <p>🏹 클래스: {props.class}</p>
      <p>❤️ 레벨: {props.level}</p>
    </div>
  )
}

// 사용법: <CharacterProfile name="Aria" class="궁수" level={5} />
// 이것은 사용자 정의 데이터로 마법적인 캐릭터 카드를 만듭니다!`,
          `// 강력한 state 예제 - 마법적인 카운터
import { useState } from 'react'

function MagicCounter() {
  const [magicPower, setMagicPower] = useState(0)
  
  const castSpell = () => {
    setMagicPower(magicPower + 1)
  }
  
  return (
    <div className="magic-counter">
      <p>✨ 마법력: {magicPower}</p>
      <button onClick={castSpell}>
        🪄 주문 시전
      </button>
    </div>
  )
}

// 각 주문 시전은 마법력을 증가시킵니다!`
        ],
        exercise: {
          description: "Create a magical greeting component that accepts a 'name' prop and displays a personalized welcome message for the traveler",
          descriptionKo: "'name' prop을 받아 여행자를 위한 개인화된 환영 메시지를 표시하는 마법적인 인사 컴포넌트를 만드세요",
          initialCode: `function TravelerGreeting() {
  
}`,
          solution: `function TravelerGreeting(props) {
  return <h1>🌟 Welcome, {props.name}! 🌟</h1>
}`,
          hints: [
            "Use the props parameter to access the traveler's name",
            "Create a magical greeting using JSX with the name prop",
            "Remember that props is an object containing all passed properties"
          ],
          hintsKo: [
            "props 매개변수를 사용하여 여행자의 이름에 접근하세요",
            "name prop을 사용하여 JSX로 마법적인 인사말을 만드세요",
            "props는 전달된 모든 속성을 포함하는 객체라는 것을 기억하세요"
          ]
        }
      }
    ],
    "typescript-1": [
      {
        id: "typescript-1-1",
        title: "The Sacred Runes of TypeScript",
        titleKo: "TypeScript의 신성한 룬 문자",
        description: "Discover the ancient magic of type safety to protect your code from the forces of chaos",
        descriptionKo: "혼돈의 세력으로부터 당신의 코드를 보호하는 타입 안전성의 고대 마법을 발견하세요",
        content: `🔮 Welcome, wise apprentice, to the mystical realm of TypeScript! Here, you'll learn the ancient art of type safety—a powerful magic that protects your code from the forces of chaos and unpredictability.

📜 The Ancient Wisdom of Type Safety:

In the kingdom of JavaScript, wild and untamed magic flows freely. While powerful, this freedom can lead to chaos—unexpected errors, mysterious bugs, and unpredictable behavior. TypeScript brings order to this chaos through the sacred runes of type safety.

🏰 The Fundamental Types - Your Basic Magical Arsenal:

🔤 STRING - The Runes of Text:
• Magical sequences of characters for spells and incantations
• Like enchanted scrolls containing wisdom and messages
• Used for names, descriptions, and magical incantations
• Immutable once created (like sealed magical texts)

🔢 NUMBER - The Crystals of Quantity:
• Magical numerical energy for calculations and measurements
• Like enchanted crystals that store precise amounts of power
• Used for counts, levels, scores, and magical measurements
• Both integers and floating-point magic

✨ BOOLEAN - The Stones of Truth:
• Sacred stones that hold only two values: true or false
• Like magical coins that show heads or tails
• Used for conditions, flags, and magical states
• The foundation of all logical magic

📦 ARRAY - The Collections of Power:
• Magical containers that hold multiple items of the same type
• Like enchanted chests filled with similar magical artifacts
• Used for lists, inventories, and spell collections
• Can be transformed and manipulated with powerful array magic

🗺️ OBJECT - The Maps of Reality:
• Complex magical structures that map keys to values
• Like ancient spellbooks with chapters and contents
• Used for complex data structures and magical entities
• The building blocks of sophisticated magical systems

⚡ ANY - The Wild Magic:
• A dangerous type that disables all type safety
• Like wild, untamed magic that can do anything
• Use sparingly, as it bypasses all protective runes
• The last resort when other types won't suffice

🎯 The Sacred Benefits of Type Magic:

🛡️ ERROR PREVENTION:
• Catch magical errors at compile time, not runtime
• Like having a magical shield that blocks problems before they happen
• Prevents common mistakes and typos in your spells
• Makes your code more predictable and reliable

📚 ENHANCED DOCUMENTATION:
• Types serve as living documentation for your magical code
• Like having enchanted comments that never go out of date
• Makes your code easier to understand and maintain
• Helps other wizards understand your magical creations

🔮 IMPROVED MAGICAL TOOLS:
• Better IDE support with auto-completion and hints
• Like having a magical assistant that helps you write code
• Reduces the time spent debugging and fixing spells
• Makes you a more efficient and powerful coder

🛡️ SAFER REFACTORING:
• Confidently change and improve your magical creations
• Like having a safety net when modifying complex spells
• Types guide you and prevent breaking changes
• Enables you to evolve your code without fear

🏆 Your First Magical Challenge:
Create a typed function that accepts a traveler's name and returns a personalized magical greeting, demonstrating your mastery of the sacred type runes!`,
        contentKo: `🔮 현명한 견습생이여, TypeScript의 신비한 영역에 오신 것을 환영합니다! 여기서 당신은 타입 안전성의 고대 기술을 배우게 됩니다—이것은 혼돈과 예측 불가능성의 세력으로부터 당신의 코드를 보호하는 강력한 마법입니다.

📜 타입 안전성의 고대 지혜:

JavaScript 왕국에서는 야생적이고 길들여지지 않은 마법이 자유롭게 흐릅니다. 강력하지만, 이 자유는 혼돈—예상치 못한 오류, 신비한 버그, 예측 불가능한 행동으로 이어질 수 있습니다. TypeScript는 타입 안전성의 신성한 룬 문자를 통해 이 혼돈에 질서를 가져옵니다.

🏰 기본 타입 - 당신의 기본적인 마법 무기고:

🔤 STRING - 텍스트의 룬 문자:
• 주문과 주문을 위한 문자의 마법적인 순서
• 지혜와 메시지가 담긴 마법적인 두루마리와 같음
• 이름, 설명, 마법적인 주문에 사용됨
• 한번 생성되면 불변 (봉인된 마법적 텍스트처럼)

🔢 NUMBER - 양의 수정:
• 계산과 측정을 위한 마법적인 수치 에너지
• 정확한 양의 힘을 저장하는 마법적인 수정과 같음
• 카운트, 레벨, 점수, 마법적인 측정에 사용됨
• 정수와 부동소수점 마법 모두 포함

✨ BOOLEAN - 진실의 돌:
• true 또는 false 두 값만 가지는 신성한 돌
• 앞면 또는 뒷면을 보여주는 마법적인 동전과 같음
• 조건, 플래그, 마법적인 상태에 사용됨
• 모든 논리적 마법의 기초

📦 ARRAY - 힘의 컬렉션:
• 같은 타입의 여러 항목을 담는 마법적인 컨테이너
• 비슷한 마법적 유물로 채워진 마법적인 상자와 같음
• 목록, 인벤토리, 주문 컬렉션에 사용됨
• 강력한 배열 마법으로 변형하고 조작할 수 있음

🗺️ OBJECT - 현실의 지도:
• 키를 값에 매핑하는 복잡한 마법적 구조
• 장과 내용이 있는 고대 주문서와 같음
• 복잡한 데이터 구조와 마법적 개체에 사용됨
• 정교한 마법 시스템의 건축 블록

⚡ ANY - 야생 마법:
• 모든 타입 안전성을 비활성화하는 위험한 타입
• 무엇이든 할 수 있는 야생적이고 길들여지지 않은 마법과 같음
• 신중하게 사용, 모든 보호 룬을 우회함
• 다른 타입으로 충분하지 않을 때의 최후의 수단

🎯 타입 마법의 신성한 이점:

🛡️ 오류 예방:
• 런타임이 아닌 컴파일 시간에 마법적 오류를 포착
• 문제가 발생하기 전에 차단하는 마법적인 방패를 가진 것과 같음
• 주문의 일반적인 실수와 오타를 방지함
• 코드를 더 예측 가능하고 신뢰할 수 있게 만듦

📚 향상된 문서화:
• 타입은 당신의 마법적 코드를 위한 살아있는 문서로 작용함
• 절대 구식이 되지 않는 마법적인 주석을 가진 것과 같음
• 코드를 더 이해하기 쉽고 유지보수하기 쉽게 만듦
• 다른 마법사들이 당신의 마법적 창조물을 이해하는 데 도움을 줌

🔮 향상된 마법적 도구:
• 자동 완성과 힌트가 있는 더 나은 IDE 지원
• 코드 작성을 도와주는 마법적인 조수를 가진 것과 같음
• 디버깅과 주문 수정에 소요되는 시간을 줄여줌
• 당신을 더 효율적이고 강력한 코더로 만듦

🛡️ 더 안전한 리팩토링:
• 자신감 있게 마법적 창조물을 변경하고 개선함
• 복잡한 주문을 수정할 때 안전망을 가진 것과 같음
• 타입이 당신을 안내하고 변경 사항을 방지함
• 두려움 없이 코드를 진화시킬 수 있게 함

🏆 당신의 첫 번째 마법적 도전:
여행자의 이름을 받아 개인화된 마법적 인사말을 반환하는 타입이 지정된 함수를 만들어 신성한 타입 룬 문자에 대한 당신의 숙련도를 증명하세요!`,
        examples: [
          `// Basic magical types
let travelerName: string = "Merlin"
let spellPower: number = 150
let hasMagicStaff: boolean = true
let spellComponents: string[] = ["herb", "crystal", "wand"]
let wizardStats: object = { level: 5, mana: 200 }

// Each type serves a specific magical purpose!`,
          `// Typed magical function
function castGreetingSpell(name: string): string {
  return "Greetings, " + name + "! May your magic be powerful!"
}

const message = castGreetingSpell("Gandalf")
// Returns: "Greetings, Gandalf! May your magic be powerful!"

// The function ensures proper magical communication!`
        ],
        examplesKo: [
          `// 기본적인 마법적 타입
let travelerName: string = "Merlin"
let spellPower: number = 150
let hasMagicStaff: boolean = true
let spellComponents: string[] = ["herb", "crystal", "wand"]
let wizardStats: object = { level: 5, mana: 200 }

// 각 타입은 특정한 마법적 목적을 가집니다!`,
          `// 타입이 지정된 마법적 함수
function castGreetingSpell(name: string): string {
  return "안녕하세요, " + name + "님! 당신의 마법이 강력하기를!"
}

const message = castGreetingSpell("Gandalf")
// 반환값: "안녕하세요, Gandalf님! 당신의 마법이 강력하기를!"

// 함수가 적절한 마법적 의사소통을 보장합니다!`

      ],
        exercise: {
          description: "Create a typed magical function that accepts a wizard's name and returns a powerful greeting spell with proper type annotations",
          descriptionKo: "마법사의 이름을 받아 적절한 타입 주석이 있는 강력한 인사 주문을 반환하는 타입이 지정된 마법적 함수를 만드세요",
          initialCode: `function castWelcomeSpell(name: ) {
  
}`,
          solution: `function castWelcomeSpell(name: string): string {
  return "Welcome, " + name + "! Your magical journey begins now!"
}`,
          hints: [
            "Add type annotation for the name parameter using string type",
            "Add return type annotation for the function using string type",
            "Use template literals to create the magical greeting message"
          ],
          hintsKo: [
            "string 타입을 사용하여 name 매개변수에 타입 주석을 추가하세요",
            "string 타입을 사용하여 함수에 반환 타입 주석을 추가하세요",
            "템플릿 리터럴을 사용하여 마법적인 인사 메시지를 만드세요"
          ]
        }
      }
    ],
    "typescript-2": [
      {
        id: "typescript-2-1",
        title: "The Ancient Blueprints of TypeScript",
        titleKo: "TypeScript의 고대 청사진",
        description: "Master the ancient art of creating magical blueprints to define the structure of mystical objects and entities",
        descriptionKo: "신비한 객체와 개체의 구조를 정의하는 마법적인 청사진을 만드는 고대 기술을 마스터하세요",
        content: `🏛️ Greetings, apprentice architect! You've learned the sacred runes of basic types, but now you must master the ancient art of creating magical blueprints—interfaces and custom types that will serve as the foundation for all your mystical creations!

📜 The Ancient Architect's Wisdom:

In the grand tradition of the TypeScript Guild, master builders don't just work with raw materials—they create detailed blueprints that ensure every structure is perfect, every component fits perfectly, and every magical artifact functions exactly as intended.

🏰 INTERFACES - The Sacred Blueprints:

🔮 THE POWER OF INTERFACES:
• Magical contracts that define the exact shape and structure of objects
• Like ancient architectural scrolls that specify every detail of a temple
• Ensure that all magical artifacts conform to the same divine pattern
• Provide clarity and predictability to your mystical constructions
• Serve as living documentation that never goes out of date

🛠️ THE ARCHITECT'S TOOLS:

📐 OPTIONAL PROPERTIES (?):
• Properties that may or may not exist in your magical creation
• Like optional chambers in a magical castle that can be added later
• Use the ? symbol to mark properties as optional
• Perfect for features that aren't always needed

🔒 READONLY PROPERTIES (readonly):
• Sacred properties that can be set once but never changed
• Like enchanted stone carvings that are permanent once created
• Use the readonly keyword to protect properties from modification
• Essential for maintaining the integrity of magical artifacts

⚡ FUNCTION TYPES:
• Blueprints for magical spells and incantations
• Define the exact signature that functions must follow
• Like specifying the exact words and gestures for a spell
• Ensure that all magical invocations work consistently

🔗 EXTENDING INTERFACES (extends):
• Build upon existing blueprints to create more complex structures
• Like adding new wings to an already magnificent castle
• Use the extends keyword to inherit and enhance existing interfaces
• The foundation of reusable and maintainable magical architecture

🎯 YOUR MAGNIFICENT QUEST:

You are now a master architect in the TypeScript Guild! Your task is to create detailed blueprints for the various magical entities that inhabit the React Kingdom. From humble travelers to powerful wizards, from simple potions to complex magical artifacts—you will define the very structure of their existence!

🏆 THE GRAND CHALLENGE:

Create a comprehensive interface for a Magical Character that can be used throughout the React Kingdom. This blueprint will define the essential properties and abilities of all magical beings, ensuring consistency and power across the realm!

🌟 THE WISDOM OF THE AGES:

Remember, young architect, that well-designed blueprints lead to magnificent creations. Your interfaces will be used by countless other wizards and builders, so craft them with care, precision, and foresight. The most powerful magic lies in the elegance and clarity of your designs!`,
        contentKo: `🏛️ 인사하라, 견습 건축가여! 당신은 기본 타입의 신성한 룬 문자를 배웠지만, 이제 마법적인 청사진을 만드는 고대 기술을 마스터해야 합니다—인터페이스와 커스텀 타입이 당신의 모든 신비한 창조물의 기초가 될 것입니다!

📜 고대 건축가의 지혜:

TypeScript 길드의 위대한 전통에서, 숙련된 건축가들은 원자재만으로 작업하지 않습니다—그들은 모든 구조가 완벽하고, 모든 컴포넌트가 완벽하게 맞으며, 모든 마법적 유물이 정확히 의도한 대로 기능하도록 보장하는 상세한 청사진을 만듭니다.

🏰 인터페이스 - 신성한 청사진:

🔮 인터페이스의 힘:
• 객체의 정확한 모양과 구조를 정의하는 마법적인 계약
• 사원의 모든 세부 사항을 명시하는 고대 건축 두루마리와 같음
• 모든 마법적 유물이 동일한 신성한 패턴을 따르도록 보장
• 당신의 신비한 구조물에 명확성과 예측 가능성을 제공
• 절대 구식이 되지 않는 살아있는 문서로 작용

🛠️ 건축가의 도구:

📐 선택적 속성 (?):
• 마법적 창조물에 있을 수도 있고 없을 수도 있는 속성
• 나중에 추가할 수 있는 마법 성의 선택적 방과 같음
• ? 기호를 사용하여 속성을 선택적으로 표시
• 항상 필요하지는 않은 기능에 완벽

🔒 읽기 전용 속성 (readonly):
• 한번 설정되면 결코 변경할 수 없는 신성한 속성
• 한번 생성되면 영구적인 마법적인 석조 조각과 같음
• readonly 키워드를 사용하여 속성을 수정으로부터 보호
• 마법적 유물의 무결성을 유지하는 데 필수적

⚡ 함수 타입:
• 마법적인 주문과 주문을 위한 청사진
• 함수가 따라야 할 정확한 시그니처를 정의
• 주문을 위한 정확한 단어와 제스처를 명시하는 것과 같음
• 모든 마법적 호출이 일관되게 작동하도록 보장

🔗 인터페이스 확장 (extends):
• 기존 청사진을 기반으로 더 복잡한 구조물을 만듦
• 이미 장엄한 성에 새로운 날개를 추가하는 것과 같음
• extends 키워드를 사용하여 기존 인터페이스를 상속하고 향상
• 재사용 가능하고 유지보수 가능한 마법적 아키텍처의 기초

🎯 당신의 장엄한 퀘스트:

이제 당신은 TypeScript 길드의 숙련된 건축가입니다! 당신의 임무는 React 왕국에 사는 다양한 마법적 개체들을 위한 상세한 청사진을 만드는 것입니다. 겸손한 여행자부터 강력한 마법사까지, 간단한 물약부터 복잡한 마법적 유물까지—당신은 그들이 존재하는 바로 그 구조를 정의할 것입니다!

🏆 위대한 도전:

React 왕국 전체에서 사용할 수 있는 마법적 캐릭터를 위한 포괄적인 인터페이스를 만드세요. 이 청사진은 모든 마법적 존재의 필수 속성과 능력을 정의하여 영역 전체에 걸쳐 일관성과 힘을 보장할 것입니다!

🌟 시대의 지혜:

기억하라, 어린 건축가여, 잘 설계된 청사진은 장엄한 창조물로 이어진다는 것을. 당신의 인터페이스는 수많은 다른 마법사와 건축가들에 의해 사용될 것이므로, 신중함, 정밀함, 그리고 선견지명으로 그들을 만드세요. 가장 강력한 마법은 당신의 디자인의 우아함과 명확성에 있습니다!`,
        examples: [
          `// Magical Character Interface - The basic blueprint
interface MagicalCharacter {
  name: string
  level: number
  class: 'warrior' | 'mage' | 'archer' | 'healer'
  health: number
  mana?: number  // Optional for non-magic users
  readonly id: string  // Permanent identifier
}

const wizard: MagicalCharacter = {
  name: "Merlin",
  level: 15,
  class: "mage",
  health: 100,
  mana: 200,
  id: "wizard-001"
}

// This creates a perfect magical being according to our blueprint!`,
          `// Advanced Interface with magical methods
interface SpellCaster {
  name: string
  spells: string[]
  castSpell(spellName: string): boolean
  learnSpell(newSpell: string): void
}

interface EnchantedItem {
  name: string
  power: number
  readonly itemType: 'weapon' | 'armor' | 'potion'
  use(): string
}

// A magical sword that follows the EnchantedItem blueprint
const Excalibur: EnchantedItem = {
  name: "Excalibur",
  power: 100,
  itemType: "weapon",
  use() {
    return "⚔️ The sword glows with magical energy!"
  }
}

// This creates powerful magical artifacts with consistent structure!`,
          `// Interface Extension - Building upon magical foundations
interface BaseCharacter {
  name: string
  level: number
  readonly id: string
}

interface MagicalCharacter extends BaseCharacter {
  mana: number
  spells: string[]
  castSpell(spellName: string): boolean
}

interface Warrior extends BaseCharacter {
  strength: number
  weapons: string[]
  attack(target: string): number
}

// Both inherit from BaseCharacter but have unique magical abilities
const wizard: MagicalCharacter = {
  name: "Gandalf",
  level: 20,
  id: "wizard-002",
  mana: 300,
  spells: ["fireball", "teleport"],
  castSpell(spellName: string) {
    return this.spells.includes(spellName)
  }
}

// This creates a hierarchy of magical beings with shared foundations!`
        ],
        examplesKo: [
          `// 마법적 캐릭터 인터페이스 - 기본 청사진
interface MagicalCharacter {
  name: string
  level: number
  class: '전사' | '마법사' | '궁수' | '힐러'
  health: number
  mana?: number  // 비마법 사용자를 위한 선택적 속성
  readonly id: string  // 영구 식별자
}

const wizard: MagicalCharacter = {
  name: "메를린",
  level: 15,
  class: "마법사",
  health: 100,
  mana: 200,
  id: "wizard-001"
}

// 이것은 우리의 청사진에 따라 완벽한 마법적 존재를 만듭니다!`,
          `// 고급 인터페이스와 마법적 메서드
interface SpellCaster {
  name: string
  spells: string[]
  castSpell(spellName: string): boolean
  learnSpell(newSpell: string): void
}

interface EnchantedItem {
  name: string
  power: number
  readonly itemType: '무기' | '갑옷' | '물약'
  use(): string
}

// EnchantedItem 청사진을 따르는 마법 검
const Excalibur: EnchantedItem = {
  name: "엑스칼리버",
  power: 100,
  itemType: "무기",
  use() {
    return "⚔️ 검이 마법적 에너지로 빛납니다!"
  }
}

// 이것은 일관된 구조를 가진 강력한 마법적 유물을 만듭니다!`,
          `// 인터페이스 확장 - 마법적 기반 위에 구축
interface BaseCharacter {
  name: string
  level: number
  readonly id: string
}

interface MagicalCharacter extends BaseCharacter {
  mana: number
  spells: string[]
  castSpell(spellName: string): boolean
}

interface Warrior extends BaseCharacter {
  strength: number
  weapons: string[]
  attack(target: string): number
}

// 둘 다 BaseCharacter에서 상속받지만 고유한 마법적 능력을 가짐
const wizard: MagicalCharacter = {
  name: "간달프",
  level: 20,
  id: "wizard-002",
  mana: 300,
  spells: ["파이어볼", "텔레포트"],
  castSpell(spellName: string) {
    return this.spells.includes(spellName)
  }
}

// 이것은 공통 기반을 가진 마법적 존재의 계층 구조를 만듭니다!`
        ],
        exercise: {
          description: "Create a magical interface for a 'Wizard' that includes name (string), level (number), mana (number, optional), spells (string array), and a readonly id (string). This blueprint will be used to create all wizards in the React Kingdom!",
          descriptionKo: "name (문자열), level (숫자), mana (숫자, 선택적), spells (문자열 배열), readonly id (문자열)를 포함하는 'Wizard'를 위한 마법적 인터페이스를 만드세요. 이 청사진은 React 왕국의 모든 마법사를 만드는 데 사용될 것입니다!",
          initialCode: `interface Wizard {
  
}`,
          solution: `interface Wizard {
  name: string
  level: number
  mana?: number
  spells: string[]
  readonly id: string
}`,
          hints: [
            "Define name as a required string property for the wizard's name",
            "Add level as a required number property for the wizard's power level",
            "Make mana optional using the ? modifier since not all wizards need mana",
            "Create spells as a string array to hold the wizard's magical abilities",
            "Add id as a readonly string to serve as a permanent identifier"
          ],
          hintsKo: [
            "마법사의 이름을 위한 필수 문자열 속성으로 name을 정의하세요",
            "마법사의 파워 레벨을 위한 필수 숫자 속성으로 level을 추가하세요",
            "모든 마법사가 마나를 필요로 하는 것은 아니므로 ? 수식어를 사용하여 mana를 선택적으로 만드세요",
            "마법사의 마법적 능력을 담기 위해 spells를 문자열 배열로 만드세요",
            "영구 식별자로 작용하도록 id를 readonly 문자열로 추가하세요"
          ]
        }
      }
    ],
    "react-3": [
      {
        id: "react-3-1",
        title: "Mastering Event Magic",
        titleKo: "이벤트 마법 마스터하기",
        description: "Learn to cast powerful spells that respond to user interactions in the React Kingdom",
        descriptionKo: "React 왕국에서 사용자 상호작용에 응답하는 강력한 주문을 배우세요",
        content: `⚡ Advanced apprentice! You've mastered the arts of props and state. Now, you must learn the most crucial skill of any React wizard: Event Handling Magic!

🎭 The Theater of Interactions:
In the React Kingdom, components are not static displays—they're living, breathing entities that respond to the kingdom's inhabitants! Event handling is the magic that brings your components to life.

🔮 The Ancient Arts of Event Magic:

🎯 CLICK EVENTS:
• The most common form of user interaction
• Like tapping a magical crystal to activate its power
• Triggers spells and actions throughout the kingdom
• Can be used for buttons, links, and interactive elements

📝 FORM EVENTS:
• Capturing the wisdom of user input
• Like gathering magical ingredients through a sacred ritual
• Essential for collecting data from kingdom inhabitants
• Includes text input, selections, and form submissions

⚡ EVENT HANDLERS:
• Magical functions that respond to user actions
• Like having a loyal familiar that obeys your commands
• Receive event objects containing mystical information
• Can prevent default behaviors and control the flow of magic

🎪 The Grand Arena:
You'll learn to create interactive magical interfaces that respond to:
• Button clicks that cast spells
• Form submissions that collect magical data
• Keyboard shortcuts for powerful wizards
• Mouse movements for enchanted animations

🏆 Your Ultimate Challenge:
Create a magical spell-casting button that responds to user clicks and announces the spell to the entire kingdom!`,
        contentKo: `⚡ 고급 견습생! 당신은 props와 state의 기술을 마스터했습니다. 이제 모든 React 마법사의 가장 중요한 기술을 배워야 합니다: 이벤트 처리 마법!

🎭 상호작용의 극장:
React 왕국에서 컴포넌트는 정적인 디스플레이가 아닙니다—그들은 왕국의 주민들에게 반응하는 살아 숨 쉬는 존재들입니다! 이벤트 처리는 당신의 컴포넌트에 생명을 불어넣는 마법입니다.

🔮 이벤트 마법의 고대 기술:

🎯 클릭 이벤트:
• 가장 일반적인 형태의 사용자 상호작용
• 마법적인 수정을 탭하여 그 힘을 활성화하는 것과 같음
• 왕국 전체에 주문과 행동을 트리거함
• 버튼, 링크, 상호작용 요소에 사용됨

📝 폼 이벤트:
• 사용자 입력의 지혜를 포착함
• 신성한 의식을 통해 마법적인 재료를 모으는 것과 같음
• 왕국 주민들로부터 데이터를 수집하는 데 필수적
• 텍스트 입력, 선택, 폼 제출을 포함함

⚡ 이벤트 핸들러:
• 사용자 행동에 응답하는 마법적인 함수
• 당신의 명령에 복종하는 충실한 패밀리어를 가진 것과 같음
• 신비한 정보를 담은 이벤트 객체를 받음
• 기본 동작을 방지하고 마법의 흐름을 제어할 수 있음

🎪 위대한 경기장:
다음에 반응하는 상호작용적인 마법적 인터페이스를 만드는 법을 배우게 됩니다:
• 주문을 시전하는 버튼 클릭
• 마법적인 데이터를 수집하는 폼 제출
• 강력한 마법사를 위한 키보드 단축키
• 마법적인 애니메이션을 위한 마우스 움직임

🏆 당신의 궁극적인 도전:
사용자 클릭에 반응하고 전체 왕국에 주문을 알리는 마법적인 주문 시전 버튼을 만드세요!`,
        examples: [
          `// Magical button that casts a spell on click
function SpellButton() {
  const handleSpellCast = (event) => {
    console.log('🪄 Magic spell cast!')
    // Prevent any default button behavior
    event.preventDefault()
    // Announce to the kingdom
    alert('✨ A magical spell has been cast!')
  }
  
  return (
    <button onClick={handleSpellCast}>
      🪄 Cast Magic Spell
    </button>
  )
}

// Each click unleashes magical power!`,
          `// Enchanted form for collecting magical ingredients
function MagicIngredientForm() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const ingredient = formData.get('ingredient')
    console.log("Added magical ingredient: " + ingredient)
    alert(ingredient + " added to your potion!")
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="ingredient" 
        placeholder="Enter magical ingredient..." 
      />
      <button type="submit">🧪 Add to Potion</button>
    </form>
  )
}

// Collect ingredients for powerful potions!`
        ],
        examplesKo: [
          `// 클릭 시 주문을 시전하는 마법적인 버튼
function SpellButton() {
  const handleSpellCast = (event) => {
    console.log('🪄 마법 주문 시전!')
    // 모든 기본 버튼 동작을 방지함
    event.preventDefault()
    // 왕국에 알림
    alert('✨ 마법적인 주문이 시전되었습니다!')
  }
  
  return (
    <button onClick={handleSpellCast}>
      🪄 마법 주문 시전
    </button>
  )
}

// 각 클릭은 마법적인 힘을 해방합니다!`,
          `// 마법적인 재료를 수집하는 마법이 걸린 폼
function MagicIngredientForm() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const ingredient = formData.get('ingredient')
    console.log("마법적인 재료 추가됨: " + ingredient)
    alert(ingredient + "이(가) 당신의 물약에 추가되었습니다!")
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="ingredient" 
        placeholder="마법적인 재료를 입력하세요..." 
      />
      <button type="submit">🧪 물약에 추가</button>
    </form>
  )
}

// 강력한 물약을 위해 재료를 수집하세요!`
        ],
        exercise: {
          description: "Create a magical button that logs '🎉 Spell cast successfully!' to the console when clicked, announcing your magical prowess to the kingdom",
          descriptionKo: "클릭될 때 '🎉 주문이 성공적으로 시전되었습니다!'를 콘솔에 출력하여 당신의 마법적 능력을 왕국에 알리는 마법적인 버튼을 만드세요",
          initialCode: `function MagicSpellButton() {
  
}`,
          solution: `function MagicSpellButton() {
  const handleSpellCast = () => {
    console.log('🎉 Spell cast successfully!')
  }
  
  return <button onClick={handleSpellCast}>🪄 Cast Spell</button>
}`,
          hints: [
            "Create a magical function that handles the spell casting event",
            "Use the onClick prop to attach your spell handler to the button",
            "Your handler function should be called when the magical button is clicked"
          ],
          hintsKo: [
            "주문 시전 이벤트를 처리하는 마법적인 함수를 만드세요",
            "onClick prop을 사용하여 주문 핸들러를 버튼에 연결하세요",
            "마법적인 버튼이 클릭될 때 핸들러 함수가 호출되어야 합니다"
          ]
        }
      }
    ],
    "react-4": [
      {
        id: "react-4-1",
        title: "The Art of Magical Transformations",
        titleKo: "마법적 변신의 기술",
        description: "Master the ancient magic of conditional rendering to create adaptive and intelligent components",
        descriptionKo: "적응형과 지능형 컴포넌트를 만들기 위한 조건부 렌더링의 고대 마법을 마스터하세요",
        content: `🎭 Welcome, skilled apprentice! You've mastered the arts of event handling. Now, you must learn one of the most powerful magical techniques in the React Kingdom: Conditional Rendering!

🔮 The Ancient Wisdom of Adaptive Magic:

In the mystical realm of React, the most powerful components are not static—they're intelligent beings that adapt to different situations and conditions. Conditional rendering is the magic that allows your components to transform themselves based on the kingdom's ever-changing state.

🎪 The Grand Theater of Possibilities:

🎯 IF/ELSE RITUALS:
• The most fundamental form of conditional magic
• Like having multiple spells ready for different situations
• Allows components to completely transform based on conditions
• Perfect for showing different content to different users

⚡ TERNARY OPERATORS:
• The swift and elegant way to make magical decisions
• Like a wise wizard who can choose between two paths instantly
• Concise and powerful for simple conditions
• The preferred method for many React sorcerers

🔗 LOGICAL && MAGIC:
• The art of conditional appearance
• Like a magical door that only appears when the right spell is cast
• Perfect for showing elements only when certain conditions are met
• Clean and efficient for simple conditional displays

🏰 Real-World Magical Scenarios:

👑 USER AUTHENTICATION:
• Show different content for logged-in users vs. guests
• Display admin controls only to kingdom rulers
• Create personalized experiences for each traveler

🎁 LOADING STATES:
• Show loading animations while magical spells are being cast
• Display error messages when spells fail
• Present success celebrations when magic works perfectly

🌟 DYNAMIC CONTENT:
• Show different components based on user preferences
• Adapt interfaces for different device sizes
• Change themes based on time of day or user settings

🏆 Your Legendary Challenge:
Create a magical user role component that displays different content for admins and regular users, demonstrating your mastery of adaptive magic!`,
        contentKo: `🎭 환영합니다, 숙련된 견습생! 당신은 이벤트 처리의 기술을 마스터했습니다. 이제 React 왕국에서 가장 강력한 마법 기술 중 하나를 배워야 합니다: 조건부 렌더링!

🔮 적응형 마법의 고대 지혜:

신비한 React 영역에서 가장 강력한 컴포넌트는 정적이 아닙니다—그들은 끊임없이 변하는 상황과 조건에 적응하는 지능적인 존재들입니다. 조건부 렌더링은 당신의 컴포넌트가 왕국의 변화하는 상태에 기반하여 스스로 변신할 수 있게 하는 마법입니다.

🎪 가능성의 위대한 극장:

🎯 IF/ELSE 의식:
• 조건부 마법의 가장 기본적인 형태
• 다른 상황을 위해 여러 주문을 준비하는 것과 같음
• 조건에 기반하여 컴포넌트가 완전히 변신할 수 있게 함
• 다른 사용자에게 다른 콘텐츠를 보여주기에 완벽함

⚡ 삼항 연산자:
• 마법적 결정을 내리는 신속하고 우아한 방법
• 두 경로 중에서 즉시 선택할 수 있는 현명한 마법사와 같음
• 간단한 조건을 위한 간결하고 강력함
• 많은 React 마법사들이 선호하는 방법

🔗 논리 && 마법:
• 조건부 출현의 기술
• 올바른 주문이 시전될 때만 나타나는 마법적인 문과 같음
• 특정 조건이 충족될 때만 요소를 보여주기에 완벽함
• 간단한 조건부 디스플레이를 위한 깔끔하고 효율적

🏰 실제 세계의 마법적 시나리오:

👑 사용자 인증:
• 로그인한 사용자와 게스트에게 다른 콘텐츠 보여주기
• 관리자 제어만 왕국 통치자에게 표시
• 각 여행자를 위한 개인화된 경험 생성

🎁 로딩 상태:
• 마법 주문이 시전되는 동안 로딩 애니메이션 보여주기
• 주문이 실패할 때 오류 메시지 표시
• 마법이 완벽하게 작동할 때 성공 축하 표시

🌟 동적 콘텐츠:
• 사용자 선호도에 기반하여 다른 컴포넌트 보여주기
• 다른 기기 크기에 맞게 인터페이스 적응
• 하루의 시간이나 사용자 설정에 기반하여 테마 변경

🏆 당신의 전설적인 도전:
관리자와 일반 사용자에게 다른 콘텐츠를 표시하는 마법적인 사용자 역할 컴포넌트를 만들어 적응형 마법의 숙련도를 증명하세요!`,
        examples: [
          `// Magical user authentication with if/else
function UserGreeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return (
      <div className="welcome-back">
        <h1>👑 Welcome back, {username}!</h1>
        <p>The kingdom has missed your presence.</p>
      </div>
    )
  } else {
    return (
      <div className="welcome-guest">
        <h1>🚪 Welcome, Traveler!</h1>
        <p>Please sign in to access the royal chambers.</p>
      </div>
    )
  }
}

// Transforms based on user's login status!`,
          `// Swift magical decision with ternary operator
function UserStatus({ isActive, isAdmin }) {
  return (
    <div className="status-display">
      <span>
        {isActive ? '✨ Active' : '🌙 Inactive'}
      </span>
      {isAdmin && <span className="admin-badge">👑 Admin</span>}
    </div>
  )
}

// Elegant and efficient status display!`
        ],
        examplesKo: [
          `// if/else를 사용한 마법적인 사용자 인증
function UserGreeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return (
      <div className="welcome-back">
        <h1>👑 다시 오신 것을 환영합니다, {username}님!</h1>
        <p>왕국이 당신의 부재를 그리워했습니다.</p>
      </div>
    )
  } else {
    return (
      <div className="welcome-guest">
        <h1>🚪 환영합니다, 여행자!</h1>
        <p>왕실 방에 접근하려면 로그인해주세요.</p>
      </div>
    )
  }
}

// 사용자의 로그인 상태에 기반하여 변신합니다!`,
          `// 삼항 연산자를 사용한 신속한 마법적 결정
function UserStatus({ isActive, isAdmin }) {
  return (
    <div className="status-display">
      <span>
        {isActive ? '✨ 활성' : '🌙 비활성'}
      </span>
      {isAdmin && <span className="admin-badge">👑 관리자</span>}
    </div>
  )
}

// 우아하고 효율적인 상태 표시!`
        ],
        exercise: {
          description: "Create a magical role component that displays '👑 Crown of Admin' if isAdmin is true, otherwise '🛡️ Shield of User' for regular users",
          descriptionKo: "isAdmin이 true이면 '👑 관리자의 왕관'을, 그렇지 않으면 일반 사용자를 위해 '🛡️ 사용자의 방패'를 표시하는 마법적인 역할 컴포넌트를 만드세요",
          initialCode: `function MagicalRole({ isAdmin }) {
  
}`,
          solution: `function MagicalRole({ isAdmin }) {
  return isAdmin ? <span>👑 Crown of Admin</span> : <span>🛡️ Shield of User</span>
}`,
          hints: [
            "Use the ternary operator for elegant magical transformation",
            "Check the isAdmin prop to determine the user's magical rank",
            "Return different elements based on the user's role in the kingdom"
          ],
          hintsKo: [
            "우아한 마법적 변신을 위해 삼항 연산자를 사용하세요",
            "사용자의 마법적 등급을 결정하기 위해 isAdmin prop을 확인하세요",
            "왕국에서 사용자의 역할에 기반하여 다른 요소를 반환하세요"
          ]
        }
      }
    ],
    "typescript-3": [
      {
        id: "typescript-3-1",
        title: "The Alchemist's Generics",
        titleKo: "연금술사의 제네릭",
        description: "Master the ancient alchemical art of creating magical recipes that work with any ingredient or substance",
        descriptionKo: "모든 재료나 물질과 함께 작동하는 마법적인 레시피를 만드는 고대 연금술 기술을 마스터하세요",
        content: `🧪 Welcome, aspiring alchemist! You've mastered the art of creating specific magical blueprints, but now you must learn the most powerful and flexible magic in all of TypeScript—the ancient alchemical art of Generics!

🔮 The Alchemist's Ultimate Wisdom:

In the mystical laboratories of the TypeScript Guild, master alchemists don't create separate potions for every possible ingredient. Instead, they master the art of creating universal magical recipes—generics—that can work with ANY type of ingredient, from the simplest herbs to the most rare and powerful magical substances!

🏺 THE MAGICAL ALCHEMICAL PROCESS:

🧪 GENERICS - The Universal Magical Recipes:
• Magical templates that can work with any type of ingredient
• Like ancient alchemical formulas that adapt to whatever you put in them
• Maintain type safety while being incredibly flexible
• The foundation of reusable and powerful magical components
• Represented by magical type parameters like <T>, <U>, <K>, <V>

⚗️ THE ALCHEMIST'S POWERFUL TOOLS:

🔮 TYPE PARAMETERS - The Magical Ingredient Slots:
• Placeholders that can be filled with any type
• Like empty vials waiting to be filled with magical ingredients
• Commonly use T (Type), U (Second Type), K (Key), V (Value)
• Allow your recipes to adapt to whatever ingredients are available
• The key to creating truly universal magical solutions

🎯 GENERIC FUNCTIONS - Spells That Work with Anything:
• Magical spells that can operate on any type of input
• Like universal spells that work on warriors, mages, or any creature
• Maintain type safety while being incredibly flexible
• Can be constrained to work only with certain types of ingredients
• The most powerful and reusable spells in your magical arsenal

🏛️ GENERIC INTERFACES - Universal Magical Blueprints:
• Blueprints that can be adapted to any type of structure
• Like architectural plans that can be built with any material
• Define the shape while leaving the material type flexible
• Perfect for creating containers, repositories, and magical storage systems
• The foundation of adaptable and powerful magical architectures

🏰 GENERIC CLASSES - Magical Factories of Any Type:
• Classes that can produce objects of any type
• Like magical factories that can create any type of potion or artifact
• Combine the power of classes with the flexibility of generics
• Essential for creating data structures, services, and magical systems
• The ultimate tool for creating reusable magical components

🔗 CONSTRAINTS - The Alchemist's Rules:
• Magical rules that limit what types can be used
• Like specifying that only magical ingredients can be used in certain potions
• Use the extends keyword to create type constraints
• Ensure that your generic recipes only work with appropriate ingredients
• Balance flexibility with safety and predictability

🎯 YOUR TRANSMUTATION QUEST:

You are now a master alchemist in the TypeScript Guild! Your quest is to create universal magical recipes that can transform and work with any type of ingredient. From simple identity spells to complex magical containers, you will learn to create magic that adapts to whatever challenges the React Kingdom presents!

🏆 THE GRAND ALCHEMICAL CHALLENGE:

Create a comprehensive magical container system that can store, retrieve, and manipulate ANY type of magical item or ingredient. This system will be used throughout the React Kingdom to store everything from simple potions to powerful magical artifacts!

🌟 THE WISDOM OF THE UNIVERSAL ALCHEMIST:

Remember, young alchemist, that the most powerful magic is often the most flexible. Your generic recipes will be used by countless other wizards and alchemists, each with their own unique ingredients and needs. Master the art of creating magic that is both universal and type-safe, and you will become one of the most sought-after artisans in the React Kingdom!`,
        contentKo: `🧪 환영합니다, 야심 찬 연금술사여! 당신은 특정한 마법적 청사진을 만드는 기술을 마스터했지만, 이제 TypeScript의 가장 강력하고 유연한 마법—고대 연금술 기술인 제네릭을 배워야 합니다!

🔮 연금술사의 궁극적인 지혜:

TypeScript 길드의 신비한 실험실에서, 숙련된 연금술사들은 모든 가능한 재료에 대해 별도의 물약을 만들지 않습니다. 대신, 그들은 모든 종류의 재료—가장 간단한 허브부터 가장 희귀하고 강력한 마법적 물질까지—어떤 것과도 작동할 수 있는 보편적인 마법적 레시피인 제네릭을 만드는 기술을 마스터합니다!

🏺 마법적 연금술 과정:

🧪 제네릭 - 보편적인 마법적 레시피:
• 모든 타입의 재료와 작동할 수 있는 마법적 템플릿
• 당신이 넣는 무엇이든지 적응하는 고대 연금술 공식과 같음
• 엄청난 유연성을 유지하면서 타입 안전성을 보장
• 재사용 가능하고 강력한 마법적 컴포넌트의 기초
• <T>, <U>, <K>, <V>와 같은 마법적 타입 매개변수로 표현됨

⚗️ 연금술사의 강력한 도구:

🔮 타입 매개변수 - 마법적 재료 슬롯:
• 모든 타입으로 채워질 수 있는 플레이스홀더
• 마법적 재료로 채워지기를 기다리는 빈 병과 같음
• 일반적으로 T (타입), U (두 번째 타입), K (키), V (값)를 사용
• 사용 가능한 어떤 재료에든지 적응하도록 레시피를 허용
• 진정으로 보편적인 마법적 해결책을 만드는 열쇠

🎯 제네릭 함수 - 무엇이든지 작동하는 주문:
• 모든 타입의 입력에서 작동할 수 있는 마법적 주문
• 전사, 마법사, 또는 어떤 생물에게든지 작동하는 보편적인 주문과 같음
• 엄청난 유연성을 유지하면서 타입 안전성을 보장
• 특정 타입의 재료에서만 작동하도록 제약될 수 있음
• 당신의 마법적 무기고에서 가장 강력하고 재사용 가능한 주문

🏛️ 제네릭 인터페이스 - 보편적인 마법적 청사진:
• 모든 타입의 구조에 적응할 수 있는 청사진
• 모든 재료로 건설할 수 있는 건축 계획과 같음
• 재료 타입을 유연하게 남겨두면서 모양을 정의
• 컨테이너, 저장소, 마법적 저장 시스템을 만드는 데 완벽
• 적응 가능하고 강력한 마법적 아키텍처의 기초

🏰 제네릭 클래스 - 모든 타입의 마법적 공장:
• 모든 타입의 객체를 생산할 수 있는 클래스
• 모든 타입의 물약이나 유물을 만들 수 있는 마법적 공장과 같음
• 클래스의 힘과 제네릭의 유연성을 결합
• 데이터 구조, 서비스, 마법적 시스템을 만드는 데 필수적
• 재사용 가능한 마법적 컴포넌트를 만드는 궁극적인 도구

🔗 제약 조건 - 연금술사의 규칙:
• 어떤 타입을 사용할 수 있는지 제한하는 마법적 규칙
• 특정 물약에서는 마법적 재료만 사용해야 한다고 명시하는 것과 같음
• extends 키워드를 사용하여 타입 제약 조건을 만듦
• 제네릭 레시피가 적절한 재료에서만 작동하도록 보장
• 유연성과 안전성, 예측 가능성의 균형을 맞춤

🎯 당신의 변환 퀘스트:

이제 당신은 TypeScript 길드의 숙련된 연금술사입니다! 당신의 퀘스트는 모든 타입의 재료를 변환하고 작동할 수 있는 보편적인 마법적 레시피를 만드는 것입니다. 간단한 동일 주문부터 복잡한 마법적 컨테이너까지, React 왕국이 제시하는 어떤 도전에도 적응하는 마법을 만드는 법을 배우게 될 것입니다!

🏆 위대한 연금술적 도전:

간단한 물약부터 강력한 마법적 유물까지 모든 것을 저장하기 위해 React 왕국 전체에서 사용될 모든 타입의 마법적 아이템이나 재료를 저장, 검색, 조작할 수 있는 포괄적인 마법적 컨테이너 시스템을 만드세요!

🌟 보편적인 연금술사의 지혜:

기억하라, 어린 연금술사여, 가장 강력한 마법은 종종 가장 유연한 마법이라는 것을. 당신의 제네릭 레시피는 각자 고유한 재료와 필요를 가진 수많은 다른 마법사와 연금술사들에 의해 사용될 것입니다. 보편적이면서도 타입 안전한 마법을 만드는 기술을 마스터한다면, 당신은 React 왕국에서 가장 찾는 장인 중 한 명이 될 것입니다!`,
        examples: [
          `// Magical Identity Spell - Returns any ingredient unchanged
function identitySpell<T>(ingredient: T): T {
  return ingredient
}

// Works with any magical ingredient!
const herbResult = identitySpell("mandrake")        // string
const crystalResult = identitySpell(42)               // number  
const potionResult = identitySpell({ power: 100 })   // object

// This universal spell preserves any magical ingredient perfectly!`,
          `// Magical Container - Stores any type of magical item
interface MagicalContainer<T> {
  contents: T
  seal(): void
  unseal(): T
  isSealed: boolean
}

// Create containers for different magical items
const herbJar: MagicalContainer<string> = {
  contents: "dragonScale",
  seal() { this.isSealed = true },
  unseal() { this.isSealed = false; return this.contents },
  isSealed: false
}

const crystalBox: MagicalContainer<number> = {
  contents: 999,
  seal() { this.isSealed = true },
  unseal() { this.isSealed = false; return this.contents },
  isSealed: false
}

// One container blueprint works for all magical items!`,
          `// Generic Alchemical Potion Factory
class PotionFactory<T> {
  private ingredients: T[] = []
  
  addIngredient(ingredient: T): void {
    this.ingredients.push(ingredient)
  }
  
  brewPotion(): T[] {
    return [...this.ingredients]  // Return a copy of all ingredients
  }
  
  getIngredientCount(): number {
    return this.ingredients.length
  }
}

// Create different types of potion factories
const healingPotionFactory = new PotionFactory<string>()
healingPotionFactory.addIngredient("herb")
healingPotionFactory.addIngredient("crystal")

const powerPotionFactory = new PotionFactory<number>()
powerPotionFactory.addIngredient(100)
powerPotionFactory.addIngredient(200)

// One factory class can create any type of magical potion!`,
          `// Constrained Magic - Only works with magical items that have power
interface MagicalItem {
  power: number
}

function enchantItem<T extends MagicalItem>(item: T): T {
  item.power += 50  // Increase magical power
  return item
}

// Works with any item that has power
const wand = { power: 100, type: "wand" }
const sword = { power: 80, material: "steel" }

const enchantedWand = enchantItem(wand)      // power: 150
const enchantedSword = enchantItem(sword)    // power: 130

// This spell only enchants items that have magical power!`
        ],
        examplesKo: [
          `// 마법적 동일 주문 - 모든 재료를 변경 없이 반환
function identitySpell<T>(ingredient: T): T {
  return ingredient
}

// 모든 마법적 재료와 작동!
const herbResult = identitySpell("만드레이크")     // 문자열
const crystalResult = identitySpell(42)            // 숫자  
const potionResult = identitySpell({ power: 100 }) // 객체

// 이 보편적인 주문은 모든 마법적 재료를 완벽하게 보존합니다!`,
          `// 마법적 컨테이너 - 모든 타입의 마법적 아이템을 저장
interface MagicalContainer<T> {
  contents: T
  seal(): void
  unseal(): T
  isSealed: boolean
}

// 다른 마법적 아이템을 위한 컨테이너 생성
const herbJar: MagicalContainer<string> = {
  contents: "용비늘",
  seal() { this.isSealed = true },
  unseal() { this.isSealed = false; return this.contents },
  isSealed: false
}

const crystalBox: MagicalContainer<number> = {
  contents: 999,
  seal() { this.isSealed = true },
  unseal() { this.isSealed = false; return this.contents },
  isSealed: false
}

// 하나의 컨테이너 청사진이 모든 마법적 아이템에 작동!`,
          `// 제네릭 연금술 물약 공장
class PotionFactory<T> {
  private ingredients: T[] = []
  
  addIngredient(ingredient: T): void {
    this.ingredients.push(ingredient)
  }
  
  brewPotion(): T[] {
    return [...this.ingredients]  // 모든 재료의 복사본 반환
  }
  
  getIngredientCount(): number {
    return this.ingredients.length
  }
}

// 다른 타입의 물약 공장 생성
const healingPotionFactory = new PotionFactory<string>()
healingPotionFactory.addIngredient("허브")
healingPotionFactory.addIngredient("크리스탈")

const powerPotionFactory = new PotionFactory<number>()
powerPotionFactory.addIngredient(100)
powerPotionFactory.addIngredient(200)

// 하나의 공장 클래스가 모든 타입의 마법적 물약을 만들 수 있습니다!`,
          `// 제약된 마법 - power를 가진 마법적 아이템에서만 작동
interface MagicalItem {
  power: number
}

function enchantItem<T extends MagicalItem>(item: T): T {
  item.power += 50  // 마법적 힘 증가
  return item
}

// power를 가진 모든 아이템에서 작동
const wand = { power: 100, type: "지팡이" }
const sword = { power: 80, material: "강철" }

const enchantedWand = enchantItem(wand)      // power: 150
const enchantedSword = enchantItem(sword)    // power: 130

// 이 주문은 마법적 힘을 가진 아이템만 인챈트합니다!`
        ],
        exercise: {
          description: "Create a magical generic function called 'extractEssence' that accepts an array of any type T and returns the first element of type T, or undefined if the array is empty. This function will be used to extract the magical essence from any collection of ingredients!",
          descriptionKo: "모든 타입 T의 배열을 받아들이고 첫 번째 요소를 타입 T로 반환하거나, 배열이 비어있으면 undefined를 반환하는 'extractEssence'라는 마법적 제네릭 함수를 만드세요. 이 함수는 모든 재료 컬렉션에서 마법적 본질을 추출하는 데 사용될 것입니다!",
          initialCode: `function extractEssence<T>(ingredients: ):  {
  
}`,
          solution: `function extractEssence<T>(ingredients: T[]): T | undefined {
  return ingredients[0]
}`,
          hints: [
            "Use T as the type parameter for the array elements",
            "The function should accept an array of type T[]",
            "Return type should be T | undefined to handle empty arrays",
            "Simply return the first element using array index [0]",
            "This magical extraction works on any type of ingredient array!"
          ],
          hintsKo: [
            "배열 요소의 타입으로 T를 사용하세요",
            "함수는 T[] 타입의 배열을 받아야 합니다",
            "빈 배열을 처리하기 위해 반환 타입은 T | undefined여야 합니다",
            "배열 인덱스 [0]을 사용하여 첫 번째 요소를 반환하세요",
            "이 마법적 추출은 모든 타입의 재료 배열에서 작동합니다!"
          ]
        }
      }
    ],
    "react-5": [
      {
        id: "react-5-1",
        title: "The Ancient Art of Hook Mastery",
        titleKo: "Hook 마스터의 고대 기술",
        description: "Unlock the ultimate power of React Hooks to become a true React Archmage",
        descriptionKo: "진정한 React 대마법사가 되기 위해 React Hooks의 궁극의 힘을 해방하세요",
        content: `🧙‍♂️ Congratulations, noble apprentice! You've mastered the fundamental arts of React. Now, you stand at the threshold of true power—the ancient and mystical art of React Hooks!

🔮 The Legendary Power of Hooks:

In the deepest chambers of the React Guild, the most powerful wizards guard the secrets of Hooks—magical functions that grant functional components the power to wield state and side effects. Before Hooks, only class components could possess such power, but now this magic is available to all!

⚡ The Sacred Hook Arsenal:

🎯 USESTATE - The Heart of Component Magic:
• The fundamental hook for managing component state
• Like a magical crystal that stores and updates power
• Returns a pair: [currentValue, updateFunction]
• Triggers magical re-renders when state changes
• The foundation of all interactive components

🌟 USEEFFECT - The Portal to Side Effects:
• Powerful magic for handling side effects and external interactions
• Like opening a portal to the outside world from within your component
• Runs after every render (with magical control)
• Perfect for API calls, subscriptions, and DOM manipulation
• Can clean up after itself with magical return functions

🔮 USECONTEXT - The Wisdom of the Ancients:
• Access shared magical knowledge across the component tree
• Like tapping into the collective wisdom of the React Guild
• Eliminates the need for tedious prop drilling
• Creates magical connections between distant components
• Essential for theme management and user preferences

⚔️ USEREDUCER - The Battle Logic Master:
• Advanced state management for complex magical battles
• Like having a tactical wizard managing complex scenarios
• Uses reducer patterns for predictable state updates
• Perfect for complex forms, game logic, and state machines
• More powerful than useState for intricate scenarios

🛡️ USECALLBACK & USEMEMO - The Guardians of Performance:
• Magical shields that prevent unnecessary re-computations
• Like having enchanted armor that protects against wasted energy
• Memoize functions and values for optimal performance
• Essential for large applications and complex component trees
• The secret to building lightning-fast magical interfaces

🏰 Real-World Magical Applications:

🎮 INTERACTIVE SPELLBOOKS:
• Complex form handling with multiple validation rules
• Real-time search with debouncing and caching
• Animated spell effects with proper cleanup
• Drag-and-drop magical ingredient management

🌐 CONNECTED KINGDOMS:
• Global state management for user authentication
• Real-time data synchronization across components
• Theme switching with persistent user preferences
• Performance optimization for large magical interfaces

🎪 Your Ultimate Challenge:
Create a magical spell timer component that combines useState and useEffect to track spell casting duration and manage magical energy levels!`,
        contentKo: `🧙‍♂️ 축하합니다, 고귀한 견습생! 당신은 React의 기본 기술을 마스터했습니다. 이제 당신은 진정한 힘의 문턱에 서 있습니다—바로 React Hooks의 고대적이고 신비한 기술입니다!

🔮 Hooks의 전설적인 힘:

React 길드의 가장 깊은 방에서, 가장 강력한 마법사들이 Hooks의 비밀을 지킵니다—Hooks는 함수형 컴포넌트가 상태와 부수 효과를 다룰 수 있는 힘을 부여하는 마법적인 함수들입니다. Hooks 이전에는 클래스 컴포넌트만이这样的 힘을 가질 수 있었지만, 이제 이 마법은 모두에게 사용 가능합니다!

⚡ 신성한 Hook 무기고:

🎯 USESTATE - 컴포넌트 마법의 심장:
• 컴포넌트 상태 관리를 위한 기본적인 hook
• 힘을 저장하고 업데이트하는 마법적인 수정과 같음
• 쌍을 반환함: [currentValue, updateFunction]
• 상태가 변경될 때 마법적인 재렌더링을 트리거함
• 모든 상호작용 컴포넌트의 기초

🌟 USEEFFECT - 부수 효과로의 포털:
• 부수 효과와 외부 상호작용을 처리하는 강력한 마법
• 컴포넌트 내부에서 외부 세계로의 포털을 여는 것과 같음
• 모든 렌더링 후에 실행됨 (마법적인 제어와 함께)
• API 호출, 구독, DOM 조작에 완벽함
• 마법적인 반환 함수로 자신을 정리할 수 있음

🔮 USECONTEXT - 고대의 지혜:
• 컴포넌트 트리 전체에 걸쳐 공유된 마법적 지식에 접근
• React 길드의 집단적 지혜에 접근하는 것과 같음
• 지루한 prop drilling의 필요성을 제거함
• 먼 컴포넌트 간의 마법적인 연결을 생성함
• 테마 관리와 사용자 선호도에 필수적

⚔️ USEREDUCER - 전투 로직 마스터:
• 복잡한 마법 전투를 위한 고급 상태 관리
• 복잡한 시나리오를 관리하는 전술적 마법사를 가진 것과 같음
• 예측 가능한 상태 업데이트를 위해 리듀서 패턴을 사용함
• 복잡한 폼, 게임 로직, 상태 머신에 완벽함
• 복잡한 시나리오에서 useState보다 더 강력함

🛡️ USECALLBACK & USEMEMO - 성능의 수호자:
• 불필요한 재계산을 방지하는 마법적인 방패
• 낭비되는 에너지로부터 보호하는 마법 갑옷을 가진 것과 같음
• 최적의 성능을 위해 함수와 값을 메모이제이션함
• 대규모 애플리케이션과 복잡한 컴포넌트 트리에 필수적
• 번개처럼 빠른 마법적 인터페이스 구축의 비밀

🏰 실제 세계의 마법적 응용:

🎮 상호작용적인 주문서:
• 다중 검증 규칙이 있는 복잡한 폼 처리
• 디바운싱과 캐싱이 있는 실시간 검색
• 적절한 정리가 있는 애니메이션 주문 효과
• 드래그 앤 드롭 마법 재료 관리

🌐 연결된 왕국:
• 사용자 인증을 위한 전역 상태 관리
• 컴포넌트 간 실시간 데이터 동기화
• 지속적인 사용자 선호도가 있는 테마 전환
• 대규모 마법적 인터페이스를 위한 성능 최적화

🎪 당신의 궁극적인 도전:
useState와 useEffect를 결합하여 주문 시전 지속 시간을 추적하고 마법적 에너지 레벨을 관리하는 마법적인 주문 타이머 컴포넌트를 만드세요!`,
        examples: [
          `// useState hook
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`,
          `// useEffect hook
import { useState, useEffect } from 'react'

function Timer() {
  const [time, setTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [time])
  
  return <div>Time: {time}s</div>
}`
        ],
        examplesKo: [
          `// useState hook
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  )
}`,
          `// useEffect hook
import { useState, useEffect } from 'react'

function Timer() {
  const [time, setTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [time])
  
  return <div>시간: {time}초</div>
}`
        ],
        exercise: {
          description: "Create a component using useState to manage a counter that increments when a button is clicked",
          descriptionKo: "버튼을 클릭하면 증가하는 카운터를 관리하기 위해 useState를 사용하는 컴포넌트를 만드세요",
          initialCode: `import { useState } from 'react'

function Counter() {
  
}`,
          solution: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`,
          hints: [
            "Import useState from react",
            "Use useState to initialize count to 0",
            "Create a button that calls setCount with count + 1"
          ],
          hintsKo: [
            "react에서 useState를 임포트하세요",
            "useState를 사용하여 count를 0으로 초기화하세요",
            "setCount(count + 1)을 호출하는 버튼을 만드세요"
          ]
        }
      }
    ],
    "typescript-4": [
      {
        id: "typescript-4-1",
        title: "The Arcane Arts of Advanced Type Magic",
        titleKo: "고급 타입 마법의 신비한 기술",
        description: "Master the most powerful and mysterious type magic that transforms and manipulates magical structures with incredible precision",
        descriptionKo: "놀라운 정밀도로 마법적 구조를 변환하고 조작하는 가장 강력하고 신비한 타입 마법을 마스터하세요",
        content: `🌟 Greetings, Archmage! You've mastered the fundamental arts of TypeScript magic, but now you stand at the precipice of the most powerful and mysterious magic in all the realm—Advanced Type Magic! These are the spells that can transform, manipulate, and create magical structures with incredible precision and power.

🔮 The Grand Archmage's Secret Knowledge:

In the highest towers of the TypeScript Guild, the most powerful archmages guard the secrets of Advanced Type Magic—arcane arts that can transform existing magical blueprints, create new ones from combinations, and manipulate the very fabric of type structures themselves. These are not mere tools; they are transformative magic that can reshape reality itself!

🏛️ THE ARCANE TOOLKIT OF TRANSFORMATION:

🔮 PARTIAL<T> - The Magic of Incompleteness:
• A powerful spell that makes all properties of a magical blueprint optional
• Like casting a spell of incompleteness on a perfect magical artifact
• Transforms required properties into optional ones
• Perfect for creating partial updates, drafts, and incremental changes
• The magic of flexibility and gradual completion

⚡ REQUIRED<T> - The Spell of Completeness:
• The inverse of Partial—makes all properties mandatory and required
• Like casting a spell of wholeness on an incomplete magical artifact
• Transforms optional properties into required ones
• Essential for ensuring complete and valid magical structures
• The magic of completeness and validation

🎯 PICK<T, K> - The Art of Selection:
• A precise spell that selects specific properties from a magical blueprint
• Like using magical tweezers to extract exactly what you need
• Creates new types with only the chosen properties
• Perfect for creating views, previews, and specialized interfaces
• The magic of precision and selection

🗡️ OMIT<T, K> - The Art of Exclusion:
• The opposite of Pick—removes specific properties from a magical blueprint
• Like using a magical eraser to remove unwanted elements
• Creates new types by excluding specified properties
• Essential for creating secure interfaces and hiding sensitive information
• The magic of exclusion and security

📚 RECORD<K, T> - The Spell of Creation:
• A powerful creation spell that generates object types from key and value types
• Like a magical loom that weaves keys and values into complete structures
• Creates objects where all keys are of type K and all values are of type T
• Perfect for dictionaries, indexes, and magical lookup tables
• The magic of creation and structure

🔮 EXTRACT<T, U> - The Magic of Discovery:
• A divination spell that extracts types from complex magical structures
• Like using a magical lens to see the true nature of complex types
• Discovers the underlying types from unions, intersections, and complex constructs
• Essential for advanced type manipulation and inference
• The magic of discovery and understanding

⚗️ EXCLUDE<T, U> - The Magic of Purification:
• A purification spell that removes specific types from unions
• Like filtering out impurities from a magical potion
• Creates clean types by excluding unwanted type components
• Perfect for type-safe filtering and validation
• The magic of purification and refinement

🎯 YOUR ULTIMATE MAGICAL QUEST:

You are now an archmage in the TypeScript Guild! Your ultimate quest is to master the transformative arts of Advanced Type Magic. You will learn to reshape existing magical blueprints, create new ones from combinations, and manipulate the very fabric of type structures with precision and power that few can comprehend!

🏆 THE GRAND ARCHMAGE CHALLENGE:

Create a comprehensive magical transformation system that can adapt, modify, and create magical blueprints for any situation. From partial updates to complete validation, from selective views to secure interfaces—you will master the magic that can transform any magical structure to meet any need!

🌟 THE WISDOM OF THE GRAND ARCHMAGE:

Remember, archmage, that the most powerful magic is not just about creating—it's about transforming. Your advanced type magic will be used to adapt existing systems, create new possibilities from old foundations, and solve problems that seem impossible to others. Master these transformative arts, and you will become one of the most powerful and sought-after magicians in the entire React Kingdom!`,
        contentKo: `🌟 인사하라, 대마법사여! 당신은 TypeScript 마법의 기본 기술을 마스터했지만, 이제 당신은 영역 전체에서 가장 강력하고 신비한 마법의 절벽에 서 있습니다—고급 타입 마법! 이것들은 놀라운 정밀도와 힘으로 마법적 구조를 변환, 조작, 생성하는 주문들입니다.

🔮 대마법사의 비밀 지식:

TypeScript 길드의 가장 높은 탑에서, 가장 강력한 대마법사들은 고급 타입 마법의 비밀을 지킵니다—기존의 마법적 청사진을 변환하고, 조합으로부터 새로운 것을 만들고, 타입 구조 자체의 매직을 조작하는 신비한 기술들입니다. 이것들은 단순한 도구가 아니라; 현실 자체를 재형성할 수 있는 변환 마법입니다!

🏛️ 변환의 신비한 도구 키트:

🔮 PARTIAL<T> - 불완전성의 마법:
• 마법적 청사진의 모든 속성을 선택적으로 만드는 강력한 주문
• 완벽한 마법적 유물에 불완전성의 주문을 거는 것과 같음
• 필수 속성을 선택적 속성으로 변환
• 부분 업데이트, 초안, 점진적 변경을 만드는 데 완벽
• 유연성과 점진적 완성의 마법

⚡ REQUIRED<T> - 완전성의 주문:
• Partial의 반대—모든 속성을 필수적이고 요구되도록 만드는 주문
• 불완전한 마법적 유물에 완전성의 주문을 거는 것과 같음
• 선택적 속성을 필수 속성으로 변환
• 완전하고 유효한 마법적 구조를 보장하는 데 필수적
• 완전성과 검증의 마법

🎯 PICK<T, K> - 선택의 기술:
• 마법적 청사진에서 특정 속성을 선택하는 정밀한 주문
• 마법적 집게를 사용하여 정확히 필요한 것을 추출하는 것과 같음
• 선택된 속성만으로 새로운 타입을 생성
• 뷰, 미리보기, 특수화된 인터페이스를 만드는 데 완벽
• 정밀성과 선택의 마법

🗡️ OMIT<T, K> - 제외의 기술:
• Pick의 반대—마법적 청사진에서 특정 속성을 제거하는 주문
• 마법적 지우개를 사용하여 원하지 않는 요소를 제거하는 것과 같음
• 지정된 속성을 제외하여 새로운 타입을 생성
• 안전한 인터페이스와 민감한 정보 숨김을 만드는 데 필수적
• 제외와 보안의 마법

📚 RECORD<K, T> - 생성의 주문:
• 키와 값 타입으로부터 객체 타입을 생성하는 강력한 생성 주문
• 키와 값을 완전한 구조로 엮는 마법적 직조기와 같음
• 모든 키가 K 타입이고 모든 값이 T 타입인 객체를 생성
• 사전, 인덱스, 마법적 조회 테이블을 만드는 데 완벽
• 생성과 구조의 마법

🔮 EXTRACT<T, U> - 발견의 마법:
• 복잡한 마법적 구조에서 타입을 추출하는 점복 주문
• 복잡한 타입의 본질을 보기 위해 마법적 렌즈를 사용하는 것과 같음
• 유니온, 인터섹션, 복잡한 구조에서 기본 타입을 발견
• 고급 타입 조작과 추론에 필수적
• 발견과 이해의 마법

⚗️ EXCLUDE<T, U> - 정제의 마법:
• 유니온에서 특정 타입을 제거하는 정제 주문
• 마법적 물약에서 불순물을 걸러내는 것과 같음
• 원하지 않는 타입 구성 요소를 제외하여 깨끗한 타입을 생성
• 타입 안전 필터링과 검증에 완벽
• 정제와 정제의 마법

🎯 당신의 궁극적인 마법적 퀘스트:

이제 당신은 TypeScript 길드의 대마법사입니다! 당신의 궁극적인 퀘스트는 고급 타입 마법의 변환 기술을 마스터하는 것입니다. 당신은 기존의 마법적 청사진을 재형성하고, 조합으로부터 새로운 것을 만들고, 소수만이 이해할 수 있는 정밀성과 힘으로 타입 구조의 매직을 조작하는 법을 배우게 될 것입니다!

🏆 대마법사의 위대한 도전:

모든 상황에 맞게 마법적 청사진을 적응, 수정, 생성할 수 있는 포괄적인 마법적 변환 시스템을 만드세요. 부분 업데이트부터 완전한 검증까지, 선택적 뷰부터 안전한 인터페이스까지—당신은 모든 마법적 구조를 모든 필요에 맞게 변환할 수 있는 마법을 마스터할 것입니다!

🌟 대마법사의 지혜:

기억하라, 대마법사여, 가장 강력한 마법은 단순히 만드는 것이 아니라 변환하는 것이라는 것을. 당신의 고급 타입 마법은 기존 시스템을 적응시키고, 오래된 기반으로부터 새로운 가능성을 만들고, 다른 사람들에게는 불가능해 보이는 문제를 해결하는 데 사용될 것입니다. 이 변환 기술들을 마스터한다면, 당신은 전체 React 왕국에서 가장 강력하고 찾는 마법사 중 한 명이 될 것입니다!`,
        examples: [
          `// Partial<T> - The Magic of Incompleteness
interface MagicalArtifact {
  name: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
}

// Cast the spell of incompleteness - all properties become optional!
type ArtifactDraft = Partial<MagicalArtifact>
// Now equals:
// {
//   name?: string
//   power?: number
//   rarity?: 'common' | 'rare' | 'epic' | 'legendary'
//   requiredLevel?: number
// }

// Perfect for creating incomplete artifacts or partial updates!
const draftArtifact: ArtifactDraft = {
  name: "Excalibur",
  power: 100
}

// This spell allows gradual creation of magical artifacts!`,
          `// Required<T> - The Spell of Completeness
interface QuestProgress {
  questId: string
  currentStep?: number
  completionPercentage?: number
  rewards?: string[]
}

// Cast the spell of completeness - all properties become required!
type CompletedQuest = Required<QuestProgress>
// Now forces all properties to be provided:
// {
//   questId: string
//   currentStep: number
//   completionPercentage: number
//   rewards: string[]
// }

// Ensures complete and valid quest data!
const finishedQuest: CompletedQuest = {
  questId: "dragon-slayer",
  currentStep: 5,
  completionPercentage: 100,
  rewards: ["gold", "experience", "dragon-scale"]
}

// This magic ensures nothing is missing!`,
          `// Pick<T, K> - The Art of Selection
interface WizardProfile {
  id: string
  name: string
  level: number
  specialty: string
  spells: string[]
  equipment: string[]
  achievements: string[]
}

// Select only the essential information for a preview
type WizardPreview = Pick<WizardProfile, 'name' | 'level' | 'specialty'>
// Creates: { name: string; level: number; specialty: string }

// Perfect for creating focused views!
const wizardPreview: WizardPreview = {
  name: "Merlin",
  level: 15,
  specialty: "Elemental Magic"
}

// This magic extracts exactly what you need!`,
          `// Omit<T, K> - The Art of Exclusion
interface FullCharacterData {
  id: string
  username: string
  email: string
  passwordHash: string
  level: number
  class: string
  inventory: string[]
  achievements: string[]
}

// Remove sensitive information for public display
type PublicCharacter = Omit<FullCharacterData, 'passwordHash' | 'email'>
// Creates a type without the sensitive properties

// Perfect for creating secure interfaces!
const publicProfile: PublicCharacter = {
  id: "char-123",
  username: "DragonSlayer",
  level: 25,
  class: "Warrior",
  inventory: ["sword", "shield"],
  achievements: ["dragon-killer"]
}

// This magic protects sensitive information!`,
          `// Record<K, T> - The Spell of Creation
// Create a magical inventory system where item names map to their quantities
type Inventory = Record<string, number>

const playerInventory: Inventory = {
  "health-potion": 5,
  "mana-potion": 3,
  "sword": 1,
  "shield": 1,
  "gold-coins": 150
}

// Create a spell book mapping spell names to their power levels
type SpellBook = Record<string, number>
const merlinSpells: SpellBook = {
  "fireball": 80,
  "teleport": 90,
  "heal": 60,
  "shield": 70
}

// This magic creates structured systems from simple types!`,
          `// Advanced Combination - Multiple Transformations
interface CompleteMagicalItem {
  id: string
  name: string
  description: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
  owner: string
  dateCreated: Date
  lastUsed: Date
}

// Create a preview type for the marketplace (public view)
type MarketplaceItem = Pick<CompleteMagicalItem, 'name' | 'power' | 'rarity' | 'requiredLevel'>

// Create an update type (partial changes)
type ItemUpdate = Partial<Pick<CompleteMagicalItem, 'power' | 'requiredLevel'>>

// Create a safe public type (no sensitive info)
type PublicItem = Omit<CompleteMagicalItem, 'id' | 'owner' | 'dateCreated'>

// This demonstrates the true power of transformation magic!`
        ],
        examplesKo: [
          `// Partial<T> - 불완전성의 마법
interface MagicalArtifact {
  name: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
}

// 불완전성의 주문을 시전 - 모든 속성이 선택적이 됨!
type ArtifactDraft = Partial<MagicalArtifact>
// 이제 다음과 같음:
// {
//   name?: string
//   power?: number
//   rarity?: 'common' | 'rare' | 'epic' | 'legendary'
//   requiredLevel?: number
// }

// 불완전한 유물이나 부분 업데이트를 만드는 데 완벽!
const draftArtifact: ArtifactDraft = {
  name: "엑스칼리버",
  power: 100
}

// 이 주문은 마법적 유물의 점진적 생성을 허용합니다!`,
          `// Required<T> - 완전성의 주문
interface QuestProgress {
  questId: string
  currentStep?: number
  completionPercentage?: number
  rewards?: string[]
}

// 완전성의 주문을 시전 - 모든 속성이 필수가 됨!
type CompletedQuest = Required<QuestProgress>
// 이제 모든 속성 제공을 강제:
// {
//   questId: string
//   currentStep: number
//   completionPercentage: number
//   rewards: string[]
// }

// 완전하고 유효한 퀘스트 데이터를 보장!
const finishedQuest: CompletedQuest = {
  questId: "dragon-slayer",
  currentStep: 5,
  completionPercentage: 100,
  rewards: ["gold", "experience", "dragon-scale"]
}

// 이 마법은 아무것도 빠지지 않도록 보장합니다!`,
          `// Pick<T, K> - 선택의 기술
interface WizardProfile {
  id: string
  name: string
  level: number
  specialty: string
  spells: string[]
  equipment: string[]
  achievements: string[]
}

// 미리보기를 위해 필수 정보만 선택
type WizardPreview = Pick<WizardProfile, 'name' | 'level' | 'specialty'>
// 생성: { name: string; level: number; specialty: string }

// 집중된 뷰를 만드는 데 완벽!
const wizardPreview: WizardPreview = {
  name: "Merlin",
  level: 15,
  specialty: "Elemental Magic"
}

// 이 마법은 정확히 필요한 것을 추출합니다!`,
          `// Omit<T, K> - 제외의 기술
interface FullCharacterData {
  id: string
  username: string
  email: string
  passwordHash: string
  level: number
  class: string
  inventory: string[]
  achievements: string[]
}

// 공개 표시를 위해 민감한 정보 제거
type PublicCharacter = Omit<FullCharacterData, 'passwordHash' | 'email'>
// 민감한 속성 없이 타입을 생성

// 안전한 인터페이스를 만드는 데 완벽!
const publicProfile: PublicCharacter = {
  id: "char-123",
  username: "DragonSlayer",
  level: 25,
  class: "Warrior",
  inventory: ["sword", "shield"],
  achievements: ["dragon-killer"]
}

// 이 마법은 민감한 정보를 보호합니다!`,
          `// Record<K, T> - 생성의 주문
// 아이템 이름을 수량에 매핑하는 마법적 인벤토리 시스템 생성
type Inventory = Record<string, number>

const playerInventory: Inventory = {
  "health-potion": 5,
  "mana-potion": 3,
  "sword": 1,
  "shield": 1,
  "gold-coins": 150
}

// 주문 이름을 파워 레벨에 매핑하는 주문서 생성
type SpellBook = Record<string, number>
const merlinSpells: SpellBook = {
  "fireball": 80,
  "teleport": 90,
  "heal": 60,
  "shield": 70
}

// 이 마법은 단순한 타입으로부터 구조화된 시스템을 생성합니다!`,
          `// 고급 조합 - 다중 변환
interface CompleteMagicalItem {
  id: string
  name: string
  description: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
  owner: string
  dateCreated: Date
  lastUsed: Date
}

// 마켓플레이스를 위한 미리보기 타입 생성 (공개 뷰)
type MarketplaceItem = Pick<CompleteMagicalItem, 'name' | 'power' | 'rarity' | 'requiredLevel'>

// 업데이트 타입 생성 (부분 변경)
type ItemUpdate = Partial<Pick<CompleteMagicalItem, 'power' | 'requiredLevel'>>

// 안전한 공개 타입 생성 (민감한 정보 없음)
type PublicItem = Omit<CompleteMagicalItem, 'id' | 'owner' | 'dateCreated'>

// 이것이 변환 마법의 진정한 힘을 보여줍니다!`
        ],
        exercise: {
          description: "Create a magical transformation spell called 'FlexibleArtifact' that uses the Partial utility type to make all properties of a MagicalArtifact interface optional. This will allow archmages to create artifact drafts and partial updates in the React Kingdom!",
          descriptionKo: "Partial 유틸리티 타입을 사용하여 MagicalArtifact 인터페이스의 모든 속성을 선택적으로 만드는 'FlexibleArtifact'라는 마법적 변환 주문을 만드세요. 이것은 대마법사들이 React 왕국에서 유물 초안과 부분 업데이트를 만들 수 있게 해줄 것입니다!",
          initialCode: `interface MagicalArtifact {
  name: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
}

type FlexibleArtifact = `,
          solution: `interface MagicalArtifact {
  name: string
  power: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requiredLevel: number
}

type FlexibleArtifact = Partial<MagicalArtifact>`,
          hints: [
            "Use the Partial utility type to make all properties optional",
            "Pass the MagicalArtifact interface as the type parameter to Partial",
            "This transformation spell allows creating incomplete artifacts",
            "Perfect for drafts, updates, and flexible magical creations",
            "The Partial magic is one of the most useful transformation spells!"
          ],
          hintsKo: [
            "Partial 유틸리티 타입을 사용하여 모든 속성을 선택적으로 만드세요",
            "MagicalArtifact 인터페이스를 Partial의 타입 매개변수로 전달하세요",
            "이 변환 주문은 불완전한 유물을 만들 수 있게 해줍니다",
            "초안, 업데이트, 유연한 마법적 창조물을 만드는 데 완벽",
            "Partial 마법은 가장 유용한 변환 주문 중 하나입니다!"
          ]
        }
      }
    ]
  }), []) // useMemo 닫는 괄호 추가

  const currentLevelLessons = lessons[level.id] || []
  const currentLessonData = currentLevelLessons[currentLesson]

  // Debug logging to identify the issue
  console.log("LearningLevel - Debug Info:")
  console.log("Level ID:", level.id)
  console.log("Available lesson keys:", Object.keys(lessons))
  console.log("Current level lessons:", currentLevelLessons)
  console.log("Current lesson index:", currentLesson)
  console.log("Current lesson data:", currentLessonData)



  const runCode = () => {
    setIsRunning(true)
    
    setTimeout(() => {
      // 더 유연한 정답 체크: 공백, 줄바꿈, 들여쓰기 차이 무시
      const normalizeCode = (code: string) => {
        return code
          .replace(/\s+/g, ' ') // 여러 공백을 하나로
          .replace(/\s*{\s*/g, '{') // 중괄호 주변 공백 제거
          .replace(/\s*}\s*/g, '}') // 중괄호 주변 공백 제거
          .replace(/\s*\(\s*/g, '(') // 괄호 주변 공백 제거
          .replace(/\s*\)\s*/g, ')') // 괄호 주변 공백 제거
          .replace(/\s*<\s*/g, '<') // JSX 태그 주변 공백 제거
          .replace(/\s*>\s*/g, '>') // JSX 태그 주변 공백 제거
          .trim()
      }
      
      const normalizedUserCode = normalizeCode(userCode)
      const normalizedSolution = normalizeCode(currentLessonData.exercise.solution)
      
      console.log("User code:", normalizedUserCode)
      console.log("Solution:", normalizedSolution)
      console.log("Is correct:", normalizedUserCode === normalizedSolution)
      
      const isCorrect = normalizedUserCode === normalizedSolution
      
      if (isCorrect) {
        setTestResults({
          passed: true,
          message: t("excellent")
        })
        setExerciseCompleted(true)
        setWrongAttempts(0) // 정답이면 틀린 횟수 리셋
        // 정답일 때 레벨 완료
        setTimeout(() => {
          completeLesson()
        }, 1500) // 1.5초 후 자동으로 다음 레벨로 진행
      } else {
        const newWrongAttempts = wrongAttempts + 1
        setWrongAttempts(newWrongAttempts)
        
        if (newWrongAttempts >= 3) {
          // 3번 틀렸을 때 솔루션 보여주기
          setShowSolution(true)
          setTestResults({
            passed: false,
            message: isKorean ? "3번 틀렸습니다. 5초간 솔루션을 보여드립니다." : "Wrong 3 times. Showing solution for 5 seconds."
          })
          
          // 5초 후 솔루션 숨기기
          setTimeout(() => {
            setShowSolution(false)
            setTestResults({
              passed: false,
              message: t("notQuiteRight")
            })
          }, 5000)
        } else {
          setTestResults({
            passed: false,
            message: isKorean ? `${newWrongAttempts}번째 시도입니다. 다시 시도해보세요.` : `Attempt ${newWrongAttempts}. Try again.`
          })
        }
      }
      
      setIsRunning(false)
    }, 1000)
  }

  const runPreview = () => {
    try {
      setPreviewError(null)
      
      if (userCode.includes('function') || userCode.includes('return')) {
        const functionMatch = userCode.match(/function\s+(\w+)/)
        const componentName = functionMatch?.[1] || 'Component'
        
        const returnMatch = userCode.match(/return\s*\(([\s\S]*?)\)|return\s+([^;\n]+)/)
        const returnContent = returnMatch?.[1] || returnMatch?.[2] || ''
        
        const cleanContent = returnContent
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/\{[^}]+\}/g, '')
          .trim()
        
        setPreviewOutput(cleanContent || `${componentName} component rendered successfully`)
      } else {
        setPreviewOutput(userCode)
      }
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Unknown error occurred")
      setPreviewOutput(null)
    }
  }

  const showNextHint = () => {
    if (currentHintIndex < currentLessonData.exercise.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  const completeLesson = () => {
    if (currentLesson < currentLevelLessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      // 다음 레슨의 초기 코드로 설정
      const nextLessonData = currentLevelLessons[currentLesson + 1]
      if (nextLessonData) {
        setUserCode(nextLessonData.exercise.initialCode)
      }
      // 레슨 변경 시 상태 리셋
      setShowHint(false)
      setCurrentHintIndex(0)
      setExerciseCompleted(false)
      setTestResults(null)
      setPreviewOutput(null)
      setPreviewError(null)
      setWrongAttempts(0)
      setShowSolution(false)
    } else {
      onComplete(level.points)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  if (!currentLessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t("levelNotFound")}</h2>
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                <p className="font-mono text-sm mb-2">Debug Info:</p>
                <p className="font-mono text-xs">Level ID: {level.id}</p>
                <p className="font-mono text-xs">Available Keys: {Object.keys(lessons).join(", ")}</p>
                <p className="font-mono text-xs">Lessons Found: {currentLevelLessons.length}</p>
                <p className="font-mono text-xs">Current Lesson Index: {currentLesson}</p>
              </div>
              <Button onClick={onBack}>{t("backToLevels")}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentContent = isKorean ? currentLessonData.contentKo : currentLessonData.content
  const currentExamples = isKorean ? currentLessonData.examplesKo : currentLessonData.examples
  const currentExercise = isKorean ? currentLessonData.exercise.descriptionKo : currentLessonData.exercise.description
  const currentHints = isKorean ? currentLessonData.exercise.hintsKo : currentLessonData.exercise.hints

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToLevels")}
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isKorean ? level.titleKo : level.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isKorean ? level.descriptionKo : level.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getDifficultyColor(level.difficulty)} text-white`}>
                {t(level.difficulty)}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{level.points}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span>{t("lesson")} {currentLesson + 1} {t("of")} {currentLevelLessons.length}</span>
              <span>{Math.round(((currentLesson + 1) / currentLevelLessons.length) * 100)}%</span>
            </div>
            <Progress value={((currentLesson + 1) / currentLevelLessons.length) * 100} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {isKorean ? currentLessonData.titleKo : currentLessonData.title}
                </CardTitle>
                <CardDescription>{isKorean ? currentLessonData.descriptionKo : currentLessonData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
                    {currentContent}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isKorean ? "예제" : "Examples"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentExamples.map((example, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-2">{isKorean ? `예제 ${index + 1}:` : `Example ${index + 1}:`}</h4>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                        {example}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {t("exercise")}
                </CardTitle>
                <CardDescription>{currentExercise}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("yourCode")}</label>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-[150px]"
                      placeholder={isKorean ? "여기에 코드를 작성하세요..." : "Write your code here..."}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={runCode} 
                      disabled={isRunning || exerciseCompleted}
                      className="flex-1"
                    >
                      {isRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("running")}
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {t("runCode")}
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {isKorean ? "미리보기" : "Preview"}
                    </Button>
                    
                    {!showHint && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowHint(true)}
                      >
                        <Lightbulb className="mr-2 h-4 w-4" />
                        {t("hint")}
                      </Button>
                    )}
                  </div>

                  {showPreview && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          {isKorean ? "라이브 미리보기" : "Live Preview"}
                          <Button size="sm" onClick={runPreview}>
                            <Play className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {previewOutput && (
                          <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                            <p className="text-sm">{previewOutput}</p>
                          </div>
                        )}
                        {previewError && (
                          <Alert className="border-red-500 bg-red-50">
                            <AlertDescription>
                              <strong>{isKorean ? "오류:" : "Error:"}</strong> {previewError}
                            </AlertDescription>
                          </Alert>
                        )}
                        {!previewOutput && !previewError && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            {isKorean ? "미리보기를 보려면 \"실행\"을 클릭하세요" : t("clickToPreview")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {testResults && (
                    <Alert className={testResults.passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                      <AlertDescription>
                        {testResults.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {showSolution && (
                    <Card className="border-orange-500 bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-orange-500" />
                          {isKorean ? "솔루션 (5초간 표시)" : "Solution (5 seconds)"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                          <pre className="text-sm font-mono overflow-x-auto">
                            {currentLessonData.exercise.solution}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {showHint && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t("hints")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentHints.slice(0, currentHintIndex + 1).map((hint, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">
                                {index + 1}
                              </Badge>
                              <p className="text-sm">{hint}</p>
                            </div>
                          ))}
                          {currentHintIndex < currentHints.length - 1 && (
                            <Button variant="outline" size="sm" onClick={showNextHint}>
                              {t("nextHint")}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {exerciseCompleted && (
                    <Button 
                      onClick={completeLesson}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      {currentLesson < currentLevelLessons.length - 1 ? (
                        <>
                          {t("nextLesson")}
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </>
                      ) : (
                        <>
                          {t("completeLevel")}
                          <Trophy className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
Tôi sẽ mô tả UI/UX theo từng bước của luồng chính:

**1. Profile Generation (Trang nhập profile)**
```
┌─────────────────────────────────────────┐
│ 🎯 Create Your Learning Path            │
├─────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐        │
│ │ Industry ▼  │ │ Job Role ▼  │        │
│ └─────────────┘ └─────────────┘        │
│                                         │
│ ┌─────────────┐                        │
│ │ Eng Level ▼ │ 🌟 Learning Goals      │
│ └─────────────┘                        │
│ [ ] Workplace Communication            │
│ [ ] Job Interviews                     │
│ [ ] Salary Review                      │
│                                         │
│      [Generate Learning Path →]         │
└─────────────────────────────────────────┘
```
- Clean, minimal design
- Dropdown menus cho Industry, Job, Level
- Checkbox cho Learning Goals
- Loading state khi generating

**2. Learning Path View (10 Weeks Overview)**
```
┌─────────────────────────────────────────┐
│ 🎓 Your 10-Week Learning Journey        │
├─────────────────────────────────────────┤
│ Week 1: Project Updates                 │
│ ├─ 5 Scenarios                          │
│ └─ Progress: 0/20 Chunks completed      │
│                                         │
│ Week 2: Technical Guidance              │
│ ├─ 5 Scenarios                          │
│ └─ Progress: 0/20 Chunks completed      │
│                                         │
│ [More weeks...]                         │
│                                         │
│ 📊 Milestones                           │
│ 2h  - Basic Project Updates            │
│ 10h - Technical Guidance Mastery       │
└─────────────────────────────────────────┘
```
- Card view cho mỗi tuần
- Progress indicators
- Interactive cards
- Milestone timeline

**3. Topic & Scenarios View (Chi tiết 1 tuần)**
```
┌─────────────────────────────────────────┐
│ 📚 Week 1: Project Updates              │
├─────────────────────────────────────────┤
│ Scenario 1: Project Introduction        │
│ ┌─────────────────────────────────┐     │
│ │ Q1: Main project objectives     │     │
│ │ Q2: Key features               │     │
│ │ Q3: Stakeholders              │     │
│ │ Q4: Expected challenges       │     │
│ └─────────────────────────────────┘     │
│                                         │
│ [More scenarios...]                     │
│                                         │
│ 📈 Weekly Progress                      │
│ [================>  ] 75% Complete      │
└─────────────────────────────────────────┘
```
- Expandable scenario cards
- Question preview
- Progress tracking
- Easy navigation

**4. Exercise Interface (4 types)**

```
┌─────────────────────────────────────────┐
│ 💡 Exercise: Main Project Objectives    │
├─────────────────────────────────────────┤
│ Type: Learning Meaning                  │
│                                         │
│ Question:                               │
│ "Can you explain the main objective     │
│  of the new project?"                   │
│                                         │
│ Choose the correct answer:              │
│ ○ To improve efficiency                │
│ ○ To increase revenue                  │
│ ○ To enhance customer satisfaction     │
│                                         │
│ [Previous] [Check Answer] [Next]        │
└─────────────────────────────────────────┘
```

**Exercise Types UI Features:**

1. **Learning Meaning Exercise:**
- Multiple choice format
- Instant feedback
- Explanation for wrong answers
- Progress indicator

2. **Learning Card Exercise:**
```
┌─────────────────────────────────────────┐
│ 🔤 Learning Card                        │
├─────────────────────────────────────────┤
│ English: The main objective is...       │
│ Vietnamese: Mục tiêu chính là...        │
│ IPA: /ðə meɪn əbˈdʒektɪv ɪz/           │
│                                         │
│ [Flip Card] [Listen] [Practice]         │
└─────────────────────────────────────────┘
```
- Flip card animation
- Audio pronunciation
- Practice mode
- Visual cues

3. **Flexible Phrase Exercise:**
```
┌─────────────────────────────────────────┐
│ 🔄 Flexible Phrase                      │
├─────────────────────────────────────────┤
│ Complete the sentence:                  │
│ The main ___ of the project is ___.     │
│                                         │
│ [objective] [goal] [purpose]            │
│ [efficiency] [quality] [speed]          │
│                                         │
│ [Check] [Show Hint] [Skip]             │
└─────────────────────────────────────────┘
```
- Drag & drop interface
- Word bank
- Hint system
- Multiple correct answers

4. **Q&A Exercise:**
```
┌─────────────────────────────────────────┐
│ 💭 Q&A Practice                         │
├─────────────────────────────────────────┤
│ Situation: Project Update Meeting       │
│                                         │
│ Question: How would you describe the    │
│ project's main objective to the team?   │
│                                         │
│ [Record Answer] [View Sample Answer]    │
│                                         │
│ 🎯 Key Points to Include:               │
│ • Clear objective statement             │
│ • Benefits                              │
│ • Timeline                              │
└─────────────────────────────────────────┘
```
- Voice recording option
- Sample answers
- Key points checklist
- Feedback system

**Shared UI/UX Features:**
1. **Navigation:**
- Breadcrumb navigation
- Progress tracking
- Easy back/forward navigation
- Save & resume functionality

2. **Responsive Design:**
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interfaces
- Accessible controls

3. **Feedback & Progress:**
- Visual progress bars
- Achievement badges
- Score tracking
- Learning statistics

4. **Accessibility:**
- High contrast options
- Screen reader support
- Keyboard navigation
- Font size controls

5. **Engagement:**
- Animations for feedback
- Sound effects (optional)
- Celebration on completion
- Streak tracking

Bạn thấy UI/UX này có phù hợp không? Tôi có thể điều chỉnh thêm theo yêu cầu của bạn.

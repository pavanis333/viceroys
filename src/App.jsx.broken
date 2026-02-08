import { useState, useEffect } from 'react'
import data from './data'

const soilsData = data.soilTypes
const quizQuestions = data.quizQuestions

function App() {
  const [mode, setMode] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [masteredSoils, setMasteredSoils] = useState([])
  const [filter, setFilter] = useState('all')
  const [flipped, setFlipped] = useState(false)
  const [showNavigator, setShowNavigator] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('soilsProgress')
    if (saved) {
      const data = JSON.parse(saved)
      setMasteredSoils(data.masteredSoils || [])
    }

    const savedQuiz = localStorage.getItem('soilsQuizState')
    if (savedQuiz && mode === 'quiz') {
      const quizData = JSON.parse(savedQuiz)
      setCurrentIndex(quizData.currentIndex || 0)
      setScore(quizData.score || 0)
      setQuizAnswers(quizData.quizAnswers || [])
    }
  }, [mode])

  const saveProgress = (mastered) => {
    localStorage.setItem('soilsProgress', JSON.stringify({
      masteredSoils: mastered
    }))
  }

  const saveQuizState = (index, currentScore, answers) => {
    localStorage.setItem('soilsQuizState', JSON.stringify({
      currentIndex: index,
      score: currentScore,
      quizAnswers: answers
    }))
  }

  const resetQuiz = () => {
    localStorage.removeItem('soilsQuizState')
    setCurrentIndex(0)
    setScore(0)
    setQuizAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const resetMode = () => {
    setMode(null)
    setCurrentIndex(0)
    setFlipped(false)
    setScore(0)
    setQuizAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const getFilteredSoils = () => {
    if (filter === 'all') return soilsData
    if (filter === 'high') return soilsData.filter(s => s.importance === 'HIGH')
    if (filter === 'alluvial') return soilsData.filter(s => s.name.includes('Alluvial'))
    if (filter === 'black') return soilsData.filter(s => s.name.includes('Black'))
    if (filter === 'red') return soilsData.filter(s => s.name.includes('Red') || s.name.includes('Yellow'))
    return soilsData
  }

  const handleQuizAnswer = (answerIndex) => {
    if (quizAnswers[currentIndex]) {
      const newAnswers = [...quizAnswers]
      const correct = quizQuestions[currentIndex].correct === answerIndex
      
      const oldCorrect = newAnswers[currentIndex].correct
      let newScore = score
      if (oldCorrect && !correct) newScore--
      if (!oldCorrect && correct) newScore++
      
      newAnswers[currentIndex] = {
        question: currentIndex,
        selected: answerIndex,
        correct: correct
      }
      
      setQuizAnswers(newAnswers)
      setScore(newScore)
      setSelectedAnswer(answerIndex)
      saveQuizState(currentIndex, newScore, newAnswers)
      return
    }
    
    setSelectedAnswer(answerIndex)
    const correct = quizQuestions[currentIndex].correct === answerIndex
    
    const newScore = correct ? score + 1 : score
    const newAnswers = [...quizAnswers, {
      question: currentIndex,
      selected: answerIndex,
      correct: correct
    }]
    
    if (correct) {
      setScore(newScore)
    }
    
    setQuizAnswers(newAnswers)
    saveQuizState(currentIndex, newScore, newAnswers)
  }

  const nextQuizQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      if (quizAnswers[nextIndex]) {
        setSelectedAnswer(quizAnswers[nextIndex].selected)
      } else {
        setSelectedAnswer(null)
      }
      saveQuizState(nextIndex, score, quizAnswers)
    } else if (quizAnswers.length === quizQuestions.length) {
      setShowResult(true)
      localStorage.removeItem('soilsQuizState')
    }
  }

  const prevQuizQuestion = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      if (quizAnswers[prevIndex]) {
        setSelectedAnswer(quizAnswers[prevIndex].selected)
      } else {
        setSelectedAnswer(null)
      }
      saveQuizState(prevIndex, score, quizAnswers)
    }
  }

  const getScoreEmoji = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 90) return '🏆'
    if (percentage >= 75) return '🌟'
    if (percentage >= 60) return '👍'
    if (percentage >= 50) return '😊'
    return '📚'
  }

  const renderModeSelector = () => (
    <div className="mode-selector">
      <div className="mode-card" onClick={() => setMode('flashcards')}>
        <div className="mode-icon">🗂️</div>
        <h3>Flashcards</h3>
        <p>Learn soils with interactive flashcards</p>
      </div>
      
      <div className="mode-card" onClick={() => setMode('browse')}>
        <div className="mode-icon">📚</div>
        <h3>Browse Soils</h3>
        <p>Explore all soils with detailed information</p>
      </div>
      
      <div className="mode-card" onClick={() => setMode('quiz')}>
        <div className="mode-icon">❓</div>
        <h3>Quiz Mode</h3>
        <p>Test knowledge with UPSC-style questions</p>
      </div>
      
      <div className="mode-card" onClick={() => setMode('progress')}>
        <div className="mode-icon">📊</div>
        <h3>Progress</h3>
        <p>Track your learning progress</p>
      </div>
    </div>
  )

  const renderFlashcards = () => {
    const soils = getFilteredSoils()
    if (soils.length === 0) return <p>No soils match this filter.</p>

    const soil = soils[currentIndex]
    const isMastered = masteredSoils.includes(soil.name)

    const nextCard = () => {
      if (currentIndex < soils.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setFlipped(false)
      }
    }

    const prevCard = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
        setFlipped(false)
      }
    }

    const markAsMastered = () => {
      if (masteredSoils.includes(soil.name)) {
        const updated = masteredSoils.filter(name => name !== soil.name)
        setMasteredSoils(updated)
        saveProgress(updated)
      } else {
        const updated = [...masteredSoils, soil.name]
        setMasteredSoils(updated)
        saveProgress(updated)
        nextCard()
      }
    }

    return (
      <div>
        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => { setFilter('all'); setCurrentIndex(0); }}
            >
              All ({soilsData.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
              onClick={() => { setFilter('high'); setCurrentIndex(0); }}
            >
              High Priority
            </button>
            <button 
              className={`filter-btn ${filter === 'alluvial' ? 'active' : ''}`}
              onClick={() => { setFilter('alluvial'); setCurrentIndex(0); }}
            >
              Alluvial
            </button>
            <button 
              className={`filter-btn ${filter === 'black' ? 'active' : ''}`}
              onClick={() => { setFilter('black'); setCurrentIndex(0); }}
            >
              Black/Regur
            </button>
            <button 
              className={`filter-btn ${filter === 'red' ? 'active' : ''}`}
              onClick={() => { setFilter('red'); setCurrentIndex(0); }}
            >
              Red/Yellow
            </button>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${((currentIndex + 1) / soils.length) * 100}%`}}
          />
        </div>

        <div className="flashcard">
          <div 
            className={`flashcard-inner ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-front">
              <h2 style={{fontSize: '2.5rem', marginBottom: '20px', color: '#1a3a0f'}}>
                {soil.name}
              </h2>
              <div style={{fontSize: '1.2rem', color: '#558b2f', marginBottom: '15px'}}>
                {soil.category}
              </div>
              {soil.season && (
                <div style={{fontSize: '1.1rem', color: '#7cb342'}}>
                  Season: {soil.season}
                </div>
              )}
              <p className="flashcard-hint">👆 Tap to flip</p>
            </div>
            <div className="flashcard-back">
              <div style={{textAlign: 'left', width: '100%'}}>
                <div className="soil-info"><strong>Category:</strong> {soil.category}</div>
                {soil.rainfall && <div className="soil-info"><strong>Rainfall:</strong> {soil.rainfall}</div>}
                {soil.temperature && <div className="soil-info"><strong>Temperature:</strong> {soil.temperature}</div>}
                {soil.altitude && <div className="soil-info"><strong>Altitude:</strong> {soil.altitude}</div>}
                {soil.percentageArea && <div className="soil-info"><strong>% of Total Area:</strong> {soil.percentageArea}</div>}
                <div className="soil-info" style={{marginTop: '10px', fontSize: '0.85rem', fontStyle: 'italic'}}>
                  <strong>Importance:</strong> {soil.importance}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button 
            className="btn btn-secondary" 
            onClick={prevCard}
            disabled={currentIndex === 0}
          >
            ⬅️ Previous
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={markAsMastered}
          >
            {isMastered ? '✓ Mastered (click to unmark)' : '✓ Mark as Mastered'}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={nextCard}
            disabled={currentIndex === soils.length - 1}
          >
            Next ➡️
          </button>
        </div>

        <div style={{textAlign: 'center', marginTop: '20px', color: '#1a3a0f', fontSize: '1.1rem'}}>
          Card {currentIndex + 1} of {soils.length}
          {isMastered && <span style={{marginLeft: '15px', color: '#558b2f'}}>✓ Mastered</span>}
        </div>
      </div>
    )
  }

  const renderBrowse = () => {
    const soils = getFilteredSoils()

    return (
      <div>
        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({soilsData.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              High Priority
            </button>
            <button 
              className={`filter-btn ${filter === 'alluvial' ? 'active' : ''}`}
              onClick={() => setFilter('alluvial')}
            >
              Alluvial
            </button>
            <button 
              className={`filter-btn ${filter === 'black' ? 'active' : ''}`}
              onClick={() => setFilter('black')}
            >
              Black/Regur
            </button>
            <button 
              className={`filter-btn ${filter === 'red' ? 'active' : ''}`}
              onClick={() => setFilter('red')}
            >
              Red/Yellow
            </button>
          </div>
        </div>

        <h2 style={{marginBottom: '20px', color: '#1a3a0f'}}>
          {soils.length} Soil(s) Found
        </h2>

        <div className="soils-grid">
          {soils.map(soil => (
            <div key={soil.id} className="soil-card">
              <h3>{soil.name}</h3>
              <div className="tags">
                <span className="tag">{soil.category}</span>
                <span className={`tag ${soil.importance === 'HIGH' ? 'high' : ''}`}>
                  {soil.importance}
                </span>
                {soil.percentageArea && <span className="tag">{soil.percentageArea}</span>}
              </div>
              {soil.rainfall && <div className="soil-info"><strong>Rainfall:</strong> {soil.rainfall}</div>}
              {soil.temperature && <div className="soil-info"><strong>Temperature:</strong> {soil.temperature}</div>}
              {soil.altitude && <div className="soil-info"><strong>Altitude:</strong> {soil.altitude}</div>}
              <div className="soil-info"><strong>Characteristics:</strong></div>
              <ul style={{margin: '5px 0', paddingLeft: '20px', fontSize: '0.85rem'}}>
                {soil.characteristics?.slice(0, 2).map((char, i) => <li key={i}>{char.substring(0, 100)}...</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderQuiz = () => {
    if (showResult) {
      const percentage = ((score / quizQuestions.length) * 100).toFixed(0)
      
      return (
        <div className="result-screen">
          <div className="result-emoji">{getScoreEmoji()}</div>
          <h2>Quiz Complete!</h2>
          <div className="result-score">
            {score} / {quizQuestions.length}
          </div>
          <p style={{fontSize: '1.5rem', color: '#1a3a0f', marginBottom: '30px'}}>
            You scored {percentage}%
          </p>
          
          <div style={{textAlign: 'left', marginBottom: '30px'}}>
            <h3 style={{marginBottom: '15px'}}>Review:</h3>
            {quizAnswers.map((answer, idx) => (
              <div key={idx} style={{
                padding: '15px',
                marginBottom: '10px',
                background: answer.correct ? '#d1fae5' : '#fee2e2',
                borderRadius: '8px',
                border: '2px solid ' + (answer.correct ? '#10b981' : '#ef4444')
              }}>
                <p style={{fontWeight: 'bold', marginBottom: '5px'}}>
                  Q{idx + 1}: {quizQuestions[idx].question}
                </p>
                <p style={{color: '#666'}}>
                  {answer.correct ? '✓ Correct!' : `✗ Wrong - ${quizQuestions[idx].explanation}`}
                </p>
              </div>
            ))}
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={resetQuiz}>
              🔄 Retry Quiz
            </button>
            <button className="btn btn-secondary" onClick={resetMode}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      )
    }

    const question = quizQuestions[currentIndex]

    const jumpToQuestion = (index) => {
      setCurrentIndex(index)
      if (quizAnswers[index]) {
        setSelectedAnswer(quizAnswers[index].selected)
      } else {
        setSelectedAnswer(null)
      }
      saveQuizState(index, score, quizAnswers)
      setShowNavigator(false)
    }

    return (
      <div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${(quizAnswers.length / quizQuestions.length) * 100}%`}}
          />
        </div>

        <div style={{textAlign: 'center', margin: '15px 0'}}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowNavigator(true)}
          >
            📋 Question Navigator ({quizAnswers.length}/{quizQuestions.length})
          </button>
        </div>

        {showNavigator && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowNavigator(false)}>
            <div style={{
              background: '#f1f8e9',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflow: 'auto',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              border: '3px solid #7cb342'
            }} onClick={(e) => e.stopPropagation()}>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{margin: 0, color: '#1a3a0f'}}>Question Navigator</h3>
                <button 
                  onClick={() => setShowNavigator(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    color: '#1a3a0f'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                gap: '10px'
              }}>
                {quizQuestions.map((_, idx) => {
                  const isAnswered = quizAnswers[idx] !== undefined
                  const isCurrent = idx === currentIndex
                  const isCorrect = isAnswered && quizAnswers[idx].correct
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToQuestion(idx)}
                      style={{
                        padding: '12px',
                        border: isCurrent ? '3px solid #7cb342' : '2px solid #558b2f',
                        borderRadius: '8px',
                        background: isCurrent 
                          ? '#c5e1a5'
                          : isAnswered 
                            ? (isCorrect ? '#d1fae5' : '#fee2e2')
                            : 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        color: '#1a3a0f',
                        transition: 'all 0.2s'
                      }}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>

              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowNavigator(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="quiz-question">
          <h3>Question {currentIndex + 1} of {quizQuestions.length}</h3>
          <p style={{fontSize: '1.3rem', marginBottom: '30px', color: '#1a3a0f'}}>
            {question.question}
          </p>

          <div className="quiz-options">
            {question.options.map((option, idx) => {
              let className = 'quiz-option'
              if (selectedAnswer !== null) {
                if (idx === question.correct) {
                  className += ' correct'
                } else if (idx === selectedAnswer) {
                  className += ' incorrect'
                }
              }

              return (
                <div
                  key={idx}
                  className={className}
                  onClick={() => handleQuizAnswer(idx)}
                >
                  <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                </div>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: selectedAnswer === question.correct ? '#d1fae5' : '#fee2e2',
              borderRadius: '12px',
              border: '2px solid ' + (selectedAnswer === question.correct ? '#10b981' : '#ef4444')
            }}>
              <p style={{fontWeight: 'bold', marginBottom: '10px', color: '#1a3a0f'}}>
                {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p style={{color: '#33691e'}}>{question.explanation}</p>
            </div>
          )}
        </div>

        <div style={{textAlign: 'center', marginTop: '20px', color: '#1a3a0f'}}>
          Score: {score} / {quizAnswers.length}
        </div>

        <div className="controls" style={{marginTop: '20px'}}>
          <button 
            className="btn btn-secondary" 
            onClick={prevQuizQuestion}
            disabled={currentIndex === 0}
          >
            ⬅️ Previous
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={nextQuizQuestion}
            disabled={currentIndex === quizQuestions.length - 1 && quizAnswers.length < quizQuestions.length}
          >
            {currentIndex === quizQuestions.length - 1 && quizAnswers.length === quizQuestions.length ? '✓ Finish Quiz' : 'Next ➡️'}
          </button>
        </div>

        <div className="controls" style={{marginTop: '10px'}}>
          <button className="btn btn-secondary" onClick={resetQuiz}>
            🔄 Reset Quiz
          </button>
          <button className="btn btn-secondary" onClick={resetMode}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    )
  }

  const renderProgress = () => {
    const totalSoils = soilsData.length
    const masteredCount = masteredSoils.length
    const progress = ((masteredCount / totalSoils) * 100).toFixed(0)
    const highPriority = soilsData.filter(c => c.importance === 'HIGH').length

    return (
      <div>
        <h2 style={{marginBottom: '30px', color: '#1a3a0f'}}>Your Progress</h2>
        
        <div className="stats">
          <div className="stat-card">
            <h4>Total Soils</h4>
            <div className="value">{totalSoils}</div>
          </div>
          <div className="stat-card">
            <h4>Mastered</h4>
            <div className="value" style={{color: '#558b2f'}}>{masteredCount}</div>
          </div>
          <div className="stat-card">
            <h4>Remaining</h4>
            <div className="value" style={{color: '#f57c00'}}>{totalSoils - masteredCount}</div>
          </div>
          <div className="stat-card">
            <h4>High Priority</h4>
            <div className="value">{highPriority}</div>
          </div>
        </div>

        <div style={{marginBottom: '30px', marginTop: '30px'}}>
          <h3 style={{marginBottom: '15px', color: '#1a3a0f'}}>Overall Progress</h3>
          <div className="progress-bar" style={{height: '30px'}}>
            <div 
              className="progress-fill" 
              style={{
                width: `${progress}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {progress}%
            </div>
          </div>
        </div>

        {masteredSoils.length > 0 && (
          <div style={{marginTop: '30px'}}>
            <h3 style={{marginBottom: '15px', color: '#1a3a0f'}}>Mastered Soils ({masteredCount})</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {masteredSoils.map((name, idx) => (
                <span key={idx} className="tag" style={{fontSize: '0.95rem', padding: '8px 16px'}}>
                  ✓ {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="controls" style={{marginTop: '30px'}}>
          <button 
            className="btn btn-danger" 
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress?')) {
                setMasteredSoils([])
                localStorage.removeItem('soilsProgress')
              }
            }}
          >
            🔄 Reset Progress
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🌳 Soils of India - UPSC Prep</h1>
          <p>Master soil types, vegetation zones & ecological diversity</p>
        </div>

        {!mode && renderModeSelector()}

        {mode && (
          <div className="content-area">
            <button 
              className="btn btn-secondary" 
              onClick={resetMode}
              style={{marginBottom: '20px'}}
            >
              ← Back to Home
            </button>

            {mode === 'flashcards' && renderFlashcards()}
            {mode === 'browse' && renderBrowse()}
            {mode === 'quiz' && renderQuiz()}
            {mode === 'progress' && renderProgress()}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

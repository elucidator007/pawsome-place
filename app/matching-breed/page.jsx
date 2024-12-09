'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BREEDS } from './breeds';
import { BREED_QUESTIONS } from './breedQuestions';
import { TRAIT_MAPPINGS } from './constants';

const CatBreedQuiz = () => {
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sections = Object.entries(BREED_QUESTIONS.sections);
  const currentSectionData = sections[currentSection][1];
  const totalQuestions = sections.reduce((total, [_, section]) => total + section.questions.length, 0);

  const handleAnswer = (optionIndex) => {
    const sectionKey = sections[currentSection][0];
    const responseKey = `${sectionKey}_${currentQuestion + 1}`;
    
    setUserResponses(prev => ({
      ...prev,
      [responseKey]: optionIndex
    }));

    if (currentQuestion + 1 < currentSectionData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection + 1 < sections.length) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      const matches = calculateMatches(userResponses);
      setResults(matches);
      setQuizComplete(true);
    }
  };

  const calculateMatches = (responses) => {
    const userTraits = Object.entries(responses).map(([question, answer]) => {
      return TRAIT_MAPPINGS[question][answer];
    });

    const matches = BREEDS.breeds.map(breed => ({
      breed: breed.name,
      score: (userTraits.filter(trait => breed.traits.includes(trait)).length / userTraits.length) * 100,
      personality: breed.personality
    }));

    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  const resetQuiz = () => {
    setCurrentSection(0);
    setCurrentQuestion(0);
    setUserResponses({});
    setQuizComplete(false);
    setResults([]);
  };

  const progressPercentage = (Object.keys(userResponses).length / totalQuestions) * 100;

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEB19C] via-[#f0c3e0] to-[#fecfd5] p-6 font-sans">
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/70">
          <CardHeader className="border-b border-[#EEB19C]/20">
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#444444] to-[#EEB19C] text-3xl font-extrabold text-center ubuntu-mono-bold">
              Your Purr-fect Matches! 🐱
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {results.map((match, index) => (
                <div key={match.breed} 
                  className="p-4 bg-white/50 rounded-lg border border-[#EEB19C]/20 hover:bg-white/60 transition-all"
                >
                  <h3 className="text-xl font-bold text-[#444444]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {index + 1}. {match.breed}
                  </h3>
                  <p className="text-base text-[#444444]/80 mt-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Match Score: <span className="text-[#EEB19C] font-bold">{match.score.toFixed(1)}%</span>
                  </p>
                  <p className="text-base mt-2 text-[#444444]/90" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Personality: <span className="text-[#f0c3e0] font-bold">{match.personality}</span>
                  </p>
                </div>
              ))}
              <Button 
                onClick={resetQuiz}
                className="w-full mt-6 bg-gradient-to-r from-[#EEB19C] to-[#fecfd5] hover:opacity-90 text-white border-none font-bold"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Take Quiz Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEB19C] via-[#f0c3e0] to-[#fecfd5] p-6">
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/30 shadow-xl">
        <CardHeader className="border-b border-white/20">
          <CardTitle className="text-[#444444] text-3xl text-center py-2" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
            {currentSectionData.title}
          </CardTitle>
          <div className="w-full bg-white/30 h-3 rounded-full mt-4">
            <div 
              className="bg-gradient-to-r from-[#EEB19C] to-[#fecfd5] h-3 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            <p className="text-xl text-[#444444] leading-relaxed text-center font-medium mb-8">
              {currentSectionData.questions[currentQuestion].situation}
            </p>
            <div className="space-y-4">
              {currentSectionData.questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left py-6 px-8 bg-white/40 hover:bg-white/60 text-[#444444] 
                  border-2 border-white/40 hover:border-[#EEB19C]/40 rounded-2xl transition-all duration-300
                  text-lg shadow hover:shadow-lg hover:transform hover:scale-[1.02]"
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatBreedQuiz;
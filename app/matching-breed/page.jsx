'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BREEDS } from './breeds';
import { BREED_QUESTIONS } from './breedQuestions';

const traitMappings = {
  'social_butterfly_or_lone_wolf_1': ['scene_stealer', 'hide_away', 'distant_observer', 'selective_friendly'],
  'social_butterfly_or_lone_wolf_2': ['attention_seeker', 'background_sleeper', 'occasional_visitor', 'complete_ignorer'],
  'social_butterfly_or_lone_wolf_3': ['playmate', 'distant_observer', 'hide_away', 'gentle_giant'],
  'energy_meter_1': ['active_joiner', 'chaos_creator', 'lazy_observer', 'dignified_watcher'],
  'energy_meter_2': ['midnight_runner', 'sleep_buddy', 'night_patrol', 'distance_keeper'],
  'energy_meter_3': ['box_claimer', 'part_chaser', 'supervisor', 'distance_keeper'],
  'maintenance_manual_1': ['quick_brush', 'spa_lover', 'salon_visitor', 'self_sufficient'],
  'maintenance_manual_2': ['vacuum_cleaner', 'food_critic', 'schedule_keeper', 'grazer'],
  'maintenance_manual_3': ['brave_warrior', 'dramatic', 'zen_master', 'gentle_giant'],
  'home_sweet_home_1': ['plant_respecter', 'leaf_hunter', 'curious_inspector', 'grass_only'],
  'home_sweet_home_2': ['quiet_companion', 'keyboard_assistant', 'paper_reorganizer', 'occasional_visitor'],
  'home_sweet_home_3': ['silent_watcher', 'chatty_observer', 'sleepy_ignorer', 'dramatic_commentator']
};

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
      return traitMappings[question][answer];
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Purr-fect Matches! 🐱</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.map((match, index) => (
              <div key={match.breed} className="p-4 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {match.breed}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Match Score: {match.score.toFixed(1)}%
                </p>
                <p className="text-sm mt-2">
                  Personality: {match.personality}
                </p>
              </div>
            ))}
            <Button 
              onClick={resetQuiz}
              className="w-full mt-4"
            >
              Take Quiz Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{currentSectionData.title}</CardTitle>
        <div className="w-full bg-slate-200 h-2 rounded-full mt-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg">
            {currentSectionData.questions[currentQuestion].situation}
          </p>
          <div className="space-y-3">
            {currentSectionData.questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left justify-start h-auto py-4 px-6"
                variant="outline"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatBreedQuiz;
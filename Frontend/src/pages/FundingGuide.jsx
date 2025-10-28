import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  GiftIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const FundingGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  // AI/ML-style questionnaire to determine best funding model
  const questions = [
    {
      id: 'purpose',
      question: 'What is the primary purpose of your funding?',
      options: [
        { value: 'personal_cause', label: 'Personal cause or emergency', weights: { donation: 10, reward: 2, equity: 0, debt: 1 } },
        { value: 'product_launch', label: 'Launch a new product or creative project', weights: { donation: 3, reward: 10, equity: 5, debt: 3 } },
        { value: 'startup', label: 'Start or scale a business/startup', weights: { donation: 1, reward: 4, equity: 10, debt: 7 } },
        { value: 'business_expansion', label: 'Expand existing business operations', weights: { donation: 0, reward: 3, equity: 6, debt: 10 } },
      ],
    },
    {
      id: 'amount',
      question: 'How much funding do you need?',
      options: [
        { value: 'small', label: 'Under ₹50,000', weights: { donation: 10, reward: 8, equity: 2, debt: 4 } },
        { value: 'medium', label: '₹50,000 - ₹5,00,000', weights: { donation: 6, reward: 10, equity: 6, debt: 7 } },
        { value: 'large', label: '₹5,00,000 - ₹50,00,000', weights: { donation: 2, reward: 5, equity: 10, debt: 9 } },
        { value: 'xlarge', label: 'Over ₹50,00,000', weights: { donation: 0, reward: 2, equity: 10, debt: 10 } },
      ],
    },
    {
      id: 'timeline',
      question: 'What is your fundraising timeline?',
      options: [
        { value: 'urgent', label: 'Urgent (1-2 months)', weights: { donation: 10, reward: 7, equity: 3, debt: 5 } },
        { value: 'moderate', label: 'Moderate (3-6 months)', weights: { donation: 7, reward: 10, equity: 7, debt: 8 } },
        { value: 'flexible', label: 'Flexible (6+ months)', weights: { donation: 5, reward: 8, equity: 10, debt: 10 } },
      ],
    },
    {
      id: 'return_expectation',
      question: 'What can you offer to backers/investors?',
      options: [
        { value: 'nothing', label: 'Nothing - seeking charitable support', weights: { donation: 10, reward: 0, equity: 0, debt: 0 } },
        { value: 'product', label: 'Product/service or exclusive perks', weights: { donation: 3, reward: 10, equity: 4, debt: 2 } },
        { value: 'equity_shares', label: 'Equity shares in the company', weights: { donation: 0, reward: 2, equity: 10, debt: 3 } },
        { value: 'repayment', label: 'Fixed repayment with interest', weights: { donation: 0, reward: 1, equity: 4, debt: 10 } },
      ],
    },
    {
      id: 'risk_tolerance',
      question: 'What level of financial commitment are you comfortable with?',
      options: [
        { value: 'no_obligation', label: 'No financial obligation to backers', weights: { donation: 10, reward: 9, equity: 3, debt: 0 } },
        { value: 'fulfill_rewards', label: 'Fulfill promised rewards/products', weights: { donation: 2, reward: 10, equity: 5, debt: 3 } },
        { value: 'share_profits', label: 'Share future profits/ownership', weights: { donation: 0, reward: 3, equity: 10, debt: 5 } },
        { value: 'fixed_repayment', label: 'Fixed repayment schedule', weights: { donation: 0, reward: 2, equity: 5, debt: 10 } },
      ],
    },
    {
      id: 'business_stage',
      question: 'What stage is your project/business?',
      options: [
        { value: 'idea', label: 'Just an idea or concept', weights: { donation: 8, reward: 10, equity: 4, debt: 2 } },
        { value: 'prototype', label: 'Prototype or MVP ready', weights: { donation: 4, reward: 10, equity: 8, debt: 5 } },
        { value: 'early_revenue', label: 'Early stage with some revenue', weights: { donation: 2, reward: 7, equity: 10, debt: 8 } },
        { value: 'established', label: 'Established with proven track record', weights: { donation: 1, reward: 5, equity: 8, debt: 10 } },
      ],
    },
  ];

  // AI-powered recommendation algorithm
  const calculateRecommendation = () => {
    const scores = { donation: 0, reward: 0, equity: 0, debt: 0 };

    // Calculate weighted scores based on answers
    Object.keys(answers).forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId);
      const selectedOption = question.options.find((opt) => opt.value === answers[questionId]);
      
      if (selectedOption && selectedOption.weights) {
        Object.keys(selectedOption.weights).forEach((fundingType) => {
          scores[fundingType] += selectedOption.weights[fundingType];
        });
      }
    });

    // Normalize scores to percentages
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const normalizedScores = {};
    Object.keys(scores).forEach((type) => {
      normalizedScores[type] = Math.round((scores[type] / total) * 100);
    });

    // Find best match
    const bestMatch = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    // Get second best for alternative
    const sortedTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const alternativeMatch = sortedTypes[1];

    return {
      primary: bestMatch,
      alternative: alternativeMatch,
      scores: normalizedScores,
      confidence: normalizedScores[bestMatch],
    };
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate recommendation
      const result = calculateRecommendation();
      setRecommendation(result);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  const getFundingInfo = (type) => {
    const info = {
      donation: {
        icon: HeartIcon,
        title: 'Donation-Based',
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        description: 'Perfect for personal causes, charities, and community projects where backers don\'t expect returns.',
        pros: ['No repayment required', 'Quick to set up', 'Emotional connection with backers'],
        cons: ['No financial return for backers', 'May need compelling story', 'Limited to smaller amounts'],
      },
      reward: {
        icon: GiftIcon,
        title: 'Reward-Based',
        color: 'from-purple-500 to-indigo-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        description: 'Ideal for creative projects and product launches where backers receive exclusive rewards or early access.',
        pros: ['Pre-sell products', 'Build community', 'Validate market demand'],
        cons: ['Must fulfill rewards', 'Production risks', 'Logistics management'],
      },
      equity: {
        icon: ChartBarIcon,
        title: 'Equity-Based',
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        description: 'Best for startups seeking serious investors who want ownership stakes and long-term growth potential.',
        pros: ['Large funding potential', 'Strategic investors', 'No debt burden'],
        cons: ['Dilution of ownership', 'Complex legal process', 'Investor expectations'],
      },
      debt: {
        icon: BuildingLibraryIcon,
        title: 'Debt-Based',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        description: 'Suitable for established businesses needing capital with fixed repayment terms and interest.',
        pros: ['Retain full ownership', 'Fixed repayment terms', 'Lower risk for lenders'],
        cons: ['Must repay with interest', 'Requires creditworthiness', 'Regular payment obligations'],
      },
    };
    return info[type] || info.donation;
  };

  const currentQuestion = questions[currentStep];
  const isAnswered = answers[currentQuestion?.id];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (recommendation) {
    const primaryInfo = getFundingInfo(recommendation.primary);
    const alternativeInfo = getFundingInfo(recommendation.alternative);
    const PrimaryIcon = primaryInfo.icon;
    const AlternativeIcon = alternativeInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-16 px-4">
        <div className="container-custom max-w-5xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Recommendation Ready!
            </h1>
            <p className="text-xl text-gray-600">
              Based on your answers, here's your personalized funding strategy
            </p>
          </div>

          {/* Primary Recommendation */}
          <div className={`bg-gradient-to-br ${primaryInfo.color} rounded-3xl p-8 text-white mb-8 shadow-2xl`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">
                  Best Match • {recommendation.confidence}% Confidence
                </div>
                <h2 className="text-4xl font-bold mb-2">{primaryInfo.title}</h2>
                <p className="text-lg opacity-90">{primaryInfo.description}</p>
              </div>
              <PrimaryIcon className="h-16 w-16 opacity-80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="font-bold mb-3">✅ Advantages</div>
                <ul className="space-y-2 text-sm">
                  {primaryInfo.pros.map((pro, index) => (
                    <li key={index}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="font-bold mb-3">⚠️ Considerations</div>
                <ul className="space-y-2 text-sm">
                  {primaryInfo.cons.map((con, index) => (
                    <li key={index}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate(`/campaigns?type=${recommendation.primary}`)}
              className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Explore {primaryInfo.title} Campaigns →
            </button>
          </div>

          {/* Alternative Recommendation */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Alternative Option • {recommendation.scores[recommendation.alternative]}% Match
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{alternativeInfo.title}</h3>
                <p className="text-gray-600">{alternativeInfo.description}</p>
              </div>
              <AlternativeIcon className={`h-12 w-12 ${alternativeInfo.textColor}`} />
            </div>

            <button
              onClick={() => navigate(`/campaigns?type=${recommendation.alternative}`)}
              className="px-8 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              View {alternativeInfo.title} Options →
            </button>
          </div>

          {/* All Scores */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Analysis</h3>
            <div className="space-y-4">
              {Object.keys(recommendation.scores).map((type) => {
                const info = getFundingInfo(type);
                return (
                  <div key={type} className="flex items-center">
                    <div className="w-32 text-sm font-semibold text-gray-700">{info.title}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${info.color} flex items-center justify-end pr-3 transition-all duration-1000`}
                        style={{ width: `${recommendation.scores[type]}%` }}
                      >
                        <span className="text-white text-sm font-bold">
                          {recommendation.scores[type]}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Start Over
            </button>
            <button
              onClick={() => navigate('/campaigns/create')}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
            >
              Start Your Campaign
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-16 px-4">
      <div className="container-custom max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <SparklesIcon className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Funding Advisor
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions to get personalized recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{option.label}</span>
                  {answers[currentQuestion.id] === option.value && (
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === questions.length - 1 ? 'Get Recommendation' : 'Next'}
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingGuide;

